import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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
let appCheck: any = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key_placeholder") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Initialize Firebase App Check
    if (typeof window !== 'undefined') {
      // In development environment, configure App Check to use a debug token
      if (import.meta.env.DEV) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      // Read reCAPTCHA v3 site key from environment variables
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 
        (import.meta.env.DEV ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : null);

      if (siteKey) {
        try {
          appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(siteKey),
            isTokenAutoRefreshEnabled: true
          });
        } catch (appCheckError) {
          console.warn("App Check initialization failed:", appCheckError);
        }
      } else {
        console.warn("VITE_RECAPTCHA_SITE_KEY is missing. App Check will not protect outgoing client requests.");
      }
    }
  } else {
    throw new Error("Missing Firebase API key or using placeholder.");
  }
} catch (error) {
  console.warn("Firebase initialization failed. Running in offline/demo auth mode.", error);
  // Provide safe dummy exports that mimic Firebase SDKs without throwing module-load errors
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

export { app, auth, appCheck };
