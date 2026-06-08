import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile as updateFirebaseProfile, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser
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
        const firstName = nameParts[0] || 'Member';
        const lastName = nameParts.slice(1).join(' ') || '';

        const providerId = firebaseUser.providerData[0]?.providerId;
        const authMethod = providerId === 'google.com' ? 'gmail' : 'email';

        setUser({
          firstName,
          lastName,
          email: firebaseUser.email || '',
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
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => {
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
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGmail, loginWithEmail, signUpWithEmail, updateProfile, logout }}>
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
