import { UserProfile, UserRole } from '../types';
import { loginUserApi, registerUserApi } from './api';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface FirebaseAuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  idToken: string;
  role: UserRole;
  organization: string;
  providerId: 'firebase.password' | 'google.com' | 'weatherintel.gov';
  createdAt: string;
}

// Read from Vite environment variables (e.g. set in .env.local)
const metaEnv = (import.meta as any).env || {};
const envApiKey = metaEnv.VITE_FIREBASE_API_KEY || '';
const envAuthDomain = metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '';
const envProjectId = metaEnv.VITE_FIREBASE_PROJECT_ID || '';

export const defaultFirebaseConfig: FirebaseConfig = {
  apiKey: envApiKey,
  authDomain: envAuthDomain || `${envProjectId || 'weatherintel-imd'}.firebaseapp.com`,
  projectId: envProjectId || 'weatherintel-imd',
};

export function isFirebaseCloudConfigured(): boolean {
  return Boolean(envApiKey && envApiKey.length > 10);
}

const FIREBASE_REST_BASE = 'https://identitytoolkit.googleapis.com/v1/accounts';

/**
 * Sign In with Email and Password
 * Uses live Google Firebase Identity Toolkit REST API when VITE_FIREBASE_API_KEY is configured,
 * with automatic zero-configuration fallback to WeatherIntel SQLite backend.
 */
export async function firebaseSignInWithEmail(
  email: string,
  pass: string
): Promise<FirebaseAuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  // If live Firebase API key is supplied, query Google Identity Toolkit directly
  if (isFirebaseCloudConfigured()) {
    try {
      const res = await fetch(`${FIREBASE_REST_BASE}:signInWithPassword?key=${defaultFirebaseConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: pass,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.error?.message || 'Firebase authentication failed.';
        if (message.includes('EMAIL_NOT_FOUND')) throw new Error('No user account found with this email.');
        if (message.includes('INVALID_PASSWORD')) throw new Error('Incorrect security password entered.');
        throw new Error(message);
      }

      // Query local user metadata for role/org or infer from email
      const inferredRole: UserRole = normalizedEmail.includes('admin')
        ? 'Admin'
        : normalizedEmail.includes('imd') || normalizedEmail.includes('analyst')
        ? 'IMD Analyst'
        : 'Citizen';

      return {
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || data.email.split('@')[0],
        emailVerified: true,
        idToken: data.idToken,
        role: inferredRole,
        organization: inferredRole === 'IMD Analyst' ? 'IMD Meteorological Center' : inferredRole === 'Admin' ? 'NDMA Command' : 'Citizen Observer',
        providerId: 'firebase.password',
        createdAt: new Date().toISOString(),
      };
    } catch (firebaseErr: any) {
      // If network fails or project misconfigured, gracefully fallback to our backend
      console.warn('[Firebase Auth] Cloud API query error, checking local gateway:', firebaseErr);
      if (!firebaseErr.message.includes('Failed to fetch')) {
        throw firebaseErr;
      }
    }
  }

  // Fallback / Standard Gateway: Authenticate with WeatherIntel backend SQLite
  const localRes = await loginUserApi({ email: normalizedEmail, password: pass });
  return {
    uid: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: localRes.user.email,
    displayName: localRes.user.name,
    emailVerified: true,
    idToken: localRes.token,
    role: localRes.user.role,
    organization: localRes.user.organization,
    providerId: 'firebase.password',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Sign Up / Register with Email and Password
 */
export async function firebaseSignUpWithEmail(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
}): Promise<FirebaseAuthUser> {
  const normalizedEmail = params.email.trim().toLowerCase();

  // If live Firebase API key configured, register directly with Google Identity Toolkit
  if (isFirebaseCloudConfigured()) {
    try {
      const res = await fetch(`${FIREBASE_REST_BASE}:signUp?key=${defaultFirebaseConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: params.password,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.error?.message || 'Firebase registration error.';
        if (message.includes('EMAIL_EXISTS')) throw new Error('An account with this email address already exists. Please sign in.');
        throw new Error(message);
      }

      // Update Display Name in Firebase
      try {
        await fetch(`${FIREBASE_REST_BASE}:update?key=${defaultFirebaseConfig.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: data.idToken,
            displayName: params.name.trim(),
            returnSecureToken: false,
          }),
        });
      } catch (e) {
        console.warn('[Firebase] Could not set display name in cloud:', e);
      }

      // Also mirror into local backend for server-side audit logs
      try {
        await registerUserApi({
          name: params.name,
          email: normalizedEmail,
          password: params.password,
          role: params.role,
          organization: params.organization,
        });
      } catch (e) {
        console.warn('[Firebase Sync] Server mirroring notice:', e);
      }

      return {
        uid: data.localId,
        email: data.email,
        displayName: params.name.trim(),
        emailVerified: false,
        idToken: data.idToken,
        role: params.role,
        organization: params.organization || 'WeatherIntel Network',
        providerId: 'firebase.password',
        createdAt: new Date().toISOString(),
      };
    } catch (cloudErr: any) {
      console.warn('[Firebase Auth] Cloud register error, trying local gateway:', cloudErr);
      if (!cloudErr.message.includes('Failed to fetch')) {
        throw cloudErr;
      }
    }
  }

  // Fallback / Standard: Register in SQLite database
  const localRes = await registerUserApi({
    name: params.name,
    email: normalizedEmail,
    password: params.password,
    role: params.role,
    organization: params.organization,
  });

  return {
    uid: `fb_usr_${Date.now()}`,
    email: localRes.user.email,
    displayName: localRes.user.name,
    emailVerified: true,
    idToken: localRes.token,
    role: localRes.user.role,
    organization: localRes.user.organization,
    providerId: 'firebase.password',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Sign In with Google (OAuth2 / Firebase Provider)
 */
export async function firebaseSignInWithGoogle(assignedRole: UserRole = 'Citizen'): Promise<FirebaseAuthUser> {
  // Simulate Google Account Auth popup for fast zero-friction testing
  const googleUser = {
    uid: `google_oauth_${Date.now()}`,
    email: assignedRole === 'IMD Analyst'
      ? 'priya.deshmukh@imd.gov.in'
      : assignedRole === 'Admin'
      ? 'commissioner.roy@ndma.gov.in'
      : 'aarav.sharma@gmail.com',
    displayName: assignedRole === 'IMD Analyst'
      ? 'Dr. Priya Deshmukh (Google SSO)'
      : assignedRole === 'Admin'
      ? 'Commissioner Roy (Google SSO)'
      : 'Aarav Sharma (Google SSO)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    emailVerified: true,
    idToken: `firebase_google_jwt_${Date.now()}`,
    role: assignedRole,
    organization: assignedRole === 'IMD Analyst'
      ? 'India Meteorological Department (IMD)'
      : assignedRole === 'Admin'
      ? 'National Disaster Management Authority (NDMA)'
      : 'Citizen Weather Observer Network',
    providerId: 'google.com' as const,
    createdAt: new Date().toISOString(),
  };

  // Sync with local backend
  try {
    await registerUserApi({
      name: googleUser.displayName,
      email: googleUser.email,
      password: 'google_sso_oauth_token',
      role: googleUser.role,
      organization: googleUser.organization,
    });
  } catch {
    // If already registered, ignore conflict
  }

  return googleUser;
}
