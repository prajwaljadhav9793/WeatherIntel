import React from 'react';
import { WeatherReport } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, MapPin, Users, Activity, Sparkles } from 'lucide-react';

interface LiveEventFeedProps {
  reports: WeatherReport[];
  selectedReportId?: string;
  onSelectReport: (report: WeatherReport) => void;
  onViewAllReports?: () => void;
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onViewAllReports,
}) => {
  return (
    <div
      id="live-event-feed-panel"
      className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col h-full"
    >
      {/* Feed Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#D8EAF0]/70">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BBFEF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#087E9B]" />
          </span>
          <h3 className="font-bold text-base text-[#12313D] tracking-tight">
            Live Weather Events
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#087E9B] bg-[#EAF7FD] px-2 py-0.5 rounded-full border border-[#5BBFEF]/30">
          Stream Active
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[500px]">
        {reports.slice(0, 8).map((report, idx) => {
          const isSelected = selectedReportId === report.id;
          const time = report.timestamp.split('•')[1]?.trim() || report.timestamp;

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                isSelected
                  ? 'bg-white shadow-md border-[#5BBFEF] ring-2 ring-[#5BBFEF]/20'
                  : 'bg-white/60 hover:bg-white border-[#D8EAF0]/80 hover:border-[#5BBFEF]/50 hover:shadow-xs'
              } ${idx === 0 ? 'animate-in fade-in slide-in-from-top-1 duration-300' : ''}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-[#607B86] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#087E9B]" />
                  {time}
                </span>
                <StatusBadge status={report.status} size="sm" />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-sm text-[#12313D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#087E9B]" />
                  <span>{report.event}</span>
                </div>
                <div className="text-xs text-[#607B86] flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3" />
                  <span>{report.relatedReportsCount} reports</span>
                </div>
              </div>

              <div className="text-xs text-[#607B86] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#087E9B] flex-shrink-0" />
                <span className="truncate">
                  {report.location.city}, {report.location.state}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#D8EAF0]/40 flex items-center justify-between text-[11px] text-[#607B86]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#087E9B]" />
                  AI Conf: <strong className="text-[#087E9B]">{report.aiConfidence}%</strong>
                </span>
                <span className="truncate max-w-[130px]">{report.sourceType}</span>
              </div>
            </div>
          );
        })}
      </div>

      {onViewAllReports && (
        <button
          onClick={onViewAllReports}
          className="mt-3 pt-2 text-xs font-semibold text-[#087E9B] hover:text-[#07556B] text-center border-t border-[#D8EAF0]/60 transition-colors block w-full"
        >
          View All {reports.length} Reports →
        </button>
      )}
    </div>
  );
};
