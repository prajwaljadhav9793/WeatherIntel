import React, { useState } from 'react';
import { WeatherReport, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

interface AIVerificationCenterPageProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  onViewReportDetails: (report: WeatherReport) => void;
  onUpdateReportStatus: (reportId: string, status: VerificationStatus) => void;
}

export const AIVerificationCenterPage: React.FC<AIVerificationCenterPageProps> = ({
  reports,
  onSelectReport,
  onViewReportDetails,
  onUpdateReportStatus,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    VerificationStatus | 'All'
  >('Under Review');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(
    reports[0]?.id || null
  );

  const filteredReports = reports.filter((r) => {
    if (selectedStatusFilter === 'All') return true;
    return r.status === selectedStatusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Automated Disinformation & Sensor Verification
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            AI Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Real-time multi-modal AI validation of weather reports against physical radar grids and historical archives.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-[#D8EAF0] text-xs">
          {(['Under Review', 'Verified', 'Suspicious', 'Duplicate', 'All'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedStatusFilter === st
                    ? 'bg-[#087E9B] text-white shadow-xs'
                    : 'text-[#607B86] hover:text-[#12313D] hover:bg-[#EAF7FD]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Verification Queue Cards */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const isExpanded = expandedReportId === report.id;

          return (
            <div
              key={report.id}
              className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-[#087E9B]/50 shadow-md ring-2 ring-[#087E9B]/10'
                  : 'border-[#D8EAF0] hover:border-[#5BBFEF]/60'
              }`}
            >
              {/* Header Bar of Queue Item */}
              <div
                onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EAF7FD] flex-shrink-0 border border-[#D8EAF0]">
                    <img
                      src={report.mediaUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=400&q=80'}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#EAF7FD] text-[#087E9B] border border-[#5BBFEF]/30">
                        {report.event}
                      </span>
                      <StatusBadge status={report.status} size="sm" />
                      <span className="text-xs text-[#607B86] font-mono">{report.id}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#12313D]">
                      {report.title}
                    </h3>
                    <p className="text-xs text-[#607B86] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                        {report.location.city}, {report.location.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {report.timestamp}
                      </span>
                    </p>
                  </div>
                </div>

                {/* AI Scores row */}
                <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#D8EAF0]/60">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#607B86] block">
                      AI Confidence
                    </span>
                    <span className="text-sm font-bold text-[#087E9B] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#087E9B]" />
                      {report.aiConfidence}%
                    </span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#607B86] block">
                      Source Trust
                    </span>
                    <span className="text-sm font-bold text-[#12313D] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2AA66F]" />
                      {report.sourceTrust}%
                    </span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#607B86] block">
                      Duplicate Prob
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        report.duplicateProbability > 50
                          ? 'text-[#E45C5C]'
                          : 'text-[#2AA66F]'
                      }`}
                    >
                      {report.duplicateProbability}%
                    </span>
                  </div>

                  <div className="p-1 rounded-xl bg-white/70 border border-[#D8EAF0] text-[#607B86]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed AI Assessment Area (Expandable) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#D8EAF0]/70 bg-white/40 space-y-4 animate-in fade-in duration-200">
                  {/* "Why AI flagged this report" */}
                  <div className="p-4 rounded-2xl bg-[#EAF7FD]/60 border border-[#D8EAF0] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#07556B] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#087E9B]" />
                        Why AI flagged this report
                      </h4>
                      <span className="text-[10px] font-semibold text-[#087E9B] bg-white px-2 py-0.5 rounded-full border border-[#D8EAF0]">
                        AI Assessment
                      </span>
                    </div>
                    <p className="text-xs text-[#12313D] leading-relaxed">
                      {report.aiAssessment.flagReason ||
                        'Multiple nearby Doppler and AWS sensors corroborate elevated precipitation levels consistent with citizen timestamp and GPS geotag.'}
                    </p>
                  </div>

                  {/* Diagnostic Breakdown Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-[#D8EAF0]">
                      <span className="text-[10px] text-[#607B86] block mb-0.5 font-medium">
                        Event Classification
                      </span>
                      <span className="font-bold text-[#087E9B]">
                        {report.aiAssessment.eventClassification}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#D8EAF0]">
                      <span className="text-[10px] text-[#607B86] block mb-0.5 font-medium">
                        Location Consistency
                      </span>
                      <span className="font-bold text-[#2AA66F]">
                        {report.aiAssessment.locationConsistency}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#D8EAF0]">
                      <span className="text-[10px] text-[#607B86] block mb-0.5 font-medium">
                        Timestamp Consistency
                      </span>
                      <span className="font-bold text-[#2AA66F]">
                        {report.aiAssessment.timestampConsistency}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#D8EAF0]">
                      <span className="text-[10px] text-[#607B86] block mb-0.5 font-medium">
                        Image Analysis
                      </span>
                      <span className="font-bold text-[#12313D] truncate block">
                        {report.aiAssessment.imageAnalysis.slice(0, 30)}...
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-[#607B86] italic">
                      Always label as: <strong className="text-[#07556B]">AI Assessment</strong> (Not absolute ground truth)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'Verified')}
                        className="px-3 py-1.5 rounded-xl bg-[#2AA66F] hover:bg-[#238a5c] text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Verify Report</span>
                      </button>

                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'Suspicious')}
                        className="px-3 py-1.5 rounded-xl bg-[#E45C5C] hover:bg-[#cf4848] text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Mark Suspicious</span>
                      </button>

                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'Duplicate')}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF7FD] text-[#607B86] font-semibold text-xs border border-[#D8EAF0] transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={() => onViewReportDetails(report)}
                        className="px-3 py-1.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>Full Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
