import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  WeatherReport,
  FilterState,
  UserRole,
  VerificationStatus,
} from './types';
import { MOCK_REPORTS } from './data/mockData';
import { Navbar } from './components/common/Navbar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sun, Moon, Lock, Shield, X } from 'lucide-react';

// Page components
import { LandingPage } from './components/pages/LandingPage';
import { OverviewPage } from './components/pages/OverviewPage';
import { LiveMonitorPage } from './components/pages/LiveMonitorPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ReportDetailsPage } from './components/pages/ReportDetailsPage';
import { AIVerificationCenterPage } from './components/pages/AIVerificationCenterPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { GeospatialPage } from './components/pages/GeospatialPage';
import { CitizenReportingPage } from './components/pages/CitizenReportingPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { DataSourcesPage } from './components/pages/DataSourcesPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { AdminVerificationWorkspacePage } from './components/pages/AdminVerificationWorkspacePage';
import { SourceManagementPage } from './components/pages/SourceManagementPage';
import { SystemHealthPage } from './components/pages/SystemHealthPage';
import { AuthModalOrPage } from './components/pages/AuthModalOrPage';

export function MainWeatherPlatform() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const {
    reports,
    selectedReport,
    alerts,
    filters,
    isConnectedToStream,
    handleFilterChange,
    handleResetFilters,
    setSelectedReport,
    updateReportStatus,
  } = useWeather();

  // If user is authenticated, default to overview; otherwise, default to landing
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => (isAuthenticated ? 'overview' : 'landing'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Sync page with auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPage !== 'landing' && currentPage !== 'auth') {
        setCurrentPage('landing');
      }
    } else {
      if (currentPage === 'landing' || currentPage === 'auth') {
        setCurrentPage('overview');
      }
    }
  }, [isAuthenticated]);

  const currentRole: UserRole = user?.role || 'IMD Analyst';

  // Navigation Guard: Protect internal modules
  const handleNavigate = (page: ActivePage, mode: 'login' | 'register' = 'login') => {
    if (!isAuthenticated && page !== 'landing' && page !== 'auth') {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    if (page === 'auth') {
      setAuthModalMode(mode);
    }
    setCurrentPage(page);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleSelectReport = (report: WeatherReport) => {
    setSelectedReport(report);
  };

  const handleClearSelectedReport = () => {
    setSelectedReport(null);
  };

  const handleViewReportDetails = (report: WeatherReport) => {
    setSelectedReport(report);
    handleNavigate('report-details');
  };

  const handleAddReport = (newReport: WeatherReport) => {
    setSelectedReport(newReport);
  };

  const handleUpdateReportStatus = (
    reportId: string,
    newStatus: VerificationStatus,
    justification?: string
  ) => {
    updateReportStatus(reportId, newStatus, justification, currentRole);
  };

  // Render Page with strict protection
  const renderPage = () => {
    // If not authenticated and attempting to view any protected module, enforce landing
    if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
      return (
        <LandingPage
          reports={reports}
          onNavigate={handleNavigate}
          onSelectReport={handleSelectReport}
          onOpenAuth={handleOpenAuth}
        />
      );
    }

    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            reports={reports}
            onNavigate={handleNavigate}
            onSelectReport={handleSelectReport}
            onOpenAuth={handleOpenAuth}
          />
        );

      case 'overview':
        return (
          <OverviewPage
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onNavigate={handleNavigate}
            onViewReportDetails={handleViewReportDetails}
          />
        );

      case 'monitor':
        return (
          <LiveMonitorPage
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
            onClearSelectedReport={handleClearSelectedReport}
            onViewReportDetails={handleViewReportDetails}
          />
        );

      case 'reports':
        return (
          <ReportsPage
            reports={reports}
            onSelectReport={handleSelectReport}
            onViewDetails={handleViewReportDetails}
          />
        );

      case 'report-details':
        return selectedReport ? (
          <ReportDetailsPage
            report={selectedReport}
            onBack={() => handleNavigate('reports')}
            onUpdateStatus={handleUpdateReportStatus}
          />
        ) : (
          <ReportsPage
            reports={reports}
            onSelectReport={handleSelectReport}
            onViewDetails={handleViewReportDetails}
          />
        );

      case 'verification':
      case 'admin-verification':
        return (
          <AIVerificationCenterPage
            reports={reports}
            onSelectReport={handleSelectReport}
            onViewReportDetails={handleViewReportDetails}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        );

      case 'analytics':
        return <AnalyticsPage />;

      case 'geospatial':
        return (
          <GeospatialPage
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
            onViewReportDetails={handleViewReportDetails}
          />
        );

      case 'citizen-report':
        return (
          <CitizenReportingPage
            onAddReport={handleAddReport}
            onViewReport={handleViewReportDetails}
          />
        );

      case 'alerts':
        return <AlertsPage />;

      case 'sources':
        return <DataSourcesPage />;

      case 'admin':
      case 'admin-dashboard':
        return (
          <AdminDashboardPage
            reports={reports}
            onNavigate={handleNavigate}
            onSelectReport={handleSelectReport}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        );

      case 'admin-workspace':
        return (
          <AdminVerificationWorkspacePage
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        );

      case 'source-management':
        return <SourceManagementPage />;

      case 'system-health':
        return <SystemHealthPage />;

      case 'auth':
        return (
          <AuthModalOrPage
            initialMode={authModalMode}
            onSuccess={() => handleNavigate('overview')}
            onClose={() => handleNavigate(isAuthenticated ? 'overview' : 'landing')}
          />
        );

      default:
        return (
          <OverviewPage
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onNavigate={handleNavigate}
            onViewReportDetails={handleViewReportDetails}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-[#5BBFEF]/30 ${
        isDark ? 'bg-[#061218] text-[#E0F2F7]' : 'bg-[#F5FAFC] text-[#12313D]'
      }`}
    >
      {/* Top Main Navigation with Dynamic Auth Gating */}
      <Navbar
        activePage={currentPage}
        onNavigate={handleNavigate}
        userRole={currentRole}
        userProfile={user || undefined}
        onOpenAuth={handleOpenAuth}
        onOpenSearch={() => handleNavigate('overview')}
        activeAlertsCount={alerts.length}
        pendingVerificationCount={
          reports.filter(
            (r) => r.status === 'Under Review' || r.status === 'Unverified'
          ).length
        }
      />

      {/* Main App Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {renderPage()}
      </main>

      {/* Auth Modal Overlay when triggered by visitor clicking locked features */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 hover:bg-white text-[#12313D] shadow-md border border-[#D8EAF0] transition-colors"
              aria-label="Close authentication modal"
            >
              <X className="w-4 h-4" />
            </button>
            <AuthModalOrPage
              initialMode={authModalMode}
              onSuccess={() => {
                setShowAuthModal(false);
                handleNavigate('overview');
              }}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        activeAlertsCount={alerts.length}
      />

      {/* Official Government / IMD Footer */}
      <footer
        className={`w-full border-t py-6 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200 ${
          isDark
            ? 'bg-[#07151E] border-[#163546] text-[#8AAABA]'
            : 'bg-white/70 border-[#D8EAF0] text-[#607B86]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087E9B]" />
            <span
              className={`font-semibold ${
                isDark ? 'text-[#E0F2F7]' : 'text-[#12313D]'
              }`}
            >
              WEATHERINTEL INDIA
            </span>
            <span>• National Weather Big Data Analytics Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => handleNavigate('landing')}
              className="hover:text-[#087E9B] transition-colors"
            >
              Portal Home
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate('system-health')}
                  className="hover:text-[#087E9B] transition-colors"
                >
                  System Health
                </button>
                <button
                  onClick={() => handleNavigate('sources')}
                  className="hover:text-[#087E9B] transition-colors"
                >
                  Sensor Feeds
                </button>
                <button
                  onClick={() => handleNavigate('auth')}
                  className="hover:text-[#087E9B] transition-colors"
                >
                  Profile ({user?.name || currentRole})
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOpenAuth('login')}
                className="hover:text-[#087E9B] font-semibold transition-colors"
              >
                Sign In / Register
              </button>
            )}

            {/* Quick theme toggle in footer */}
            <button
              id="footer-theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                isDark
                  ? 'bg-[#0D2431] border-[#193F53] text-[#5BBFEF] hover:text-white'
                  : 'bg-white border-[#D8EAF0] text-[#607B86] hover:text-[#087E9B]'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F5B041]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#607B86]" />
                  <span>Dark Mode</span>
                </>
              )
            }
            </button>
          </div>

          <div className={`text-[11px] ${isDark ? 'text-[#6C8E9F]' : 'text-[#607B86]'}`}>
            IMD & Ministry of Earth Sciences • v2.4.1 Secure Build
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <MainWeatherPlatform />
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
