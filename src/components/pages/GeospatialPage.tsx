import React, { useState } from 'react';
import { WeatherReport, WeatherEventType } from '../../types';
import { IndiaWeatherMap } from '../map/IndiaWeatherMap';
import { STATE_ACTIVITY_DATA } from '../../data/mockData';
import {
  Layers,
  MapPin,
  Flame,
  Activity,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  BarChart2,
} from 'lucide-react';

interface GeospatialPageProps {
  reports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onSelectReport: (report: WeatherReport) => void;
  onViewReportDetails: (report: WeatherReport) => void;
}

export const GeospatialPage: React.FC<GeospatialPageProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  onViewReportDetails,
}) => {
  const [activeLayer, setActiveLayer] = useState<'EVENTS' | 'HEATMAP' | 'CLUSTERS' | 'STATE ACTIVITY'>('EVENTS');
  const [selectedStateName, setSelectedStateName] = useState<string>('Maharashtra');

  const selectedStateData =
    STATE_ACTIVITY_DATA[selectedStateName] || STATE_ACTIVITY_DATA['Maharashtra'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Geospatial Vector Grid
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Geospatial Weather Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Macro meteorological contours, hydrological basins, and district vulnerability indices.
          </p>
        </div>

        {/* Layer Switcher: EVENTS, HEATMAP, CLUSTERS, STATE ACTIVITY */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-[#D8EAF0] text-xs font-semibold self-start sm:self-auto">
          {(['EVENTS', 'HEATMAP', 'CLUSTERS', 'STATE ACTIVITY'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeLayer === layer
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-[#EAF7FD]'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: India Map (65%) + State Breakdown Panel (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <IndiaWeatherMap
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={onSelectReport}
            selectedState={selectedStateName}
            onSelectState={setSelectedStateName}
            layerMode={activeLayer}
            heightClass="h-[600px]"
            showNationalStatusOverlay={false}
            onViewReportDetails={onViewReportDetails}
          />
        </div>

        {/* State Breakdown Panel */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B] bg-[#EAF7FD] px-2.5 py-1 rounded-lg border border-[#5BBFEF]/30">
                State Intelligence Profile
              </span>
              <span className="text-xs text-[#2AA66F] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Feed
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <select
                value={selectedStateName}
                onChange={(e) => setSelectedStateName(e.target.value)}
                className="text-2xl font-extrabold text-[#12313D] bg-transparent border-b border-[#087E9B] outline-none cursor-pointer pb-1"
              >
                {Object.keys(STATE_ACTIVITY_DATA).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Core State Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] font-semibold uppercase block">
                  Total Reports
                </span>
                <span className="text-xl font-extrabold text-[#12313D]">
                  {selectedStateData.reports.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] font-semibold uppercase block">
                  Active Events
                </span>
                <span className="text-xl font-extrabold text-[#087E9B]">
                  {selectedStateData.activeEvents}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] font-semibold uppercase block">
                  Verification Rate
                </span>
                <span className="text-xl font-extrabold text-[#2AA66F]">
                  {selectedStateData.verificationRate}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] font-semibold uppercase block">
                  Most Common Event
                </span>
                <span className="text-sm font-bold text-[#12313D] truncate block mt-1">
                  {selectedStateData.mostCommonEvent}
                </span>
              </div>
            </div>

            {/* Districts List */}
            <h4 className="font-bold text-xs text-[#12313D] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Active Reports in {selectedStateName}</span>
              <span className="text-[10px] text-[#607B86] font-normal">Active Ingestion</span>
            </h4>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {reports
                .filter((r) => r.location.state === selectedStateName)
                .map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="p-2.5 rounded-xl bg-white/80 border border-[#D8EAF0] hover:border-[#5BBFEF] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087E9B]" />
                      <span className="font-semibold text-[#12313D]">{rep.location.district}</span>
                      <span className="text-[10px] text-[#607B86]">({rep.location.city})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#087E9B] bg-[#EAF7FD] px-2 py-0.5 rounded-md">
                        {rep.event}
                      </span>
                    </div>
                  </div>
                ))}
              {reports.filter((r) => r.location.state === selectedStateName).length === 0 && (
                <div className="p-3 text-center text-xs text-[#607B86] bg-white/50 rounded-xl border border-[#D8EAF0]">
                  No severe anomalies currently reported for {selectedStateName}.
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF7FD]/70 border border-[#D8EAF0] text-xs text-[#07556B] flex items-center justify-between">
            <span>State Emergency Operation Center (SEOC)</span>
            <span className="font-bold">Standby Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};
