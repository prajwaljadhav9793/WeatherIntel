import React, { useState } from 'react';
import { WeatherReport, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Copy,
  CheckCircle,
  XCircle,
  Radio,
  FileCheck2,
  ExternalLink,
  Share2,
} from 'lucide-react';

interface ReportDetailsPageProps {
  report: WeatherReport;
  onBack: () => void;
  onUpdateStatus: (reportId: string, newStatus: VerificationStatus) => void;
}

export const ReportDetailsPage: React.FC<ReportDetailsPageProps> = ({
  report,
  onBack,
  onUpdateStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>(report.status);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (status: VerificationStatus, label: string) => {
    setCurrentStatus(status);
    onUpdateStatus(report.id, status);
    setNotification(`Report status updated to: ${status}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 pb-14 max-w-6xl mx-auto">
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#087E9B] hover:text-[#07556B] bg-white/70 hover:bg-white px-3.5 py-2 rounded-xl border border-[#D8EAF0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={currentStatus} size="md" pulse={currentStatus === 'Under Review'} />
          <span className="text-xs text-[#607B86] font-mono hidden sm:inline">
            ID: {report.id}
          </span>
        </div>
      </div>

      {/* Status Toast */}
      {notification && (
        <div className="p-3 rounded-xl bg-[#2AA66F]/15 border border-[#2AA66F]/30 text-[#2AA66F] text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Media & Location Map on Top, Information & AI Assessment below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Media Area (60%) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#607B86]">
            <span className="flex items-center gap-1.5 text-[#087E9B]">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Multi-Spectral / Ground Photo
            </span>
            <span>EXIF Geotagged</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-[#EAF7FD] aspect-video border border-[#D8EAF0]">
            <img
              src={report.mediaUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80'}
              alt={report.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 right-3 glass-panel px-3 py-2 rounded-xl text-xs flex items-center justify-between text-[#12313D] shadow-md border border-white/80">
              <span className="font-semibold truncate">{report.title}</span>
              <span className="text-[11px] text-[#607B86] flex-shrink-0">
                {report.timestamp}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/70 border border-[#D8EAF0] text-xs text-[#607B86] leading-relaxed">
            <strong className="text-[#12313D] block mb-1">Description:</strong>
            {report.description}
          </div>
        </div>

        {/* Location & Metadata Panel (40%) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-[#D8EAF0] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087E9B] bg-[#EAF7FD] px-2.5 py-1 rounded-lg border border-[#5BBFEF]/30">
                {report.event}
              </span>
              <span className="text-xs font-semibold text-[#607B86]">
                Severity: <strong className="text-[#12313D]">{report.severity}</strong>
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-[#12313D] tracking-tight mb-4">
              {report.location.city}, {report.location.state}
            </h2>

            {/* Static Geo coordinate mini badge */}
            <div className="p-3 rounded-2xl bg-white/80 border border-[#D8EAF0] mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#087E9B] font-semibold">
                <MapPin className="w-4 h-4" />
                <span>
                  {report.location.lat.toFixed(4)}° N, {report.location.lng.toFixed(4)}° E
                </span>
              </div>
              <span className="text-[11px] text-[#607B86]">District: {report.location.district}</span>
            </div>

            {/* Metadata key-values */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#D8EAF0]/60">
                <span className="text-[#607B86]">Timestamp:</span>
                <span className="font-semibold text-[#12313D]">{report.timestamp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8EAF0]/60">
                <span className="text-[#607B86]">Data Source:</span>
                <span className="font-semibold text-[#12313D]">{report.source}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8EAF0]/60">
                <span className="text-[#607B86]">Source Reliability:</span>
                <span className="font-semibold text-[#087E9B]">{report.sourceTrust}% Trust Score</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8EAF0]/60">
                <span className="text-[#607B86]">AI Confidence Score:</span>
                <span className="font-semibold text-[#087E9B]">{report.aiConfidence}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8EAF0]/60">
                <span className="text-[#607B86]">Duplicate Probability:</span>
                <span className={`font-semibold ${report.duplicateProbability > 50 ? 'text-[#E45C5C]' : 'text-[#2AA66F]'}`}>
                  {report.duplicateProbability}%
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#607B86]">Corroborating Reports:</span>
                <span className="font-semibold text-[#12313D]">{report.relatedReportsCount} verified reports</span>
              </div>
            </div>
          </div>

          {/* Admin Action Buttons */}
          <div className="pt-4 border-t border-[#D8EAF0] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#607B86] block">
              Official Verification Controls
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-action-verify"
                onClick={() => handleAction('Verified', 'Verified')}
                className="py-2.5 px-3 rounded-xl bg-[#2AA66F] hover:bg-[#238a5c] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>VERIFY</span>
              </button>

              <button
                id="btn-action-suspicious"
                onClick={() => handleAction('Suspicious', 'Suspicious')}
                className="py-2.5 px-3 rounded-xl bg-[#E45C5C] hover:bg-[#cf4848] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SUSPICIOUS</span>
              </button>

              <button
                id="btn-action-duplicate"
                onClick={() => handleAction('Duplicate', 'Duplicate')}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#EAF7FD] text-[#607B86] font-semibold text-xs border border-[#D8EAF0] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>MARK DUPLICATE</span>
              </button>

              <button
                id="btn-action-reject"
                onClick={() => handleAction('Suspicious', 'Rejected')}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 text-[#E45C5C] font-semibold text-xs border border-[#E45C5C]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>REJECT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI ASSESSMENT PANEL */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8EAF0]/70 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center border border-[#5BBFEF]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#12313D] tracking-tight">
                AI ASSESSMENT
              </h3>
              <p className="text-xs text-[#607B86]">
                Multi-factor corroboration across satellite, radar reflectivity, and NLP text semantics
              </p>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#087E9B] bg-[#EAF7FD] px-3 py-1 rounded-full border border-[#5BBFEF]/30 self-start sm:self-auto">
            Confidence: {report.aiAssessment.confidenceScore}%
          </div>
        </div>

        {/* Assessment Metrics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/70 border border-[#D8EAF0]">
            <span className="text-[11px] text-[#607B86] font-semibold uppercase tracking-wider block mb-1">
              Event Classification
            </span>
            <div className="text-base font-bold text-[#087E9B]">
              {report.aiAssessment.eventClassification}
            </div>
            <div className="w-full bg-[#EAF7FD] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#087E9B] h-full rounded-full"
                style={{ width: `${report.aiAssessment.confidenceScore}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-[#D8EAF0]">
            <span className="text-[11px] text-[#607B86] font-semibold uppercase tracking-wider block mb-1">
              Location Consistency
            </span>
            <div className="text-base font-bold text-[#2AA66F]">
              {report.aiAssessment.locationConsistency}
            </div>
            <p className="text-[11px] text-[#607B86] mt-1">Matched with AWS rain gauge radius</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-[#D8EAF0]">
            <span className="text-[11px] text-[#607B86] font-semibold uppercase tracking-wider block mb-1">
              Timestamp Consistency
            </span>
            <div className="text-base font-bold text-[#2AA66F]">
              {report.aiAssessment.timestampConsistency}
            </div>
            <p className="text-[11px] text-[#607B86] mt-1">Zero latency skew with radar scan</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-[#D8EAF0]">
            <span className="text-[11px] text-[#607B86] font-semibold uppercase tracking-wider block mb-1">
              Duplicate Detection
            </span>
            <div className={`text-base font-bold ${report.aiAssessment.duplicateProbability > 50 ? 'text-[#E45C5C]' : 'text-[#2AA66F]'}`}>
              {report.aiAssessment.duplicateDetection}
            </div>
            <p className="text-[11px] text-[#607B86] mt-1">Perceptual image hash check: {report.aiAssessment.duplicateProbability}%</p>
          </div>
        </div>

        {/* Vision & NLP Deep Dive */}
        <div className="p-4 rounded-2xl bg-[#EAF7FD]/50 border border-[#D8EAF0] space-y-2">
          <h4 className="text-xs font-bold text-[#07556B] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#087E9B]" />
            Image & Model Analysis Insights
          </h4>
          <p className="text-xs text-[#12313D] leading-relaxed">
            {report.aiAssessment.imageAnalysis}
          </p>
          {report.aiAssessment.flagReason && (
            <div className="pt-2 border-t border-[#D8EAF0]/60 text-xs text-[#607B86]">
              <strong className="text-[#087E9B]">Reasoning Matrix:</strong> {report.aiAssessment.flagReason}
            </div>
          )}
        </div>

        {/* Disclaimer as instructed: Always label this as AI Assessment, never absolute truth */}
        <div className="text-[11px] text-[#607B86] italic text-center">
          Note: This evaluation is generated by the AI Assessment Pipeline for decision support.
          Official verification is strictly subject to authorized IMD/SDMA officer discretion.
        </div>
      </div>
    </div>
  );
};
