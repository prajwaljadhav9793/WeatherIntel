import { WeatherEventType, AlertSeverity } from '../../src/types';
import { runAIVerificationPipeline } from '../ai/verificationPipeline';
import { db } from '../db';
import { eventBus } from '../pipeline/streamPipeline';

export interface IndianStationConfig {
  name: string;
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export const MONITORED_CITIES: IndianStationConfig[] = [
  { name: 'IMD Mumbai Regional', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', lat: 18.922, lng: 72.834 },
  { name: 'IMD Pune Observatory', city: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'IMD Safdarjung', city: 'New Delhi', district: 'New Delhi', state: 'Delhi', lat: 28.5833, lng: 77.2083 },
  { name: 'IMD Alipore Station', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5256, lng: 88.3267 },
  { name: 'IMD Meenambakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9833, lng: 80.1667 },
  { name: 'IMD Bengaluru City', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'IMD Shimla Ridge', city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'IMD Guwahati Centre', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'IMD Hyderabad Station', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
];

// Map WMO weather codes to platform event types
export function mapWmoCodeToEvent(code: number, rainMm: number, windKmh: number, tempC: number): { event: WeatherEventType; severity: AlertSeverity } {
  if (code >= 95) {
    return { event: 'Thunderstorm', severity: rainMm > 30 ? 'Critical' : 'High' };
  }
  if (code >= 80 || rainMm >= 15) {
    return { event: rainMm >= 40 ? 'Flooding' : 'Rainfall', severity: rainMm >= 40 ? 'Critical' : 'High' };
  }
  if (code >= 51 || rainMm > 0.5) {
    return { event: 'Rainfall', severity: 'Moderate' };
  }
  if (code >= 45 && code <= 48) {
    return { event: 'Fog', severity: 'Moderate' };
  }
  if (windKmh >= 45) {
    return { event: 'Strong Winds', severity: windKmh > 65 ? 'Critical' : 'High' };
  }
  if (tempC >= 40) {
    return { event: 'Heatwave', severity: tempC >= 44 ? 'Critical' : 'High' };
  }
  return { event: 'Rainfall', severity: 'Moderate' };
}

// Fetch live telemetry from Open-Meteo for an Indian station
export async function fetchLiveWeatherForStation(station: IndianStationConfig): Promise<void> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      console.warn(`[API Ingestion] Open-Meteo returned status ${res.status} for ${station.city}`);
      return;
    }
    const data = await res.json();
    const current = data.current;
    if (!current) return;

    const rainMm = current.precipitation || 0;
    const windKmh = current.wind_speed_10m || 0;
    const tempC = current.temperature_2m || 25;
    const humidity = current.relative_humidity_2m || 65;
    const wmoCode = current.weather_code || 0;

    const { event, severity } = mapWmoCodeToEvent(wmoCode, rainMm, windKmh, tempC);
    
    // Format descriptive observation
    const desc = `Live telemetry from ${station.name}: Temp ${tempC}°C, Humidity ${humidity}%, Precip ${rainMm}mm, Wind ${windKmh}km/h (WMO Code ${wmoCode}).`;
    const title = `${event} Activity Registered by ${station.name}`;

    const reportInput = {
      title,
      description: desc,
      event,
      city: station.city,
      district: station.district,
      state: station.state,
      lat: station.lat,
      lng: station.lng,
      source: `${station.name} Automated Feed`,
      sourceType: 'Official APIs',
    };

    const aiResult = await runAIVerificationPipeline(reportInput);

    const reportId = `REP-IMD-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
    const now = new Date();
    const timestampStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const insert = db.prepare(`
      INSERT OR REPLACE INTO reports (
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
      title,
      desc,
      aiResult.classifiedEvent,
      aiResult.severity || severity,
      station.city,
      station.district,
      station.state,
      station.lat,
      station.lng,
      timestampStr,
      reportInput.source,
      reportInput.sourceType,
      aiResult.sourceTrust,
      aiResult.aiConfidence,
      aiResult.duplicateProbability,
      aiResult.status,
      1,
      'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
      'image',
      JSON.stringify(aiResult.aiAssessment),
      'IMD Automated Meteorological Network',
      timestampStr
    );

    // Update source metrics in database
    db.prepare(`
      UPDATE data_sources
      SET reportsCount = reportsCount + 1, lastUpdated = ?
      WHERE type = 'Official APIs'
    `).run(timestampStr);

    console.log(`[API Ingestion] Synced live observation for ${station.city}: ${event} (${tempC}°C, ${rainMm}mm rain)`);

    // Broadcast through streaming event bus
    eventBus.emit('report:new', {
      id: reportId,
      title,
      description: desc,
      event: aiResult.classifiedEvent,
      severity: aiResult.severity || severity,
      location: {
        city: station.city,
        district: station.district,
        state: station.state,
        lat: station.lat,
        lng: station.lng,
      },
      timestamp: timestampStr,
      source: reportInput.source,
      sourceType: reportInput.sourceType,
      sourceTrust: aiResult.sourceTrust,
      aiConfidence: aiResult.aiConfidence,
      duplicateProbability: aiResult.duplicateProbability,
      status: aiResult.status,
      relatedReportsCount: 1,
      mediaUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
      mediaType: 'image',
      aiAssessment: aiResult.aiAssessment,
      verifiedBy: 'IMD Automated Meteorological Network',
      updatedAt: timestampStr,
    });

  } catch (err: any) {
    console.warn(`[API Ingestion] Live weather fetch failed for ${station.city}:`, err?.message || err);
  }
}

// Ingest from all monitored stations
export async function syncAllStations(): Promise<void> {
  console.log('[API Ingestion] Initiating live weather data sync across Indian stations...');
  for (const station of MONITORED_CITIES) {
    await fetchLiveWeatherForStation(station);
    // Be courteous to rate limits
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

