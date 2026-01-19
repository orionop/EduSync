import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { fetchUserProfile } from '../../lib/authHelpers';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Authentication failed');
          setTimeout(() => navigate('/login?error=auth_failed'), 2000);
          return;
        }

        if (session?.user) {
          console.log('OAuth callback - user authenticated:', session.user.id);
          // The auth state change listener in AuthContext will handle fetching the profile
          // Just wait a moment for it to process, then check if user is set
          setTimeout(() => {
            if (user) {
              navigate(`/${user.role}/dashboard`);
            } else {
              // Try fetching profile directly as fallback
              fetchUserProfile(session.user.id).then((profile) => {
                if (profile) {
                  navigate(`/${profile.role}/dashboard`);
                } else {
                  setError('Profile not found');
                  setTimeout(() => navigate('/login?error=profile_not_found'), 2000);
                }
              });
            }
          }, 1000);
        } else {
          setError('No session found');
          setTimeout(() => navigate('/login?error=no_session'), 2000);
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('Callback failed');
        setTimeout(() => navigate('/login?error=callback_failed'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <p className="text-slate-600">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
