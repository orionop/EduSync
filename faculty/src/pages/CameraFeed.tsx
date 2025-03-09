import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Camera, User, Clock, Calendar, Shield, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import UFMReportModal from '../components/UFMReportModal';
import UserProfileModal from '../components/UserProfileModal';

interface Alert {
  id: string;
  studentId: string;
  type: string;
  timestamp: string;
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

const CameraFeed: React.FC = () => {
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const [isUFMModalOpen, setIsUFMModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Simulate camera feed with a placeholder image
  const cameraFeedUrl = "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80";
  
  // Mock exam details
  const examDetails = {
    subject: "Computer Science Fundamentals",
    date: "April 16, 2025",
    duration: "3 hours",
    students: 42,
  };

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
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate random alerts
    const alertTimer = setInterval(() => {
      const random = Math.random();
      if (random < 0.3) { // 30% chance of generating an alert
        const newAlert = {
          id: Date.now().toString(),
          studentId: `S${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
          type: random < 0.15 ? 'Object Detection' : 'Looking Away',
          timestamp: new Date().toLocaleTimeString(),
          classroom: classroomId || 'CS-101'
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep only the 5 most recent alerts
        
        // Show toast notification
        toast((t) => (
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Alert: {newAlert.type}</p>
              <p className="text-sm">Student {newAlert.studentId}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>Classroom: {newAlert.classroom}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedStudentId(newAlert.studentId);
                    setIsUFMModalOpen(true);
                    toast.dismiss(t.id);
                  }}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                >
                  Report
                </button>
                <button 
                  onClick={() => toast.dismiss(t.id)}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ), { duration: 10000 });
      }
    }, 15000); // Check every 15 seconds
    
    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
    };
  }, [classroomId]);

  const handleBack = () => {
    navigate('/proctor-section');
  };

  const handleReportUFM = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsUFMModalOpen(true);
  };

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Camera Feed - Classroom {classroomId}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-red-600 dark:text-red-400">Live</span>
          </div>
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
      
      <main className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <div className="bg-black rounded-xl overflow-hidden shadow-lg relative">
              <img 
                src={cameraFeedUrl} 
                alt="Camera Feed" 
                className="w-full h-auto object-cover"
              />
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Classroom {classroomId}</span>
              </div>
              
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                {currentTime.toLocaleTimeString()}
              </div>
              
              {alerts.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Alert: {alerts[0].type}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recent Alerts</h2>
              
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-300">
                            {alert.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Student {alert.studentId} • {alert.timestamp}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Classroom: {alert.classroom}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleReportUFM(alert.studentId)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Report
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No alerts detected
                </p>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Exam Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                    <p className="font-medium text-gray-900 dark:text-white">{examDetails.subject}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{examDetails.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{examDetails.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                    <p className="font-medium text-gray-900 dark:text-white">{examDetails.students}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Classroom</p>
                    <p className="font-medium text-gray-900 dark:text-white">{classroomId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-4">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-3">Proctor Controls</h3>
              
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Camera className="h-4 w-4" />
                  Switch Camera View
                </button>
                
                <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Emergency Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
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

export default CameraFeed;