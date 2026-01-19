import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { fetchUserProfile, getCurrentSession, signInWithEmail, signInWithOAuth as signInWithOAuthHelper, signOutUser } from '../lib/authHelpers';

export type UserRole = 'student' | 'faculty' | 'admin' | 'test';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  institution?: string;
  photoUrl?: string;
  // Student-specific fields
  studentId?: string;
  course?: string;
  semester?: string;
  rollNumber?: string;
  division?: string;
  cgpa?: number;
  // Faculty-specific fields
  facultyId?: string;
  department?: string;
  designation?: string;
  specialization?: string;
  // Admin-specific fields
  adminId?: string;
  adminRole?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to check session

  // Initialize: Check for existing session on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const session = await getCurrentSession();
        
        if (session?.user && mounted) {
          // Fetch user profile from database
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile && mounted) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error initializing auth:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile) {
            setUser(userProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Refresh user profile on token refresh
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile) {
            setUser(userProfile);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase
      const data = await signInWithEmail(email, password);
      
      if (!data || !data.user) {
        if (import.meta.env.DEV) {
          console.error('No user data returned from authentication');
        }
        throw new Error('No user returned from authentication');
      }

      // Fetch user profile from database
      const userProfile = await fetchUserProfile(data.user.id);
      
      if (!userProfile) {
        if (import.meta.env.DEV) {
          console.error('User profile not found');
        }
        throw new Error('User profile not found. Please ensure your account is set up correctly. Contact administrator if this persists.');
      }

      // For 'test' role, we'll use a fallback since it's not in the database
      if (userProfile.role === 'test' || !userProfile.role) {
        if (import.meta.env.DEV) {
          console.error('Invalid user role:', userProfile.role);
        }
        throw new Error('Invalid user role. Please contact administrator.');
      }

      setUser(userProfile);
    } catch (error: any) {
      const message = error?.message || 'Failed to sign in';
      
      // Provide user-friendly error messages
      if (message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (message.includes('Email not confirmed')) {
        toast.error('Please verify your email address');
      } else {
        toast.error(message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    try {
      setLoading(true);
      await signInWithOAuthHelper(provider);
      // OAuth redirects away, so we don't need to handle the response here
      // The auth state change listener will handle it when user returns
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('OAuth sign in failed:', error);
      }
      toast.error(error?.message || `Failed to sign in with ${provider}`);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Failed to sign out:', error);
      }
      toast.error(error?.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithOAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
