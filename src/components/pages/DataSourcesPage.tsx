import React, { useState } from 'react';
import { DataSource, SourceType } from '../../types';
import { MOCK_DATA_SOURCES } from '../../data/mockData';
import {
  Database,
  RefreshCw,
  ShieldCheck,
  Radio,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>(MOCK_DATA_SOURCES);
  const [selectedType, setSelectedType] = useState<SourceType | 'All'>('All');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const filteredSources = sources.filter((src) => {
    if (selectedType === 'All') return true;
    return src.type === selectedType;
  });

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, lastUpdated: 'Just now' } : s))
      );
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              National Ingestion Grid
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Data Sources & Feeds
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Connected sensor networks, satellite payloads, Doppler radar nodes, and citizen APIs.
          </p>
        </div>

        {/* Source Type Filter */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-[#D8EAF0] text-xs font-semibold self-start sm:self-auto overflow-x-auto max-w-full">
          {(
            [
              'All',
              'Official APIs',
              'Weather APIs',
              'Citizen Reports',
              'Social Media',
              'Public Datasets',
              'Websites',
            ] as const
          ).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as SourceType | 'All')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-[#087E9B] text-white shadow-xs'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-[#EAF7FD]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Table */}
      <div className="glass-panel rounded-3xl border border-[#D8EAF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAF7FD]/70 border-b border-[#D8EAF0] text-[#07556B] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Source Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Reports Ingested</th>
                <th className="py-3 px-3">Trust Score</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8EAF0]/60">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-white/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-[#12313D]">
                    <div>{source.name}</div>
                    <div className="text-[11px] text-[#607B86] font-normal">{source.id}</div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-semibold text-[#12313D] bg-[#EAF7FD] px-2.5 py-1 rounded-lg border border-[#D8EAF0]">
                      {source.type}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-semibold text-[#12313D]">
                    {source.reportsCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#EAF7FD] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2AA66F] h-full rounded-full"
                          style={{ width: `${source.trustScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-[#087E9B]">{source.trustScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-[#607B86] font-medium">{source.latency}</td>
                  <td className="py-4 px-3 text-[#607B86]">{source.lastUpdated}</td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border ${
                        source.status === 'Trusted'
                          ? 'bg-[#2AA66F]/10 text-[#2AA66F] border-[#2AA66F]/30'
                          : source.status === 'Monitoring'
                          ? 'bg-[#E5983B]/10 text-[#E5983B] border-[#E5983B]/30'
                          : 'bg-[#E45C5C]/10 text-[#E45C5C] border-[#E45C5C]/30'
                      }`}
                    >
                      {source.status === 'Trusted' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{source.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleSync(source.id)}
                      disabled={syncingId === source.id}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF7FD] text-[#087E9B] font-semibold text-xs border border-[#D8EAF0] transition-colors inline-flex items-center gap-1.5"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${syncingId === source.id ? 'animate-spin' : ''}`}
                      />
                      <span>Sync</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
