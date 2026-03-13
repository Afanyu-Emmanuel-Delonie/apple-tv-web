import { initializeApp } from 'firebase/app';

/**
 * Firebase configuration object
 * Values loaded from environment variables
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
};

// Only initialize Firebase if we have real credentials
const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                     import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const app = hasValidConfig ? initializeApp(firebaseConfig) : null;

// Export a flag to check if Firebase is properly configured
export const isFirebaseConfigured = hasValidConfig;
