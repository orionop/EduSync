import React, { useState } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import UserProfileModal from './UserProfileModal';
import { useNotifications } from '../context/NotificationContext';

interface StudentHeaderProps {
  studentInfo: {
    name: string;
    email: string;
    phone: string;
    institution: string;
    accountType: string;
    photoUrl?: string;
    studentId: string;
  };
}

const StudentHeader: React.FC<StudentHeaderProps> = ({ studentInfo }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {studentInfo.photoUrl ? (
                  <img
                    src={studentInfo.photoUrl}
                    alt={studentInfo.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {studentInfo.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {studentInfo.studentId}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userInfo={studentInfo}
        />
      )}
    </header>
  );
};

export default StudentHeader;