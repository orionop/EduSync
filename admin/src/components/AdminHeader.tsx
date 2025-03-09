import React, { useState } from 'react';
import { Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import UserProfileModal from './UserProfileModal';

interface AdminInfo {
  name: string;
  email: string;
  phone: string;
  institution: string;
  accountType: string;
  adminId: string;
  photoUrl?: string;
}

interface AdminHeaderProps {
  adminInfo: AdminInfo;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminInfo }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Exam Coordinator Portal
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>

              <button 
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {adminInfo.photoUrl ? (
                  <img 
                    src={adminInfo.photoUrl} 
                    alt={adminInfo.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="hidden sm:block">{adminInfo.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showProfile && (
        <UserProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userInfo={{
            ...adminInfo,
            bankAccountNumber: '****1234' // Example bank account number
          }}
        />
      )}
    </>
  );
};

export default AdminHeader;