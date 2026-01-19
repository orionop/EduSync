import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '../../components/student/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn('student@example.com', 'password');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Student Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Access your academic information and resources
          </p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login to Student Portal
        </button>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 EduSync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;