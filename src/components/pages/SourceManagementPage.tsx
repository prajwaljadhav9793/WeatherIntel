import React, { useState } from 'react';
import { DataSource, SourceType } from '../../types';
import { MOCK_DATA_SOURCES } from '../../data/mockData';
import {
  Database,
  Plus,
  Trash2,
  Sliders,
  Shield,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const SourceManagementPage: React.FC = () => {
  const { sources: contextSources, toggleSource } = useWeather();
  const [sources, setSources] = useState<DataSource[]>(contextSources);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<SourceType>('Weather APIs');
  const [newTrust, setNewTrust] = useState(85);
  const [notification, setNotification] = useState<string | null>(null);

  React.useEffect(() => {
    if (contextSources && contextSources.length > 0) {
      setSources(contextSources);
    }
  }, [contextSources]);

  const toggleSourceStatus = (id: string) => {
    const src = sources.find((s) => s.id === id);
    if (src) {
      toggleSource(id, !src.activeStatus);
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, activeStatus: !s.activeStatus } : s))
      );
      setNotification(`Source ${src.name} status updated.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const updateTrust = (id: string, newScore: number) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, trustScore: newScore } : s))
    );
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    setNotification('Source removed from ingestion mesh');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DataSource = {
      id: `SRC-${Date.now().toString().slice(-4)}`,
      name: newName,
      type: newType,
      reportsCount: 0,
      trustScore: newTrust,
      lastUpdated: 'Just added',
      status: 'Trusted',
      description: 'Ingestion pipeline registered via Source Management panel.',
      rateLimit: '2,500 req/min',
      activeStatus: true,
      latency: '350ms',
    };
    setSources([newEntry, ...sources]);
    setShowAddModal(false);
    setNewName('');
    setNotification(`Source "${newName}" configured successfully`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 pb-14 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087E9B] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B]">
              Ingestion Mesh Configuration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#12313D] tracking-tight">
            Source Management & Credibility
          </h1>
          <p className="text-xs sm:text-sm text-[#607B86] mt-0.5">
            Configure trust thresholds, disable spam networks, and ingest third-party environmental telemetry.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Data Source</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-2xl bg-[#2AA66F]/15 border border-[#2AA66F]/30 text-[#2AA66F] text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <form
          onSubmit={handleAddSource}
          className="glass-panel p-6 rounded-3xl border border-[#087E9B] shadow-md space-y-4 animate-in fade-in"
        >
          <h3 className="font-bold text-base text-[#12313D]">
            Connect New Meteorological Source
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Source Name (e.g. State Agri Sensor Hub)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-2.5 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as SourceType)}
              className="p-2.5 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
            >
              <option value="Weather APIs">Weather APIs</option>
              <option value="Official APIs">Official APIs</option>
              <option value="Public Datasets">Public Datasets</option>
              <option value="Social Media">Social Media</option>
              <option value="Citizen Reports">Citizen Reports</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#607B86] whitespace-nowrap">Trust: {newTrust}%</span>
              <input
                type="range"
                min={30}
                max={100}
                value={newTrust}
                onChange={(e) => setNewTrust(Number(e.target.value))}
                className="w-full accent-[#087E9B]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#D8EAF0] text-xs font-semibold text-[#607B86]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#087E9B] text-white text-xs font-semibold"
            >
              Save Source
            </button>
          </div>
        </form>
      )}

      {/* Sources List */}
      <div className="space-y-3">
        {sources.map((src) => {
          const isEnabled = src.status !== 'Restricted';

          return (
            <div
              key={src.id}
              className="glass-panel p-4 sm:p-5 rounded-3xl border border-[#D8EAF0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#12313D]">{src.name}</span>
                  <span className="text-xs text-[#087E9B] bg-[#EAF7FD] px-2 py-0.5 rounded-md font-semibold">
                    {src.type}
                  </span>
                  <span className="text-[11px] text-[#607B86] font-mono">{src.id}</span>
                </div>
                <div className="text-xs text-[#607B86]">
                  {src.reportsCount.toLocaleString()} lifetime ingestions • Latency: {src.latency}
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#D8EAF0]/60">
                {/* Trust Score Slider */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#607B86] font-medium whitespace-nowrap">
                    Trust: <strong className="text-[#087E9B]">{src.trustScore}%</strong>
                  </span>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={src.trustScore}
                    onChange={(e) => updateTrust(src.id, Number(e.target.value))}
                    className="w-24 accent-[#087E9B]"
                  />
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => toggleSourceStatus(src.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isEnabled
                      ? 'bg-[#2AA66F]/10 text-[#2AA66F] border border-[#2AA66F]/30'
                      : 'bg-gray-100 text-gray-500 border border-gray-300'
                  }`}
                >
                  <span>{isEnabled ? 'Active' : 'Disabled'}</span>
                </button>

                {/* Remove */}
                <button
                  onClick={() => removeSource(src.id)}
                  className="p-1.5 rounded-lg text-[#607B86] hover:text-[#E45C5C] hover:bg-red-50 transition-colors"
                  title="Remove Source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
