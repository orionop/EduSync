import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Book, Calendar, GraduationCap, Award, Clock, FileText, AlertCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AnnouncementSection from '../components/AnnouncementSection';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const studentInfo = JSON.parse(localStorage.getItem('eduSyncUser') || '{}');

  // Current attendance percentage
  const currentAttendance = 95;

  const quickAccessCards = [
    {
      title: 'Pre Exam',
      description: 'View and manage exam requirements and hall tickets',
      icon: FileText,
      path: '/exam-prerequisites',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Results',
      description: 'Check semester results and apply for revaluation',
      icon: GraduationCap,
      path: '/results',
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'from-emerald-600 to-green-700'
    },
    {
      title: 'KT Section',
      description: 'Manage KT applications and view status',
      icon: AlertCircle,
      path: '/kt-section',
      gradient: 'from-rose-500 to-red-600',
      hoverGradient: 'from-rose-600 to-red-700'
    },
    {
      title: 'Submissions',
      description: 'Upload assignments and track submissions',
      icon: Upload,
      path: '/submissions',
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-600 to-violet-700'
    }
  ];

  const upcomingExams = [
    { subject: 'Data Structures', date: '2025-03-15', time: '10:00 AM' },
    { subject: 'Database Management', date: '2025-03-18', time: '02:00 PM' },
    { subject: 'Web Development', date: '2025-03-22', time: '11:00 AM' },
  ];

  // Calculate the stroke dash array for the circular progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (currentAttendance / 100) * circumference;

  // Function to get attendance status color
  const getAttendanceStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500 dark:text-green-400';
    if (percentage >= 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Mock announcements data
  const bannerAnnouncements = [
    {
      id: '1',
      message: 'Important announcement about upcoming exams.',
      link: '/exam-timetable',
      isImportant: true,
    },
    // Add more banner announcements as needed
  ];

  const sectionAnnouncements = [
    {
      id: '2',
      title: 'Exam Schedule Released',
      message: 'The exam schedule for the upcoming semester has been released.',
      date: '2023-10-01',
      sender: 'Admin',
      isImportant: true,
    },
    // Add more section announcements as needed
  ];

  const handleViewMore = () => {
    // Implement logic to view more announcements
    console.log('View more announcements');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="overflow-x-hidden overflow-y-auto">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current CGPA</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">3.8</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">95%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Credits Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">96</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Achievements</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
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
            {/* Attendance Overview - Circular Graph */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Attendance Overview</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Background circle */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r={radius}
                      className="stroke-current text-gray-200 dark:text-gray-700"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r={radius}
                      className="stroke-current text-blue-500 dark:text-blue-400"
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                  </svg>
                  {/* Percentage text in the middle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getAttendanceStatusColor(currentAttendance)}`}>
                      {currentAttendance}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Attendance</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">120</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">114</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">6</p>
                </div>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Exams</h2>
              <div className="space-y-4">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{exam.subject}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(exam.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{exam.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;