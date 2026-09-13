import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Shield,
  Users,
  Eye,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalOrPageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onClose?: () => void;
}

export const AuthModalOrPage: React.FC<AuthModalOrPageProps> = ({
  currentRole,
  onRoleChange,
  onClose,
}) => {
  const [email, setEmail] = useState('officer.deshmukh@imd.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>(currentRole);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRoleChange(role);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl border border-[#D8EAF0] shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12">
      {/* Left Atmospheric Visual Panel */}
      <div className="md:col-span-5 atmospheric-bg p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D8EAF0] relative">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#D8EAF0] text-xs font-semibold text-[#07556B]">
            <span className="w-2 h-2 rounded-full bg-[#25BFA5] animate-ping" />
            <span>National Geospatial Gateway</span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#12313D] tracking-tight leading-snug">
            WEATHERINTEL <br />
            <span className="text-[#087E9B]">INDIA</span>
          </h2>
          <p className="text-xs text-[#607B86] leading-relaxed">
            Authorized portal for IMD meteorologists, disaster management commissioners, and citizen
            observers.
          </p>
        </div>

        {/* Role Descriptions */}
        <div className="space-y-2 pt-6 border-t border-[#D8EAF0]/60 text-xs text-[#607B86]">
          <div className="font-semibold text-[#12313D] mb-1">Role Privileges:</div>
          <div>• <strong>Citizen:</strong> Report observations, monitor radar</div>
          <div>• <strong>IMD Analyst:</strong> Triage AI flags, verify ground reports</div>
          <div>• <strong>National Admin:</strong> Full command, dispatch CAP alerts</div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:col-span-7 p-8 bg-white/90 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#12313D]">
            Access Portal & Role Switcher
          </h3>
          <p className="text-xs text-[#607B86] mt-0.5">
            Switch your profile persona to test multi-role governance.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-[#2AA66F]/10 border border-[#2AA66F]/30 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle className="w-8 h-8 text-[#2AA66F] mx-auto" />
            <h4 className="font-bold text-sm text-[#12313D]">
              Signed in as {role}
            </h4>
            <p className="text-xs text-[#607B86]">
              Session authenticated under Ministry of Earth Sciences standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Persona / Role Selector */}
            <div>
              <label className="block text-xs font-bold text-[#12313D] uppercase tracking-wider mb-2">
                Select Persona Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Citizen', 'IMD Analyst', 'Admin'] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => {
                      setRole(r);
                      if (r === 'Citizen') setEmail('aarav.sharma@gmail.com');
                      if (r === 'IMD Analyst') setEmail('analyst.roy@imd.gov.in');
                      if (r === 'Admin') setEmail('commissioner@ndma.gov.in');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      role === r
                        ? 'bg-[#087E9B] text-white border-[#087E9B] shadow-2xs'
                        : 'bg-white text-[#12313D] border-[#D8EAF0] hover:bg-[#EAF7FD]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#607B86] mb-1">
                Official Identifier / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#607B86] mb-1">
                Security Key / OTP
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#607B86] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5FAFC] rounded-xl border border-[#D8EAF0] focus:outline-none focus:border-[#5BBFEF] text-[#12313D]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#087E9B] hover:bg-[#07556B] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Authenticate as {role}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
