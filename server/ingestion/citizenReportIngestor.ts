import { runAIVerificationPipeline, RawReportInput } from '../ai/verificationPipeline';
import { db, formatDbReport } from '../db';
import { eventBus } from '../pipeline/streamPipeline';
import { WeatherReport, WeatherEventType } from '../../src/types';

export interface CitizenSubmissionDto {
  title?: string;
  description: string;
  event: WeatherEventType;
  city: string;
  district?: string;
  state: string;
  lat: number;
  lng: number;
  mediaUrl?: string;
}

export async function processCitizenReport(dto: CitizenSubmissionDto): Promise<WeatherReport> {
  // Input sanity checks
  if (!dto.city || !dto.state || !dto.lat || !dto.lng) {
    throw new Error('Incomplete location payload: city, state, lat, and lng are required.');
  }

  // Ensure coordinates fall roughly within Indian bounding box (Lat: 6°N - 38°N, Lng: 68°E - 98°E)
  if (dto.lat < 6 || dto.lat > 38 || dto.lng < 68 || dto.lng > 98) {
    throw new Error('Coordinates fall outside Indian territorial boundaries.');
  }

  const rawInput: RawReportInput = {
    title: dto.title || `${dto.event} reported at ${dto.city}`,
    description: dto.description || `Severe ${dto.event} observed by citizen on the ground.`,
    event: dto.event,
    city: dto.city,
    district: dto.district || dto.city,
    state: dto.state,
    lat: dto.lat,
    lng: dto.lng,
    source: 'Citizen Mobile App (Geotagged)',
    sourceType: 'Citizen Reports',
    mediaUrl: dto.mediaUrl || 'https://images.unsplash.com/photo-1514632595-4944383f2737?auto=format&fit=crop&w=1200&q=80',
  };

  // Run comprehensive AI Verification Pipeline
  const aiResult = await runAIVerificationPipeline(rawInput);

  const reportId = `REP-CTZ-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date();
  const timestampStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const insert = db.prepare(`
    INSERT INTO reports (
      id, title, description, event, severity,
      city, district, state, lat, lng,
      timestamp, source, sourceType, sourceTrust,
      aiConfidence, duplicateProbability, status,
      relatedReportsCount, mediaUrl, mediaType,
      aiAssessment, verifiedBy, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )
  `);

  insert.run(
    reportId,
    rawInput.title,
    rawInput.description,
    aiResult.classifiedEvent,
    aiResult.severity,
    rawInput.city,
    rawInput.district,
    rawInput.state,
    rawInput.lat,
    rawInput.lng,
    timestampStr,
    rawInput.source,
    rawInput.sourceType,
    aiResult.sourceTrust,
    aiResult.aiConfidence,
    aiResult.duplicateProbability,
    aiResult.status,
    1,
    rawInput.mediaUrl,
    'image',
    JSON.stringify(aiResult.aiAssessment),
    aiResult.status === 'Verified' ? 'Automated AI Sensor Correlation' : null,
    timestampStr
  );

  // Update Data Source counters
  db.prepare(`
    UPDATE data_sources
    SET reportsCount = reportsCount + 1, lastUpdated = ?
    WHERE type = 'Citizen Reports'
  `).run(timestampStr);

  // Audit Log
  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, reportId, userRole, userName, action, oldStatus, newStatus, justification)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `AUDIT-${Date.now().toString().slice(-6)}`,
    now.toISOString(),
    reportId,
    'Citizen',
    'Crowd Observation Portal',
    'CITIZEN_SUBMISSION',
    'None',
    aiResult.status,
    `Submission triaged: AI confidence ${aiResult.aiConfidence}%, duplicate prob ${aiResult.duplicateProbability}%`
  );

  const savedReport: WeatherReport = {
    id: reportId,
    title: rawInput.title,
    description: rawInput.description,
    event: aiResult.classifiedEvent,
    severity: aiResult.severity,
    location: {
      city: rawInput.city,
      district: rawInput.district,
      state: rawInput.state,
      lat: rawInput.lat,
      lng: rawInput.lng,
    },
    timestamp: timestampStr,
    source: rawInput.source,
    sourceType: 'Citizen Reports',
    sourceTrust: aiResult.sourceTrust,
    aiConfidence: aiResult.aiConfidence,
    duplicateProbability: aiResult.duplicateProbability,
    status: aiResult.status,
    relatedReportsCount: 1,
    mediaUrl: rawInput.mediaUrl,
    mediaType: 'image',
    aiAssessment: aiResult.aiAssessment,
    verifiedBy: aiResult.status === 'Verified' ? 'Automated AI Sensor Correlation' : undefined,
    updatedAt: timestampStr,
  };

  eventBus.emit('report:new', savedReport);
  console.log(`[Citizen Ingest] New report registered: ${reportId} (${dto.event} in ${dto.city}) -> ${aiResult.status}`);
  return savedReport;
}

