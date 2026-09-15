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
  Lock,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { ActivePage, UserProfile, UserRole } from '../../types';
import { WeatherIntelLogo } from './WeatherIntelLogo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
  onOpenSearch?: () => void;
  activeAlertsCount?: number;
  pendingVerificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  userRole,
  userProfile,
  onOpenAuth,
  onOpenSearch,
  activeAlertsCount = 4,
  pendingVerificationCount = 6,
}) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  const currentRole: UserRole = user?.role || userRole || userProfile?.role || 'IMD Analyst';
  const profile: UserProfile =
    user || userProfile || DEFAULT_USER_PROFILES[currentRole] || DEFAULT_USER_PROFILES['IMD Analyst'];

  // Modules visible ONLY when authenticated
  const authenticatedNavLinks: { id: ActivePage; label: string; badge?: number }[] = [
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

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#D8EAF0]/80 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="navbar-brand-logo"
          onClick={() => onNavigate(isAuthenticated ? 'overview' : 'landing')}
          className="cursor-pointer flex-shrink-0"
        >
          <WeatherIntelLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        {isAuthenticated ? (
          <nav className="hidden xl:flex items-center gap-1">
            {authenticatedNavLinks.map((item) => {
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
            {(currentRole === 'Admin' || currentRole === 'IMD Analyst') && (
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
            )}
          </nav>
        ) : (
          /* Public Unauthenticated Navigation */
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activePage === 'landing'
                  ? 'text-[#087E9B] bg-[#EAF7FD]'
                  : 'text-[#607B86] hover:text-[#12313D]'
              }`}
            >
              Portal Home
            </button>
            <span className="text-xs text-[#D8EAF0]">•</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7FD] border border-[#5BBFEF]/40 text-xs font-bold text-[#07556B]">
              <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
              <span>National Big Data Platform</span>
            </div>
          </nav>
        )}

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Live Data Pulse Pill */}
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
            </>
          ) : null}

          {/* Light / Dark Mode Switcher */}
          <button
            id="global-theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
              isDark
                ? 'bg-[#102937] text-[#5BBFEF] border-[#1E4357] hover:bg-[#16374A] hover:text-white shadow-xs'
                : 'text-[#607B86] hover:text-[#12313D] hover:bg-white/70 border-transparent hover:border-[#D8EAF0]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-[#F6C343] transition-transform hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-[#4D6D7D] transition-transform hover:-rotate-12 duration-300" />
            )}
          </button>

          {/* User Profile / Auth State Pill */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                id="user-profile-btn"
                onClick={() => onNavigate('auth')}
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

              {/* Logout Button */}
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                className="p-2 rounded-xl text-[#607B86] hover:text-[#E45C5C] hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated Login / Register Buttons */
            <div className="flex items-center gap-2">
              <button
                id="nav-signin-btn"
                onClick={() => onOpenAuth ? onOpenAuth('login') : onNavigate('auth')}
                className="px-3.5 py-2 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                id="nav-register-btn"
                onClick={() => onOpenAuth ? onOpenAuth('register') : onNavigate('auth')}
                className="hidden sm:flex px-3 py-2 rounded-xl bg-white hover:bg-[#F5FAFC] text-[#12313D] text-xs font-bold border border-[#D8EAF0] hover:border-[#087E9B] transition-all items-center gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#087E9B]" />
                <span>Register</span>
              </button>
            </div>
          )}

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
          className="xl:hidden glass-dropdown border-t border-[#D8EAF0] px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto"
        >
          {isAuthenticated ? (
            <>
              {/* User Profile Bar in Mobile Menu */}
              <div className="p-3 rounded-2xl bg-[#EAF7FD] border border-[#5BBFEF]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#087E9B] text-white flex items-center justify-center font-bold text-xs">
                    {(profile?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#12313D]">{profile?.name}</div>
                    <div className="text-[10px] text-[#087E9B] font-semibold">{profile?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#607B86] px-1">
                Operational Modules
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {authenticatedNavLinks.map((item) => (
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

              {(currentRole === 'Admin' || currentRole === 'IMD Analyst') && (
                <>
                  <div className="pt-2 border-t border-[#D8EAF0] text-[11px] font-semibold uppercase tracking-wider text-[#607B86] px-1">
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
                </>
              )}
            </>
          ) : (
            /* Unauthenticated Mobile View */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#EAF7FD] border border-[#5BBFEF]/40 text-center space-y-2">
                <div className="text-xs font-bold text-[#07556B]">
                  Welcome to WeatherIntel India
                </div>
                <p className="text-[11px] text-[#607B86]">
                  Sign in with your credentials or register to view live modules, maps, and reports.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#087E9B] text-white text-xs font-bold"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth('register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#D8EAF0] text-[#12313D] text-xs font-bold"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}

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
