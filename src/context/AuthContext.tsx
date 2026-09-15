import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { loginUserApi, registerUserApi } from '../services/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'weatherintel_auth_session';

const DEMO_PERSONAS: Record<UserRole, { profile: UserProfile; pass: string }> = {
  'IMD Analyst': {
    profile: {
      name: 'Dr. Priya Deshmukh',
      email: 'analyst.deshmukh@imd.gov.in',
      role: 'IMD Analyst',
      organization: 'India Meteorological Department (IMD)',
    },
    pass: 'imd12345',
  },
  Admin: {
    profile: {
      name: 'Commissioner Roy',
      email: 'commissioner@ndma.gov.in',
      role: 'Admin',
      organization: 'National Disaster Management Authority (NDMA)',
    },
    pass: 'admin12345',
  },
  Citizen: {
    profile: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      role: 'Citizen',
      organization: 'Citizen Weather Observer Network',
    },
    pass: 'citizen12345',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('[Auth] Failed to restore session from storage:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {
      console.warn('[Auth] Could not persist session:', e);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUserApi({ email, password });
      saveSession(res.user);
    } catch (err: any) {
      // Fallback check if user typed demo email/pass locally
      const matchingDemo = Object.values(DEMO_PERSONAS).find(
        (d) => d.profile.email.toLowerCase() === email.trim().toLowerCase() && d.pass === password
      );
      if (matchingDemo) {
        saveSession(matchingDemo.profile);
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await registerUserApi(data);
      saveSession(res.user);
    } catch (err: any) {
      // If backend network error, still register offline gracefully for testing
      if (err.message && err.message.includes('fetch')) {
        const offlineProfile: UserProfile = {
          name: data.name,
          email: data.email,
          role: data.role,
          organization: data.organization || 'WeatherIntel Observer Network',
        };
        saveSession(offlineProfile);
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    const demo = DEMO_PERSONAS[role];
    try {
      const res = await loginUserApi({ email: demo.profile.email, password: demo.pass });
      saveSession(res.user);
    } catch {
      // Local fallback for offline/instant testing
      saveSession(demo.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[Auth] Error clearing session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
