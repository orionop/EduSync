import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Chrome, Github } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { signIn, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();

  // Redirect after successful login
  useEffect(() => {
    if (user) {
      const redirectPath = `/${user.role}/dashboard`;
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      // Navigation will happen via useEffect when user is set
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col">
      {/* EduSync Header */}
      <div className="w-full bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/dark-mode.png" 
                alt="EduSync" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">EduSync</h1>
                <p className="text-sm text-gray-500">Unified Education Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left Side - Banner */}
          <div className="p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between hidden md:flex">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/images/portal-logo.png" 
                alt="EduSync Portal" 
                className="h-36 w-36 object-contain mb-6"
              />
              <h1 className="text-4xl font-bold mb-6">EduSync Portal</h1>
              <div className="space-y-1">
                <p className="text-xl">One unified platform for</p>
                <p className="text-xl">students, faculty & administrators.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12">
            <div className="md:hidden mb-8 flex flex-col items-center">
              <img 
                src="/images/dark-mode.png" 
                alt="EduSync" 
                className="h-16 w-16 object-contain mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-800">EduSync</h1>
              <p className="text-sm text-gray-500 mt-1">Unified Education Management</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
            <p className="text-sm text-gray-500 mb-8">Enter your institutional email and password</p>
            
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid="false"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid="false"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || oauthLoading !== null}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isLoading ? 'Signing in, please wait' : 'Sign in to your account'}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
