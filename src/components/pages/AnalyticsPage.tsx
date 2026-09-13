import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  TIME_SERIES_DATA,
  EVENT_CATEGORY_DATA,
  STATE_ACTIVITY_DATA,
  VERIFICATION_DISTRIBUTION,
  SOURCE_RELIABILITY_DATA,
  AI_INSIGHTS_DATA,
} from '../../data/mockData';
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '3M'>('7D');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');

  const timeSeries = TIME_SERIES_DATA[timeRange] || TIME_SERIES_DATA['7D'];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              National Big Data Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Weather & Disaster Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Spatio-temporal intelligence synthesized across 800+ automated weather stations and Doppler radar sweeps.
          </p>
        </div>

        {/* Range switch */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-[#D8EAF0] text-xs font-semibold self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-[#087E9B] ml-2" />
          {(['24H', '7D', '30D', '3M'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeRange === r
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-[#EAF7FD]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Weather Reports Over Time */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#087E9B]" />
              SECTION 1: Weather Reports Over Time
            </h3>
            <p className="text-xs text-[#607B86] mt-0.5">
              High-throughput event timeline showing ingested vs. AI-verified reports across selected period ({timeRange}).
            </p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="anTotalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5BBFEF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5BBFEF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="anVerifGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2AA66F" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2AA66F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#607B86" fontSize={12} tickLine={false} axisLine={{ stroke: '#D8EAF0' }} />
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
                  boxShadow: '0 8px 25px rgba(7, 85, 107, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalReports"
                name="Total Ingested"
                stroke="#5BBFEF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#anTotalGrad)"
              />
              <Area
                type="monotone"
                dataKey="verified"
                name="AI Verified"
                stroke="#2AA66F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#anVerifGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grid: SECTION 2 (Events by Category) & SECTION 3 (Weather Activity by State) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 2 */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight flex items-center gap-2 mb-1">
              <BarChart2 className="w-5 h-5 text-[#087E9B]" />
              SECTION 2: Weather Events by Category
            </h3>
            <p className="text-xs text-[#607B86] mb-6">
              Distribution of severity clusters across 7 key national disaster categories.
            </p>

            <div className="space-y-4">
              {EVENT_CATEGORY_DATA.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#12313D] flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="text-[#607B86]">
                      {cat.count.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EAF7FD] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.percentage * 2.2}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-[#087E9B]" />
              SECTION 3: Weather Activity by State
            </h3>
            <p className="text-xs text-[#607B86] mb-5">
              Geographic intensity rankings by total corroborations and verification accuracy.
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {Object.values(STATE_ACTIVITY_DATA).map((st) => (
                <div
                  key={st.name}
                  className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0] flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div>
                    <div className="font-bold text-sm text-[#12313D] flex items-center gap-2">
                      <span>{st.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF7FD] text-[#087E9B]">
                        Primary: {st.mostCommonEvent}
                      </span>
                    </div>
                    <div className="text-xs text-[#607B86] mt-0.5">
                      {st.reports.toLocaleString()} reports • {st.activeEvents} active events
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#2AA66F] block">
                      {st.verificationRate}%
                    </span>
                    <span className="text-[10px] text-[#607B86]">Verified Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Grid: SECTION 4 (Verification Distribution) & SECTION 5 (Source Reliability) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SECTION 4: Verification Distribution (Donut Chart) */}
        <section className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-[#087E9B]" />
              SECTION 4: Verification Distribution
            </h3>
            <p className="text-xs text-[#607B86] mb-4">
              AI verification triage breakdown across all processed incoming events.
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VERIFICATION_DISTRIBUTION}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {VERIFICATION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid #D8EAF0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#D8EAF0]/60 text-xs">
              {VERIFICATION_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#607B86]">{item.name}:</span>
                  <strong className="text-[#12313D]">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Source Reliability */}
        <section className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#087E9B]" />
              SECTION 5: Source Reliability
            </h3>
            <p className="text-xs text-[#607B86] mb-6">
              Weighted credibility scoring and latency for active telemetry streams.
            </p>

            <div className="space-y-4">
              {SOURCE_RELIABILITY_DATA.map((src) => (
                <div key={src.source} className="p-3 rounded-2xl bg-white/70 border border-[#D8EAF0]">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#12313D]">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#607B86]">Latency: {src.latency}</span>
                      <span className="text-[#087E9B] font-bold">{src.trustScore}% Trust Score</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#EAF7FD] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#087E9B]"
                      style={{ width: `${src.trustScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 6: AI INSIGHTS */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-[#12313D] tracking-tight">
              SECTION 6: AI INSIGHTS
            </h3>
            <p className="text-xs text-[#607B86]">
              Synthesized meteorological signals dynamically generated across national spatial clusters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AI_INSIGHTS_DATA.map((insight) => (
            <div
              key={insight.id}
              className="p-5 rounded-2xl bg-white/80 border border-[#D8EAF0] flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#5BBFEF]/60 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#087E9B] uppercase tracking-wider text-[10px] bg-[#EAF7FD] px-2 py-0.5 rounded-md border border-[#5BBFEF]/20">
                    {insight.type}
                  </span>
                  <span className="text-[11px] text-[#2AA66F] font-semibold">{insight.confidence}</span>
                </div>
                <h4 className="font-bold text-sm text-[#12313D] mb-1.5">{insight.title}</h4>
                <p className="text-xs text-[#607B86] leading-relaxed">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
