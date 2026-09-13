import React from 'react';
import { FilterState, WeatherEventType, VerificationStatus } from '../../types';
import { Filter, Calendar, MapPin, CheckCircle, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  availableStates?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableStates = [
    'Maharashtra',
    'Kerala',
    'Odisha',
    'Gujarat',
    'Rajasthan',
    'Assam',
    'Delhi',
    'Tamil Nadu',
    'Karnataka',
    'Telangana',
    'Bihar',
  ],
}) => {
  const eventCategories: (WeatherEventType | 'All')[] = [
    'All',
    'Rainfall',
    'Thunderstorm',
    'Flooding',
    'Heatwave',
    'Fog',
    'Dust Storm',
    'Strong Winds',
  ];

  const verificationOptions: (VerificationStatus | 'All')[] = [
    'All',
    'Verified',
    'Under Review',
    'Suspicious',
    'Duplicate',
  ];

  const hasActiveFilters =
    filters.event !== 'All' ||
    filters.state !== 'All' ||
    filters.verification !== 'All' ||
    filters.dateRange !== '24H';

  return (
    <div className="glass-panel p-3 rounded-2xl shadow-xs border border-[#D8EAF0] flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#D8EAF0] text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#087E9B] ml-1.5" />
          {(['24H', '7D', '30D', '3M'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onFilterChange({ dateRange: range })}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filters.dateRange === range
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Event Filter */}
        <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#D8EAF0]">
          <span className="text-xs font-medium text-[#607B86]">Event:</span>
          <select
            value={filters.event}
            onChange={(e) =>
              onFilterChange({ event: e.target.value as WeatherEventType | 'All' })
            }
            className="text-xs font-semibold text-[#12313D] bg-transparent outline-none cursor-pointer"
          >
            {eventCategories.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#D8EAF0]">
          <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
          <span className="text-xs font-medium text-[#607B86]">State:</span>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ state: e.target.value })}
            className="text-xs font-semibold text-[#12313D] bg-transparent outline-none cursor-pointer"
          >
            <option value="All">All India</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status */}
        <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#D8EAF0]">
          <CheckCircle className="w-3.5 h-3.5 text-[#2AA66F]" />
          <span className="text-xs font-medium text-[#607B86]">Status:</span>
          <select
            value={filters.verification}
            onChange={(e) =>
              onFilterChange({ verification: e.target.value as VerificationStatus | 'All' })
            }
            className="text-xs font-semibold text-[#12313D] bg-transparent outline-none cursor-pointer"
          >
            {verificationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Action */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-[#607B86] hover:text-[#087E9B] px-2.5 py-1.5 rounded-xl hover:bg-white/80 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};
