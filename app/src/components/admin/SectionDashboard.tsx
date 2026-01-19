import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import UserProfileModal from './UserProfileModal';
import CollegeBanner from './CollegeBanner';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

interface SectionDashboardProps {
  title: string;
  userInfo: {
    name: string;
    role?: string;
    email: string;
    phone?: string;
    institution?: string;
    accountType: string;
    photoUrl?: string;
    adminId?: string;
    adminRole?: string;
  } | null;
  children: React.ReactNode;
}

const SectionDashboard: React.FC<SectionDashboardProps> = ({
  title,
  userInfo,
  children
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    acceptRequest, 
    ignoreRequest 
  } = useNotifications();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <CollegeBanner 
        collegeName="EdVantage University" 
        logoUrl="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=128&q=80" 
      />
      
      <div className="flex-1 flex flex-col">
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
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {userInfo && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userInfo={userInfo}
        />
      )}
    </div>
  );
};

export default SectionDashboard;