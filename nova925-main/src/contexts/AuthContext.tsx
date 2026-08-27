import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export type SpecialOccasion = {
  id: string;
  type: 'birthday_partner' | 'anniversary' | 'parents_anniversary' | 'custom';
  label: string;
  date: string;
};

export type NotificationPrefs = {
  birthday: boolean;
  anniversary: boolean;
  offers: boolean;
  productSuggestions: boolean;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'others' | null;
  anniversary?: string;
  zodiacSign?: string;
  occasions?: SpecialOccasion[];
  notifications?: NotificationPrefs;
  authMethod: 'gmail' | 'phone' | 'email';
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  loginWithGmail: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, recaptchaContainerId: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => Promise<void>;
  updateProfile: (details: Partial<Omit<UserProfile, 'isAuthenticated' | 'authMethod'>>) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Local profile details that Firebase doesn't store directly
  const [localDetails, setLocalDetails] = useState<{
    dob?: string;
    gender?: 'male' | 'female' | 'others' | null;
    anniversary?: string;
    zodiacSign?: string;
    occasions?: SpecialOccasion[];
    notifications?: NotificationPrefs;
  }>({});

  // Helper: derive a stable userId for API calls
  const getProfileUserId = (firebaseUser: FirebaseUser): string => {
    return firebaseUser.uid;
  };

  // Listen to auth state changes
  useEffect(() => {
    // Prevent calling the real Firebase SDK if keys are unconfigured or using the mock auth implementation
    if (!auth || (auth as any).name === 'mockAuth') {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userId = getProfileUserId(firebaseUser);

        // Helper: get a fresh Firebase ID token for authenticated API calls
        const getIdToken = async (): Promise<string | null> => {
          try { return await firebaseUser.getIdToken(); } catch { return null; }
        };

        // 1. Try to load from MongoDB; fall back to localStorage
        let parsedDetails: any = {};
        try {
          const token = await getIdToken();
          const res = await fetch(`/api/profile/${encodeURIComponent(userId)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (data.success && data.profile) {
            parsedDetails = data.profile;
            // Keep localStorage in sync as offline fallback
            localStorage.setItem(`nova_firebase_details_${userId}`, JSON.stringify(parsedDetails));
          } else {
            // API returned no profile – try localStorage
            const stored = localStorage.getItem(`nova_firebase_details_${userId}`);
            if (stored) parsedDetails = JSON.parse(stored);
          }
        } catch {
          // Network error – fall back to localStorage
          const stored = localStorage.getItem(`nova_firebase_details_${userId}`);
          if (stored) {
            try { parsedDetails = JSON.parse(stored); } catch { /* ignore */ }
          }
        }

        setLocalDetails(parsedDetails);

        const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : [];
        const firstName = nameParts[0] || (firebaseUser.phoneNumber ? 'Guest' : 'Member');
        const lastName = nameParts.slice(1).join(' ') || (firebaseUser.phoneNumber ? 'Collector' : '');

        const providerId = firebaseUser.providerData[0]?.providerId;
        const authMethod = providerId === 'google.com' ? 'gmail' : (providerId === 'phone' || firebaseUser.phoneNumber) ? 'phone' : 'email';

        setUser({
          firstName: parsedDetails.firstName || firstName,
          lastName: parsedDetails.lastName || lastName,
          email: firebaseUser.email || `${firebaseUser.phoneNumber?.replace(/\+/g, '') || firebaseUser.uid}@nova-phone.local`,
          phoneNumber: parsedDetails.phoneNumber || firebaseUser.phoneNumber || '',
          dob: parsedDetails.dob,
          gender: parsedDetails.gender,
          anniversary: parsedDetails.anniversary,
          zodiacSign: parsedDetails.zodiacSign,
          occasions: parsedDetails.occasions || [],
          notifications: parsedDetails.notifications || { birthday: true, anniversary: true, offers: true, productSuggestions: true },
          authMethod,
          isAuthenticated: true
        });
      } else {
        setUser(null);
        setLocalDetails({});
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGmail = async () => {
    if (!auth || (auth as any).name === 'mockAuth') {
      alert("Firebase Authentication is not configured. Please add environment variables in your Vercel project dashboard.");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth || (auth as any).name === 'mockAuth') {
      alert("Firebase Authentication is not configured. Please add environment variables in your Vercel project dashboard.");
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Keep a reference to the RecaptchaVerifier across renders
  const recaptchaVerifierRef = useRef<any>(null);

  const loginWithPhone = async (phoneNumber: string, recaptchaContainerId: string): Promise<any> => {
    if (!auth || (auth as any).name === 'mockAuth') {
      // Mock mode for local dev / unconfigured Firebase
      console.log("Mock Phone Sign-In triggered for:", phoneNumber);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        confirm: async (code: string) => {
          if (code === '123456' || code === '925925') {
            setUser({
              firstName: 'Guest',
              lastName: 'Collector',
              email: `${phoneNumber.replace(/\+/g, '')}@nova-phone.local`,
              phoneNumber: phoneNumber,
              authMethod: 'phone',
              isAuthenticated: true
            });
          } else {
            throw new Error('Invalid verification code. Enter 123456 or 925925.');
          }
        }
      };
    }

    // Clear any existing verifier to prevent "already rendered" errors on resend
    if (recaptchaVerifierRef.current) {
      try { recaptchaVerifierRef.current.clear(); } catch { /* ignore */ }
      recaptchaVerifierRef.current = null;
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
      callback: () => { }
    });
    recaptchaVerifierRef.current = recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => {
    if (!auth || (auth as any).name === 'mockAuth') {
      alert("Firebase Authentication is not configured. Please add environment variables in your Vercel project dashboard.");
      return;
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (credential.user) {
      // Update display name
      await updateFirebaseProfile(credential.user, {
        displayName: `${firstName} ${lastName}`
      });
      // Save phone number if provided or store it locally
      if (phoneNumber) {
        const currentStored = localStorage.getItem(`nova_firebase_details_${credential.user.uid}`);
        const current = currentStored ? JSON.parse(currentStored) : {};
        localStorage.setItem(
          `nova_firebase_details_${credential.user.uid}`,
          JSON.stringify({ ...current, phoneNumber })
        );
      }
    }
  };

  const updateProfile = async (details: Partial<Omit<UserProfile, 'isAuthenticated' | 'authMethod'>>) => {
    if (!auth || (auth as any).name === 'mockAuth') return;
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    const userId = getProfileUserId(firebaseUser);

    // Update display name in Firebase Auth if name changed
    if (details.firstName !== undefined || details.lastName !== undefined) {
      const newFirstName = details.firstName !== undefined ? details.firstName : (user?.firstName || '');
      const newLastName = details.lastName !== undefined ? details.lastName : (user?.lastName || '');
      await updateFirebaseProfile(firebaseUser, {
        displayName: `${newFirstName} ${newLastName}`
      });
    }

    // Merge new details with existing local details
    const newDetails = {
      ...localDetails,
      ...(details.firstName !== undefined ? { firstName: details.firstName } : {}),
      ...(details.lastName !== undefined ? { lastName: details.lastName } : {}),
      ...(details.dob !== undefined ? { dob: details.dob } : {}),
      ...(details.gender !== undefined ? { gender: details.gender } : {}),
      ...(details.anniversary !== undefined ? { anniversary: details.anniversary } : {}),
      ...(details.zodiacSign !== undefined ? { zodiacSign: details.zodiacSign } : {}),
      ...(details.occasions !== undefined ? { occasions: details.occasions } : {}),
      ...(details.phoneNumber !== undefined ? { phoneNumber: details.phoneNumber } : {}),
      ...(details.notifications !== undefined ? { notifications: details.notifications } : {}),
    };

    // 1. Persist to localStorage (offline fallback)
    setLocalDetails(newDetails);
    localStorage.setItem(`nova_firebase_details_${userId}`, JSON.stringify(newDetails));

    // 2. Sync to MongoDB via API
    try {
      const token = await firebaseUser.getIdToken();
      await fetch(`/api/profile/${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newDetails)
      });
    } catch (err) {
      console.warn('Profile cloud sync failed (saved locally):', err);
    }

    // 3. Update local React state
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...details,
        firstName: details.firstName !== undefined ? details.firstName : prev.firstName,
        lastName: details.lastName !== undefined ? details.lastName : prev.lastName,
      };
    });
  };

  const logout = async () => {
    if (!auth || (auth as any).name === 'mockAuth') {
      setUser(null);
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGmail, loginWithEmail, loginWithPhone, signUpWithEmail, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
