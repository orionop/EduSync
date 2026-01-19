import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { GraduationCap } from 'lucide-react';
import StudentSidebar from '../../components/student/StudentSidebar';
import ThemeToggle from '../../components/student/ThemeToggle';
import NotificationPanel from '../../components/student/NotificationPanel';
import UserProfileModal from '../../components/student/UserProfileModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, acceptRequest, ignoreRequest } = useNotifications();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userInfo = {
    name: user?.name || 'Student',
    email: user?.email || 'student@example.com',
    phone: user?.phone || '+91 9876543210',
    institution: user?.institution || 'EdVantage University',
    accountType: 'Student',
    studentId: user?.studentId || 'STU2025001',
    rollNumber: user?.rollNumber || '2025CS001',
    course: user?.course || 'B.Tech Computer Science',
    semester: user?.semester || '6th',
    division: user?.division || 'A',
    cgpa: user?.cgpa || 8.75,
    photoUrl: user?.photoUrl,
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <NotificationPanel 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onAcceptRequest={acceptRequest}
              onIgnoreRequest={ignoreRequest}
            />
            <ThemeToggle />
            
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
            >
              {userInfo.photoUrl ? (
                <img 
                  src={userInfo.photoUrl} 
                  alt={userInfo.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {userInfo.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userInfo.name}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome, {user?.name || 'Student'}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Student Portal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Exam Schedule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View your upcoming exams
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Results
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check your exam results
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Applications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Apply for examinations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

export default StudentDashboard;
