import React, { useState } from 'react';
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
import { Sun, Moon } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState<ActivePage>('overview');
  const [userRole, setUserRole] = useState<UserRole>('IMD Analyst');
  const [reports, setReports] = useState<WeatherReport[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '24H',
    event: 'All',
    state: 'All',
    district: 'All',
    verification: 'All',
    searchQuery: '',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setSelectedReport(null);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: '24H',
      event: 'All',
      state: 'All',
      district: 'All',
      verification: 'All',
      searchQuery: '',
    });
    setSelectedReport(null);
  };

  const handleSelectReport = (report: WeatherReport) => {
    setSelectedReport(report);
  };

  const handleClearSelectedReport = () => {
    setSelectedReport(null);
  };

  const handleViewReportDetails = (report: WeatherReport) => {
    setSelectedReport(report);
    setCurrentPage('report-details');
  };

  const handleAddReport = (newReport: WeatherReport) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
  };

  const handleUpdateReportStatus = (
    reportId: string,
    newStatus: VerificationStatus
  ) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Render Page
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            reports={reports}
            onNavigate={setCurrentPage}
            onSelectReport={handleSelectReport}
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
            onNavigate={setCurrentPage}
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
            onBack={() => setCurrentPage('reports')}
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
        return (
          <AdminDashboardPage
            reports={reports}
            onNavigate={setCurrentPage}
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
            currentRole={userRole}
            onRoleChange={setUserRole}
            onClose={() => setCurrentPage('overview')}
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
            onNavigate={setCurrentPage}
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
      {/* Top Main Navigation */}
      <Navbar
        activePage={currentPage}
        onNavigate={setCurrentPage}
        userRole={userRole}
        onRoleChange={setUserRole}
        onOpenAuth={() => setCurrentPage('auth')}
        onOpenSearch={() => setCurrentPage('overview')}
        activeAlertsCount={4}
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onOpenAuth={() => setCurrentPage('auth')}
        activeAlertsCount={4}
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
              onClick={() => setCurrentPage('landing')}
              className="hover:text-[#087E9B] transition-colors"
            >
              Portal Home
            </button>
            <button
              onClick={() => setCurrentPage('system-health')}
              className="hover:text-[#087E9B] transition-colors"
            >
              System Health
            </button>
            <button
              onClick={() => setCurrentPage('sources')}
              className="hover:text-[#087E9B] transition-colors"
            >
              Sensor Feeds
            </button>
            <button
              onClick={() => setCurrentPage('auth')}
              className="hover:text-[#087E9B] transition-colors"
            >
              Role Auth ({userRole})
            </button>

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
              )}
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
      <MainWeatherPlatform />
    </ThemeProvider>
  );
}
