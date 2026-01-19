import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickLinks = [
    { path: '/student/exam-prerequisites', icon: FileCheck, label: 'Exam Prerequisites', description: 'Apply for exams and download hall tickets', color: 'bg-blue-50 text-blue-600' },
    { path: '/student/exam-timetable', icon: Calendar, label: 'Exam Timetable', description: 'View your examination schedule', color: 'bg-purple-50 text-purple-600' },
    { path: '/student/results', icon: Award, label: 'Results', description: 'Check your semester results and grades', color: 'bg-amber-50 text-amber-600' },
    { path: '/student/kt-section', icon: RefreshCw, label: 'KT Section', description: 'Apply for backlog examinations', color: 'bg-rose-50 text-rose-600' },
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

  // Progress ring component
  const ProgressRing = ({ value, size = 60, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#10b981" strokeWidth={strokeWidth} 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
    );
  };

  // Progress bar component
  const ProgressBar = ({ value, label }: { value: number; label: string }) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! Here's an overview of your academic activities.</p>
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
              <Link to="/student/exam-timetable" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
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
                <div key={notification.id} className="px-5 py-4 flex gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate-2">{notification.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 w-full text-center">
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
    </div>
  );
};

export default Dashboard;
