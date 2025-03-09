import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import UserProfileModal from './UserProfileModal';
import { useNotifications } from '../context/NotificationContext';

interface SectionDashboardProps {
  title: string;
  userInfo: {
    name: string;
    role: string;
    email: string;
    phone: string;
    institution: string;
    accountType: string;
    photoUrl?: string;
  } | null;
  children: React.ReactNode;
}

const SectionDashboard: React.FC<SectionDashboardProps> = ({
  title,
  userInfo,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    acceptRequest, 
    ignoreRequest 
  } = useNotifications();
  
  const handleLogout = () => {
    localStorage.removeItem('eduSyncUser');
    navigate('/');
  };
  
  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {!isDashboard && <Sidebar onLogout={handleLogout} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
          
          <div className="flex items-center gap-4">
            <NotificationPanel 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onAcceptRequest={acceptRequest}
              onIgnoreRequest={ignoreRequest}
            />
            <ThemeToggle />
            
            {userInfo && (
              <button 
                onClick={handleOpenProfile}
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
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
        
        {userInfo && (
          <UserProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            userInfo={userInfo}
          />
        )}
      </div>
    </div>
  );
};

export default SectionDashboard;