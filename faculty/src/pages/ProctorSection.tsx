import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Camera, Bell, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ActivityNotification from '../components/ActivityNotification';
import UFMReportModal from '../components/UFMReportModal';
import UserProfileModal from '../components/UserProfileModal';
import NotificationPanel from '../components/NotificationPanel';
import { useNotifications } from '../context/NotificationContext';

interface Activity {
  id: string;
  timestamp: string;
  type: 'suspicious' | 'normal';
  description: string;
  classroom: string;
}

interface UserInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  institution: string;
  accountType: string;
  photoUrl?: string;
}

const ProctorSection: React.FC = () => {
  const navigate = useNavigate();
  const [classroomNumber, setClassroomNumber] = useState('');
  const [isUFMModalOpen, setIsUFMModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    acceptRequest, 
    ignoreRequest,
    addNotification
  } = useNotifications();
  
  // Mock activities data
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      timestamp: '2025-04-16 10:15 AM',
      type: 'suspicious',
      description: 'Student S003 looking away from screen repeatedly',
      classroom: 'CS-101'
    },
    {
      id: '2',
      timestamp: '2025-04-16 10:12 AM',
      type: 'normal',
      description: 'All students focused on exam',
      classroom: 'CS-101'
    },
    {
      id: '3',
      timestamp: '2025-04-16 10:08 AM',
      type: 'suspicious',
      description: 'Multiple objects detected near Student S007',
      classroom: 'CS-102'
    }
  ]);
  
  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('eduSyncUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // In a real app, you would fetch complete user details from an API
      // For this demo, we'll extend the stored user with mock data
      setUserInfo({
        ...parsedUser,
        email: 'jane.smith@university.edu',
        phone: '+1 (555) 123-4567',
        institution: 'University of Technology',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      });
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('eduSyncUser');
    navigate('/');
  };

  const handleViewCameraFeed = () => {
    if (!classroomNumber) {
      toast.error('Please enter a classroom number');
      return;
    }
    navigate(`/camera-feed/${classroomNumber}`);
    
    // Add a notification for camera feed access
    addNotification({
      title: 'Camera Feed Accessed',
      message: `You have accessed the camera feed for classroom ${classroomNumber}.`,
      timestamp: new Date().toLocaleString(),
      type: 'announcement',
      sender: 'System'
    });
  };

  const handleReportUFM = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      // Extract student ID from description if available
      const match = activity.description.match(/Student\s+(\w+)/);
      const studentId = match ? match[1] : '';
      setSelectedStudentId(studentId);
      setIsUFMModalOpen(true);
      
      // Add a notification for UFM report
      addNotification({
        title: 'UFM Report Initiated',
        message: `You have initiated a UFM report for student ${studentId} in classroom ${activity.classroom}.`,
        timestamp: new Date().toLocaleString(),
        type: 'announcement',
        sender: 'System'
      });
    }
  };

  const handleFalseAlarm = (activityId: string) => {
    // Update the activity type to normal
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, type: 'normal', description: 'Marked as false alarm' } 
        : activity
    ));
    toast.success('Marked as false alarm');
    
    // Add a notification for false alarm
    addNotification({
      title: 'False Alarm Marked',
      message: 'You have marked a suspicious activity as a false alarm.',
      timestamp: new Date().toLocaleString(),
      type: 'announcement',
      sender: 'System'
    });
  };

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Proctor Section</h1>
          </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Exam Proctoring</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monitor exams in real-time and detect suspicious activities
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Classroom Number
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="classroom"
                      value={classroomNumber}
                      onChange={(e) => setClassroomNumber(e.target.value)}
                      placeholder="e.g., CS-101"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleViewCameraFeed}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      View Camera Feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="font-medium text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm text-red-600 dark:text-red-400">Live Monitoring</span>
                </div>
              </div>
              
              <div className="p-4">
                {activities.length > 0 ? (
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <ActivityNotification
                        key={activity.id}
                        id={activity.id}
                        timestamp={activity.timestamp}
                        type={activity.type}
                        description={activity.description}
                        classroom={activity.classroom}
                        onReport={handleReportUFM}
                        onFalseAlarm={handleFalseAlarm}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <UFMReportModal
        isOpen={isUFMModalOpen}
        onClose={() => setIsUFMModalOpen(false)}
        studentId={selectedStudentId}
      />
      
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

export default ProctorSection;