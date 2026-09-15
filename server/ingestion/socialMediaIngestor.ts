import { runAIVerificationPipeline, RawReportInput } from '../ai/verificationPipeline';
import { db } from '../db';
import { eventBus } from '../pipeline/streamPipeline';

export interface SocialPostTemplate {
  author: string;
  handle: string;
  platform: 'X (Twitter)' | 'Telegram' | 'Public Web';
  text: string;
  hashtag: string;
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  mediaUrl: string;
}

export const SOCIAL_CANDIDATE_POSTS: SocialPostTemplate[] = [
  {
    author: 'Mumbai Weather Updates',
    handle: '@mumbai_rain_radar',
    platform: 'X (Twitter)',
    text: 'Heavy spells underway across Dadar, Kurla and Sion. Water accumulation up to 1 foot near Gandhi Market. #IMD #MumbaiRains',
    hashtag: '#MumbaiRains',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    lat: 19.033,
    lng: 72.863,
    mediaUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    author: 'Delhi Weatherman',
    handle: '@delhi_heat_watch',
    platform: 'X (Twitter)',
    text: 'Scorching afternoon in Delhi NCR! Safdarjung touching 42.8°C with blazing hot loo winds. Stay indoors. #IMD #DelhiWeather #Heatwave',
    hashtag: '#DelhiWeather',
    city: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    mediaUrl: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1200&q=80',
  },
  {
    author: 'Northeast Flood Alert Community',
    handle: '@brahmaputra_watch',
    platform: 'Telegram',
    text: 'Brahmaputra water level swelling rapidly near Guwahati ghats following heavy upstream cloudburst. #IMD #AssamFloods',
    hashtag: '#AssamFloods',
    city: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    lat: 26.18,
    lng: 91.75,
    mediaUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    author: 'Bengaluru Commuter Desk',
    handle: '@blr_traffic_rain',
    platform: 'X (Twitter)',
    text: 'Sudden high intensity thunderstorm hitting Outer Ring Road and Bellandur. Heavy lightning and squalls. #IMD #BengaluruRain',
    hashtag: '#BengaluruRain',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    lat: 12.9352,
    lng: 77.6245,
    mediaUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
  },
  {
    author: 'Kolkata Cloud Tracker',
    handle: '@bengal_cyclone_alert',
    platform: 'Public Web',
    text: 'Gusty winds exceeding 55 km/h along Diamond Harbour and Sundarbans coastal stretch. Sea conditions rough. #IMD #CycloneAlert',
    hashtag: '#CycloneAlert',
    city: 'Kolkata',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    lat: 22.18,
    lng: 88.2,
    mediaUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80',
  },
];

let socialCursor = 0;

// Ingest a single social post through the AI pipeline and stream bus
export async function ingestNextSocialPost(): Promise<void> {
  const post = SOCIAL_CANDIDATE_POSTS[socialCursor % SOCIAL_CANDIDATE_POSTS.length];
  socialCursor++;

  const input: RawReportInput = {
    title: `${post.hashtag} Observation via ${post.platform}`,
    description: `${post.text} [Author: ${post.author} (${post.handle})]`,
    city: post.city,
    district: post.district,
    state: post.state,
    lat: post.lat + (Math.random() - 0.5) * 0.02,
    lng: post.lng + (Math.random() - 0.5) * 0.02,
    source: `${post.platform} (${post.hashtag})`,
    sourceType: 'Social Media',
    mediaUrl: post.mediaUrl,
  };

  const aiResult = await runAIVerificationPipeline(input);

  const reportId = `REP-SOC-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
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
    input.title || `${aiResult.classifiedEvent} Report`,
    input.description,
    aiResult.classifiedEvent,
    aiResult.severity,
    input.city,
    input.district || input.city,
    input.state,
    input.lat,
    input.lng,
    timestampStr,
    input.source,
    input.sourceType,
    aiResult.sourceTrust,
    aiResult.aiConfidence,
    aiResult.duplicateProbability,
    aiResult.status,
    1,
    input.mediaUrl,
    'image',
    JSON.stringify(aiResult.aiAssessment),
    aiResult.status === 'Verified' ? 'Automated Social Cross-Verification' : null,
    timestampStr
  );

  // Update data source count
  db.prepare(`
    UPDATE data_sources
    SET reportsCount = reportsCount + 1, lastUpdated = ?
    WHERE type = 'Social Media'
  `).run(timestampStr);

  const newReportObj = {
    id: reportId,
    title: input.title || `${aiResult.classifiedEvent} Report`,
    description: input.description,
    event: aiResult.classifiedEvent,
    severity: aiResult.severity,
    location: {
      city: input.city,
      district: input.district || input.city,
      state: input.state,
      lat: input.lat,
      lng: input.lng,
    },
    timestamp: timestampStr,
    source: input.source,
    sourceType: 'Social Media' as const,
    sourceTrust: aiResult.sourceTrust,
    aiConfidence: aiResult.aiConfidence,
    duplicateProbability: aiResult.duplicateProbability,
    status: aiResult.status,
    relatedReportsCount: 1,
    mediaUrl: input.mediaUrl,
    mediaType: 'image' as const,
    aiAssessment: aiResult.aiAssessment,
    verifiedBy: aiResult.status === 'Verified' ? 'Automated Social Cross-Verification' : undefined,
    updatedAt: timestampStr,
  };

  eventBus.emit('report:new', newReportObj);
  console.log(`[Social Ingest] Processed post for ${post.city} [${post.hashtag}] -> ${aiResult.status} (${aiResult.classifiedEvent})`);
}

// Start periodic ingestion daemon
export function startSocialIngestionDaemon(intervalMs = 30000) {
  console.log(`[Social Ingest] Starting social media streaming ingestion daemon (Interval: ${intervalMs}ms)...`);
  setInterval(() => {
    ingestNextSocialPost().catch((err) => console.error('[Social Ingest] Error processing post:', err));
  }, intervalMs);
}

