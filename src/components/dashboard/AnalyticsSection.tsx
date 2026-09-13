import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  TIME_SERIES_DATA,
  EVENT_CATEGORY_DATA,
  STATE_ACTIVITY_DATA,
} from '../../data/mockData';
import { WeatherEventType } from '../../types';
import { Sparkles, BarChart2, TrendingUp, MapPin } from 'lucide-react';

interface AnalyticsSectionProps {
  dateRange: '24H' | '7D' | '30D' | '3M';
  onDateRangeChange: (range: '24H' | '7D' | '30D' | '3M') => void;
  selectedEvent: WeatherEventType | 'All';
  onSelectEvent: (event: WeatherEventType | 'All') => void;
  selectedState: string | 'All';
  onSelectState: (state: string) => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  dateRange,
  onDateRangeChange,
  selectedEvent,
  onSelectEvent,
  selectedState,
  onSelectState,
}) => {
  const chartData = TIME_SERIES_DATA[dateRange] || TIME_SERIES_DATA['24H'];

  return (
    <div id="dashboard-analytics-section" className="space-y-6">
      {/* SECTION 1: Weather Reports Over Time */}
      <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-xl text-[#12313D] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#087E9B]" />
              Weather Reports Over Time
            </h3>
            <p className="text-xs text-[#607B86] mt-0.5">
              Time-series ingestion volume: Total Reports vs. AI-Verified vs. Suspicious reports
            </p>
          </div>

          {/* Time range controls */}
          <div className="flex items-center gap-1 bg-[#F5FAFC] p-1 rounded-xl border border-[#D8EAF0] self-start sm:self-auto text-xs font-semibold">
            {(['24H', '7D', '30D', '3M'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onDateRangeChange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dateRange === range
                    ? 'bg-[#087E9B] text-white shadow-xs'
                    : 'text-[#607B86] hover:text-[#12313D] hover:bg-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="totalReportsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5BBFEF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5BBFEF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="verifiedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2AA66F" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2AA66F" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E45C5C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E45C5C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#607B86"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#D8EAF0' }}
              />
              <YAxis
                stroke="#607B86"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#D8EAF0' }}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid #D8EAF0',
                  boxShadow: '0 10px 25px -5px rgba(7, 85, 107, 0.1)',
                  fontSize: '12px',
                  color: '#12313D',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalReports"
                name="Total Reports"
                stroke="#5BBFEF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalReportsGrad)"
              />
              <Area
                type="monotone"
                dataKey="verified"
                name="Verified"
                stroke="#2AA66F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#verifiedGrad)"
              />
              <Area
                type="monotone"
                dataKey="suspicious"
                name="Suspicious"
                stroke="#E45C5C"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#suspiciousGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-3 border-t border-[#D8EAF0]/60 text-xs font-medium text-[#607B86]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5BBFEF]" />
            <span>Total Reports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2AA66F]" />
            <span>Verified by AI & Radar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E45C5C]" />
            <span>Suspicious / Flagged</span>
          </div>
        </div>
      </div>

      {/* Grid for Events by Category & Regional Weather Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Events by Category */}
        <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-lg text-[#12313D] tracking-tight flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#087E9B]" />
                Weather Events by Category
              </h3>
              {selectedEvent !== 'All' && (
                <button
                  onClick={() => onSelectEvent('All')}
                  className="text-xs font-semibold text-[#087E9B] hover:underline"
                >
                  Clear filter ({selectedEvent})
                </button>
              )}
            </div>
            <p className="text-xs text-[#607B86] mb-5">
              Click any weather category to cross-filter the map and live reports.
            </p>

            {/* Horizontal Bar Visualizer */}
            <div className="space-y-3">
              {EVENT_CATEGORY_DATA.map((cat) => {
                const isSelected = selectedEvent === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() =>
                      onSelectEvent(
                        isSelected ? 'All' : (cat.name as WeatherEventType)
                      )
                    }
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF7FD] border border-[#5BBFEF]'
                        : 'hover:bg-white/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-[#12313D] flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </span>
                      <span className="text-[#607B86]">
                        {cat.count.toLocaleString()} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#EAF7FD] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage * 2.5}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Regional Weather Activity */}
        <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-lg text-[#12313D] tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#087E9B]" />
                Regional Weather Activity
              </h3>
              {selectedState !== 'All' && (
                <button
                  onClick={() => onSelectState('All')}
                  className="text-xs font-semibold text-[#087E9B] hover:underline"
                >
                  Reset ({selectedState})
                </button>
              )}
            </div>
            <p className="text-xs text-[#607B86] mb-4">
              Activity rankings across key meteorology divisions. Click to focus state.
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {Object.values(STATE_ACTIVITY_DATA).map((state) => {
                const isSelected = selectedState === state.name;
                return (
                  <div
                    key={state.name}
                    onClick={() => onSelectState(isSelected ? 'All' : state.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#087E9B] shadow-sm ring-2 ring-[#5BBFEF]/20'
                        : 'bg-white/60 hover:bg-white border-[#D8EAF0]/80'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-[#12313D] flex items-center gap-2">
                        <span>{state.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF7FD] text-[#087E9B]">
                          {state.mostCommonEvent}
                        </span>
                      </div>
                      <div className="text-xs text-[#607B86] mt-0.5">
                        {state.reports} reports • {state.activeEvents} active events
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#2AA66F]">
                        {state.verificationRate}%
                      </div>
                      <div className="text-[10px] text-[#607B86]">Verified</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
