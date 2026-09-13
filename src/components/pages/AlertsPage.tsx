import React, { useState } from 'react';
import { WeatherAlert, AlertSeverity } from '../../types';
import { MOCK_ALERTS } from '../../data/mockData';
import {
  AlertTriangle,
  Radio,
  ShieldAlert,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Bell,
  ChevronRight,
  Info,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>(MOCK_ALERTS);
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'All'>('All');
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity === 'All') return true;
    return alert.severity === selectedSeverity;
  });

  const handleBroadcast = (alertTitle: string) => {
    setActionNotification(`CAP Broadcast sent for "${alertTitle}" to SEOC and cellular networks.`);
    setTimeout(() => setActionNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E45C5C] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Disaster Management Command Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            National Weather Warnings & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Synchronized with National Disaster Management Authority (NDMA) & Central Water Commission (CWC).
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-[#D8EAF0] text-xs font-semibold self-start sm:self-auto">
          {(['All', 'Critical', 'High', 'Moderate', 'Information'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev as AlertSeverity | 'All')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedSeverity === sev
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-[#EAF7FD]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {actionNotification && (
        <div className="p-3.5 rounded-2xl bg-[#2AA66F]/15 border border-[#2AA66F]/40 text-[#2AA66F] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotification}</span>
        </div>
      )}

      {/* Timeline Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isHigh = alert.severity === 'High';

          return (
            <div
              key={alert.id}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                isCritical
                  ? 'border-[#E45C5C]/40 bg-white/90 shadow-sm'
                  : isHigh
                  ? 'border-[#E5983B]/40 bg-white/80 shadow-2xs'
                  : 'border-[#D8EAF0] bg-white/70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    {/* Severity Badge with strict color system: subtle red accent, no full red background */}
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                        isCritical
                          ? 'bg-[#E45C5C]/10 text-[#E45C5C] border-[#E45C5C]/30'
                          : isHigh
                          ? 'bg-[#E5983B]/10 text-[#E5983B] border-[#E5983B]/30'
                          : 'bg-[#087E9B]/10 text-[#087E9B] border-[#087E9B]/30'
                      }`}
                    >
                      {alert.severity} Warning
                    </span>
                    <span className="text-xs text-[#607B86] font-mono">{alert.id}</span>
                    <span className="text-xs text-[#607B86] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Issued: {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#12313D]">{alert.title}</h3>
                  <p className="text-xs text-[#607B86] leading-relaxed">{alert.description}</p>

                  {/* Affected Districts */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[#607B86] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                      Affected ({alert.state}):
                    </span>
                    {alert.affectedDistricts.map((dist) => (
                      <span
                        key={dist}
                        className="bg-[#EAF7FD] text-[#07556B] px-2 py-0.5 rounded-md font-semibold text-[11px] border border-[#5BBFEF]/20"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  {/* Guidelines */}
                  <div className="p-3 rounded-2xl bg-[#F5FAFC] border border-[#D8EAF0] text-xs text-[#12313D] space-y-1 mt-2">
                    <span className="font-bold text-[#087E9B] flex items-center gap-1 text-[11px]">
                      <Info className="w-3.5 h-3.5" />
                      DISASTER RESPONSE DIRECTIVE
                    </span>
                    <ul className="text-[#607B86] list-disc list-inside space-y-0.5">
                      {alert.guidelines.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Action column */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#D8EAF0]/60">
                  <span className="text-[11px] text-[#607B86] font-medium">
                    Issuer: <strong>{alert.issuedBy}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBroadcast(alert.title)}
                      className="px-3.5 py-2 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>CAP Broadcast</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
