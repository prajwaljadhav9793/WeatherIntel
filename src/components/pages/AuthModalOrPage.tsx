import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Users,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  User as UserIcon,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  LogIn,
  UserPlus,
  Radio,
  Check,
  Globe,
  Compass,
} from 'lucide-react';

interface AuthModalOrPageProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AuthModalOrPage: React.FC<AuthModalOrPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onClose,
}) => {
  const { login, register, loginWithGoogle, quickDemoLogin, isLoading, isFirebaseCloud } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('analyst.deshmukh@imd.gov.in');
  const [password, setPassword] = useState('imd12345');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('IMD Analyst');
  const [organization, setOrganization] = useState('India Meteorological Department (IMD)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

  // Keep internal mode in sync when initialMode prop updates
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setErrorMessage(null);
    }
  }, [initialMode]);

  // Adjust default organization and email sample when role changes in register mode
  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'IMD Analyst') {
      setOrganization('India Meteorological Department (IMD)');
      if (!name) setName('Dr. Rajiv Sengupta');
      if (!email || email.includes('@')) setEmail('analyst.sengupta@imd.gov.in');
    } else if (newRole === 'Admin') {
      setOrganization('State Disaster Management Authority (SDMA)');
      if (!name) setName('Director Ananya Sen');
      if (!email || email.includes('@')) setEmail('director.sdma@gov.in');
    } else {
      setOrganization('Citizen Weather Observer Network');
      if (!name) setName('Kavita Nair');
      if (!email || email.includes('@')) setEmail('kavita.nair@gmail.com');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login(email, password);
      setSuccessName(email);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name & designation.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid official or personal email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        organization: organization.trim() || undefined,
      });
      setSuccessName(name.trim());
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account with this email already exists.');
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setErrorMessage(null);
    try {
      await quickDemoLogin(demoRole);
      setSuccessName(demoRole);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize demo persona.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      await loginWithGoogle(role);
      setSuccessName('Google Account');
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed.');
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: 'bg-gray-200' };
    if (password.length < 6) return { label: 'Too short', score: 1, color: 'bg-red-500' };
    if (password.length < 8) return { label: 'Medium', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl border border-[#D8EAF0] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative animate-in fade-in zoom-in-95 duration-200">
      {/* LEFT ATMOSPHERIC COMMAND PANEL */}
      <div className="md:col-span-5 atmospheric-bg p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D8EAF0] relative overflow-hidden">
        {/* Animated Radar Pulse concentric circles */}
        <div className="absolute top-1/4 -right-16 w-72 h-72 rounded-full border border-[#5BBFEF]/30 pointer-events-none animate-ping opacity-25" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#5BBFEF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-0 w-64 h-64 bg-[#087E9B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#D8EAF0] text-[11px] font-bold text-[#07556B] shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25BFA5] animate-pulse" />
            <span>Official IMD & MoES Gateway</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12313D] tracking-tight leading-snug">
              WEATHERINTEL <br />
              <span className="text-[#087E9B]">INDIA PORTAL</span>
            </h2>
            <p className="text-xs text-[#607B86] mt-2 leading-relaxed font-medium">
              National Big Data Meteorological Ingestion, AI Verification & Disaster Alerting Grid.
            </p>
          </div>

          {/* Interactive Role Matrix Cards */}
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="font-bold text-[#12313D] uppercase tracking-wider text-[10px] text-[#087E9B] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Role Permissions Matrix</span>
            </div>

            <div
              onClick={() => mode === 'register' && handleRoleSelect('IMD Analyst')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                role === 'IMD Analyst' && mode === 'register'
                  ? 'bg-white border-[#087E9B] shadow-sm ring-1 ring-[#087E9B]'
                  : 'bg-white/70 hover:bg-white border-[#D8EAF0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#12313D] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EAF7FD] text-[#087E9B] flex items-center justify-center font-bold text-xs">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>IMD Analyst / Meteorologist</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF7FD] text-[#087E9B]">
                  Duty Officer
                </span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-1.5 leading-relaxed pl-8">
                Triage AI flags, verify ground reports, AWS sensor cross-checks, and duplicate clustering.
              </p>
            </div>

            <div
              onClick={() => mode === 'register' && handleRoleSelect('Admin')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                role === 'Admin' && mode === 'register'
                  ? 'bg-white border-[#E7A23B] shadow-sm ring-1 ring-[#E7A23B]'
                  : 'bg-white/70 hover:bg-white border-[#D8EAF0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#12313D] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FEF9E7] text-[#E7A23B] flex items-center justify-center font-bold text-xs">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <span>NDMA / SDMA Admin</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#E7A23B]">
                  Command
                </span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-1.5 leading-relaxed pl-8">
                Dispatch Common Alerting Protocol (CAP) emergency warnings, manage data feeds & audit logs.
              </p>
            </div>

            <div
              onClick={() => mode === 'register' && handleRoleSelect('Citizen')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                role === 'Citizen' && mode === 'register'
                  ? 'bg-white border-[#2AA66F] shadow-sm ring-1 ring-[#2AA66F]'
                  : 'bg-white/70 hover:bg-white border-[#D8EAF0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#12313D] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EAFBF3] text-[#2AA66F] flex items-center justify-center font-bold text-xs">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>Citizen Field Observer</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAFBF3] text-[#2AA66F]">
                  Public
                </span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-1.5 leading-relaxed pl-8">
                Submit geo-tagged weather observations, access interactive Doppler radar & local alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Gateway Security Details */}
        <div className="relative z-10 pt-6 border-t border-[#D8EAF0]/80 text-[11px] text-[#607B86] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#25BFA5]" />
            <span>256-Bit Encrypted Session</span>
          </div>
          <span className="font-mono text-[10px] text-[#07556B]">v2.4.1 SECURE</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION & REGISTRATION FORM PANEL */}
      <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
        <div>
          {/* Top Header & Mode Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D8EAF0]">
            <div className="flex items-center gap-1 p-1 bg-[#F0F8FB] rounded-2xl border border-[#D8EAF0]">
              <button
                type="button"
                id="auth-tab-signin"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-[#087E9B] text-white shadow-md'
                    : 'text-[#607B86] hover:text-[#12313D]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                id="auth-tab-register"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-[#087E9B] text-white shadow-md'
                    : 'text-[#607B86] hover:text-[#12313D]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-[#607B86] hover:text-[#12313D] px-2.5 py-1.5 rounded-xl hover:bg-[#F5FAFC] transition-colors"
              >
                Exit
              </button>
            )}
          </div>

          {/* Subtitle Banner */}
          <div className="mt-3">
            <h3 className="text-lg font-black text-[#12313D]">
              {mode === 'login' ? 'Sign In to Your Station' : 'Register Official Account'}
            </h3>
            <p className="text-xs text-[#607B86] mt-0.5">
              {mode === 'login'
                ? 'Authenticate to unlock the live radar grid, AI verification, and operational modules.'
                : 'Join the national network as a meteorologist, disaster administrator, or citizen observer.'}
            </p>
          </div>

          {/* Firebase Authentication Status Pill */}
          <div className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F0F8FB] border border-[#D8EAF0] text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-[#12313D]">
                {isFirebaseCloud ? 'Google Firebase Cloud Active' : 'Firebase Hybrid Auth Protocol'}
              </span>
            </div>
            <span className="text-[10px] text-[#087E9B] font-bold">
              Identity Toolkit v1
            </span>
          </div>

          {/* Google Sign-In Button */}
          <div className="mt-3">
            <button
              type="button"
              id="google-signin-btn"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D8EAF0] hover:border-[#4285F4] bg-white hover:bg-[#F8FAFF] text-[#12313D] font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2.5 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-2.5 items-center">
            <div className="flex-grow border-t border-[#D8EAF0]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider font-bold text-[#607B86]">
              or authenticate with credentials
            </span>
            <div className="flex-grow border-t border-[#D8EAF0]" />
          </div>

          {/* Instant 1-Click Demo Personas Bar */}
          <div className="mt-1 p-3.5 rounded-2xl bg-gradient-to-r from-[#EAF7FD] to-[#F2FAFD] border border-[#5BBFEF]/40 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#07556B] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#F5B041] fill-[#F5B041]" />
                Instant 1-Click Demo Evaluation:
              </span>
              <span className="text-[10px] font-semibold text-[#087E9B] bg-white px-2 py-0.5 rounded-full border border-[#D8EAF0]">
                Instant Access
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="demo-login-analyst"
                disabled={isLoading}
                onClick={() => handleQuickDemo('IMD Analyst')}
                className="p-2.5 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#087E9B] hover:shadow-sm text-left transition-all group"
              >
                <div className="text-[11px] font-extrabold text-[#12313D] group-hover:text-[#087E9B] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#087E9B]" />
                  <span>IMD Analyst</span>
                </div>
                <div className="text-[9px] text-[#607B86] truncate mt-0.5 font-medium">Duty Officer</div>
              </button>

              <button
                type="button"
                id="demo-login-admin"
                disabled={isLoading}
                onClick={() => handleQuickDemo('Admin')}
                className="p-2.5 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#E7A23B] hover:shadow-sm text-left transition-all group"
              >
                <div className="text-[11px] font-extrabold text-[#12313D] group-hover:text-[#E7A23B] flex items-center gap-1">
                  <Building className="w-3 h-3 text-[#E7A23B]" />
                  <span>NDMA Admin</span>
                </div>
                <div className="text-[9px] text-[#607B86] truncate mt-0.5 font-medium">National Command</div>
              </button>

              <button
                type="button"
                id="demo-login-citizen"
                disabled={isLoading}
                onClick={() => handleQuickDemo('Citizen')}
                className="p-2.5 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#2AA66F] hover:shadow-sm text-left transition-all group"
              >
                <div className="text-[11px] font-extrabold text-[#12313D] group-hover:text-[#2AA66F] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#2AA66F]" />
                  <span>Citizen</span>
                </div>
                <div className="text-[9px] text-[#607B86] truncate mt-0.5 font-medium">Field Observer</div>
              </button>
            </div>
          </div>

          {/* Feedback error alert */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Screen */}
          {isSuccess ? (
            <div className="my-8 p-8 rounded-2xl bg-[#2AA66F]/10 border border-[#2AA66F]/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-[#2AA66F]/20 text-[#2AA66F] flex items-center justify-center mx-auto ring-8 ring-[#2AA66F]/10">
                <CheckCircle className="w-8 h-8 text-[#2AA66F] animate-bounce" />
              </div>
              <h4 className="font-extrabold text-lg text-[#12313D]">
                Authentication Verified!
              </h4>
              <p className="text-xs text-[#607B86] max-w-sm mx-auto">
                Welcome to WeatherIntel India, <span className="font-bold text-[#12313D]">{successName}</span>. Unlocking live Doppler telemetry, AI verification, and modules...
              </p>
              <div className="w-32 h-1.5 bg-[#2AA66F]/20 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#2AA66F] animate-pulse rounded-full w-full" />
              </div>
            </div>
          ) : mode === 'login' ? (
            /* ========================================================================= */
            /* SIGN IN FORM                                                              */
            /* ========================================================================= */
            <form onSubmit={handleLogin} className="mt-4 space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#12313D]">
                    Official Identifier / Email
                  </label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('analyst.deshmukh@imd.gov.in');
                        setPassword('imd12345');
                      }}
                      className="text-[#087E9B] hover:underline font-semibold"
                    >
                      Fill IMD
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('commissioner@ndma.gov.in');
                        setPassword('admin12345');
                      }}
                      className="text-[#087E9B] hover:underline font-semibold"
                    >
                      Fill Admin
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('aarav.sharma@gmail.com');
                        setPassword('citizen12345');
                      }}
                      className="text-[#087E9B] hover:underline font-semibold"
                    >
                      Fill Citizen
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    id="login-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@imd.gov.in"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12313D] mb-1">
                  Security Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#607B86] hover:text-[#12313D] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember session checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#607B86] hover:text-[#12313D]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D8EAF0] text-[#087E9B] focus:ring-[#087E9B]"
                  />
                  <span>Remember session on this device</span>
                </label>

                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#087E9B] hover:text-[#07556B] hover:underline"
                >
                  Need an account?
                </button>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-xs shadow-md shadow-[#087E9B]/25 transition-all flex items-center justify-center gap-2 hover:gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Enter Command Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#607B86]">Don't have an official account? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs font-bold text-[#087E9B] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* CREATE ACCOUNT / REGISTER FORM                                            */
            /* ========================================================================= */
            <form onSubmit={handleRegister} className="mt-4 space-y-3.5">
              {/* Visual Role Category Selection (Cards) */}
              <div>
                <label className="block text-xs font-bold text-[#12313D] mb-1.5">
                  Select Your Operational Role Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('Citizen')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'Citizen'
                        ? 'bg-[#EAFBF3] border-[#2AA66F] shadow-2xs ring-1 ring-[#2AA66F]'
                        : 'bg-[#F5FAFC] border-[#D8EAF0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#12313D]">Citizen</span>
                      {role === 'Citizen' && <Check className="w-3.5 h-3.5 text-[#2AA66F]" />}
                    </div>
                    <div className="text-[10px] text-[#607B86] mt-0.5 leading-tight">Field Reporter</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('IMD Analyst')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'IMD Analyst'
                        ? 'bg-[#EAF7FD] border-[#087E9B] shadow-2xs ring-1 ring-[#087E9B]'
                        : 'bg-[#F5FAFC] border-[#D8EAF0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#12313D]">IMD Analyst</span>
                      {role === 'IMD Analyst' && <Check className="w-3.5 h-3.5 text-[#087E9B]" />}
                    </div>
                    <div className="text-[10px] text-[#607B86] mt-0.5 leading-tight">Duty Officer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('Admin')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'Admin'
                        ? 'bg-[#FEF9E7] border-[#E7A23B] shadow-2xs ring-1 ring-[#E7A23B]'
                        : 'bg-[#F5FAFC] border-[#D8EAF0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#12313D]">NDMA Admin</span>
                      {role === 'Admin' && <Check className="w-3.5 h-3.5 text-[#E7A23B]" />}
                    </div>
                    <div className="text-[10px] text-[#607B86] mt-0.5 leading-tight">Command Authority</div>
                  </button>
                </div>
              </div>

              {/* Full Name & Designation */}
              <div>
                <label className="block text-xs font-bold text-[#12313D] mb-1">
                  Full Name & Designation
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="register-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Verma (Lead Meteorologist)"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email & Organization Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#12313D] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      id="register-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.gov.in"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12313D] mb-1">
                    Affiliated Organization
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="register-org-input"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. State Disaster Management Cell"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Strength Meter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#12313D]">
                    Create Security Key / Password
                  </label>
                  {password && (
                    <span className="text-[10px] font-bold text-[#607B86]">
                      Strength: <strong className="text-[#12313D]">{strength.label}</strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#607B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="register-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 alphanumeric characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] focus:ring-2 focus:ring-[#5BBFEF]/20 text-[#12313D] font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#607B86] hover:text-[#12313D] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength mini bar */}
                {password && (
                  <div className="flex gap-1 mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.score >= 1 ? strength.color : 'bg-transparent'} w-1/3`} />
                    <div className={`h-full rounded-full transition-all ${strength.score >= 2 ? strength.color : 'bg-transparent'} w-1/3`} />
                    <div className={`h-full rounded-full transition-all ${strength.score >= 3 ? strength.color : 'bg-transparent'} w-1/3`} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="register-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-xs shadow-md shadow-[#087E9B]/25 transition-all flex items-center justify-center gap-2 hover:gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Official Session...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration & Access Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#607B86]">Already registered an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-[#087E9B] hover:underline"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security & Protocol Compliance Footer */}
        <div className="mt-5 pt-3 border-t border-[#D8EAF0] flex items-center justify-between text-[10px] text-[#607B86]">
          <span>IMD Meteorological Telemetry Standard</span>
          <span className="font-semibold text-[#07556B]">MoES Verified Gateway</span>
        </div>
      </div>
    </div>
  );
};
