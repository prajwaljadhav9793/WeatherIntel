import { EventEmitter } from 'events';
import { WeatherReport, WeatherAlert } from '../../src/types';
import { db, formatDbReport, formatDbAlert } from '../db';

export class StreamEventBus extends EventEmitter {}

export const eventBus = new StreamEventBus();

export interface SlidingWindowStats {
  window5mCount: number;
  window1hCount: number;
  window24hCount: number;
  criticalEvents1h: number;
  activeHotspots: { district: string; state: string; count: number }[];
}

// In-memory sliding buffer for streaming stream analytics
interface TimedReportRecord {
  id: string;
  district: string;
  state: string;
  event: string;
  severity: string;
  timestampMs: number;
}

class BigDataStreamEngine {
  private buffer: TimedReportRecord[] = [];
  private readonly MAX_BUFFER_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.setupListeners();
    // Clean buffer every 5 minutes
    setInterval(() => this.pruneOldRecords(), 5 * 60 * 1000);
  }

  private setupListeners() {
    eventBus.on('report:new', (report: WeatherReport) => {
      this.pushReport(report);
      this.evaluateAlertThresholds(report);
    });
  }

  public pushReport(report: WeatherReport) {
    this.buffer.push({
      id: report.id,
      district: report.location.district,
      state: report.location.state,
      event: report.event,
      severity: report.severity,
      timestampMs: Date.now(),
    });
  }

  private pruneOldRecords() {
    const cutoff = Date.now() - this.MAX_BUFFER_AGE_MS;
    this.buffer = this.buffer.filter((r) => r.timestampMs >= cutoff);
  }

  public getSlidingStats(): SlidingWindowStats {
    const now = Date.now();
    const cutoff5m = now - 5 * 60 * 1000;
    const cutoff1h = now - 60 * 60 * 1000;
    const cutoff24h = now - 24 * 60 * 60 * 1000;

    let window5mCount = 0;
    let window1hCount = 0;
    let window24hCount = 0;
    let criticalEvents1h = 0;
    const districtCounter: Record<string, { district: string; state: string; count: number }> = {};

    for (const item of this.buffer) {
      if (item.timestampMs >= cutoff24h) window24hCount++;
      if (item.timestampMs >= cutoff1h) {
        window1hCount++;
        if (item.severity === 'Critical' || item.severity === 'High') {
          criticalEvents1h++;
        }
        const key = `${item.district}_${item.state}`;
        if (!districtCounter[key]) {
          districtCounter[key] = { district: item.district, state: item.state, count: 0 };
        }
        districtCounter[key].count++;
      }
      if (item.timestampMs >= cutoff5m) window5mCount++;
    }

    const activeHotspots = Object.values(districtCounter)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      window5mCount,
      window1hCount,
      window24hCount,
      criticalEvents1h,
      activeHotspots,
    };
  }

  // Threshold-Based Severe Weather Trigger
  private evaluateAlertThresholds(newReport: WeatherReport) {
    if (newReport.status === 'Suspicious' || newReport.status === 'Duplicate') return;

    const district = newReport.location.district;
    const state = newReport.location.state;
    const cutoff1h = Date.now() - 60 * 60 * 1000;

    const severeMatches = this.buffer.filter(
      (r) =>
        r.timestampMs >= cutoff1h &&
        r.district.toLowerCase() === district.toLowerCase() &&
        (r.event === newReport.event || r.severity === 'Critical')
    );

    // Rule: If >= 3 severe incidents occur in a district within 1 hour, auto-trigger a high-level alert
    if (severeMatches.length >= 3) {
      this.triggerThresholdAlert(newReport, severeMatches.length);
    }
  }

  private triggerThresholdAlert(report: WeatherReport, clusterSize: number) {
    const alertId = `ALT-IMD-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timestampStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const title = `EMERGENCY ALERT: Severe ${report.event} Spike in ${report.location.district}`;
    const description = `Automated Big-Data threshold exceeded: ${clusterSize} corroborating reports of ${report.event.toLowerCase()} recorded in ${report.location.district}, ${report.location.state} within 60 minutes. Immediate precautionary protocol activated.`;
    
    const guidelines = [
      'Avoid low-lying underpasses and areas prone to waterlogging.',
      'SDRF and local disaster management teams dispatched to affected zones.',
      'Monitor live radar and official IMD warnings through the National Command Center.',
    ];

    try {
      // Check if an active alert for this district already exists
      const existing = db.prepare(`
        SELECT id FROM alerts
        WHERE location LIKE ? AND event = ?
      `).get(`%${report.location.district}%`, report.event);

      if (existing) {
        // Increment report count on existing alert
        db.prepare(`
          UPDATE alerts
          SET reportsCount = reportsCount + 1, timestamp = ?
          WHERE id = ?
        `).run(timestampStr, (existing as any).id);
        return;
      }

      db.prepare(`
        INSERT INTO alerts (
          id, title, event, location, state, severity,
          timestamp, verification, reportsCount, description,
          guidelines, affectedDistricts, issuedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        alertId,
        title,
        report.event,
        `${report.location.district}, ${report.location.state}`,
        report.location.state,
        'Critical',
        timestampStr,
        'Verified',
        clusterSize,
        description,
        JSON.stringify(guidelines),
        JSON.stringify([report.location.district]),
        'National Weather Intelligence Automated Engine'
      );

      console.log(`[ALERT ENGINE] Triggered severe weather alert: ${alertId} for ${report.location.district}`);

      eventBus.emit('alert:new', {
        id: alertId,
        title,
        event: report.event,
        location: `${report.location.district}, ${report.location.state}`,
        state: report.location.state,
        severity: 'Critical',
        timestamp: timestampStr,
        verification: 'Verified',
        reportsCount: clusterSize,
        description,
        guidelines,
        affectedDistricts: [report.location.district],
        issuedBy: 'National Weather Intelligence Automated Engine',
      });

      // Log in audit trail
      db.prepare(`
        INSERT INTO audit_logs (id, timestamp, reportId, userRole, userName, action, oldStatus, newStatus, justification)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `AUDIT-${Date.now().toString().slice(-6)}`,
        now.toISOString(),
        alertId,
        'System Engine',
        'Stream Analytics Daemon',
        'ALERT_AUTO_DISPATCH',
        'None',
        'Active',
        `Automated threshold fired: ${clusterSize} severe reports in 60m window`
      );

    } catch (err) {
      console.error('[ALERT ENGINE] Failed to persist alert:', err);
    }
  }
}

export const streamEngine = new BigDataStreamEngine();

