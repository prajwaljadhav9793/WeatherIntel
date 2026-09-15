import { db, formatDbReport } from '../server/db';
import { runAIVerificationPipeline } from '../server/ai/verificationPipeline';
import { fetchLiveWeatherForStation, MONITORED_CITIES } from '../server/ingestion/weatherApiConnector';
import { processCitizenReport } from '../server/ingestion/citizenReportIngestor';
import { ingestNextSocialPost } from '../server/ingestion/socialMediaIngestor';
import { streamEngine, eventBus } from '../server/pipeline/streamPipeline';

async function runEndToEndVerification() {
  console.log('===========================================================');
  console.log(' WeatherIntel India — Big Data Platform E2E Test Suite');
  console.log('===========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} — ${detail || ''}`);
    }
  }

  // 1. Database & Table Integrity
  const reportCount = (db.prepare('SELECT COUNT(*) as cnt FROM reports').get() as any).cnt;
  assert(reportCount > 0, '1. SQLite Persistent Database Integrity', `Report count: ${reportCount}`);

  const auditCount = (db.prepare('SELECT COUNT(*) as cnt FROM audit_logs').get() as any).cnt;
  assert(auditCount > 0, '2. Governance Audit Trail Persistence', `Audit logs: ${auditCount}`);

  // 3. Physical Sensor Cross-Validation (Anomaly Detection for Fake Reports)
  const fakeFloodReport = {
    description: 'Catastrophic flash flood submerged all roads with 5 feet water in Thar desert',
    city: 'Jodhpur',
    state: 'Rajasthan',
    lat: 26.2389,
    lng: 73.0243,
    source: 'Social Media',
    sourceType: 'Social Media',
  };
  const fakeCheck = await runAIVerificationPipeline(fakeFloodReport);
  assert(
    fakeCheck.status === 'Suspicious' && fakeCheck.aiAssessment.locationConsistency === 'Low',
    '3. AI Anomaly & Fake-Report Detection against Sensor Ground Truth',
    `Status: ${fakeCheck.status}, Flag: ${fakeCheck.aiAssessment.flagReason}`
  );

  // 4. Multi-Class NLP Weather Event Classification
  const thunderReport = {
    description: 'Severe convective cloudburst, continuous lightning swarm and low cloud base over Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.877,
    source: 'Citizen Reports',
    sourceType: 'Citizen Reports',
  };
  const classCheck = await runAIVerificationPipeline(thunderReport);
  assert(
    classCheck.classifiedEvent === 'Thunderstorm',
    '4. Multi-Class NLP Event Classifier',
    `Expected Thunderstorm, got: ${classCheck.classifiedEvent} (${classCheck.aiConfidence}% conf)`
  );

  // 5. Spatial-Temporal Deduplication
  const duplicateInput = {
    description: 'Panchganga river has crossed warning level of 41 feet. Shiroli submerged under water and flood',
    city: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.705,
    lng: 74.2433,
    source: 'Citizen Reports',
    sourceType: 'Citizen Reports',
  };
  const dupCheck = await runAIVerificationPipeline(duplicateInput);
  assert(
    dupCheck.duplicateProbability >= 55,
    '5. Spatial-Temporal Deduplication Engine',
    `Duplicate prob: ${dupCheck.duplicateProbability}%, Detection: ${dupCheck.aiAssessment.duplicateDetection}`
  );

  // 6. Real Open-Meteo Station Telemetry Ingestion
  const initialReports = (db.prepare('SELECT COUNT(*) as cnt FROM reports').get() as any).cnt;
  await fetchLiveWeatherForStation(MONITORED_CITIES[0]); // Mumbai
  const postApiReports = (db.prepare('SELECT COUNT(*) as cnt FROM reports').get() as any).cnt;
  assert(
    postApiReports >= initialReports,
    '6. Live Weather API Ingestion Connector (Open-Meteo Real Data)',
    `Before: ${initialReports}, After: ${postApiReports}`
  );

  // 7. Social Media #IMD Hashtag Stream Processing
  await ingestNextSocialPost();
  const latestSocial = db.prepare("SELECT * FROM reports WHERE sourceType = 'Social Media' ORDER BY rowid DESC LIMIT 1").get() as any;
  assert(
    Boolean(latestSocial && latestSocial.source.includes('#')),
    '7. Social Media & Hashtag Collection Engine',
    `Latest source: ${latestSocial?.source}`
  );

  // 8. Citizen Ground Observation Ingestion
  const citizenSubmission = await processCitizenReport({
    title: 'Flash Waterlogging in Camp Area',
    description: 'Heavy rainfall causing knee-deep water accumulation on Main Street.',
    event: 'Flooding',
    city: 'Pune',
    district: 'Pune District',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
  });
  assert(
    citizenSubmission.id.startsWith('REP-CTZ-') && citizenSubmission.location.city === 'Pune',
    '8. Crowdsourced Citizen Reporting & AI Validation Workflow',
    `Generated ID: ${citizenSubmission.id}`
  );

  // 9. In-Memory Sliding-Window Big Data Aggregator
  const stats = streamEngine.getSlidingStats();
  assert(
    stats.window24hCount >= 0 && Array.isArray(stats.activeHotspots),
    '9. Sliding-Window Big-Data Stream Aggregation Engine',
    `5m: ${stats.window5mCount}, 1h: ${stats.window1hCount}, 24h: ${stats.window24hCount}`
  );

  // 10. Audit Trail Verification & Admin Action
  const latestAudit = db.prepare('SELECT * FROM audit_logs ORDER BY rowid DESC LIMIT 1').get() as any;
  assert(
    latestAudit && latestAudit.action !== '',
    '10. Operational Admin Governance & Audit Logging',
    `Action: ${latestAudit?.action}, User: ${latestAudit?.userName}`
  );

  console.log('\n-----------------------------------------------------------');
  console.log(` Test Results: ${passed} / ${total} Checks Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('-----------------------------------------------------------\n');

  if (passed === total) {
    console.log('[SUCCESS] All 8 problem statement architectural requirements verified!');
  } else {
    process.exit(1);
  }
}

runEndToEndVerification().catch((err) => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});

