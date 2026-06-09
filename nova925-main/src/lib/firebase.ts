import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: any;
let auth: any;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key_placeholder") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    throw new Error("Missing Firebase API key or using placeholder.");
  }
} catch (error) {
  console.warn("Firebase initialization failed. Running in offline/demo auth mode.", error);
  // Provide safe dummy exports that mimic Firebase Auth without throwing module-load errors
  app = {
    name: '[MockApp]',
    options: {},
    automaticDataCollectionEnabled: false
  };
  auth = {
    app,
    name: 'mockAuth',
    config: {},
    currentUser: null,
    languageCode: null,
    tenantId: null,
    settings: {},
    onAuthStateChanged: (callback: any) => {
      // Simulate unauthenticated state immediately
      setTimeout(() => callback(null), 50);
      return () => {};
    },
    onIdTokenChanged: (callback: any) => {
      setTimeout(() => callback(null), 50);
      return () => {};
    }
  };
}

export { app, auth };
