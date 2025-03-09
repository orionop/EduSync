import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Calendar, GraduationCap, Award, Clock, FileText, AlertCircle, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AnnouncementSection from '../components/AnnouncementSection';
import SectionDashboard from '../components/SectionDashboard';

interface UserInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  institution: string;
  accountType: string;
  photoUrl?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('eduSyncUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        ...parsedUser,
        email: 'jane.smith@university.edu',
        phone: '+1 (555) 123-4567',
        institution: 'EdVantage University',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      });
    }
  }, []);

  // Mock data for performance chart
  const performanceData = [
    { month: 'Jan', avgScore: 82 },
    { month: 'Feb', avgScore: 85 },
    { month: 'Mar', avgScore: 78 },
    { month: 'Apr', avgScore: 89 },
    { month: 'May', avgScore: 92 },
    { month: 'Jun', avgScore: 87 }
  ];

  const quickAccessCards = [
    {
      title: 'Marks Entry',
      description: 'Enter and manage student marks',
      icon: FileText,
      path: '/marks-calculation',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Results',
      description: 'View and publish exam results',
      icon: GraduationCap,
      path: '/view-results',
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'from-emerald-600 to-green-700'
    },
    {
      title: 'Proctor Section',
      description: 'Monitor exams and detect irregularities',
      icon: AlertCircle,
      path: '/proctor-section',
      gradient: 'from-rose-500 to-red-600',
      hoverGradient: 'from-rose-600 to-red-700'
    },
    {
      title: 'Supervisor Duty',
      description: 'Manage supervision assignments',
      icon: Upload,
      path: '/supervisor-duty',
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-600 to-violet-700'
    }
  ];

  const upcomingDuties = [
    { subject: 'Data Structures', date: '2025-03-15', time: '10:00 AM', classroom: 'CS-101' },
    { subject: 'Database Management', date: '2025-03-18', time: '02:00 PM', classroom: 'CS-102' },
    { subject: 'Web Development', date: '2025-03-22', time: '11:00 AM', classroom: 'CS-103' },
  ];

  // Mock announcements data
  const bannerAnnouncements = [
    {
      id: '1',
      message: 'Hall tickets for End Semester Exams have been released. Download here.',
      link: '#',
      isImportant: true
    },
    {
      id: '2',
      message: 'Faculty meeting scheduled for tomorrow at 10:00 AM in the conference room.',
      link: '#',
      isImportant: true
    }
  ];

  const sectionAnnouncements = [
    {
      id: '1',
      title: 'End Semester Exam Schedule Released',
      message: 'The end semester examination schedule has been released. Please check your duty assignments.',
      date: '2025-04-15',
      sender: 'Exam Coordinator',
      isImportant: true
    },
    {
      id: '2',
      title: 'Faculty Meeting Reminder',
      message: 'Reminder: Faculty meeting tomorrow at 10:00 AM in the conference room.',
      date: '2025-04-14',
      sender: 'Department Head',
      isImportant: false
    }
  ];

  const handleViewMore = () => {
    // Implement view more logic
    console.log('View more clicked');
  };

  return (
    <SectionDashboard title="Dashboard" userInfo={userInfo}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnnouncementBanner announcements={bannerAnnouncements} />
        <AnnouncementSection announcements={sectionAnnouncements} onViewMore={handleViewMore} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Classes Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">4</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Duties Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">248</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">92%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.path}
                  onClick={() => navigate(card.path)}
                  className={`relative overflow-hidden rounded-xl shadow-lg group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1`}
                  aria-label={`Access ${card.title}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} group-hover:${card.hoverGradient} transition-all duration-300`} />
                  <div className="relative p-5 flex items-start">
                    <div className="flex-shrink-0 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1.5 truncate">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/90 leading-snug">
                        {card.description}
                      </p>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
          {/* Performance Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Class Performance</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    name="Average Score" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Duties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Duties</h2>
            <div className="space-y-4">
              {upcomingDuties.map((duty, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{duty.subject}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(duty.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{duty.time}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Room: {duty.classroom}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionDashboard>
  );
};

export default Dashboard;