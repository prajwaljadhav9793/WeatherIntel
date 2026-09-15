import React, { useState } from 'react';
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
} from 'lucide-react';

interface AuthModalOrPageProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AuthModalOrPage: React.FC<AuthModalOrPageProps> = ({
  onSuccess,
  onClose,
}) => {
  const { login, register, quickDemoLogin, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('analyst.deshmukh@imd.gov.in');
  const [password, setPassword] = useState('imd12345');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('IMD Analyst');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

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
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
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
      setErrorMessage(err.message || 'Registration failed. Email may already be in use.');
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

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl border border-[#D8EAF0] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative animate-in fade-in zoom-in-95 duration-200">
      {/* Left Atmospheric Government Protocol Panel */}
      <div className="md:col-span-5 atmospheric-bg p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D8EAF0] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5BBFEF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#D8EAF0] text-[11px] font-bold text-[#07556B]">
            <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
            <span>National Secure Gateway</span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#12313D] tracking-tight leading-snug">
              WEATHERINTEL <br />
              <span className="text-[#087E9B]">INDIA PORTAL</span>
            </h2>
            <p className="text-xs text-[#607B86] mt-2 leading-relaxed">
              Unified Big Data Meteorological Intelligence & Real-Time AI Verification Platform.
            </p>
          </div>

          {/* Persona Permissions Guide */}
          <div className="space-y-2.5 pt-4 text-xs">
            <div className="font-bold text-[#12313D] uppercase tracking-wider text-[10px] text-[#087E9B]">
              Role Access Matrix
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 border border-[#D8EAF0]/80">
              <div className="font-semibold text-[#12313D] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#087E9B]" />
                <span>IMD Meteorologist / Analyst</span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-0.5">
                Full AI triage, ground-truth sensor overrides, duplicate clustering, and verification.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 border border-[#D8EAF0]/80">
              <div className="font-semibold text-[#12313D] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#E7A23B]" />
                <span>NDMA National Admin</span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-0.5">
                Command dashboard, CAP disaster alerts, source ingestion governance, audit trails.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 border border-[#D8EAF0]/80">
              <div className="font-semibold text-[#12313D] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2AA66F]" />
                <span>Citizen Field Observer</span>
              </div>
              <p className="text-[11px] text-[#607B86] mt-0.5">
                Geo-tagged weather reporting, Doppler radar access, live alerts, and community feeds.
              </p>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 pt-6 border-t border-[#D8EAF0]/60 text-[11px] text-[#607B86] flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#25BFA5]" />
          <span>MoES & IMD Encrypted Protocol</span>
        </div>
      </div>

      {/* Right Interactive Auth Form Panel */}
      <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
        <div>
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D8EAF0]">
            <div className="flex items-center gap-1 p-1 bg-[#F0F8FB] rounded-xl border border-[#D8EAF0]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-[#087E9B] text-white shadow-xs'
                    : 'text-[#607B86] hover:text-[#12313D]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-[#087E9B] text-white shadow-xs'
                    : 'text-[#607B86] hover:text-[#12313D]'
                }`}
              >
                Create Account
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#607B86] hover:text-[#12313D] px-2 py-1"
              >
                Back to Landing
              </button>
            )}
          </div>

          {/* 1-Click Quick Demo Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-[#EAF7FD]/80 border border-[#5BBFEF]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#07556B] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#F5B041]" />
                Instant Demo Evaluation (1-Click Access)
              </span>
              <span className="text-[10px] text-[#607B86]">No typing required</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickDemo('IMD Analyst')}
                className="px-2 py-2 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#087E9B] hover:bg-[#EAF7FD] text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#12313D] group-hover:text-[#087E9B]">
                  IMD Analyst
                </div>
                <div className="text-[9px] text-[#607B86] truncate">Duty Meteorologist</div>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickDemo('Admin')}
                className="px-2 py-2 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#E7A23B] hover:bg-[#FEF9E7] text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#12313D] group-hover:text-[#E7A23B]">
                  NDMA Admin
                </div>
                <div className="text-[9px] text-[#607B86] truncate">National Command</div>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickDemo('Citizen')}
                className="px-2 py-2 rounded-xl bg-white border border-[#D8EAF0] hover:border-[#2AA66F] hover:bg-[#EAFBF3] text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#12313D] group-hover:text-[#2AA66F]">
                  Citizen
                </div>
                <div className="text-[9px] text-[#607B86] truncate">Field Reporter</div>
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

          {/* Success screen */}
          {isSuccess ? (
            <div className="my-8 p-6 rounded-2xl bg-[#2AA66F]/10 border border-[#2AA66F]/30 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle className="w-10 h-10 text-[#2AA66F] mx-auto animate-bounce" />
              <h4 className="font-bold text-base text-[#12313D]">
                Authentication Successful!
              </h4>
              <p className="text-xs text-[#607B86]">
                Welcome to WeatherIntel India. Unlocking modules & real-time telemetry...
              </p>
            </div>
          ) : mode === 'login' ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleLogin} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#12313D] mb-1">
                  Official Identifier / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@imd.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#12313D]">
                    Password / Security Key
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('analyst.deshmukh@imd.gov.in');
                      setPassword('imd12345');
                    }}
                    className="text-[10px] text-[#087E9B] hover:underline"
                  >
                    Use default test key
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#607B86] hover:text-[#12313D]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* --- REGISTER FORM --- */
            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#12313D] mb-1">
                  Full Name & Designation
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Verma"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#12313D] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@organization.gov.in"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12313D] mb-1">
                    Role Category
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  >
                    <option value="Citizen">Citizen Field Observer</option>
                    <option value="IMD Analyst">IMD Meteorologist / Analyst</option>
                    <option value="Admin">NDMA / SDMA National Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12313D] mb-1">
                  Affiliated Organization / Department (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Maharashtra State Disaster Cell"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12313D] mb-1">
                  Create Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-9 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#087E9B] text-[#12313D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#607B86] hover:text-[#12313D]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Official Account & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#D8EAF0] text-center text-[10px] text-[#607B86]">
          By authenticating, you adhere to the National Geospatial Data Guidelines & IMD Telemetry Protocols.
        </div>
      </div>
    </div>
  );
};
