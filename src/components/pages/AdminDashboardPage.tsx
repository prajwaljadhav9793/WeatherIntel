import React from 'react';
import { WeatherReport, ActivePage, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_SYSTEM_HEALTH } from '../../data/mockData';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  Clock,
  Cpu,
  Database,
  Radio,
  FileCheck,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Server,
} from 'lucide-react';

interface AdminDashboardPageProps {
  reports: WeatherReport[];
  onNavigate: (page: ActivePage) => void;
  onSelectReport: (report: WeatherReport) => void;
  onUpdateReportStatus: (reportId: string, status: VerificationStatus) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  reports,
  onNavigate,
  onSelectReport,
  onUpdateReportStatus,
}) => {
  const pendingReports = reports.filter((r) => r.status === 'Under Review');
  const suspiciousReports = reports.filter((r) => r.status === 'Suspicious');
  const verifiedReports = reports.filter((r) => r.status === 'Verified');
  const duplicateReports = reports.filter((r) => r.status === 'Duplicate');

  return (
    <div className="space-y-8 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Ministry of Earth Sciences • Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Command Center Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Operational oversight of data ingestion feeds, AI corroboration queues, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('admin-workspace')}
            className="px-4 py-2 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Launch Verification Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#607B86] uppercase block">
            Total Reports
          </span>
          <div className="text-2xl font-extrabold text-[#12313D] mt-1">24,580</div>
          <span className="text-[10px] text-[#2AA66F] font-semibold">+1,240 in last 24h</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#607B86] uppercase block">
            Pending Review
          </span>
          <div className="text-2xl font-extrabold text-[#E5983B] mt-1">
            {pendingReports.length}
          </div>
          <span className="text-[10px] text-[#607B86]">Awaiting officer triage</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#607B86] uppercase block">
            Suspicious Flagged
          </span>
          <div className="text-2xl font-extrabold text-[#E45C5C] mt-1">
            {suspiciousReports.length}
          </div>
          <span className="text-[10px] text-[#E45C5C] font-semibold">Anomalies detected</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#607B86] uppercase block">
            Duplicates Blocked
          </span>
          <div className="text-2xl font-extrabold text-[#607B86] mt-1">
            {duplicateReports.length + 3180}
          </div>
          <span className="text-[10px] text-[#2AA66F] font-semibold">Perceptual hash match</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-[#607B86] uppercase block">
            Active Sources
          </span>
          <div className="text-2xl font-extrabold text-[#087E9B] mt-1">6 Feeds</div>
          <span className="text-[10px] text-[#2AA66F] font-semibold">100% telemetry online</span>
        </div>
      </div>

      {/* Grid: Verification Queue Preview & System Health Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Queue Preview (65%) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#12313D] tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#087E9B]" />
              Verification Queue (High Priority)
            </h3>
            <button
              onClick={() => onNavigate('admin-workspace')}
              className="text-xs font-semibold text-[#087E9B] hover:underline"
            >
              Open 3-Column Workspace →
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#EAF7FD] text-[#087E9B]">
                      {report.event}
                    </span>
                    <StatusBadge status={report.status} size="sm" />
                    <span className="text-[11px] text-[#607B86] font-mono">{report.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#12313D]">{report.title}</h4>
                  <div className="text-xs text-[#607B86] mt-0.5">
                    {report.location.city}, {report.location.state} • Source: {report.source}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onUpdateReportStatus(report.id, 'Verified')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#2AA66F] hover:bg-[#238a5c] text-white text-xs font-semibold transition-colors"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => onUpdateReportStatus(report.id, 'Suspicious')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#E45C5C] hover:bg-[#cf4848] text-white text-xs font-semibold transition-colors"
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => onSelectReport(report)}
                    className="px-2.5 py-1.5 rounded-xl bg-white text-[#607B86] hover:text-[#12313D] border border-[#D8EAF0] text-xs font-semibold transition-colors"
                  >
                    Examine
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Status (35%) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg text-[#12313D] tracking-tight flex items-center gap-2">
                <Server className="w-5 h-5 text-[#087E9B]" />
                Infrastructure Health
              </h3>
              <button
                onClick={() => onNavigate('system-health')}
                className="text-xs font-semibold text-[#087E9B] hover:underline"
              >
                Detailed Logs →
              </button>
            </div>
            <p className="text-xs text-[#607B86] mb-4">
              Real-time container and pipeline health.
            </p>

            <div className="space-y-3">
              {MOCK_SYSTEM_HEALTH.map((service) => (
                <div
                  key={service.id}
                  className="p-3 rounded-2xl bg-white/70 border border-[#D8EAF0] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#12313D]">{service.name}</div>
                    <div className="text-[11px] text-[#607B86]">
                      {service.latencyMs}ms • {service.uptimePercent}% uptime
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2AA66F]/10 text-[#2AA66F] border border-[#2AA66F]/30">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#D8EAF0] flex items-center justify-between text-xs text-[#607B86]">
            <span>Last Cluster Heartbeat:</span>
            <strong className="text-[#12313D]">12ms ago</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
