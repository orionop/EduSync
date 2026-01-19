import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  phone?: string;
  institution?: string;
  studentId?: string;
  course?: string;
  semester?: string;
  photoUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  profile: UserProfile | null;
}

/**
 * Sign in with email and password using Supabase Auth
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Failed to sign in');
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  // Fetch user profile from database
  const profile = await getUserProfile(data.user.id);

  return {
    id: data.user.id,
    email: data.user.email || email,
    role: profile?.role || 'student',
    profile,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message || 'Failed to get session');
  }
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }

  const profile = await getUserProfile(session.user.id);
  
  return {
    id: session.user.id,
    email: session.user.email || '',
    role: profile?.role || 'student',
    profile,
  };
}

/**
 * Fetch user profile from database
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}
