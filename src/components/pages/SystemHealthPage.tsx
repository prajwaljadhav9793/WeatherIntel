import React from 'react';
import { MOCK_SYSTEM_HEALTH } from '../../data/mockData';
import {
  Server,
  Activity,
  CheckCircle2,
  HardDrive,
  Cpu,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-14 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2AA66F] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Telemetry & Infrastructure Observability
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            System Infrastructure Health
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Distributed node heartbeat, ingestion queue saturation, and AI model inference latency.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#2AA66F]/10 border border-[#2AA66F]/30 text-[#2AA66F] text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" />
          <span>All 6 Core Subsystems Operational</span>
        </div>
      </div>

      {/* Grid of Micro Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_SYSTEM_HEALTH.map((sys) => (
          <div
            key={sys.id}
            className="glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-2xs space-y-4 hover:border-[#5BBFEF]/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#07556B] bg-[#EAF7FD] px-2.5 py-1 rounded-lg">
                {sys.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#2AA66F]">
                <span className="w-2 h-2 rounded-full bg-[#2AA66F] animate-pulse" />
                {sys.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] block">Latency</span>
                <strong className="text-sm text-[#12313D]">{sys.latencyMs}ms</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#D8EAF0]">
                <span className="text-[10px] text-[#607B86] block">Availability</span>
                <strong className="text-sm text-[#2AA66F]">{sys.uptimePercent}%</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1 border-t border-[#D8EAF0]/60">
              <div className="flex justify-between text-[#607B86]">
                <span>Throughput:</span>
                <strong className="text-[#12313D]">{sys.throughputPerSec.toLocaleString()} ops/s</strong>
              </div>
              <div className="flex justify-between text-[#607B86]">
                <span>Heartbeat:</span>
                <span className="text-[#087E9B] font-medium">{sys.lastChecked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Observability Log Stream Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#12313D] uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#087E9B]" />
            Live Ingestion Bus Activity
          </span>
          <span className="text-[#607B86] font-mono text-[11px]">Stream: kafka-weather-in.0</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07556B]/5 border border-[#D8EAF0] font-mono text-xs text-[#07556B] space-y-1.5">
          <div className="flex items-center justify-between">
            <span>[10:42:01.214] INGEST radar.dwr.mumbai payload_bytes=1048576 verified_sha=true</span>
            <span className="text-[#2AA66F]">OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span>[10:42:03.490] AI_INFER model=ResNet101_ViT batch=16 latency=118ms</span>
            <span className="text-[#2AA66F]">OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span>[10:42:04.811] GEO_CLUSTER state=Maharashtra count=42 active_hull=true</span>
            <span className="text-[#2AA66F]">OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span>[10:42:06.102] CAP_DISPATCH channel=SEOC_MAHA alert_code=RAIN_RED status=SENT</span>
            <span className="text-[#2AA66F]">OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
