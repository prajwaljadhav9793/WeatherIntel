import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  fetchReportsApi,
  submitCitizenReportApi,
  updateReportStatusApi,
  fetchAlertsApi,
  fetchSourcesApi,
  fetchAuditLogsApi,
  fetchSystemHealthApi,
  toggleSourceStatusApi,
} from '../services/api';
import {
  INITIAL_REPORTS,
  ACTIVE_ALERTS,
  DATA_SOURCES,
  SYSTEM_HEALTH_METRICS,
} from '../data/mockData';

interface WeatherContextType {
  reports: WeatherReport[];
  selectedReport: WeatherReport | null;
  alerts: WeatherAlert[];
  sources: DataSourceItem[];
  systemHealth: SystemComponentHealth[];
  auditLogs: any[];
  slidingStats: any;
  isConnectedToStream: boolean;
  filters: FilterState;
  isLoading: boolean;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleFilterChange: (newFilters: Partial<FilterState>) => void;
  handleResetFilters: () => void;
  setSelectedReport: (report: WeatherReport | null) => void;
  updateReportStatus: (
    reportId: string,
    newStatus: VerificationStatus,
    justification?: string,
    userName?: string
  ) => Promise<void>;
  submitCitizenReport: (data: {
    title?: string;
    description: string;
    event: WeatherEventType;
    city: string;
    district?: string;
    state: string;
    lat: number;
    lng: number;
    mediaUrl?: string;
  }) => Promise<WeatherReport>;
  toggleSource: (sourceId: string, activeStatus: boolean) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WeatherReport[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(INITIAL_REPORTS[0]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(ACTIVE_ALERTS);
  const [sources, setSources] = useState<DataSourceItem[]>(DATA_SOURCES);
  const [systemHealth, setSystemHealth] = useState<SystemComponentHealth[]>(SYSTEM_HEALTH_METRICS);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [slidingStats, setSlidingStats] = useState<any>(null);
  const [isConnectedToStream, setIsConnectedToStream] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: '24H',
    event: 'All',
    state: 'All',
    district: 'All',
    verification: 'All',
    searchQuery: '',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: '24H',
      event: 'All',
      state: 'All',
      district: 'All',
      verification: 'All',
      searchQuery: '',
    });
  };

  // Initial Data Load
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedReports, fetchedAlerts, fetchedSources, fetchedAudit, healthData] = await Promise.all([
        fetchReportsApi(filters),
        fetchAlertsApi(),
        fetchSourcesApi(),
        fetchAuditLogsApi(),
        fetchSystemHealthApi(),
      ]);

      if (fetchedReports && fetchedReports.length > 0) {
        setReports(fetchedReports);
        setSelectedReport((prev) => (prev ? fetchedReports.find((r) => r.id === prev.id) || fetchedReports[0] : fetchedReports[0]));
      }
      if (fetchedAlerts) setAlerts(fetchedAlerts);
      if (fetchedSources) setSources(fetchedSources);
      if (fetchedAudit) setAuditLogs(fetchedAudit);
      if (healthData) {
        setSystemHealth(healthData.components);
        setSlidingStats(healthData.slidingStats);
      }
    } catch (err) {
      console.warn('[WeatherContext] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Connect to Server-Sent Events (SSE) stream for live updates
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/stream');

      eventSource.onopen = () => {
        setIsConnectedToStream(true);
        console.log('[SSE Stream] Connected to live WeatherIntel stream');
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'REPORT_NEW') {
            const newReport = data.payload as WeatherReport;
            setReports((prev) => {
              if (prev.some((r) => r.id === newReport.id)) return prev;
              return [newReport, ...prev];
            });
          } else if (data.type === 'REPORT_STATUS_UPDATE') {
            const updated = data.payload as WeatherReport;
            setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelectedReport((prev) => (prev?.id === updated.id ? updated : prev));
          } else if (data.type === 'ALERT_NEW') {
            const newAlert = data.payload as WeatherAlert;
            setAlerts((prev) => {
              if (prev.some((a) => a.id === newAlert.id)) return prev;
              return [newAlert, ...prev];
            });
          }
        } catch (err) {
          // heartbeat or unparseable
        }
      };

      eventSource.onerror = () => {
        setIsConnectedToStream(false);
      };
    } catch (err) {
      console.warn('[SSE Stream] EventSource initialization failed:', err);
      setIsConnectedToStream(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const updateReportStatus = async (
    reportId: string,
    newStatus: VerificationStatus,
    justification?: string,
    userName = 'IMD Duty Officer'
  ) => {
    // Optimistic UI update
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus, verifiedBy: userName } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus, verifiedBy: userName } : null));
    }

    try {
      const updated = await updateReportStatusApi(reportId, newStatus, justification, 'IMD Analyst', userName);
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(updated);
      }
      const logs = await fetchAuditLogsApi();
      setAuditLogs(logs);
    } catch (err) {
      console.error('[WeatherContext] Failed to persist report status update:', err);
    }
  };

  const submitCitizenReport = async (data: {
    title?: string;
    description: string;
    event: WeatherEventType;
    city: string;
    district?: string;
    state: string;
    lat: number;
    lng: number;
    mediaUrl?: string;
  }) => {
    const saved = await submitCitizenReportApi(data);
    setReports((prev) => [saved, ...prev]);
    setSelectedReport(saved);
    return saved;
  };

  const toggleSource = async (sourceId: string, activeStatus: boolean) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, activeStatus } : s))
    );
    await toggleSourceStatusApi(sourceId, activeStatus);
  };

  return (
    <WeatherContext.Provider
      value={{
        reports,
        selectedReport,
        alerts,
        sources,
        systemHealth,
        auditLogs,
        slidingStats,
        isConnectedToStream,
        filters,
        isLoading,
        setFilters,
        handleFilterChange,
        handleResetFilters,
        setSelectedReport,
        updateReportStatus,
        submitCitizenReport,
        toggleSource,
        refreshAll,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

