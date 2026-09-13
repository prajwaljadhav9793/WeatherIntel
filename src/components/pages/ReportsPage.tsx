import React, { useState } from 'react';
import {
  WeatherReport,
  WeatherEventType,
  VerificationStatus,
  SourceType,
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Download,
} from 'lucide-react';

interface ReportsPageProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  onViewDetails: (report: WeatherReport) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  reports,
  onSelectReport,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WeatherEventType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'All'>('All');
  const [selectedSourceType, setSelectedSourceType] = useState<SourceType | 'All'>('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const categories: (WeatherEventType | 'All')[] = [
    'All',
    'Rainfall',
    'Flooding',
    'Thunderstorm',
    'Heatwave',
    'Fog',
    'Dust Storm',
    'Strong Winds',
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || report.event === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || report.status === selectedStatus;
    const matchesSource =
      selectedSourceType === 'All' || report.sourceType === selectedSourceType;

    return matchesSearch && matchesCategory && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Weather Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Ingested intelligence stream from Doppler radar, AWS networks, satellites and citizen reports.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#07556B] bg-[#EAF7FD] px-3.5 py-1.5 rounded-xl border border-[#D8EAF0] flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
          <span>{filteredReports.length} Reports Found</span>
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports, cities, states or sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
          />
        </div>

        {/* Filter Chips for Weather Events */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#607B86] font-medium mr-1 flex-shrink-0">Events:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#087E9B] text-white font-semibold shadow-xs'
                  : 'bg-white/70 text-[#607B86] hover:text-[#12313D] hover:bg-white border border-[#D8EAF0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Additional Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#D8EAF0]/60 text-xs">
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-[#D8EAF0]">
            <span className="text-[#607B86]">Verification:</span>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as VerificationStatus | 'All')
              }
              className="font-semibold text-[#12313D] bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Duplicate">Duplicate</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-[#D8EAF0]">
            <span className="text-[#607B86]">Source Type:</span>
            <select
              value={selectedSourceType}
              onChange={(e) =>
                setSelectedSourceType(e.target.value as SourceType | 'All')
              }
              className="font-semibold text-[#12313D] bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Sources</option>
              <option value="Official APIs">Official APIs</option>
              <option value="Weather APIs">Weather APIs</option>
              <option value="Public Datasets">Public Datasets</option>
              <option value="Citizen Reports">Citizen Reports</option>
              <option value="Social Media">Social Media</option>
              <option value="Websites">Websites</option>
            </select>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block glass-panel rounded-2xl border border-[#D8EAF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAF7FD]/70 border-b border-[#D8EAF0] text-[#07556B] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Report</th>
                <th className="py-3 px-3">Event</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">AI Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8EAF0]/60">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => onViewDetails(report)}
                  className="hover:bg-white/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#12313D] max-w-[280px]">
                    <div className="truncate group-hover:text-[#087E9B] transition-colors">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-[#607B86] font-normal truncate mt-0.5">
                      {report.id} • {report.relatedReportsCount} corroborations
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-[#12313D] bg-[#EAF7FD] px-2.5 py-1 rounded-lg border border-[#D8EAF0]">
                      {report.event}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#12313D]">
                    <div className="font-medium">{report.location.city}</div>
                    <div className="text-[11px] text-[#607B86]">{report.location.state}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[#607B86] max-w-[150px] truncate">
                    <div className="font-medium text-[#12313D]">{report.sourceType}</div>
                    <div className="text-[10px] truncate">{report.source}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[#607B86] whitespace-nowrap">
                    {report.timestamp.split('•')[1]?.trim() || report.timestamp}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 font-bold text-[#087E9B]">
                      <Sparkles className="w-3.5 h-3.5 text-[#087E9B]" />
                      <span>{report.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={report.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(report);
                      }}
                      className="px-3 py-1 rounded-xl bg-white hover:bg-[#EAF7FD] text-[#087E9B] font-semibold border border-[#D8EAF0] text-xs transition-colors"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE EXPANDABLE CARDS */}
      <div className="md:hidden space-y-3">
        {filteredReports.map((report) => {
          const isExpanded = expandedCardId === report.id;
          return (
            <div
              key={report.id}
              className="glass-panel p-4 rounded-2xl border border-[#D8EAF0] shadow-2xs space-y-2"
            >
              <div
                onClick={() => setExpandedCardId(isExpanded ? null : report.id)}
                className="cursor-pointer flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#087E9B] bg-[#EAF7FD] px-2 py-0.5 rounded-lg">
                      {report.event}
                    </span>
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-sm text-[#12313D]">{report.title}</h3>
                  <p className="text-xs text-[#607B86] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#087E9B]" />
                    {report.location.city}, {report.location.state}
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-[#607B86] transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Expandable Details Area */}
              {isExpanded && (
                <div className="pt-3 mt-2 border-t border-[#D8EAF0]/60 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-[#607B86] leading-relaxed">
                    {report.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/60 p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-[#607B86] block">AI Confidence</span>
                      <strong className="text-[#087E9B]">{report.aiConfidence}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#607B86] block">Source Trust</span>
                      <strong className="text-[#12313D]">{report.sourceTrust}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#607B86] block">Time</span>
                      <strong className="text-[#12313D]">{report.timestamp}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#607B86] block">Source</span>
                      <strong className="text-[#12313D]">{report.sourceType}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewDetails(report)}
                    className="w-full py-2 rounded-xl bg-[#087E9B] text-white font-semibold text-xs text-center block"
                  >
                    View Full Investigation
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
