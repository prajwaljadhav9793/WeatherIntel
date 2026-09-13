export type WeatherEventType =
  | 'Rainfall'
  | 'Thunderstorm'
  | 'Flooding'
  | 'Heatwave'
  | 'Fog'
  | 'Dust Storm'
  | 'Strong Winds';

export type VerificationStatus =
  | 'Verified'
  | 'Under Review'
  | 'Suspicious'
  | 'Duplicate';

export type AlertSeverity =
  | 'Critical'
  | 'High'
  | 'Moderate'
  | 'Information';

export type SourceType =
  | 'Official APIs'
  | 'Weather APIs'
  | 'Social Media'
  | 'Public Datasets'
  | 'Websites'
  | 'Citizen Reports';

export interface LocationData {
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface AIAssessment {
  eventClassification: string;
  confidenceScore: number; // 0 - 100
  locationConsistency: 'High' | 'Moderate' | 'Low';
  timestampConsistency: 'High' | 'Moderate' | 'Low';
  duplicateDetection: 'Low probability' | 'Moderate probability' | 'High probability';
  duplicateProbability: number; // 0 - 100
  imageAnalysis: string;
  flagReason?: string;
  nlpSummary: string;
}

export interface WeatherReport {
  id: string;
  title: string;
  description: string;
  event: WeatherEventType;
  severity: AlertSeverity;
  location: LocationData;
  timestamp: string; // e.g., "12 Sep 2026 • 10:42 AM" or ISO
  source: string;
  sourceType: SourceType;
  sourceTrust: number; // 0 - 100
  aiConfidence: number; // 0 - 100
  duplicateProbability: number; // 0 - 100
  status: VerificationStatus;
  relatedReportsCount: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  aiAssessment: AIAssessment;
  verifiedBy?: string;
  updatedAt: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  event: WeatherEventType;
  location: string;
  state: string;
  severity: AlertSeverity;
  timestamp: string;
  verification: VerificationStatus;
  reportsCount: number;
  description: string;
  guidelines: string[];
  affectedDistricts: string[];
  issuedBy: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  type: SourceType;
  reportsCount: number;
  trustScore: number; // 0 - 100
  lastUpdated: string;
  status: 'Trusted' | 'Monitoring' | 'Restricted';
  description: string;
  rateLimit: string;
  activeStatus: boolean;
  latency?: string;
}

export interface SystemComponentHealth {
  id: string;
  name: string;
  category: 'Ingestion' | 'Processing' | 'Database' | 'Intelligence' | 'Network' | 'Storage';
  status: 'Operational' | 'Warning' | 'Offline';
  latencyMs: number;
  throughputPerSec: number;
  uptimePercent: number;
  lastChecked: string;
  notes: string;
}

export interface FilterState {
  dateRange: '24H' | '7D' | '30D' | '3M';
  event: WeatherEventType | 'All';
  state: string | 'All';
  district: string | 'All';
  verification: VerificationStatus | 'All';
  searchQuery: string;
}

export type DataSource = DataSourceItem;
export type SystemHealth = SystemComponentHealth;

export type ActivePage =
  | 'landing'
  | 'overview'
  | 'monitor'
  | 'reports'
  | 'report-details'
  | 'verification'
  | 'analytics'
  | 'geospatial'
  | 'citizen-report'
  | 'alerts'
  | 'sources'
  | 'auth'
  | 'admin'
  | 'admin-dashboard'
  | 'admin-workspace'
  | 'admin-verification'
  | 'source-management'
  | 'system-health'
  | 'audit-logs';

export type UserRole = 'Citizen' | 'IMD Analyst' | 'Admin';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
}
