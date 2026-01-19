import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck,
  Calendar, 
  Award,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar, ProgressRing } from '../../components/test/Progress';
import { SkeletonCard, SkeletonStat, SkeletonListItem } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

const TestDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const quickLinks = [
    { path: '/test/exam-prerequisites', icon: FileCheck, label: 'Exam Prerequisites', description: 'Apply for exams and download hall tickets', color: 'bg-blue-50 text-blue-600' },
    { path: '/test/exam-timetable', icon: Calendar, label: 'Exam Timetable', description: 'View your examination schedule', color: 'bg-purple-50 text-purple-600' },
    { path: '/test/results', icon: Award, label: 'Results', description: 'Check your semester results and grades', color: 'bg-amber-50 text-amber-600' },
    { path: '/test/kt-section', icon: RefreshCw, label: 'KT Section', description: 'Apply for backlog examinations', color: 'bg-rose-50 text-rose-600' },
  ];

  const upcomingExams = [
    { subject: 'Data Structures', code: 'CS301', date: 'Jan 20, 2026', time: '10:00 AM', venue: 'Hall A', daysLeft: 9 },
    { subject: 'Database Systems', code: 'CS302', date: 'Jan 22, 2026', time: '10:00 AM', venue: 'Hall B', daysLeft: 11 },
    { subject: 'Computer Networks', code: 'CS303', date: 'Jan 24, 2026', time: '02:00 PM', venue: 'Hall A', daysLeft: 13 },
  ];

  const notifications = [
    { id: 1, text: 'Hall ticket available for download', time: '2 hours ago', type: 'success' },
    { id: 2, text: 'Exam form submission deadline: Jan 15', time: '1 day ago', type: 'warning' },
    { id: 3, text: 'Results published for Semester 5', time: '3 days ago', type: 'info' },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <TestLayout title="Dashboard" subtitle="Welcome back! Here's an overview of your academic activities.">
        <div className="card mb-6 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-60 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <SkeletonStat />
              <SkeletonStat />
            </div>
          </div>
        </div>
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Dashboard" subtitle="Welcome back! Here's an overview of your academic activities.">
      {/* Student Info Card */}
      <div className="card mb-6">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={user?.photoUrl || '/images/default-avatar.png'} 
                alt=""
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl object-cover bg-slate-100 ring-2 ring-slate-100"
              />
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.course} • Semester {user?.semester}</p>
                <p className="text-sm text-slate-500">Roll No: {user?.rollNumber || user?.studentId}</p>
              </div>
            </div>
            <div className="flex gap-6 sm:gap-8 items-center">
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">CGPA</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-800">{user?.cgpa?.toFixed(2) || '8.75'}</p>
              </div>
              <ProgressRing value={87.5} size={60} strokeWidth={6} color="success" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <ProgressBar value={82} label="Attendance" showLabel color="success" />
            <ProgressBar value={65} label="Syllabus Covered" showLabel color="default" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} className="card card-hover p-4 group">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg ${link.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{link.label}</h4>
                        <p className="text-xs text-slate-500 mt-1 truncate-2">{link.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 mt-1 flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Upcoming Examinations</h3>
              <Link to="/test/exam-timetable" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{exam.subject}</p>
                      <p className="text-xs text-slate-500">{exam.code} • {exam.venue}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">{exam.date}</p>
                    <p className="text-xs text-slate-500">{exam.time}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                    {exam.daysLeft} days
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">92%</p>
              <p className="text-xs text-slate-500">Attendance</p>
            </div>
            <div className="card p-4 text-center">
              <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">5</p>
              <p className="text-xs text-slate-500">Rank</p>
            </div>
          </div>

          <section className="card">
            <div className="card-header">
              <h3 className="text-base font-semibold text-slate-800">Notifications</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-5 py-4 flex gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => showToast.info(notification.text)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate-2">{notification.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 w-full text-center"
                onClick={() => showToast.success('All notifications loaded')}
              >
                View all notifications
              </button>
            </div>
          </section>

          <div className="card p-4 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">💡 Quick Tip</p>
            <p className="text-sm text-slate-600">
              Download your hall ticket at least 3 days before your first exam.
            </p>
          </div>
        </div>
      </div>
    </TestLayout>
  );
};

export default TestDashboard;
