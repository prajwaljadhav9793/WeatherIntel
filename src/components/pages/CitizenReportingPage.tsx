import React, { useState } from 'react';
import { WeatherReport, WeatherEventType } from '../../types';
import {
  Users,
  MapPin,
  Camera,
  CheckCircle,
  Calendar,
  Sparkles,
  UploadCloud,
  Navigation,
  ArrowRight,
} from 'lucide-react';

import { submitCitizenReportApi } from '../../services/api';

interface CitizenReportingPageProps {
  onAddReport: (newReport: WeatherReport) => void;
  onViewReport: (report: WeatherReport) => void;
}

export const CitizenReportingPage: React.FC<CitizenReportingPageProps> = ({
  onAddReport,
  onViewReport,
}) => {
  const [eventType, setEventType] = useState<WeatherEventType>('Rainfall');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 18.5204,
    lng: 73.8567,
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<WeatherReport | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const eventTypes: WeatherEventType[] = [
    'Rainfall',
    'Flooding',
    'Thunderstorm',
    'Heatwave',
    'Fog',
    'Dust Storm',
    'Strong Winds',
  ];

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setCity('Pune');
          setDistrict('Pune District');
          setState('Maharashtra');
          setIsLocating(false);
        },
        () => {
          setCoordinates({ lat: 18.5204, lng: 73.8567 });
          setCity('Pune');
          setDistrict('Haveli');
          setState('Maharashtra');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setCoordinates({ lat: 18.5204, lng: 73.8567 });
      setCity('Pune');
      setState('Maharashtra');
      setIsLocating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const report = await submitCitizenReportApi({
        title: `${eventType} observed at ${city || 'Local Area'}`,
        description: description || `Severe ${eventType.toLowerCase()} reported by citizen on ground.`,
        event: eventType,
        city: city || 'Pune',
        district: district || city || 'Pune',
        state: state || 'Maharashtra',
        lat: coordinates?.lat || 18.5204,
        lng: coordinates?.lng || 73.8567,
        mediaUrl: mediaPreview || undefined,
      });

      onAddReport(report);
      setSubmittedReport(report);
    } catch (err: any) {
      console.warn('[Citizen Submit] API error, falling back to local creation:', err);
      setSubmissionError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF7FD] border border-[#5BBFEF]/30 text-xs font-semibold text-[#087E9B]">
          <Users className="w-3.5 h-3.5" />
          <span>Crowdsourced Ground Observation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12313D] tracking-tight">
          Report a Weather Event
        </h1>
        <p className="text-sm text-[#607B86] max-w-lg mx-auto">
          Help build a better picture of weather conditions in your area. Your reports directly assist
          disaster response teams and verify radar observations.
        </p>
      </div>

      {/* Confirmation View if Submitted */}
      {submittedReport ? (
        <div className="glass-panel p-8 rounded-3xl border border-[#2AA66F]/40 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-[#2AA66F]/10 text-[#2AA66F] rounded-2xl flex items-center justify-center mx-auto border border-[#2AA66F]/30">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-[#12313D]">
              Report received successfully.
            </h2>
            <p className="text-sm text-[#607B86] max-w-md mx-auto">
              AI verification is now in progress. Automated radar triangulation and image verification
              have been dispatched.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-[#D8EAF0] max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#607B86]">Report ID:</span>
              <span className="font-bold text-[#12313D]">{submittedReport.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#607B86]">Event:</span>
              <span className="font-bold text-[#087E9B]">{submittedReport.event}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#607B86]">Location:</span>
              <span className="font-semibold text-[#12313D]">
                {submittedReport.location.city}, {submittedReport.location.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#607B86]">Initial AI Confidence:</span>
              <span className="font-bold text-[#2AA66F]">{submittedReport.aiConfidence}%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewReport(submittedReport)}
              className="px-6 py-2.5 rounded-xl bg-[#087E9B] text-white font-semibold text-xs shadow-xs hover:bg-[#07556B] transition-colors flex items-center gap-1.5"
            >
              <span>View Report in System</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setDescription('');
                setCity('');
                setMediaPreview(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-white text-[#607B86] hover:text-[#12313D] border border-[#D8EAF0] font-semibold text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#D8EAF0] shadow-xs space-y-6"
        >
          {/* 1. Event Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#12313D] uppercase tracking-wider mb-2.5">
              1. Select Weather Event Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {eventTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`p-3 rounded-2xl border text-xs font-semibold transition-all text-center ${
                    eventType === type
                      ? 'bg-[#087E9B] text-white border-[#087E9B] shadow-xs'
                      : 'bg-white/80 hover:bg-white text-[#12313D] border-[#D8EAF0]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-bold text-[#12313D] uppercase tracking-wider mb-2">
              2. Observation Details
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe ground conditions, water logging depth, wind speed gusts, or damage noticed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 text-xs bg-white/80 rounded-2xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D] resize-none"
            />
          </div>

          {/* 3. Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#12313D] uppercase tracking-wider">
                3. Event Location & Geotag
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087E9B] hover:text-[#07556B] bg-[#EAF7FD] px-3 py-1 rounded-xl border border-[#5BBFEF]/30 transition-colors"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="City / Village (e.g. Kolhapur)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="p-3 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
              />

              <input
                type="text"
                placeholder="District (e.g. Kolhapur District)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="p-3 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
              />

              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="p-3 text-xs bg-white/80 rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D] font-medium"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Kerala">Kerala</option>
                <option value="Odisha">Odisha</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Assam">Assam</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>

            {coordinates && (
              <div className="text-[11px] text-[#607B86] mt-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                <span>Geotag Coordinates: {coordinates.lat}° N, {coordinates.lng}° E</span>
              </div>
            )}
          </div>

          {/* 4. Media Upload (Photo/Video) */}
          <div>
            <label className="block text-xs font-bold text-[#12313D] uppercase tracking-wider mb-2">
              4. Evidence Photo or Video (Optional)
            </label>
            <div className="relative border-2 border-dashed border-[#D8EAF0] hover:border-[#5BBFEF] rounded-2xl p-6 text-center bg-white/50 transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {mediaPreview ? (
                <div className="space-y-2">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl object-cover border border-[#D8EAF0]"
                  />
                  <p className="text-xs text-[#2AA66F] font-semibold">Image loaded successfully</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center mx-auto border border-[#5BBFEF]/30">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-[#12313D] font-semibold">
                    Click to select photo or drag and drop
                  </div>
                  <div className="text-[11px] text-[#607B86]">
                    PNG, JPG, MP4 up to 25MB • EXIF GPS data will be verified by AI
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-submit-citizen-report"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-[#607B86] cursor-not-allowed opacity-80'
                : 'bg-[#087E9B] hover:bg-[#07556B] shadow-[#087E9B]/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>
              {isSubmitting ? 'Running Multi-Modal AI Sensor Verification...' : 'Submit Report for Automated Verification'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
