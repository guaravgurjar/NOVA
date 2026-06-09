import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'others' | null;
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
  }>({});

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
        // Load custom local details
        const stored = localStorage.getItem(`nova_firebase_details_${firebaseUser.uid}`);
        let parsedDetails: any = {};
        if (stored) {
          try {
            parsedDetails = JSON.parse(stored);
            setLocalDetails(parsedDetails);
          } catch (e) {
            // ignore
          }
        } else {
          setLocalDetails({});
        }

        const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : [];
        const firstName = nameParts[0] || (firebaseUser.phoneNumber ? 'Guest' : 'Member');
        const lastName = nameParts.slice(1).join(' ') || (firebaseUser.phoneNumber ? 'Collector' : '');

        const providerId = firebaseUser.providerData[0]?.providerId;
        const authMethod = providerId === 'google.com' ? 'gmail' : (providerId === 'phone' || firebaseUser.phoneNumber) ? 'phone' : 'email';

        setUser({
          firstName,
          lastName,
          email: firebaseUser.email || `${firebaseUser.phoneNumber?.replace(/\+/g, '') || firebaseUser.uid}@nova-phone.local`,
          phoneNumber: firebaseUser.phoneNumber || parsedDetails.phoneNumber || '',
          dob: parsedDetails.dob,
          gender: parsedDetails.gender,
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

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
      callback: () => {}
    });

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

    // Update name in Firebase Auth
    if (details.firstName !== undefined || details.lastName !== undefined) {
      const newFirstName = details.firstName !== undefined ? details.firstName : (user?.firstName || '');
      const newLastName = details.lastName !== undefined ? details.lastName : (user?.lastName || '');
      await updateFirebaseProfile(firebaseUser, {
        displayName: `${newFirstName} ${newLastName}`
      });
    }

    // Save DOB, Gender locally keyed by Firebase UID
    const newDetails = {
      ...localDetails,
      ...(details.dob !== undefined ? { dob: details.dob } : {}),
      ...(details.gender !== undefined ? { gender: details.gender } : {}),
    };
    setLocalDetails(newDetails);
    localStorage.setItem(`nova_firebase_details_${firebaseUser.uid}`, JSON.stringify(newDetails));

    // Sync local React user state
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
