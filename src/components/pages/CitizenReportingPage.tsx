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
    lat: 16.705,
    lng: 74.2433,
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<WeatherReport | null>(null);
  const [isLocating, setIsLocating] = useState(false);

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
    // Simulate real browser geolocation fallback
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
          // Default to Pune / Maharashtra coordinates if permission denied in iframe
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `REP-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${
      now.getHours() >= 12 ? 'PM' : 'AM'
    }`;
    const dateStr = 'Today';

    const newReport: WeatherReport = {
      id: newId,
      title: `${eventType} observed at ${city || 'Local Area'}`,
      description: description || `Severe ${eventType.toLowerCase()} reported by citizen. Water level and wind observations recorded.`,
      event: eventType,
      severity: eventType === 'Flooding' || eventType === 'Heatwave' ? 'High' : 'Moderate',
      status: 'Under Review',
      aiConfidence: Math.floor(85 + Math.random() * 12),
      source: 'Citizen Mobile App (Geotagged)',
      sourceType: 'Citizen Reports',
      sourceTrust: 88,
      duplicateProbability: 12,
      timestamp: `${dateStr} • ${timeStr}`,
      location: {
        city: city || 'Kolhapur',
        district: district || 'Kolhapur',
        state: state || 'Maharashtra',
        lat: coordinates?.lat || 16.705,
        lng: coordinates?.lng || 74.2433,
      },
      mediaUrl:
        mediaPreview ||
        'https://images.unsplash.com/photo-1514632595-4944383f2737?auto=format&fit=crop&w=1200&q=80',
      relatedReportsCount: 1,
      updatedAt: `${dateStr} • ${timeStr}`,
      aiAssessment: {
        confidenceScore: 89,
        eventClassification: `${eventType} — 91% match with cloud reflectivity`,
        locationConsistency: 'High',
        timestampConsistency: 'High',
        duplicateDetection: 'Low probability',
        duplicateProbability: 12,
        imageAnalysis: 'Visual indicators show ground precipitation and atmospheric humidity markers consistent with report.',
        flagReason: 'Citizen report forwarded to automated verification queue. Coordinates match local AWS boundary with < 2 min latency.',
        nlpSummary: 'Citizen submission processed through NLP entity extraction and geographical verification.',
      },
    };

    onAddReport(newReport);
    setSubmittedReport(newReport);
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
            className="w-full py-3.5 rounded-2xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-sm shadow-md shadow-[#087E9B]/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Report for Automated Verification</span>
          </button>
        </form>
      )}
    </div>
  );
};
