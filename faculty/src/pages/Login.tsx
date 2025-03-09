import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // In a real app, you would validate credentials here
      // For this demo, we'll just store a dummy user in localStorage
      localStorage.setItem('eduSyncUser', JSON.stringify({ 
        name: 'Dr. Jane Smith', 
        role: 'faculty',
        email: 'jane.smith@university.edu',
        phone: '+1 (555) 123-4567',
        institution: 'University of Technology',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      }));
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
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
              <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">EduSync Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Faculty portal for marks management and result processing
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 EduSync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;