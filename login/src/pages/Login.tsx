import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

type UserType = 'faculty' | 'admin' | 'student';

// Configure your redirect URLs here
const REDIRECT_URLS: Record<UserType, string> = {
  faculty: 'http://localhost:3001',
  admin: 'http://localhost:3002',
  student: 'http://localhost:3000'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Add actual authentication logic here
    // For now, just redirect to the appropriate dashboard using the configured URL
    window.location.href = REDIRECT_URLS[userType];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col">
      {/* Enhanced University Banner */}
      <div className="w-full bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="/uni.png" 
                  alt="EdVantage University Logo" 
                  className="h-14 w-auto object-contain rounded-lg shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">EdVantage University</h1>
                <p className="text-sm text-gray-500">Excellence in Education</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Programs</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Student Portal</a>
            </div>
          </div>
        </div>
      </div>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left Side - Banner */}
          <div className="p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between hidden md:flex">
            <div>
              <img 
                src="/portal.png" 
                alt="EduSync Portal Logo" 
                className="w-32 h-32 mb-6 object-contain"
              />
              <h1 className="text-4xl font-bold mb-6">EduSync Portal</h1>
              <p className="text-xl mb-4">One stop portal for</p>
              <p className="text-xl mb-4">students, faculty &</p>
              <p className="text-xl">exam coordinators.</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Instructions</p>
              <p className="text-sm opacity-80">Login using your institutional credentials.</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12">
            <div className="md:hidden mb-8">
              <img 
                src="/portal.png" 
                alt="EduSync Portal Logo" 
                className="w-20 h-20 mb-4 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800">EduSync Portal</h1>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Sign In</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Exam Coordinator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Register now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;