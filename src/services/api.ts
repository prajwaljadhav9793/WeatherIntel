import {
  WeatherReport,
  WeatherAlert,
  DataSourceItem,
  SystemComponentHealth,
  FilterState,
  VerificationStatus,
  WeatherEventType,
} from '../types';
import {
  INITIAL_REPORTS,
  ACTIVE_ALERTS,
  DATA_SOURCES,
  SYSTEM_HEALTH_METRICS,
} from '../data/mockData';

const BASE_URL = '/api';

export async function fetchReportsApi(filters?: Partial<FilterState>): Promise<WeatherReport[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.event && filters.event !== 'All') params.append('event', filters.event);
    if (filters?.state && filters.state !== 'All') params.append('state', filters.state);
    if (filters?.district && filters.district !== 'All') params.append('district', filters.district);
    if (filters?.verification && filters.verification !== 'All') params.append('status', filters.verification);
    if (filters?.searchQuery && filters.searchQuery.trim()) params.append('search', filters.searchQuery.trim());

    const res = await fetch(`${BASE_URL}/reports?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || INITIAL_REPORTS;
  } catch (err) {
    console.warn('[API Client] Falling back to local reports:', err);
    return INITIAL_REPORTS;
  }
}

export async function submitCitizenReportApi(data: {
  title?: string;
  description: string;
  event: WeatherEventType;
  city: string;
  district?: string;
  state: string;
  lat: number;
  lng: number;
  mediaUrl?: string;
}): Promise<WeatherReport> {
  const res = await fetch(`${BASE_URL}/reports/citizen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateReportStatusApi(
  reportId: string,
  status: VerificationStatus,
  justification?: string,
  userRole = 'IMD Analyst',
  userName = 'Regional Duty Officer'
): Promise<WeatherReport> {
  const res = await fetch(`${BASE_URL}/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, justification, userRole, userName }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function fetchAlertsApi(): Promise<WeatherAlert[]> {
  try {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || ACTIVE_ALERTS;
  } catch (err) {
    console.warn('[API Client] Falling back to local alerts:', err);
    return ACTIVE_ALERTS;
  }
}

export async function createAlertApi(alertData: Partial<WeatherAlert>): Promise<WeatherAlert> {
  const res = await fetch(`${BASE_URL}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function fetchSourcesApi(): Promise<DataSourceItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/sources`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || DATA_SOURCES;
  } catch (err) {
    console.warn('[API Client] Falling back to local sources:', err);
    return DATA_SOURCES;
  }
}

export async function toggleSourceStatusApi(id: string, activeStatus: boolean): Promise<void> {
  await fetch(`${BASE_URL}/sources/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activeStatus }),
  });
}

export async function fetchAuditLogsApi(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}/audit`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[API Client] Falling back to empty audit logs:', err);
    return [];
  }
}

export async function fetchSystemHealthApi(): Promise<{
  components: SystemComponentHealth[];
  slidingStats: any;
  systemStats: any;
}> {
  try {
    const res = await fetch(`${BASE_URL}/system/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || {
      components: SYSTEM_HEALTH_METRICS,
      slidingStats: { window5mCount: 0, window1hCount: 0, window24hCount: 0, criticalEvents1h: 0, activeHotspots: [] },
      systemStats: { uptimeSeconds: 120, memoryUsageMb: 45, nodeVersion: 'v24.0.0' },
    };
  } catch (err) {
    console.warn('[API Client] Falling back to local system health:', err);
    return {
      components: SYSTEM_HEALTH_METRICS,
      slidingStats: { window5mCount: 0, window1hCount: 0, window24hCount: 0, criticalEvents1h: 0, activeHotspots: [] },
      systemStats: { uptimeSeconds: 120, memoryUsageMb: 45, nodeVersion: 'v24.0.0' },
    };
  }
}

export async function fetchAnalyticsApi(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/analytics`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Client] Falling back on analytics:', err);
    return null;
  }
}

