import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertCircle, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle,
  GraduationCap,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Award,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: 'Active Exams', value: '8', icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { title: 'Supervisors', value: '45', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Pending Tasks', value: '12', icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { title: 'Grievances', value: '5', icon: AlertCircle, color: 'bg-rose-50 text-rose-600' },
  ];

  const quickLinks = [
    { path: '/admin/exam-prerequisites', icon: FileCheck, label: 'Exam Prerequisites', description: 'Manage applications, hall tickets, and timetables', color: 'bg-blue-50 text-blue-600' },
    { path: '/admin/supervisory-duty', icon: Calendar, label: 'Supervisory Duty', description: 'Allocate and manage supervisor duties', color: 'bg-purple-50 text-purple-600' },
    { path: '/admin/during-exam', icon: Clock, label: 'During Exam', description: 'Monitor ongoing examinations', color: 'bg-emerald-50 text-emerald-600' },
    { path: '/admin/post-exam', icon: ClipboardList, label: 'Post Exam', description: 'Handle answer sheet collection and grading', color: 'bg-amber-50 text-amber-600' },
  ];

  const upcomingExams = [
    { subject: 'Data Structures', code: 'CS301', date: 'Jan 20, 2026', time: '10:00 AM', supervisors: 4 },
    { subject: 'Database Systems', code: 'CS302', date: 'Jan 22, 2026', time: '10:00 AM', supervisors: 3 },
    { subject: 'Computer Networks', code: 'CS303', date: 'Jan 24, 2026', time: '02:00 PM', supervisors: 5 },
  ];

  const pendingTasks = [
    { id: 1, text: 'Approve hall ticket applications (15 pending)', type: 'warning', time: 'Due today' },
    { id: 2, text: 'Allocate supervisors for CS302 exam', type: 'error', time: 'Overdue' },
    { id: 3, text: 'Review grievance applications', type: 'info', time: 'Due in 2 days' },
    { id: 4, text: 'Update exam timetable', type: 'success', time: 'Completed' },
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! Here's an overview of the examination system.</p>
      </div>

      {/* Admin Info Card */}
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
                <p className="text-sm text-slate-500">Exam Coordinator</p>
                <p className="text-sm text-slate-500">Department of Examinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access */}
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

          {/* Upcoming Exams */}
          <section className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Upcoming Examinations</h3>
              <Link to="/admin/during-exam" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{exam.subject}</p>
                      <p className="text-xs text-slate-500">{exam.code} • {exam.supervisors} supervisors</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">{exam.date}</p>
                    <p className="text-xs text-slate-500">{exam.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">245</p>
              <p className="text-xs text-slate-500">Students</p>
            </div>
            <div className="card p-4 text-center">
              <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">15</p>
              <p className="text-xs text-slate-500">Subjects</p>
            </div>
          </div>

          {/* Pending Tasks */}
          <section className="card">
            <div className="card-header">
              <h3 className="text-base font-semibold text-slate-800">Pending Tasks</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingTasks.map((task) => (
                <div key={task.id} className="px-5 py-4 flex gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  {getTaskIcon(task.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate-2">{task.text}</p>
                    <p className={`text-xs mt-1 ${task.type === 'error' ? 'text-red-500' : task.type === 'success' ? 'text-emerald-500' : 'text-slate-400'}`}>{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 w-full text-center">
                View all tasks
              </button>
            </div>
          </section>

          <div className="card p-4 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">📋 Reminder</p>
            <p className="text-sm text-slate-600">
              Supervisor duty allocation for next week needs to be completed by Jan 17, 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
