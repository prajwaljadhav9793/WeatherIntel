import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  firebaseSignInWithEmail,
  firebaseSignUpWithEmail,
  firebaseSignInWithGoogle,
  isFirebaseCloudConfigured,
  FirebaseAuthUser,
} from '../services/firebaseAuth';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseCloud: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: (assignedRole?: UserRole) => Promise<void>;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFirebaseCloud = isFirebaseCloudConfigured();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
          setFirebaseUser({
            uid: parsed.token || 'stored_session',
            email: parsed.email,
            displayName: parsed.name,
            emailVerified: true,
            idToken: parsed.token || 'valid_token',
            role: parsed.role,
            organization: parsed.organization || '',
            providerId: 'firebase.password',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('[Auth] Failed to restore session from storage:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (fbUser: FirebaseAuthUser) => {
    const profile: UserProfile = {
      name: fbUser.displayName,
      email: fbUser.email,
      role: fbUser.role,
      organization: fbUser.organization,
      avatarUrl: fbUser.photoURL,
    };
    setUser(profile);
    setFirebaseUser(fbUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('[Auth] Could not persist session:', e);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseSignInWithEmail(email, password);
      saveSession(fbUser);
    } catch (err: any) {
      // Fallback check if user typed demo email/pass locally
      const matchingDemo = Object.values(DEMO_PERSONAS).find(
        (d) => d.profile.email.toLowerCase() === email.trim().toLowerCase() && d.pass === password
      );
      if (matchingDemo) {
        saveSession({
          uid: 'demo_user',
          email: matchingDemo.profile.email,
          displayName: matchingDemo.profile.name,
          emailVerified: true,
          idToken: 'demo_token',
          role: matchingDemo.profile.role,
          organization: matchingDemo.profile.organization,
          providerId: 'firebase.password',
          createdAt: new Date().toISOString(),
        });
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
      const fbUser = await firebaseSignUpWithEmail({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        organization: data.organization,
      });
      saveSession(fbUser);
    } catch (err: any) {
      // Offline graceful registration fallback
      if (err.message && (err.message.includes('fetch') || err.message.includes('Network'))) {
        saveSession({
          uid: `offline_${Date.now()}`,
          email: data.email,
          displayName: data.name,
          emailVerified: true,
          idToken: `offline_token_${Date.now()}`,
          role: data.role,
          organization: data.organization || 'WeatherIntel Observer Network',
          providerId: 'firebase.password',
          createdAt: new Date().toISOString(),
        });
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (assignedRole: UserRole = 'Citizen') => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseSignInWithGoogle(assignedRole);
      saveSession(fbUser);
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    const demo = DEMO_PERSONAS[role];
    try {
      const fbUser = await firebaseSignInWithEmail(demo.profile.email, demo.pass);
      saveSession(fbUser);
    } catch {
      saveSession({
        uid: `demo_${role.toLowerCase()}`,
        email: demo.profile.email,
        displayName: demo.profile.name,
        emailVerified: true,
        idToken: `demo_token_${Date.now()}`,
        role: demo.profile.role,
        organization: demo.profile.organization,
        providerId: 'firebase.password',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setFirebaseUser(null);
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
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        isFirebaseCloud,
        login,
        register,
        loginWithGoogle,
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
}
