import React from 'react';
import { WeatherReport, ActivePage } from '../../types';
import { IndiaWeatherMap } from '../map/IndiaWeatherMap';
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
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  reports: WeatherReport[];
  onNavigate: (page: ActivePage) => void;
  onSelectReport: (report: WeatherReport) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  reports,
  onNavigate,
  onSelectReport,
}) => {
  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      {/* HERO SECTION with atmospheric sky-blue gradient */}
      <section className="relative rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#D8EAF0] overflow-hidden atmospheric-bg">
        {/* Subtle background atmospheric isobar/wave circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BBFEF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#087E9B]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D8EAF0] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
              <span className="text-xs font-semibold text-[#07556B] tracking-wide">
                IMD & Ministry of Earth Sciences Protocol
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12313D] tracking-tight leading-[1.15]">
              India's Weather Intelligence, <br />
              <span className="text-[#087E9B]">In Real Time.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#607B86] leading-relaxed max-w-xl">
              Connect real-time weather reports, AI-powered verification and geospatial intelligence
              to understand weather events across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-live-monitor-btn"
                onClick={() => onNavigate('monitor')}
                className="px-6 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-semibold text-sm shadow-md shadow-[#087E9B]/20 flex items-center gap-2 transition-all hover:gap-3"
              >
                <span>Explore Live Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-report-event-btn"
                onClick={() => onNavigate('citizen-report')}
                className="px-6 py-3.5 rounded-xl bg-white/80 hover:bg-white text-[#12313D] font-semibold text-sm border border-[#D8EAF0] hover:border-[#5BBFEF] transition-all shadow-2xs flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#087E9B]" />
                <span>Report an Event</span>
              </button>
            </div>

            {/* Micro telemetry counters */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#D8EAF0]/60 max-w-md">
              <div>
                <div className="text-xl font-extrabold text-[#12313D]">24.5k+</div>
                <div className="text-xs text-[#607B86]">Daily Reports</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#2AA66F]">94.2%</div>
                <div className="text-xs text-[#607B86]">AI Accuracy</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#087E9B]">37 Radars</div>
                <div className="text-xs text-[#607B86]">IMD Doppler Grid</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Large Interactive India Map with live pulses */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -top-3 -right-3 z-20 glass-panel px-3 py-1.5 rounded-full text-xs font-semibold text-[#07556B] flex items-center gap-1.5 shadow-sm border border-white">
                <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-pulse" />
                <span>Active Events Across India</span>
              </div>
              <IndiaWeatherMap
                reports={reports}
                selectedReport={null}
                onSelectReport={onSelectReport}
                heightClass="h-[460px]"
                isHeroMode={true}
                showNationalStatusOverlay={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CLEAN FEATURES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#087E9B]">
            CORE ARCHITECTURE
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#12313D] tracking-tight">
            Engineered for Disaster Preparedness
          </h3>
          <p className="text-sm text-[#607B86]">
            Multi-modal data ingestion combined with automated spatial verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5BBFEF]/60 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#12313D] mb-1.5">
                Real-Time Monitoring
              </h4>
              <p className="text-xs text-[#607B86] leading-relaxed">
                Stream processing of Doppler radar, automated weather stations, and citizen telemetry
                under a single pane.
              </p>
            </div>
            <button
              onClick={() => onNavigate('monitor')}
              className="text-xs font-semibold text-[#087E9B] hover:text-[#07556B] flex items-center gap-1 self-start"
            >
              <span>Explore Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5BBFEF]/60 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#12313D] mb-1.5">
                AI Verification
              </h4>
              <p className="text-xs text-[#607B86] leading-relaxed">
                Multi-modal computer vision and NLP models corroborate images, geolocation timestamps,
                and radar anomalies.
              </p>
            </div>
            <button
              onClick={() => onNavigate('verification')}
              className="text-xs font-semibold text-[#087E9B] hover:text-[#07556B] flex items-center gap-1 self-start"
            >
              <span>View Verification Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5BBFEF]/60 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#12313D] mb-1.5">
                Geospatial Intelligence
              </h4>
              <p className="text-xs text-[#607B86] leading-relaxed">
                High-resolution spatial clustering, river basin danger marks, and state-level
                meteorological risk indexing.
              </p>
            </div>
            <button
              onClick={() => onNavigate('geospatial')}
              className="text-xs font-semibold text-[#087E9B] hover:text-[#07556B] flex items-center gap-1 self-start"
            >
              <span>View India Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5BBFEF]/60 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#12313D] mb-1.5">
                Citizen Reporting
              </h4>
              <p className="text-xs text-[#607B86] leading-relaxed">
                Empower citizens across 28 states to report localized cloudbursts, waterlogging, and
                microbursts with geotagged media.
              </p>
            </div>
            <button
              onClick={() => onNavigate('citizen-report')}
              className="text-xs font-semibold text-[#087E9B] hover:text-[#07556B] flex items-center gap-1 self-start"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* VISUAL PIPELINE: "From Raw Reports to Verified Intelligence" */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-extrabold text-[#12313D] tracking-tight">
            From Raw Reports to Verified Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-[#607B86]">
            Every data point passes through a rigorous multi-stage pipeline before informing national
            emergency decisions.
          </p>
        </div>

        {/* Clean horizontal flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'DATA SOURCES',
              desc: 'IMD AWS, DWR Radars, INSAT-3D, Social Media, Citizen Mobile App',
              icon: <Database className="w-5 h-5 text-[#087E9B]" />,
            },
            {
              step: '02',
              title: 'REAL-TIME INGESTION',
              desc: 'Apache Kafka event bus stream handling 18k+ payloads per second',
              icon: <Radio className="w-5 h-5 text-[#087E9B]" />,
            },
            {
              step: '03',
              title: 'AI ANALYSIS',
              desc: 'Vision segmenters, duplicate hash matching, and NLP sentiment filtering',
              icon: <Sparkles className="w-5 h-5 text-[#087E9B]" />,
            },
            {
              step: '04',
              title: 'VERIFICATION',
              desc: 'Cross-sensor spatial consistency score and automated confidence scoring',
              icon: <FileCheck className="w-5 h-5 text-[#2AA66F]" />,
            },
            {
              step: '05',
              title: 'WEATHER INTELLIGENCE',
              desc: 'Disaster command dispatch, SEOC bulletins, and CAP cellular broadcast',
              icon: <Shield className="w-5 h-5 text-[#087E9B]" />,
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="relative p-4 rounded-2xl bg-white/70 border border-[#D8EAF0] shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#087E9B] bg-[#EAF7FD] px-2 py-0.5 rounded-lg border border-[#5BBFEF]/30">
                  {item.step}
                </span>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#12313D] tracking-wide mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#607B86] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
