import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  WeatherReport,
  WeatherEventType,
  VerificationStatus,
} from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Flame,
  Filter,
  RotateCcw,
  Sparkles,
  ExternalLink,
  X,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useTheme } from '../../context/ThemeContext';
import { STATE_ACTIVITY_DATA } from '../../data/mockData';

interface IndiaWeatherMapProps {
  reports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onSelectReport: (report: WeatherReport) => void;
  selectedEvent?: WeatherEventType | 'All';
  selectedState?: string | 'All';
  onSelectState?: (state: string) => void;
  layerMode?: 'EVENTS' | 'HEATMAP' | 'CLUSTERS' | 'STATE ACTIVITY';
  heightClass?: string;
  isHeroMode?: boolean;
  onViewReportDetails?: (report: WeatherReport) => void;
  showNationalStatusOverlay?: boolean;
  theme?: 'light' | 'dark';
}

export const IndiaWeatherMap: React.FC<IndiaWeatherMapProps> = ({
  reports,
  selectedReport,
  onSelectReport,
  selectedEvent = 'All',
  selectedState = 'All',
  onSelectState,
  layerMode = 'EVENTS',
  heightClass = 'h-[580px]',
  isHeroMode = false,
  onViewReportDetails,
  showNationalStatusOverlay = false,
  theme: propTheme,
}) => {
  let contextTheme: 'light' | 'dark' = 'light';
  try {
    const { theme: t } = useTheme();
    contextTheme = t;
  } catch {
    // fallback if outside ThemeProvider
  }
  const theme = propTheme || contextTheme;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeLayer, setActiveLayer] = useState<'light' | 'terrain' | 'satellite'>('light');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideOverReport, setSlideOverReport] = useState<WeatherReport | null>(selectedReport);

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Synchronize internal slide-over when selectedReport prop changes
  useEffect(() => {
    setSlideOverReport(selectedReport ?? null);
  }, [selectedReport]);

  // Color mapping by weather event
  const getEventColor = (event: WeatherEventType): string => {
    switch (event) {
      case 'Flooding':
        return '#087E9B'; // Deep Ocean Teal
      case 'Rainfall':
        return '#5BBFEF'; // Primary Sky Blue
      case 'Thunderstorm':
        return '#07556B'; // Dark Teal
      case 'Heatwave':
        return '#E7A23B'; // Warning Amber
      case 'Strong Winds':
        return '#25BFA5'; // Aqua
      case 'Fog':
        return '#607B86'; // Slate Blue
      case 'Dust Storm':
        return '#D8A05B'; // Sandy amber
      default:
        return '#5BBFEF';
    }
  };

  // Helper to generate custom pulsing SVG marker HTML
  const createMarkerHtml = (report: WeatherReport, isSelected: boolean) => {
    const color = getEventColor(report.event);
    const pulseRingClass = report.severity === 'Critical' ? 'border-[#E45C5C] bg-[#E45C5C]/20' : `border-[${color}] bg-[${color}]/20`;

    return `
      <div class="weather-marker-pin group flex items-center justify-center cursor-pointer" style="width: 38px; height: 38px;">
        <div class="ring" style="border: 2px solid ${color}; background-color: ${color}20;"></div>
        <div class="relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
          isSelected ? 'scale-125 ring-3 ring-[#087E9B]' : 'hover:scale-115'
        }" style="background-color: #FFFFFF; border: 2.5px solid ${color};">
          <span style="display:inline-block; width:12px; height:12px; border-radius:9999px; background-color:${color};"></span>
        </div>
      </div>
    `;
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Center coordinates for India
    const map = L.map(mapContainerRef.current, {
      center: [21.8, 78.9],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 14,
    });

    // Clean, elegant CartoDB Positron tiles for light climate atmosphere or CartoDB Dark Matter for Night Ops
    const initialUrl =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(initialUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create marker layers
    const markersLayer = L.layerGroup().addTo(map);
    const heatmapLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    heatmapLayerRef.current = heatmapLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer based on selected layer type and theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let url =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    if (activeLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (activeLayer === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    const newLayer = L.tileLayer(url, {
      subdomains: activeLayer === 'satellite' ? '' : 'abcd',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeLayer, theme]);

  // Update markers and heat/density overlays whenever reports or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !heatmapLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    const effectiveHeatmap = showHeatmap || layerMode === 'HEATMAP';
    const effectiveClusters = layerMode === 'CLUSTERS';
    const effectiveStateActivity = layerMode === 'STATE ACTIVITY';

    // If a report is selected from the live feed, isolate the map to that single marker.
    const selectedReportForMap = slideOverReport ?? selectedReport;
    const filteredReports = selectedReportForMap
      ? reports.filter((r) => r.id === selectedReportForMap.id)
      : reports.filter((r) => {
          const matchEvent = selectedEvent === 'All' || r.event === selectedEvent;
          const matchState = selectedState === 'All' || r.location.state === selectedState;
          return matchEvent && matchState;
        });

    if (effectiveStateActivity && selectedState !== 'All') {
      const stateMeta = STATE_ACTIVITY_DATA[selectedState];
      if (stateMeta) {
        const stateCircle = L.circle([stateMeta.lat, stateMeta.lng], {
          radius: 260000,
          color: '#5BBFEF',
          fillColor: '#5BBFEF',
          fillOpacity: 0.18,
          weight: 2,
        }).addTo(heatmapLayerRef.current!);

        const stateLabel = L.marker([stateMeta.lat, stateMeta.lng], {
          icon: L.divIcon({
            className: 'state-activity-label',
            html: `<div style="background: rgba(8, 126, 155, 0.9); color: white; border-radius: 9999px; padding: 6px 10px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 8px 20px rgba(8,126,155,0.2);">${selectedState}</div>`,
            iconSize: [110, 30],
            iconAnchor: [55, 15],
          }),
        });

        stateCircle.addTo(heatmapLayerRef.current!);
        stateLabel.addTo(heatmapLayerRef.current!);
      }
    }

    if (effectiveClusters) {
      const clusters = Object.values(
        filteredReports.reduce((acc, report) => {
          const key = report.location.state;
          if (!acc[key]) acc[key] = [];
          acc[key].push(report);
          return acc;
        }, {} as Record<string, WeatherReport[]>)
      );

      clusters.forEach((items: WeatherReport[]) => {
        const avgLat = items.reduce((sum, item) => sum + item.location.lat, 0) / items.length;
        const avgLng = items.reduce((sum, item) => sum + item.location.lng, 0) / items.length;
        const radius = Math.max(50000, items.length * 24000);

        L.circle([avgLat, avgLng], {
          radius,
          color: '#087E9B',
          fillColor: '#087E9B',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '6 8',
        }).addTo(heatmapLayerRef.current!);
      });
    }

    filteredReports.forEach((report) => {
      const isSelected = slideOverReport?.id === report.id;
      const customIcon = L.divIcon({
        className: 'custom-weather-icon',
        html: createMarkerHtml(report, isSelected),
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([report.location.lat, report.location.lng], {
        icon: customIcon,
      });

      marker.on('click', () => {
        setSlideOverReport(report);
        onSelectReport(report);
        if (onSelectState && report.location.state) {
          onSelectState(report.location.state);
        }
      });

      marker.bindTooltip(
        `<strong>${report.event.toUpperCase()}</strong>: ${report.location.city}, ${report.location.state}<br/><span style="font-size:11px;color:#607B86;">AI Conf: ${report.aiConfidence}% • ${report.status}</span>`,
        {
          direction: 'top',
          offset: [0, -18],
          opacity: 0.95,
        }
      );

      marker.addTo(markersLayerRef.current!);

      if (effectiveHeatmap) {
        const color = getEventColor(report.event);
        const radius = Math.max(35000, report.relatedReportsCount * 1200);

        L.circle([report.location.lat, report.location.lng], {
          radius: radius,
          color: color,
          fillColor: color,
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '4 4',
        }).addTo(heatmapLayerRef.current!);
      }
    });

    if (selectedReportForMap && filteredReports.length > 0) {
      const targetReport = filteredReports[0];
      mapInstanceRef.current.flyTo([targetReport.location.lat, targetReport.location.lng], 7, {
        duration: 1.2,
      });
    } else if (selectedState !== 'All' && filteredReports.length > 0) {
      const stateReport = filteredReports[0];
      mapInstanceRef.current.flyTo([stateReport.location.lat, stateReport.location.lng], 7, {
        duration: 1.2,
      });
    }
  }, [reports, selectedEvent, selectedState, showHeatmap, layerMode, slideOverReport, selectedReport, onSelectReport, onSelectState]);

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => {
    mapInstanceRef.current?.flyTo([21.8, 78.9], 5, { duration: 1 });
    if (onSelectState) onSelectState('All');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      id="india-weather-map-wrapper"
      className={`relative w-full rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 ${
        theme === 'dark' ? 'border-[#1E3A49] bg-[#071217]' : 'border-[#D8EAF0] bg-[#EAF7FD]'
      } ${
        isFullscreen
          ? `fixed inset-0 z-50 rounded-none h-screen ${theme === 'dark' ? 'bg-[#071217]' : 'bg-[#EAF7FD]'}`
          : heightClass
      }`}
    >
      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div
          className={`${
            theme === 'dark'
              ? 'glass-panel-dark border-[#1E3A49]'
              : 'glass-panel border-[#D8EAF0]'
          } p-1 rounded-xl flex flex-col gap-1 shadow-md border`}
        >
          <button
            onClick={handleZoomIn}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-[#A0C0D0] hover:text-[#5BBFEF] hover:bg-[#152E3C]'
                : 'text-[#12313D] hover:text-[#087E9B] hover:bg-white/80'
            }`}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-[#A0C0D0] hover:text-[#5BBFEF] hover:bg-[#152E3C]'
                : 'text-[#12313D] hover:text-[#087E9B] hover:bg-white/80'
            }`}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-colors border-t ${
              theme === 'dark'
                ? 'text-[#A0C0D0] hover:text-[#5BBFEF] hover:bg-[#152E3C] border-[#1E3A49]'
                : 'text-[#12313D] hover:text-[#087E9B] hover:bg-white/80 border-[#D8EAF0]/60'
            }`}
            title="Reset to All-India View"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Toggles for Heatmap and Layers */}
        <div
          className={`${
            theme === 'dark'
              ? 'glass-panel-dark border-[#1E3A49]'
              : 'glass-panel border-[#D8EAF0]'
          } p-1 rounded-xl flex flex-col gap-1 shadow-md border`}
        >
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              showHeatmap
                ? theme === 'dark'
                  ? 'bg-[#5BBFEF] text-[#072430] font-bold shadow-xs'
                  : 'bg-[#087E9B] text-white shadow-xs'
                : theme === 'dark'
                ? 'text-[#84A2B2] hover:text-[#5BBFEF] hover:bg-[#152E3C]'
                : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/80'
            }`}
            title="Toggle Weather Event Density / Heatmap"
            aria-label="Toggle Heatmap"
          >
            <Flame className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveLayer(
                activeLayer === 'light'
                  ? 'satellite'
                  : activeLayer === 'satellite'
                  ? 'terrain'
                  : 'light'
              );
            }}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-[#84A2B2] hover:text-[#5BBFEF] hover:bg-[#152E3C]'
                : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/80'
            }`}
            title={`Layer: ${activeLayer.toUpperCase()} (Click to toggle)`}
            aria-label="Toggle Base Map"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors border-t ${
              theme === 'dark'
                ? 'text-[#84A2B2] hover:text-[#5BBFEF] hover:bg-[#152E3C] border-[#1E3A49]'
                : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/80 border-[#D8EAF0]/60'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Glass Panel: LIVE NATIONAL STATUS */}
      {showNationalStatusOverlay && (
        <div
          id="national-status-overlay"
          className={`absolute top-4 left-4 z-20 px-4 py-3 rounded-2xl shadow-lg border max-w-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'glass-panel-dark border-[#1E3A49] text-[#E0F2F7]'
              : 'glass-panel border-white/70 text-[#12313D]'
          }`}
        >
          <div
            className={`flex items-center justify-between gap-3 mb-2 border-b pb-1.5 ${
              theme === 'dark' ? 'border-[#1E3A49]' : 'border-[#D8EAF0]/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-[#5BBFEF]' : 'text-[#07556B]'
                }`}
              >
                LIVE NATIONAL STATUS
              </span>
            </div>
            <span
              className={`text-[10px] font-medium ${
                theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
              }`}
            >
              IMD Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div
                className={`text-xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#12313D]'
                }`}
              >
                24,580
              </div>
              <div
                className={`text-[11px] font-medium ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Reports
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#2AA66F]">18,420</div>
              <div
                className={`text-[11px] font-medium ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Verified
              </div>
            </div>
            <div>
              <div
                className={`text-xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-[#5BBFEF]' : 'text-[#087E9B]'
                }`}
              >
                842
              </div>
              <div
                className={`text-[11px] font-medium ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Active Events
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#E45C5C]">2,130</div>
              <div
                className={`text-[11px] font-medium ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Suspicious
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Card on Marker Click */}
      {slideOverReport && (
        <div
          id="map-marker-slideover"
          className={`absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 z-30 md:w-88 p-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            theme === 'dark'
              ? 'glass-panel-dark border-[#1E3A49] text-[#E0F2F7]'
              : 'glass-panel border-white/90 text-[#12313D]'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${getEventColor(slideOverReport.event)}25`,
                  color: getEventColor(slideOverReport.event),
                }}
              >
                {slideOverReport.event}
              </span>
              <h4
                className={`font-bold text-base mt-1 flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-[#12313D]'
                }`}
              >
                <MapPin
                  className={`w-4 h-4 flex-shrink-0 ${
                    theme === 'dark' ? 'text-[#5BBFEF]' : 'text-[#087E9B]'
                  }`}
                />
                {slideOverReport.location.city}, {slideOverReport.location.state}
              </h4>
            </div>
            <button
              onClick={() => setSlideOverReport(null)}
              className={`p-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-[#84A2B2] hover:text-white hover:bg-[#152E3C]'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/80'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-[#0E222D] border-[#1D3B4B]'
                : 'bg-white/60 border-[#D8EAF0]/60'
            }`}
          >
            <div>
              <span
                className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                <Sparkles
                  className={`w-3 h-3 ${theme === 'dark' ? 'text-[#5BBFEF]' : 'text-[#087E9B]'}`}
                />
                AI Confidence
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-[#5BBFEF]' : 'text-[#087E9B]'
                }`}
              >
                {slideOverReport.aiConfidence}%
              </span>
            </div>
            <div>
              <span
                className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-[#2AA66F]" />
                Source Trust
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-[#12313D]'
                }`}
              >
                {slideOverReport.sourceTrust}%
              </span>
            </div>
            <div>
              <span
                className={`text-[10px] uppercase font-semibold ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Related Reports
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-[#12313D]'
                }`}
              >
                {slideOverReport.relatedReportsCount}
              </span>
            </div>
            <div>
              <span
                className={`text-[10px] uppercase font-semibold ${
                  theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
                }`}
              >
                Status
              </span>
              <div>
                <StatusBadge status={slideOverReport.status} size="sm" />
              </div>
            </div>
          </div>

          <div
            className={`flex items-center justify-between text-xs mb-3 ${
              theme === 'dark' ? 'text-[#84A2B2]' : 'text-[#607B86]'
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {slideOverReport.timestamp.split('•')[1]?.trim() || slideOverReport.timestamp}
            </span>
            <span className="truncate max-w-[140px]">{slideOverReport.sourceType}</span>
          </div>

          {onViewReportDetails && (
            <button
              onClick={() => onViewReportDetails(slideOverReport)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#087E9B] hover:bg-[#5BBFEF] hover:text-[#072430] text-white'
                  : 'bg-[#087E9B] hover:bg-[#07556B] text-white'
              }`}
            >
              <span>View Full Report</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
