import React, { useState } from 'react';
import { WeatherReport, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Copy,
  XCircle,
  MapPin,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AdminVerificationWorkspaceProps {
  reports: WeatherReport[];
  onUpdateReportStatus: (reportId: string, status: VerificationStatus) => void;
}

export const AdminVerificationWorkspacePage: React.FC<
  AdminVerificationWorkspaceProps
> = ({ reports, onUpdateReportStatus }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSearch =
      searchQuery.trim() === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleAction = (status: VerificationStatus) => {
    if (!selectedReport) return;
    onUpdateReportStatus(selectedReport.id, status);
    setNotification(`Report ${selectedReport.id} marked as ${status}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Rapid Triage Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12313D] tracking-tight">
            Verification Workspace (3-Column Stream)
          </h1>
          <p className="text-xs text-[#607B86]">
            Review incoming payloads, AI computer vision flags, and dispatch status without leaving the viewport.
          </p>
        </div>

        {notification && (
          <div className="px-3.5 py-1.5 rounded-xl bg-[#2AA66F]/15 border border-[#2AA66F]/30 text-[#2AA66F] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* 3-COLUMN WORKSPACE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[620px]">
        {/* COLUMN 1 (LEFT 30%): QUEUE */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#12313D]">
                Queue ({filteredReports.length})
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-semibold text-[#087E9B] bg-transparent outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Duplicate">Duplicate</option>
              </select>
            </div>

            {/* Micro search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
              />
            </div>

            {/* Scrollable list of reports */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredReports.map((r) => {
                const isSelected = selectedReport?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReportId(r.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white border-[#087E9B] shadow-sm ring-2 ring-[#5BBFEF]/20'
                        : 'bg-white/60 hover:bg-white border-[#D8EAF0]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EAF7FD] text-[#087E9B]">
                        {r.event}
                      </span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <div className="font-bold text-xs text-[#12313D] truncate">{r.title}</div>
                    <div className="text-[11px] text-[#607B86] mt-0.5 flex items-center justify-between">
                      <span className="truncate max-w-[120px]">
                        {r.location.city}, {r.location.state}
                      </span>
                      <span className="font-semibold text-[#087E9B]">{r.aiConfidence}% AI</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2 (CENTER 45%): SELECTED REPORT */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4">
          {selectedReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B] bg-[#EAF7FD] px-2.5 py-1 rounded-lg">
                  {selectedReport.event}
                </span>
                <span className="text-xs text-[#607B86] font-mono">
                  {selectedReport.id}
                </span>
              </div>

              {/* Photo Media Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#EAF7FD] border border-[#D8EAF0]">
                <img
                  src={
                    selectedReport.mediaUrl ||
                    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#12313D] mb-1">
                  {selectedReport.title}
                </h3>
                <p className="text-xs text-[#607B86] leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* Geo Coordinates & Metadata */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D8EAF0] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[#12313D]">
                  <span className="text-[#607B86]">Coordinates:</span>
                  <span className="font-semibold">
                    {selectedReport.location.lat}° N, {selectedReport.location.lng}° E
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#12313D]">
                  <span className="text-[#607B86]">District / State:</span>
                  <span className="font-semibold">
                    {selectedReport.location.district}, {selectedReport.location.state}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#12313D]">
                  <span className="text-[#607B86]">Source Network:</span>
                  <span className="font-semibold">{selectedReport.source}</span>
                </div>
                <div className="flex items-center justify-between text-[#12313D]">
                  <span className="text-[#607B86]">Timestamp:</span>
                  <span className="font-semibold">{selectedReport.timestamp}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-[#607B86] text-xs">
              No report selected
            </div>
          )}
        </div>

        {/* COLUMN 3 (RIGHT 25%): AI ANALYSIS & INSTANT ACTIONS */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4">
          {selectedReport ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#D8EAF0]/60">
                  <Sparkles className="w-4 h-4 text-[#087E9B]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#12313D]">
                    AI ASSESSMENT
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-[#D8EAF0] text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#607B86]">AI Confidence:</span>
                    <strong className="text-sm font-bold text-[#087E9B]">
                      {selectedReport.aiConfidence}%
                    </strong>
                  </div>
                  <div className="w-full bg-[#EAF7FD] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#087E9B] h-full rounded-full"
                      style={{ width: `${selectedReport.aiConfidence}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/70 border border-[#D8EAF0]">
                    <span className="text-[10px] text-[#607B86] block">Location Verification</span>
                    <strong className="text-[#2AA66F]">
                      {selectedReport.aiAssessment.locationConsistency}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 border border-[#D8EAF0]">
                    <span className="text-[10px] text-[#607B86] block">Timestamp Accuracy</span>
                    <strong className="text-[#2AA66F]">
                      {selectedReport.aiAssessment.timestampConsistency}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 border border-[#D8EAF0]">
                    <span className="text-[10px] text-[#607B86] block">Duplicate Risk</span>
                    <strong
                      className={
                        selectedReport.duplicateProbability > 50
                          ? 'text-[#E45C5C]'
                          : 'text-[#2AA66F]'
                      }
                    >
                      {selectedReport.duplicateProbability}% Probability
                    </strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#EAF7FD]/70 border border-[#D8EAF0] text-[11px] text-[#07556B] leading-relaxed">
                  <strong>Model Note:</strong> {selectedReport.aiAssessment.imageAnalysis}
                </div>
              </div>

              {/* Instant Action Controls */}
              <div className="pt-3 border-t border-[#D8EAF0] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#607B86] block text-center">
                  Immediate Disposition
                </span>

                <button
                  onClick={() => handleAction('Verified')}
                  className="w-full py-2.5 rounded-xl bg-[#2AA66F] hover:bg-[#238a5c] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>VERIFY REPORT</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAction('Suspicious')}
                    className="py-2 rounded-xl bg-[#E45C5C] hover:bg-[#cf4848] text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SUSPICIOUS</span>
                  </button>

                  <button
                    onClick={() => handleAction('Duplicate')}
                    className="py-2 rounded-xl bg-white hover:bg-[#EAF7FD] text-[#607B86] font-semibold text-xs border border-[#D8EAF0] flex items-center justify-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>DUPLICATE</span>
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
