import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  Activity,
  Layers,
  Menu,
  X,
  AlertTriangle,
  User,
  Radio,
  CheckCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { ActivePage, UserProfile, UserRole } from '../../types';
import { WeatherIntelLogo } from './WeatherIntelLogo';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_USER_PROFILES: Record<UserRole, UserProfile> = {
  Citizen: {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    role: 'Citizen',
    organization: 'Citizen Weather Observer Network',
  },
  'IMD Analyst': {
    name: 'Dr. Priya Deshmukh',
    email: 'analyst.deshmukh@imd.gov.in',
    role: 'IMD Analyst',
    organization: 'India Meteorological Department (IMD)',
  },
  Admin: {
    name: 'Commissioner Roy',
    email: 'commissioner@ndma.gov.in',
    role: 'Admin',
    organization: 'National Disaster Management Authority (NDMA)',
  },
};

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  userRole?: UserRole;
  userProfile?: UserProfile;
  onRoleChange?: (role: UserRole) => void;
  onOpenAuth?: () => void;
  onOpenSearch?: () => void;
  activeAlertsCount?: number;
  pendingVerificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  userRole = 'IMD Analyst',
  userProfile,
  onRoleChange,
  onOpenAuth,
  onOpenSearch,
  activeAlertsCount = 4,
  pendingVerificationCount = 6,
}) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const currentRole: UserRole = userRole || userProfile?.role || 'IMD Analyst';
  const profile: UserProfile =
    userProfile || DEFAULT_USER_PROFILES[currentRole] || DEFAULT_USER_PROFILES['IMD Analyst'];

  const navLinks: { id: ActivePage; label: string; badge?: number }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'overview', label: 'Overview' },
    { id: 'monitor', label: 'Live Monitor' },
    { id: 'reports', label: 'Reports' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'geospatial', label: 'India Map' },
    { id: 'verification', label: 'Verification', badge: pendingVerificationCount },
    { id: 'sources', label: 'Sources' },
    { id: 'citizen-report', label: 'Citizen Report' },
    { id: 'alerts', label: 'Alerts', badge: activeAlertsCount },
  ];

  const adminLinks: { id: ActivePage; label: string; badge?: number }[] = [
    { id: 'admin-dashboard', label: 'Admin Dashboard' },
    { id: 'admin-verification', label: 'Verification Workspace', badge: pendingVerificationCount },
    { id: 'source-management', label: 'Source Management' },
    { id: 'system-health', label: 'System Health' },
    { id: 'audit-logs', label: 'Audit Logs' },
  ];

  const isAdminSectionActive = [
    'admin-dashboard',
    'admin-verification',
    'source-management',
    'system-health',
    'audit-logs',
  ].includes(activePage);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#D8EAF0]/80 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="navbar-brand-logo"
          onClick={() => onNavigate('overview')}
          className="cursor-pointer flex-shrink-0"
        >
          <WeatherIntelLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#087E9B] bg-[#EAF7FD] font-semibold shadow-xs'
                    : 'text-[#12313D] hover:text-[#087E9B] hover:bg-white/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      item.id === 'alerts'
                        ? 'bg-[#E45C5C] text-white'
                        : 'bg-[#087E9B] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5BBFEF] rounded-full" />
                )}
              </button>
            );
          })}

          {/* Admin Dropdown */}
          <div className="relative ml-1">
            <button
              id="nav-admin-dropdown"
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                isAdminSectionActive
                  ? 'text-[#07556B] bg-[#EAF7FD] font-semibold border border-[#D8EAF0]'
                  : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/60'
              }`}
            >
              <Shield className="w-4 h-4 text-[#087E9B]" />
              <span>Admin</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isAdminMenuOpen && (
              <div
                id="admin-menu-popover"
                className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl py-2 shadow-xl border border-[#D8EAF0] z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsAdminMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#607B86] border-b border-[#D8EAF0]/60">
                  Command & Controls
                </div>
                {adminLinks.map((adm) => (
                  <button
                    key={adm.id}
                    id={`admin-nav-${adm.id}`}
                    onClick={() => {
                      onNavigate(adm.id);
                      setIsAdminMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      activePage === adm.id
                        ? 'text-[#087E9B] bg-[#EAF7FD] font-semibold'
                        : 'text-[#12313D] hover:bg-white/80'
                    }`}
                  >
                    <span>{adm.label}</span>
                    {adm.badge !== undefined && adm.badge > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#E7A23B] text-white">
                        {adm.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Subtle Live Data Pulse Pill */}
          <div
            id="live-data-status-pill"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7FD] border border-[#5BBFEF]/40 shadow-xs"
            title="Real-Time Data Ingestion Active via IMD & CWC Gateway"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25BFA5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25BFA5]" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-[#07556B]">
              LIVE DATA
            </span>
          </div>

          {/* Quick Search */}
          <button
            id="global-search-btn"
            onClick={onOpenSearch || (() => onNavigate('overview'))}
            className="p-2 rounded-xl text-[#607B86] hover:text-[#12313D] hover:bg-white/70 transition-colors border border-transparent hover:border-[#D8EAF0]"
            aria-label="Search reports and locations"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Alerts Bell */}
          <button
            id="global-alerts-btn"
            onClick={() => onNavigate('alerts')}
            className="relative p-2 rounded-xl text-[#607B86] hover:text-[#12313D] hover:bg-white/70 transition-colors border border-transparent hover:border-[#D8EAF0]"
            aria-label="Disaster Alerts"
          >
            <Bell className="w-4.5 h-4.5" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E45C5C] ring-2 ring-white" />
            )}
          </button>

          {/* Full Website Dark / Light Mode Switcher */}
          <button
            id="global-theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
              isDark
                ? 'bg-[#102937] text-[#5BBFEF] border-[#1E4357] hover:bg-[#16374A] hover:text-white shadow-xs'
                : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/70 border-transparent hover:border-[#D8EAF0]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Full Website)'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-[#F6C343] transition-transform hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-[#4D6D7D] transition-transform hover:-rotate-12 duration-300" />
            )}
          </button>

          {/* Role Pill & Profile */}
          <button
            id="user-profile-btn"
            onClick={onOpenAuth || (() => onNavigate('auth'))}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/70 hover:bg-white border border-[#D8EAF0] hover:border-[#5BBFEF]/60 transition-all text-left shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center font-bold text-xs border border-[#5BBFEF]/30">
              {(profile?.name || 'User').charAt(0)}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-[#12313D] leading-tight">
                {profile?.name || 'Authorized User'}
              </span>
              <span className="text-[10px] font-medium text-[#087E9B] leading-tight">
                {profile?.role || currentRole}
              </span>
            </div>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-[#12313D] hover:bg-white/70 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="xl:hidden glass-dropdown border-t border-[#D8EAF0] px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto"
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#607B86] px-2">
            Main Navigation
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                  activePage === item.id
                    ? 'bg-[#EAF7FD] text-[#087E9B] font-semibold border border-[#D8EAF0]'
                    : 'text-[#12313D] hover:bg-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#E45C5C] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D8EAF0] text-[11px] font-semibold uppercase tracking-wider text-[#607B86] px-2">
            Administration & Verification
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {adminLinks.map((adm) => (
              <button
                key={adm.id}
                onClick={() => {
                  onNavigate(adm.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                  activePage === adm.id
                    ? 'bg-[#EAF7FD] text-[#087E9B] font-semibold border border-[#D8EAF0]'
                    : 'text-[#12313D] hover:bg-white'
                }`}
              >
                <span>{adm.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Theme Switcher Row */}
          <div className="pt-3 mt-2 border-t border-[#D8EAF0] flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-[#5BBFEF]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F5B041]" />
              )}
              <span className="text-xs font-semibold text-[#12313D]">
                Appearance: {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              id="mobile-theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#122A38] text-[#5BBFEF] border-[#1D4054]'
                  : 'bg-[#EAF7FD] text-[#087E9B] border-[#5BBFEF]/40'
              }`}
            >
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
