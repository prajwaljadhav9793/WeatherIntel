import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, formatDbReport, formatDbAlert } from './db';
import { eventBus, streamEngine } from './pipeline/streamPipeline';
import { syncAllStations } from './ingestion/weatherApiConnector';
import { startSocialIngestionDaemon } from './ingestion/socialMediaIngestor';
import { processCitizenReport } from './ingestion/citizenReportIngestor';
import { WeatherReport, VerificationStatus, WeatherEventType } from '../src/types';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- REST Endpoints ---

// 1. GET /api/reports - Filtered reports
app.get('/api/reports', (req, res) => {
  try {
    const { event, state, district, status, search, limit = 100 } = req.query;

    let query = 'SELECT * FROM reports WHERE 1=1';
    const params: any[] = [];

    if (event && event !== 'All') {
      query += ' AND event = ?';
      params.push(event);
    }
    if (state && state !== 'All') {
      query += ' AND state = ?';
      params.push(state);
    }
    if (district && district !== 'All') {
      query += ' AND district = ?';
      params.push(district);
    }
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ? OR city LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY rowid DESC LIMIT ?';
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);
    const reports: WeatherReport[] = rows.map(formatDbReport);

    res.json({ success: true, count: reports.length, data: reports });
  } catch (err: any) {
    console.error('[API] /api/reports error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/reports/citizen - Submit citizen report
app.post('/api/reports/citizen', async (req, res) => {
  try {
    const report = await processCitizenReport(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (err: any) {
    console.error('[API] /api/reports/citizen error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. PATCH /api/reports/:id/status - Admin Verification Triage & Override
app.patch('/api/reports/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, justification, userRole = 'IMD Analyst', userName = 'Regional Duty Officer' } = req.body;

    const validStatuses: VerificationStatus[] = ['Verified', 'Under Review', 'Suspicious', 'Duplicate'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid verification status.' });
    }

    const current = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!current) {
      return res.status(404).json({ success: false, error: `Report ${id} not found.` });
    }

    const now = new Date();
    const timestampStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    db.prepare(`
      UPDATE reports
      SET status = ?, verifiedBy = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, `${userName} (${userRole})`, timestampStr, id);

    // Record immutable audit trail
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, reportId, userRole, userName, action, oldStatus, newStatus, justification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `AUDIT-${Date.now().toString().slice(-6)}`,
      now.toISOString(),
      id,
      userRole,
      userName,
      'STATUS_OVERRIDE',
      current.status,
      status,
      justification || `Analyst manual status assignment: marked as ${status}`
    );

    const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    const formatted = formatDbReport(updated);

    // Notify stream subscribers
    eventBus.emit('report:status', formatted);

    console.log(`[Admin Action] Report ${id} status updated from ${current.status} -> ${status} by ${userName}`);
    res.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error('[API] /api/reports/:id/status error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/alerts - Active severe alerts
app.get('/api/alerts', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM alerts ORDER BY rowid DESC').all();
    const alerts = rows.map(formatDbAlert);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err: any) {
    console.error('[API] /api/alerts error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/alerts - Issue manual severe alert
app.post('/api/alerts', (req, res) => {
  try {
    const { title, event, location, state, severity, description, guidelines, affectedDistricts, issuedBy } = req.body;
    const alertId = `ALT-MAN-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timestampStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    db.prepare(`
      INSERT INTO alerts (
        id, title, event, location, state, severity,
        timestamp, verification, reportsCount, description,
        guidelines, affectedDistricts, issuedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      alertId,
      title,
      event,
      location,
      state,
      severity || 'High',
      timestampStr,
      'Verified',
      1,
      description,
      JSON.stringify(guidelines || []),
      JSON.stringify(affectedDistricts || [location]),
      issuedBy || 'IMD National Severe Weather Bureau'
    );

    const created = db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId);
    const alertObj = formatDbAlert(created);
    eventBus.emit('alert:new', alertObj);

    res.status(201).json({ success: true, data: alertObj });
  } catch (err: any) {
    console.error('[API] /api/alerts error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GET /api/sources - Data source health and status
app.get('/api/sources', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM data_sources').all() as any[];
    const sources = rows.map((r) => ({
      ...r,
      activeStatus: Boolean(r.activeStatus),
    }));
    res.json({ success: true, data: sources });
  } catch (err: any) {
    console.error('[API] /api/sources error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. PATCH /api/sources/:id - Toggle source status
app.patch('/api/sources/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { activeStatus } = req.body;
    db.prepare('UPDATE data_sources SET activeStatus = ? WHERE id = ?').run(activeStatus ? 1 : 0, id);
    res.json({ success: true, message: `Data source ${id} status updated.` });
  } catch (err: any) {
    console.error('[API] /api/sources/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. GET /api/audit - Audit trail logs
app.get('/api/audit', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM audit_logs ORDER BY rowid DESC LIMIT 100').all();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    console.error('[API] /api/audit error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. GET /api/system/health - Live component health & throughput
app.get('/api/system/health', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM system_metrics').all() as any[];
    const sliding = streamEngine.getSlidingStats();

    // Dynamically adjust throughput based on live buffer
    const enriched = rows.map((m) => {
      if (m.category === 'Ingestion') {
        return { ...m, throughputPerSec: Math.max(m.throughputPerSec, sliding.window5mCount * 8 + 420) };
      }
      return m;
    });

    res.json({
      success: true,
      data: {
        components: enriched,
        slidingStats: sliding,
        systemStats: {
          uptimeSeconds: process.uptime(),
          memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          nodeVersion: process.version,
        },
      },
    });
  } catch (err: any) {
    console.error('[API] /api/system/health error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. GET /api/analytics - Aggregated national big-data distributions
app.get('/api/analytics', (req, res) => {
  try {
    const stateCounts = db.prepare(`
      SELECT state, COUNT(*) as count FROM reports GROUP BY state ORDER BY count DESC
    `).all();

    const eventCounts = db.prepare(`
      SELECT event, COUNT(*) as count FROM reports GROUP BY event ORDER BY count DESC
    `).all();

    const severityCounts = db.prepare(`
      SELECT severity, COUNT(*) as count FROM reports GROUP BY severity
    `).all();

    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count FROM reports GROUP BY status
    `).all();

    const slidingStats = streamEngine.getSlidingStats();

    res.json({
      success: true,
      data: {
        stateDistribution: stateCounts,
        eventDistribution: eventCounts,
        severityDistribution: severityCounts,
        statusDistribution: statusCounts,
        slidingStats,
      },
    });
  } catch (err: any) {
    console.error('[API] /api/analytics error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Authentication Endpoints ---

// POST /api/auth/login - Authenticate user credentials
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(normalizedEmail) as any;

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Please verify your email and password.' });
    }

    const sessionToken = `token_${user.id}_${Date.now()}`;

    // Log successful login to audit trail
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, reportId, userRole, userName, action, oldStatus, newStatus, justification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `AUDIT-AUTH-${Date.now().toString().slice(-6)}`,
      new Date().toISOString(),
      'N/A',
      user.role,
      user.name,
      'USER_LOGIN',
      'Unauthenticated',
      'Authenticated',
      `User ${user.email} successfully logged into ${user.role} role.`
    );

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization || 'WeatherIntel Network',
      },
      token: sessionToken,
    });
  } catch (err: any) {
    console.error('[API] /api/auth/login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/register - Register new personnel / citizen
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role = 'Citizen', organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const validRoles = ['Citizen', 'IMD Analyst', 'Admin'];
    const assignedRole = validRoles.includes(role) ? role : 'Citizen';

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists. Please log in.' });
    }

    const userId = `USR-${Date.now().toString().slice(-6)}`;
    const org = organization?.trim() || (assignedRole === 'Citizen' ? 'Citizen Weather Observer' : assignedRole === 'IMD Analyst' ? 'IMD Meteorological Division' : 'State Disaster Management Authority');

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, organization, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      name.trim(),
      normalizedEmail,
      password,
      assignedRole,
      org,
      new Date().toISOString()
    );

    // Audit log new registration
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, reportId, userRole, userName, action, oldStatus, newStatus, justification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `AUDIT-REG-${Date.now().toString().slice(-6)}`,
      new Date().toISOString(),
      'N/A',
      assignedRole,
      name.trim(),
      'USER_REGISTRATION',
      'None',
      'Created',
      `New user registered with role ${assignedRole} (${org}).`
    );

    const sessionToken = `token_${userId}_${Date.now()}`;

    res.status(201).json({
      success: true,
      user: {
        name: name.trim(),
        email: normalizedEmail,
        role: assignedRole,
        organization: org,
      },
      token: sessionToken,
    });
  } catch (err: any) {
    console.error('[API] /api/auth/register error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/users - Retrieve registered personnel (Admin view)
app.get('/api/auth/users', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, email, role, organization, createdAt FROM users ORDER BY rowid DESC').all();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    console.error('[API] /api/auth/users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. GET /api/stream - Server-Sent Events (SSE) Real-Time Stream
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send handshake confirmation
  res.write(`data: ${JSON.stringify({ type: 'handshake', message: 'Connected to WeatherIntel National Big-Data Stream' })}\n\n`);

  const onReportNew = (report: WeatherReport) => {
    res.write(`data: ${JSON.stringify({ type: 'REPORT_NEW', payload: report })}\n\n`);
  };

  const onReportStatus = (report: WeatherReport) => {
    res.write(`data: ${JSON.stringify({ type: 'REPORT_STATUS_UPDATE', payload: report })}\n\n`);
  };

  const onAlertNew = (alert: any) => {
    res.write(`data: ${JSON.stringify({ type: 'ALERT_NEW', payload: alert })}\n\n`);
  };

  eventBus.on('report:new', onReportNew);
  eventBus.on('report:status', onReportStatus);
  eventBus.on('alert:new', onAlertNew);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    eventBus.off('report:new', onReportNew);
    eventBus.off('report:status', onReportStatus);
    eventBus.off('alert:new', onAlertNew);
    res.end();
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[WeatherIntel API] National Command Center Backend active on http://localhost:${PORT}`);

  // Ingest from Open-Meteo on startup (non-blocking)
  syncAllStations().catch((err) => console.error('[API Ingestion] Startup station sync failed:', err));

  // Periodic station sync every 10 minutes
  setInterval(() => {
    syncAllStations().catch((err) => console.error('[API Ingestion] Scheduled station sync failed:', err));
  }, 10 * 60 * 1000);

  // Start social stream ingestor (every 40s)
  startSocialIngestionDaemon(40000);
});

