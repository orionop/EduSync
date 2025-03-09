import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  Clock, 
  Calendar, 
  CheckCircle,
  GraduationCap,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AnnouncementSection from '../components/AnnouncementSection';
import SectionDashboard from '../components/SectionDashboard';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const bannerAnnouncements = [
    {
      id: '1',
      message: 'Important: End semester examination schedule has been updated',
      messageMarathi: 'महत्त्वाचे: शेवटच्या सत्राची परीक्षा वेळापत्रक अपडेट केले आहे',
      link: '/admin/exam-prerequisites',
      isImportant: true
    },
    {
      id: '2',
      message: 'Urgent: Supervisor duty allocation for next week is pending',
      messageMarathi: 'तातडीचे: पुढील आठवड्यासाठी पर्यवेक्षक ड्यूटी वाटप प्रलंबित आहे',
      link: '/admin/supervisory-duty',
      isImportant: true
    }
  ];

  const announcements = [
    {
      id: '1',
      title: 'End Semester Examination Schedule Update',
      message: 'The examination schedule for the upcoming end semester has been updated. Please review and confirm your assigned duties.',
      date: '2025-03-15',
      sender: 'Examination Controller',
      isImportant: true
    },
    {
      id: '2',
      title: 'New Examination Guidelines',
      message: 'Updated guidelines for examination supervision have been released. All supervisors must review before the next duty.',
      date: '2025-03-14',
      sender: 'Academic Office',
      isImportant: false
    }
  ];

  const stats = [
    {
      title: 'Active Exams',
      value: '8',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Supervisors',
      value: '45',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Pending Tasks',
      value: '12',
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      title: 'Grievances',
      value: '5',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  const quickAccessCards = [
    {
      title: 'Exam Prerequisites',
      description: 'Manage applications, hall tickets, and timetables',
      icon: FileText,
      path: '/admin/exam-prerequisites',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Supervisory Duty',
      description: 'Allocate and manage examination duties',
      icon: Users,
      path: '/admin/supervisory-duty',
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'from-emerald-600 to-green-700'
    },
    {
      title: 'During Exam',
      description: 'Monitor ongoing exams and handle issues',
      icon: Clock,
      path: '/admin/during-exam',
      gradient: 'from-amber-500 to-orange-600',
      hoverGradient: 'from-amber-600 to-orange-700'
    },
    {
      title: 'Post Exam',
      description: 'Process results and manage evaluations',
      icon: FileCheck,
      path: '/admin/post-exam',
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-600 to-violet-700'
    }
  ];

  const upcomingExams = [
    {
      subject: 'Advanced Mathematics',
      date: '2025-03-15',
      time: '09:00 AM',
      venue: 'Hall A',
      supervisors: 12
    },
    {
      subject: 'Digital Electronics',
      date: '2025-03-16',
      time: '02:00 PM',
      venue: 'Lab Complex',
      supervisors: 8
    },
    {
      subject: 'Computer Networks',
      date: '2025-03-17',
      time: '10:00 AM',
      venue: 'Hall B',
      supervisors: 10
    }
  ];

  const recentActivities = [
    {
      id: '1',
      action: 'Hall tickets generated for Computer Science department',
      timestamp: '30 minutes ago',
      icon: FileCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: '2',
      action: 'New supervisor duty swap request received',
      timestamp: '1 hour ago',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: '3',
      action: 'UFM report submitted from Room 301',
      timestamp: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  const userInfo = {
    name: 'Dr. Sarah Johnson',
    role: 'Exam Coordinator',
    email: 'sarah.johnson@university.edu',
    phone: '9876543210',
    institution: 'University of Technology',
    accountType: 'Exam Coordinator',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  };

  return (
    <SectionDashboard title="Exam Coordinator Dashboard" userInfo={userInfo}>
      <AnnouncementBanner announcements={bannerAnnouncements} />
      <div className="max-w-7xl mx-auto space-y-8">
        <AnnouncementSection 
          announcements={announcements} 
          onViewMore={() => console.log('View more announcements')} 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="relative overflow-hidden rounded-xl shadow-lg group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 h-[200px]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} group-hover:${card.hoverGradient} transition-all duration-300`} />
                <div className="relative h-full p-6 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {card.title}
                    </h3>
                  </div>
                  
                  <p className="text-base text-white/90 leading-relaxed flex-grow">
                    {card.description}
                  </p>
                  
                  <div className="mt-4 self-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Exams */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upcoming Exams
                  </h2>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {upcomingExams.map((exam, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exam.subject}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(exam.date).toLocaleDateString()} at {exam.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {exam.supervisors} supervisors
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Venue: {exam.venue}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activities
                  </h2>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </SectionDashboard>
  );
};

export default AdminDashboard;