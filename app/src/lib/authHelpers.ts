import { supabase } from './supabase';
import { User, UserRole } from '../context/AuthContext';

/**
 * Fetches user profile from the database based on their auth user ID
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    // Fetch user profile from public.users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Only log detailed errors in development
      if (import.meta.env.DEV) {
        console.error('Error fetching user profile:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }
      
      // If it's a "not found" error (PGRST116), the profile doesn't exist
      if (error.code === 'PGRST116' && import.meta.env.DEV) {
        console.error('User profile does not exist in database.');
      }
      
      return null;
    }

    if (!profile) {
      if (import.meta.env.DEV) {
        console.warn('User profile not found for userId:', userId);
      }
      return null;
    }

    // Map database profile to User interface
    // All fields are now in the users table
    const user: User = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role as UserRole,
      phone: profile.phone || undefined,
      institution: profile.institution || undefined,
      photoUrl: profile.photo_url || undefined,
      // Student-specific fields
      studentId: profile.student_id || undefined,
      rollNumber: profile.roll_number || undefined,
      course: profile.course || undefined,
      semester: profile.semester || undefined,
      division: profile.division || undefined,
      cgpa: profile.cgpa ? Number(profile.cgpa) : undefined,
      // Faculty-specific fields
      facultyId: profile.faculty_id || undefined,
      department: profile.department || undefined,
      designation: profile.designation || undefined,
      specialization: profile.specialization || undefined,
      // Admin-specific fields
      adminId: profile.admin_id || undefined,
      adminRole: profile.admin_role || undefined,
    };

    return user;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

/**
 * Gets the current session from Supabase
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}

/**
 * Signs in a user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      // Only log in development, don't expose error details in production
      if (import.meta.env.DEV) {
        console.error('Authentication error:', response.error);
      }
      throw response.error;
    }

    if (!response.data) {
      console.error('No data in response:', response);
      throw new Error('Authentication failed: No data returned from Supabase');
    }

    if (!response.data.user) {
      console.error('No user in response data:', response.data);
      throw new Error('Authentication failed: No user data returned');
    }

    console.log('Sign in successful, user ID:', response.data.user.id);
    return response.data;
  } catch (error) {
    console.error('Error in signInWithEmail:', error);
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Signs in with OAuth provider (Google, GitHub, Discord, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('OAuth sign in error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in signInWithOAuth:', error);
    throw error;
  }
}
