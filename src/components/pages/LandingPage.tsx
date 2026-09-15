import React, { useState } from 'react';
import { WeatherReport, ActivePage, UserRole } from '../../types';
import { IndiaWeatherMap } from '../map/IndiaWeatherMap';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  MapPin,
  FileCheck,
  Users,
  Eye,
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  TrendingUp,
  Server,
  Building,
  Layers,
  Lock,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Check,
  XCircle,
} from 'lucide-react';

interface LandingPageProps {
  reports: WeatherReport[];
  onNavigate: (page: ActivePage, mode?: 'login' | 'register') => void;
  onSelectReport: (report: WeatherReport) => void;
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  reports,
  onNavigate,
  onSelectReport,
  onOpenAuth,
}) => {
  const { isAuthenticated, user, quickDemoLogin } = useAuth();
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'ai' | 'streaming' | 'geo' | 'crowd'>('ai');
  const [slidingWindowView, setSlidingWindowView] = useState<'5m' | '1h' | '24h'>('1h');
  const [selectedHotspot, setSelectedHotspot] = useState<string>('Mumbai');

  const handleProtectedNavigate = (page: ActivePage) => {
    if (isAuthenticated) {
      onNavigate(page);
    } else if (onOpenAuth) {
      onOpenAuth('login');
    }
  };

  const hotspots = [
    { city: 'Mumbai', state: 'Maharashtra', event: 'Heavy Rainfall', risk: 'High', mm: '68.4 mm/h', coords: '19.0760° N, 72.8777° E' },
    { city: 'Delhi NCR', state: 'Delhi', event: 'Dust Storm', risk: 'Moderate', mm: '45 km/h gusts', coords: '28.6139° N, 77.2090° E' },
    { city: 'Guwahati', state: 'Assam', event: 'Severe Flooding', risk: 'Critical', mm: '112 mm rain', coords: '26.1445° N, 91.7362° E' },
    { city: 'Bengaluru', state: 'Karnataka', event: 'Thunderstorm', risk: 'Moderate', mm: '32.1 mm/h', coords: '12.9716° N, 77.5946° E' },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* --- HERO SECTION --- */}
      <section className="relative rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#D8EAF0] overflow-hidden atmospheric-bg">
        {/* Atmospheric Glow Rings */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#5BBFEF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-[#087E9B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#D8EAF0] shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25BFA5] animate-ping" />
              <span className="text-xs font-bold text-[#07556B] tracking-wide">
                IMD & Ministry of Earth Sciences Standard Platform
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12313D] tracking-tight leading-[1.12]">
              National Weather <br />
              <span className="text-[#087E9B]">Big Data Analytics</span> & Intelligence
            </h1>

            <p className="text-base sm:text-lg text-[#607B86] leading-relaxed max-w-xl">
              High-throughput ingestion from Doppler radars, AWS telemetry, social feeds, and citizen reports — verified by multimodal AI and spatial-temporal sensor cross-checks.
            </p>

            {/* Authentication & Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {isAuthenticated ? (
                <>
                  <button
                    id="hero-enter-platform-btn"
                    onClick={() => onNavigate('overview')}
                    className="px-6 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-sm shadow-md shadow-[#087E9B]/25 flex items-center gap-2.5 transition-all hover:gap-3.5"
                  >
                    <span>Enter Platform Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="hero-live-monitor-btn"
                    onClick={() => onNavigate('monitor')}
                    className="px-5 py-3.5 rounded-xl bg-white/90 hover:bg-white text-[#12313D] font-semibold text-sm border border-[#D8EAF0] hover:border-[#087E9B] transition-all shadow-2xs flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-[#087E9B]" />
                    <span>Live Radar Stream</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="hero-login-btn"
                    onClick={() => onOpenAuth ? onOpenAuth('login') : onNavigate('auth')}
                    className="px-6 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-sm shadow-md shadow-[#087E9B]/25 flex items-center gap-2.5 transition-all hover:gap-3.5"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Access Modules</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="hero-register-btn"
                    onClick={() => onOpenAuth ? onOpenAuth('register') : onNavigate('auth', 'register')}
                    className="px-5 py-3.5 rounded-xl bg-white/90 hover:bg-white text-[#12313D] font-semibold text-sm border border-[#D8EAF0] hover:border-[#087E9B] transition-all shadow-2xs flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-[#087E9B]" />
                    <span>Register New Account</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Demo Pill bar for Instant 1-Click Evaluation */}
            {!isAuthenticated && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-[#607B86] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#F5B041]" />
                  <span>Instant 1-Click Demo Personas:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await quickDemoLogin('IMD Analyst');
                      onNavigate('overview');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-[#EAF7FD] border border-[#D8EAF0] hover:border-[#087E9B] text-xs font-semibold text-[#12313D] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#087E9B]" />
                    <span>IMD Analyst</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await quickDemoLogin('Admin');
                      onNavigate('overview');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-[#FEF9E7] border border-[#D8EAF0] hover:border-[#E7A23B] text-xs font-semibold text-[#12313D] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Building className="w-3.5 h-3.5 text-[#E7A23B]" />
                    <span>NDMA Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await quickDemoLogin('Citizen');
                      onNavigate('overview');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-[#EAFBF3] border border-[#D8EAF0] hover:border-[#2AA66F] text-xs font-semibold text-[#12313D] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5 text-[#2AA66F]" />
                    <span>Citizen Observer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Metrics Ticker */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#D8EAF0]/80 max-w-md">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#12313D]">48,290+</div>
                <div className="text-xs text-[#607B86] font-medium">Daily Data Points</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#2AA66F]">94.6%</div>
                <div className="text-xs text-[#607B86] font-medium">AI Precision</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#087E9B]">37 Radars</div>
                <div className="text-xs text-[#607B86] font-medium">Doppler Grid</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Interactive India Weather Map Preview */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -top-3 -right-3 z-20 glass-panel px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#07556B] flex items-center gap-2 shadow-sm border border-white">
                <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-pulse" />
                <span>Live IMD Telemetry Network</span>
              </div>

              <div className="glass-card rounded-2xl p-4 border border-[#D8EAF0] shadow-lg">
                <IndiaWeatherMap
                  reports={reports.slice(0, 15)}
                  onSelectReport={onSelectReport}
                />
              </div>

              {!isAuthenticated && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth('login') : onNavigate('auth')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087E9B] hover:text-[#07556B] hover:underline"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log in to access live radar controls, filters, and district analytics</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE INTELLIGENCE SHOWCASE --- */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7FD] border border-[#5BBFEF]/40 text-xs font-bold text-[#087E9B] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Architecture Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12313D] tracking-tight">
              Real-Time Intelligence In Action
            </h2>
            <p className="text-sm text-[#607B86] mt-1 max-w-2xl">
              Interact with the live subsystems that power India's automated weather verification and emergency response.
            </p>
          </div>

          {/* Showcase Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#F0F8FB] rounded-2xl border border-[#D8EAF0] overflow-x-auto">
            <button
              onClick={() => setActiveShowcaseTab('ai')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeShowcaseTab === 'ai'
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Anomaly & Fake Detection</span>
            </button>
            <button
              onClick={() => setActiveShowcaseTab('streaming')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeShowcaseTab === 'streaming'
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Sliding Stream Analytics</span>
            </button>
            <button
              onClick={() => setActiveShowcaseTab('geo')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeShowcaseTab === 'geo'
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geospatial Early Warning</span>
            </button>
            <button
              onClick={() => setActiveShowcaseTab('crowd')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeShowcaseTab === 'crowd'
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen Intake Flow</span>
            </button>
          </div>
        </div>

        {/* Tab 1: AI Anomaly & Fake Report Detector */}
        {activeShowcaseTab === 'ai' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E45C5C]/10 text-[#E45C5C] text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Misinformation Neutralized</span>
              </div>
              <h3 className="text-xl font-bold text-[#12313D]">
                AWS Ground-Truth Sensor Cross-Validation
              </h3>
              <p className="text-xs sm:text-sm text-[#607B86] leading-relaxed">
                Social media posts claiming catastrophic floods or cloudbursts are automatically matched against real-time physical Automated Weather Stations (AWS) within a 25km radius. If sensors show dry conditions, the claim is immediately flagged as Suspicious.
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-xl bg-white border border-[#D8EAF0] flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-[#E45C5C] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#12313D]">Unverified Claim (Social Post / Rumor)</div>
                    <div className="text-xs text-[#607B86] mt-0.5">
                      "Terrifying cloudburst at Marine Drive, South Mumbai! Water reaching 4 feet high right now!"
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#2AA66F]/40 bg-[#2AA66F]/5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2AA66F] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#12313D]">Physical AWS Telemetry (Colaba Station #43003)</div>
                    <div className="text-xs text-[#607B86] mt-0.5">
                      Recorded precipitation: <strong>0.1 mm</strong> in last 60m • Wind: 12 km/h • Humidity: 68%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#07151E] text-[#E0F2F7] border border-[#163546] space-y-4">
              <div className="flex items-center justify-between border-b border-[#163546] pb-3">
                <span className="text-xs font-bold text-[#5BBFEF] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  AI Verification Pipeline Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E45C5C]/20 text-[#E45C5C]">
                  SUSPICIOUS ANOMALY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8AAABA]">Physical Sensor Discrepancy</span>
                    <span className="font-bold text-[#E45C5C]">-98% (High Mismatch)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#163546] overflow-hidden">
                    <div className="h-full bg-[#E45C5C] rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8AAABA]">Spatial-Temporal Credibility Score</span>
                    <span className="font-bold text-[#F5B041]">18 / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#163546] overflow-hidden">
                    <div className="h-full bg-[#F5B041] rounded-full w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8AAABA]">Explainable AI (XAI) Diagnosis</span>
                    <span className="text-[#25BFA5]">Verified by Rule Engine</span>
                  </div>
                  <p className="text-[11px] text-[#8AAABA] bg-[#0A1F2B] p-2.5 rounded-xl border border-[#163546]">
                    "Automated sensor cross-check failed: Colaba AWS Station recorded only 0.1mm rain. Claim marked as Suspicious Anomaly to prevent panic broadcast."
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleProtectedNavigate('verification')}
                  className="text-xs font-bold text-[#5BBFEF] hover:text-white flex items-center gap-1"
                >
                  <span>Explore Verification Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sliding Stream Analytics */}
        {activeShowcaseTab === 'streaming' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#12313D]">
                  High-Throughput Sliding-Window Ingestion Engine
                </h3>
                <p className="text-xs text-[#607B86] mt-0.5">
                  Aggregate and compute running velocity metrics over 5-minute, 1-hour, and 24-hour temporal buffers.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#D8EAF0]">
                {(['5m', '1h', '24h'] as const).map((win) => (
                  <button
                    key={win}
                    onClick={() => setSlidingWindowView(win)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      slidingWindowView === win
                        ? 'bg-[#087E9B] text-white shadow-2xs'
                        : 'text-[#607B86] hover:text-[#12313D]'
                    }`}
                  >
                    Window {win.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#D8EAF0]">
                <div className="text-xs font-bold text-[#607B86]">Throughput Rate</div>
                <div className="text-2xl font-black text-[#12313D] mt-1">
                  {slidingWindowView === '5m' ? '184 / min' : slidingWindowView === '1h' ? '11,040 / hr' : '48,290 / day'}
                </div>
                <div className="text-[11px] text-[#2AA66F] font-semibold mt-1">
                  ↑ 14% vs previous window
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D8EAF0]">
                <div className="text-xs font-bold text-[#607B86]">Active Hotspots Tracked</div>
                <div className="text-2xl font-black text-[#087E9B] mt-1">
                  {slidingWindowView === '5m' ? '3 Clusters' : slidingWindowView === '1h' ? '8 Clusters' : '14 Clusters'}
                </div>
                <div className="text-[11px] text-[#607B86] mt-1">
                  Mumbai, Guwahati, Delhi, Pune
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D8EAF0]">
                <div className="text-xs font-bold text-[#607B86]">Severe Weather Alerts Issued</div>
                <div className="text-2xl font-black text-[#E45C5C] mt-1">
                  {slidingWindowView === '5m' ? '1 Triggered' : slidingWindowView === '1h' ? '4 Broadcast' : '9 Verified'}
                </div>
                <div className="text-[11px] text-[#607B86] mt-1">
                  CAP Protocol compliant
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D8EAF0]">
                <div className="text-xs font-bold text-[#607B86]">Stream Deduplication Rate</div>
                <div className="text-2xl font-black text-[#2AA66F] mt-1">41.8%</div>
                <div className="text-[11px] text-[#607B86] mt-1">
                  Filtered spam & duplicate tweets
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5FAFC] border border-[#D8EAF0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#607B86]">
                Streaming engine powered by <strong>Node v24 SQLite WAL Mode</strong> with partitioned geographic coordinate indexing.
              </div>
              <button
                onClick={() => handleProtectedNavigate('system-health')}
                className="px-4 py-2 rounded-xl bg-white border border-[#D8EAF0] text-xs font-bold text-[#087E9B] hover:bg-[#EAF7FD] transition-colors whitespace-nowrap"
              >
                View System Health Telemetry
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Geospatial Early Warning */}
        {activeShowcaseTab === 'geo' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xl font-bold text-[#12313D]">
                  Interactive Meteorological Hotspot Radar
                </h3>
                <p className="text-xs sm:text-sm text-[#607B86] leading-relaxed">
                  Select a live active weather hotspot to inspect real-time radar telemetry, affected districts, and emergency guidance.
                </p>

                <div className="space-y-2">
                  {hotspots.map((h) => (
                    <button
                      key={h.city}
                      onClick={() => setSelectedHotspot(h.city)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        selectedHotspot === h.city
                          ? 'bg-[#087E9B] text-white border-[#087E9B] shadow-md'
                          : 'bg-white text-[#12313D] border-[#D8EAF0] hover:bg-[#F5FAFC]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{h.city}, {h.state}</div>
                        <div className={`text-[11px] ${selectedHotspot === h.city ? 'text-white/80' : 'text-[#607B86]'}`}>
                          {h.event} • {h.mm}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        h.risk === 'Critical'
                          ? 'bg-[#E45C5C] text-white'
                          : h.risk === 'High'
                          ? 'bg-[#E7A23B] text-white'
                          : selectedHotspot === h.city ? 'bg-white/20 text-white' : 'bg-[#EAF7FD] text-[#087E9B]'
                      }`}>
                        {h.risk} Risk
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#D8EAF0] shadow-sm space-y-4">
                {(() => {
                  const curr = hotspots.find((h) => h.city === selectedHotspot) || hotspots[0];
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-[#D8EAF0] pb-3">
                        <div>
                          <span className="text-xs text-[#607B86] font-semibold">Active Hotspot Target</span>
                          <h4 className="text-lg font-black text-[#12313D]">{curr.city} Metropolitan Region</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-[#607B86]">{curr.coords}</span>
                          <div className="text-xs font-bold text-[#087E9B]">IMD Doppler Station Active</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-[#F5FAFC] border border-[#D8EAF0]">
                          <div className="text-[10px] text-[#607B86] uppercase font-bold">Phenomenon</div>
                          <div className="text-xs font-bold text-[#12313D] mt-0.5">{curr.event}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F5FAFC] border border-[#D8EAF0]">
                          <div className="text-[10px] text-[#607B86] uppercase font-bold">Intensity Metric</div>
                          <div className="text-xs font-bold text-[#087E9B] mt-0.5">{curr.mm}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F5FAFC] border border-[#D8EAF0]">
                          <div className="text-[10px] text-[#607B86] uppercase font-bold">Advisory Level</div>
                          <div className="text-xs font-bold text-[#E45C5C] mt-0.5">Red Alert Warning</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#EAF7FD] border border-[#5BBFEF]/40 text-xs text-[#07556B]">
                        <strong>Emergency Advisory:</strong> SDMA protocols deployed. Ground teams instructed to monitor low-lying underpasses and activate municipal storm water drain pumps.
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleProtectedNavigate('geospatial')}
                          className="px-4 py-2 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <span>Open Full India Geospatial Map</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Citizen Intake Flow */}
        {activeShowcaseTab === 'crowd' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xl font-bold text-[#12313D]">
                Crowdsourced Citizen Reporting & AI Validation Workflow
              </h3>
              <p className="text-xs sm:text-sm text-[#607B86]">
                How a citizen's smartphone photo and description travels from ground level to verified national disaster warning in under 1.2 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-[#D8EAF0] text-center space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center mx-auto font-black text-sm">
                  1
                </div>
                <h4 className="font-bold text-xs text-[#12313D]">Citizen Submission</h4>
                <p className="text-[11px] text-[#607B86]">
                  Citizen captures photo with automated GPS coordinate tag and selects event type (e.g. Flooding).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D8EAF0] text-center space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center mx-auto font-black text-sm">
                  2
                </div>
                <h4 className="font-bold text-xs text-[#12313D]">Spatial Deduplication</h4>
                <p className="text-[11px] text-[#607B86]">
                  Engine scans within 25km radius. If 12 other users reported the same flood, clusters into single master event.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D8EAF0] text-center space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center mx-auto font-black text-sm">
                  3
                </div>
                <h4 className="font-bold text-xs text-[#12313D]">Sensor Corroboration</h4>
                <p className="text-[11px] text-[#607B86]">
                  AI checks physical rain gauge telemetry from nearby IMD Automated Weather Station (AWS) to verify event reality.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#2AA66F]/40 bg-[#2AA66F]/5 text-center space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#2AA66F] text-white flex items-center justify-center mx-auto font-black text-sm">
                  4
                </div>
                <h4 className="font-bold text-xs text-[#12313D]">Official Broadcast</h4>
                <p className="text-[11px] text-[#607B86]">
                  Report marked as Verified. CAP alert automatically drafted for NDMA approval and emergency push.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => handleProtectedNavigate('citizen-report')}
                className="px-6 py-3 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Submit Citizen Weather Observation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* --- THE 8 PROBLEM STATEMENT PILLARS --- */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7FD] border border-[#5BBFEF]/40 text-xs font-bold text-[#087E9B]">
            <Layers className="w-3.5 h-3.5" />
            <span>SIH Problem Statement Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12313D] tracking-tight">
            Complete 8-Pillar Meteorological Framework
          </h2>
          <p className="text-sm text-[#607B86]">
            Engineered from ground up to fulfill every architectural and analytical pillar specified by the Ministry of Earth Sciences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 01</div>
            <h4 className="font-bold text-sm text-[#12313D]">Multi-Source Ingestion</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Real-time connectors for Open-Meteo, IMD API, social hashtags (#IMD, #MumbaiRains), and citizen crowd streams.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Server className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 02</div>
            <h4 className="font-bold text-sm text-[#12313D]">Big Data Storage & Sliding Stream</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              SQLite WAL engine with spatial indexes and temporal sliding buffers (5m, 1h, 24h) computing real-time velocity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 03</div>
            <h4 className="font-bold text-sm text-[#12313D]">Multimodal AI & NLP</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Multi-class event classifier (Rain, Flood, Thunderstorm, Fog) with entity extraction and sentiment urgency scoring.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 04</div>
            <h4 className="font-bold text-sm text-[#12313D]">AWS Sensor Cross-Checking</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Eliminates fake reports and rumor panics by cross-referencing physical ground telemetry from Automated Weather Stations.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 05</div>
            <h4 className="font-bold text-sm text-[#12313D]">Spatial-Temporal Deduplication</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Clusters duplicate reports within 25km radius and 3-hour temporal windows using Haversine distance and Jaccard text similarity.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 06</div>
            <h4 className="font-bold text-sm text-[#12313D]">CAP Real-Time Alert Engine</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Common Alerting Protocol (CAP) compliant engine dispatching push warnings to state and district emergency disaster cells.
            </p>
          </div>

          {/* Pillar 7 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 07</div>
            <h4 className="font-bold text-sm text-[#12313D]">Geospatial GIS & Doppler Radar</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Full interactive India map featuring district chloropleths, live coordinates, and severe weather boundary fences.
            </p>
          </div>

          {/* Pillar 8 */}
          <div className="glass-card p-5 rounded-2xl border border-[#D8EAF0] hover:border-[#087E9B] transition-all hover:shadow-md space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center group-hover:bg-[#087E9B] group-hover:text-white transition-colors">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-[#087E9B] uppercase tracking-wider">Pillar 08</div>
            <h4 className="font-bold text-sm text-[#12313D]">Governance & Audit Trails</h4>
            <p className="text-xs text-[#607B86] leading-relaxed">
              Immutable audit logging for all manual analyst overrides, status updates, and CAP broadcast dispatches.
            </p>
          </div>
        </div>
      </section>

      {/* --- PUBLIC ACCESS CTA BANNER --- */}
      <section className="p-8 sm:p-12 rounded-3xl atmospheric-bg border border-[#D8EAF0] text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D8EAF0] text-xs font-bold text-[#07556B]">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Personnel & Citizen Access</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#12313D]">
            Ready to Explore WeatherIntel India?
          </h3>
          <p className="text-xs sm:text-sm text-[#607B86] leading-relaxed">
            Sign in with official credentials or create a new account to unlock the full operational dashboard, live radar feeds, and verification suite.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => onNavigate('overview')}
              className="px-8 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Go to Overview Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('login') : onNavigate('auth')}
                className="px-7 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Sign In to Access All Modules</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : onNavigate('auth', 'register')}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#F5FAFC] text-[#12313D] font-bold text-sm border border-[#D8EAF0] transition-all flex items-center gap-2"
              >
                <span>Create New Account</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
