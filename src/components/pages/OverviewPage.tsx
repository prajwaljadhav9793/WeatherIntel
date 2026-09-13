import React from 'react';
import {
  WeatherReport,
  FilterState,
  WeatherEventType,
  ActivePage,
} from '../../types';
import { IndiaWeatherMap } from '../map/IndiaWeatherMap';
import { FilterBar } from '../common/FilterBar';
import { LiveEventFeed } from '../dashboard/LiveEventFeed';
import { AnalyticsSection } from '../dashboard/AnalyticsSection';
import { Radio, RefreshCw } from 'lucide-react';

interface OverviewPageProps {
  reports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onSelectReport: (report: WeatherReport) => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onNavigate: (page: ActivePage) => void;
  onViewReportDetails: (report: WeatherReport) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  filters,
  onFilterChange,
  onResetFilters,
  onNavigate,
  onViewReportDetails,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              National Weather Command Center
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12313D] tracking-tight">
            National Weather Overview
          </h1>
          <p className="text-sm text-[#607B86] mt-1">
            Real-time weather intelligence across India
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('monitor')}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-[#087E9B] border border-[#D8EAF0] transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Map-First Monitor</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Main Visual Area: Map (65%) + Live Feed (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Map occupies ~65% of main visual area */}
        <div className="lg:col-span-8 flex flex-col">
          <IndiaWeatherMap
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={onSelectReport}
            selectedEvent={filters.event}
            selectedState={filters.state}
            onSelectState={(st) => onFilterChange({ state: st })}
            heightClass="h-[560px]"
            showNationalStatusOverlay={true}
            onViewReportDetails={onViewReportDetails}
          />
        </div>

        {/* Live Weather Events timeline beside the map */}
        <div className="lg:col-span-4 flex flex-col">
          <LiveEventFeed
            reports={reports}
            selectedReportId={selectedReport?.id}
            onSelectReport={onSelectReport}
            onViewAllReports={() => onNavigate('reports')}
          />
        </div>
      </div>

      {/* Analytics Section Below Map */}
      <AnalyticsSection
        dateRange={filters.dateRange}
        onDateRangeChange={(range) => onFilterChange({ dateRange: range })}
        selectedEvent={filters.event}
        onSelectEvent={(evt) => onFilterChange({ event: evt })}
        selectedState={filters.state}
        onSelectState={(st) => onFilterChange({ state: st })}
      />
    </div>
  );
};
