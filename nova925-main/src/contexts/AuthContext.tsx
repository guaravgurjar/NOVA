import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

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
  loginWithGmail: (email: string, firstName: string, lastName: string) => void;
  loginWithPhone: (phoneNumber: string) => void;
  registerUser: (details: Omit<UserProfile, 'isAuthenticated' | 'authMethod'>) => void;
  updateProfile: (details: Partial<Omit<UserProfile, 'isAuthenticated' | 'authMethod'>>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  
  // Local profile details that Clerk doesn't store directly
  const [localDetails, setLocalDetails] = useState<{
    dob?: string;
    gender?: 'male' | 'female' | 'others' | null;
  }>({});

  // Sync local details from localStorage based on clerk user id
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      const stored = localStorage.getItem(`nova_clerk_details_${clerkUser.id}`);
      if (stored) {
        try {
          setLocalDetails(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
      } else {
        setLocalDetails({});
      }
    } else {
      setLocalDetails({});
    }
  }, [isSignedIn, clerkUser]);

  // Construct UserProfile from Clerk state
  let user: UserProfile | null = null;
  if (isLoaded && isSignedIn && clerkUser) {
    user = {
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || '',
      dob: localDetails.dob,
      gender: localDetails.gender,
      authMethod: clerkUser.externalAccounts.length > 0 ? 'gmail' : 'email',
      isAuthenticated: true
    };
  }

  // Fallback / simulated functions for compatibility
  const loginWithGmail = () => {
    // Under Clerk, login is done via Clerk UI components, so this is a no-op
  };

  const loginWithPhone = () => {
    // Under Clerk, login is done via Clerk UI components, so this is a no-op
  };

  const registerUser = () => {
    // Under Clerk, registration is done via Clerk UI components, so this is a no-op
  };

  const updateProfile = async (details: Partial<Omit<UserProfile, 'isAuthenticated' | 'authMethod'>>) => {
    if (!clerkUser) return;

    // Update firstName and lastName in Clerk
    try {
      const updates: any = {};
      if (details.firstName !== undefined) updates.firstName = details.firstName;
      if (details.lastName !== undefined) updates.lastName = details.lastName;
      if (Object.keys(updates).length > 0) {
        await clerkUser.update(updates);
      }
    } catch (err) {
      console.error("Failed to update name in Clerk:", err);
    }

    // Save DOB and Gender locally keyed by clerk ID
    const newDetails = {
      ...localDetails,
      ...(details.dob !== undefined ? { dob: details.dob } : {}),
      ...(details.gender !== undefined ? { gender: details.gender } : {}),
    };
    setLocalDetails(newDetails);
    localStorage.setItem(`nova_clerk_details_${clerkUser.id}`, JSON.stringify(newDetails));
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGmail, loginWithPhone, registerUser, updateProfile, logout }}>
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
