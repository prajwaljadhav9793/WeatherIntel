import React, { useState, useEffect } from 'react';
import {
  WeatherReport,
  WeatherEventType,
  VerificationStatus,
  AlertSeverity,
} from '../../types';
import { IndiaWeatherMap } from '../map/IndiaWeatherMap';
import {
  Search,
  Filter,
  Flame,
  Radio,
  SlidersHorizontal,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LiveMonitorPageProps {
  reports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onSelectReport: (report: WeatherReport) => void;
  onClearSelectedReport: () => void;
  onViewReportDetails: (report: WeatherReport) => void;
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  onClearSelectedReport,
  onViewReportDetails,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<WeatherEventType | 'All'>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'All'>('All');
  const [selectedVerification, setSelectedVerification] = useState<VerificationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | 'All'>('All');

  // Synchronized with global Theme Context
  const { isDark: isGlobalDark, setTheme } = useTheme();
  const isDarkMode = isGlobalDark;
  const setIsDarkMode = (dark: boolean) => {
    setTheme(dark ? 'dark' : 'light');
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchEvent = selectedEvent === 'All' || r.event === selectedEvent;
    const matchSeverity = selectedSeverity === 'All' || r.severity === selectedSeverity;
    const matchVerif = selectedVerification === 'All' || r.status === selectedVerification;
    const matchState = selectedState === 'All' || r.location.state === selectedState;
    const matchSearch =
      searchQuery.trim() === '' ||
      r.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEvent && matchSeverity && matchVerif && matchState && matchSearch;
  });

  const hasActiveFilters =
    selectedEvent !== 'All' ||
    selectedSeverity !== 'All' ||
    selectedVerification !== 'All' ||
    selectedState !== 'All' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    setSelectedEvent('All');
    setSelectedSeverity('All');
    setSelectedVerification('All');
    setSelectedState('All');
    setSearchQuery('');
    onClearSelectedReport();
  };

  const applyFilter = (updater: () => void) => {
    updater();
    onClearSelectedReport();
  };

  const clearCurrentView = () => {
    resetFilters();
    onClearSelectedReport();
  };

  return (
    <div
      className={`space-y-3 pb-8 transition-colors duration-300 ${
        isDarkMode
          ? 'dark-monitor bg-[#061218] -m-3 p-3 sm:-m-5 sm:p-5 rounded-3xl min-h-[calc(100vh-140px)] text-[#E0F2F7]'
          : ''
      }`}
    >
      {/* Top Floating Control Bar */}
      <div
        className={`p-3 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors duration-200 ${
          isDarkMode
            ? 'glass-panel-dark border-[#1A3849] bg-[#0A1B24]/90 text-[#E0F2F7]'
            : 'glass-panel border-[#D8EAF0]'
        }`}
      >
        {/* Left Section: Search and Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-[#6C8E9F]' : 'text-[#607B86]'
              }`}
            />
            <input
              type="text"
              placeholder="Search city, state or event..."
              value={searchQuery}
              onChange={(e) => applyFilter(() => setSearchQuery(e.target.value))}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDarkMode
                  ? 'bg-[#102431] border-[#1E3E50] text-[#E0F2F7] placeholder-[#6C8E9F] focus:border-[#5BBFEF]'
                  : 'bg-white/80 border-[#D8EAF0] text-[#12313D] placeholder-[#607B86] focus:border-[#5BBFEF]'
              }`}
            />
          </div>

          {/* Theme Switcher: Day / Night Ops */}
          <div
            className={`flex items-center p-0.5 rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-[#0E212D] border-[#1D3C4E]'
                : 'bg-white/80 border-[#D8EAF0]'
            }`}
          >
            <button
              id="live-theme-day-btn"
              type="button"
              onClick={() => setIsDarkMode(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !isDarkMode
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
              title="Standard Daylight Mode"
              aria-label="Switch to Day Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              id="live-theme-night-btn"
              type="button"
              onClick={() => setIsDarkMode(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDarkMode
                  ? 'bg-[#5BBFEF] text-[#051C26] font-bold shadow-xs'
                  : 'text-[#607B86] hover:text-[#087E9B]'
              }`}
              title="Night Operations (Reduced eye strain dark map)"
              aria-label="Switch to Night Ops"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Night Ops</span>
            </button>
          </div>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Filter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-[#102431] border-[#1E3E50] text-[#E0F2F7]'
                : 'bg-white/70 border-[#D8EAF0]'
            }`}
          >
            <span
              className={`font-medium ${
                isDarkMode ? 'text-[#7B9EAة] text-[#82A2B2]' : 'text-[#607B86]'
              }`}
            >
              Event:
            </span>
            <select
              value={selectedEvent}
              onChange={(e) =>
                applyFilter(() => setSelectedEvent(e.target.value as WeatherEventType | 'All'))
              }
              className={`font-semibold bg-transparent outline-none cursor-pointer ${
                isDarkMode ? 'text-white' : 'text-[#12313D]'
              }`}
            >
              <option value="All" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                All Events
              </option>
              <option value="Rainfall" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Rainfall
              </option>
              <option value="Flooding" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Flooding
              </option>
              <option value="Thunderstorm" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Thunderstorm
              </option>
              <option value="Heatwave" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Heatwave
              </option>
              <option value="Fog" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Fog
              </option>
              <option value="Dust Storm" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Dust Storm
              </option>
              <option value="Strong Winds" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Strong Winds
              </option>
            </select>
          </div>

          {/* Severity Filter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-[#102431] border-[#1E3E50] text-[#E0F2F7]'
                : 'bg-white/70 border-[#D8EAF0]'
            }`}
          >
            <span
              className={`font-medium ${
                isDarkMode ? 'text-[#82A2B2]' : 'text-[#607B86]'
              }`}
            >
              Severity:
            </span>
            <select
              value={selectedSeverity}
              onChange={(e) =>
                applyFilter(() => setSelectedSeverity(e.target.value as AlertSeverity | 'All'))
              }
              className={`font-semibold bg-transparent outline-none cursor-pointer ${
                isDarkMode ? 'text-white' : 'text-[#12313D]'
              }`}
            >
              <option value="All" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                All Severities
              </option>
              <option value="Critical" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Critical
              </option>
              <option value="High" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                High
              </option>
              <option value="Moderate" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Moderate
              </option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-[#102431] border-[#1E3E50] text-[#E0F2F7]'
                : 'bg-white/70 border-[#D8EAF0]'
            }`}
          >
            <span
              className={`font-medium ${
                isDarkMode ? 'text-[#82A2B2]' : 'text-[#607B86]'
              }`}
            >
              Verification:
            </span>
            <select
              value={selectedVerification}
              onChange={(e) =>
                applyFilter(() =>
                  setSelectedVerification(e.target.value as VerificationStatus | 'All')
                )
              }
              className={`font-semibold bg-transparent outline-none cursor-pointer ${
                isDarkMode ? 'text-white' : 'text-[#12313D]'
              }`}
            >
              <option value="All" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                All Statuses
              </option>
              <option value="Verified" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Verified
              </option>
              <option value="Under Review" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Under Review
              </option>
              <option value="Suspicious" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Suspicious
              </option>
            </select>
          </div>

          {/* State Filter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-[#102431] border-[#1E3E50] text-[#E0F2F7]'
                : 'bg-white/70 border-[#D8EAF0]'
            }`}
          >
            <span
              className={`font-medium ${
                isDarkMode ? 'text-[#82A2B2]' : 'text-[#607B86]'
              }`}
            >
              State:
            </span>
            <select
              value={selectedState}
              onChange={(e) => applyFilter(() => setSelectedState(e.target.value))}
              className={`font-semibold bg-transparent outline-none cursor-pointer ${
                isDarkMode ? 'text-white' : 'text-[#12313D]'
              }`}
            >
              <option value="All" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                All States
              </option>
              <option value="Maharashtra" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Maharashtra
              </option>
              <option value="Kerala" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Kerala
              </option>
              <option value="Odisha" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Odisha
              </option>
              <option value="Gujarat" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Gujarat
              </option>
              <option value="Rajasthan" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Rajasthan
              </option>
              <option value="Assam" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Assam
              </option>
              <option value="Delhi" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Delhi
              </option>
              <option value="Tamil Nadu" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Tamil Nadu
              </option>
              <option value="Karnataka" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Karnataka
              </option>
              <option value="Telangana" className={isDarkMode ? 'bg-[#0F232F] text-white' : ''}>
                Telangana
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className={`p-1.5 rounded-xl transition-colors ${
              isDarkMode
                ? 'text-[#82A2B2] hover:text-[#5BBFEF] hover:bg-[#122A38]'
                : 'text-[#607B86] hover:text-[#087E9B] hover:bg-white/80'
            }`}
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              isDarkMode
                ? 'text-[#5BBFEF] bg-[#0A2634] border-[#18495E]'
                : 'text-[#07556B] bg-[#EAF7FD] border-[#5BBFEF]/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
            <span>{filteredReports.length} Real-Time Markers</span>
          </div>

          {(selectedReport || hasActiveFilters) && (
            <button
              onClick={clearCurrentView}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors ${
                isDarkMode
                  ? 'border-[#1E3E50] bg-[#102431] text-[#E0F2F7] hover:bg-[#153447]'
                  : 'border-[#D8EAF0] bg-white/80 text-[#12313D] hover:bg-white'
              }`}
            >
              Clear View
            </button>
          )}
        </div>
      </div>

      {/* Night Operations Operational Telemetry Banner */}
      {isDarkMode && (
        <div
          id="night-ops-status-strip"
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-[#0A1B24]/90 border border-[#1A3849] text-xs text-[#89A9B9] shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BBFEF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5BBFEF]"></span>
            </span>
            <span className="font-bold text-[#E2F2F8] tracking-wide">
              NIGHT OPERATIONS CONSOLE
            </span>
            <span className="hidden lg:inline text-[#658797]">
              — CartoDB Dark Matter low-glare cartography enabled to eliminate eye strain for nocturnal meteorological monitoring.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#25BFA5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25BFA5]" />
              Doppler Radar: Sweeping
            </span>
            <span className="flex items-center gap-1.5 text-[#5BBFEF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5BBFEF]" />
              AWS Grid: Synchronized
            </span>
          </div>
        </div>
      )}

      {/* Primary Map: Full-Screen Live Map with Dynamic Theme */}
      <div className="relative">
        <IndiaWeatherMap
          reports={filteredReports}
          selectedReport={selectedReport}
          onSelectReport={onSelectReport}
          selectedEvent={selectedEvent}
          selectedState={selectedState}
          onSelectState={setSelectedState}
          heightClass="h-[calc(85vh-120px)] min-h-[580px]"
          showNationalStatusOverlay={false}
          onViewReportDetails={onViewReportDetails}
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </div>
    </div>
  );
};
