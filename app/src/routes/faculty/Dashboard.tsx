import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Calendar, GraduationCap, Clock, FileText, AlertCircle, Shield, ChevronRight, TrendingUp, Award, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for performance chart
  const performanceData = [
    { month: 'Jan', avgScore: 82 },
    { month: 'Feb', avgScore: 85 },
    { month: 'Mar', avgScore: 78 },
    { month: 'Apr', avgScore: 89 },
    { month: 'May', avgScore: 92 },
    { month: 'Jun', avgScore: 87 }
  ];

  const quickLinks = [
    { path: '/faculty/marks-calculation', icon: FileText, label: 'Marks Entry', description: 'Enter and manage student marks', color: 'bg-blue-50 text-blue-600' },
    { path: '/faculty/view-results', icon: GraduationCap, label: 'View Results', description: 'View and publish exam results', color: 'bg-emerald-50 text-emerald-600' },
    { path: '/faculty/proctor-section', icon: Shield, label: 'Proctor Section', description: 'Monitor exams and detect irregularities', color: 'bg-rose-50 text-rose-600' },
    { path: '/faculty/supervisor-duty', icon: Calendar, label: 'Supervisor Duty', description: 'Manage supervision assignments', color: 'bg-purple-50 text-purple-600' },
  ];

  const upcomingDuties = [
    { subject: 'Data Structures', code: 'CS301', date: 'Jan 20, 2026', time: '10:00 AM', classroom: 'Hall A' },
    { subject: 'Database Systems', code: 'CS302', date: 'Jan 22, 2026', time: '02:00 PM', classroom: 'Hall B' },
    { subject: 'Computer Networks', code: 'CS303', date: 'Jan 24, 2026', time: '11:00 AM', classroom: 'Hall C' },
  ];

  const announcements = [
    { id: 1, text: 'End semester examination schedule released', time: '2 hours ago', type: 'info' },
    { id: 2, text: 'Faculty meeting tomorrow at 10:00 AM', time: '5 hours ago', type: 'warning' },
    { id: 3, text: 'Marks submission deadline: Jan 15, 2026', time: '1 day ago', type: 'success' },
  ];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! Here's an overview of your academic activities.</p>
      </div>

      {/* Faculty Info Card */}
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
                <p className="text-sm text-slate-500">{user?.department || 'Computer Science & Engineering'}</p>
                <p className="text-sm text-slate-500">{user?.designation || 'Associate Professor'}</p>
              </div>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Classes Today</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-800">4</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Pending Tasks</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-800">3</p>
              </div>
            </div>
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

          {/* Performance Chart */}
          <section className="card">
            <div className="card-header">
              <h3 className="text-base font-semibold text-slate-800">Class Performance</h3>
              <p className="text-sm text-slate-500 mt-1">Average student scores over months</p>
            </div>
            <div className="p-5">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#334155" strokeWidth={2} dot={{ fill: '#334155', strokeWidth: 2 }} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Upcoming Duties */}
          <section className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Upcoming Supervision Duties</h3>
              <Link to="/faculty/supervisor-duty" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingDuties.map((duty, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Book className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{duty.subject}</p>
                      <p className="text-xs text-slate-500">{duty.code} • {duty.classroom}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">{duty.date}</p>
                    <p className="text-xs text-slate-500">{duty.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">245</p>
              <p className="text-xs text-slate-500">Students</p>
            </div>
            <div className="card p-4 text-center">
              <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">6</p>
              <p className="text-xs text-slate-500">Subjects</p>
            </div>
          </div>

          <section className="card">
            <div className="card-header">
              <h3 className="text-base font-semibold text-slate-800">Announcements</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="px-5 py-4 flex gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  {getAnnouncementIcon(announcement.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate-2">{announcement.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{announcement.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 w-full text-center">
                View all announcements
              </button>
            </div>
          </section>

          <div className="card p-4 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">📋 Reminder</p>
            <p className="text-sm text-slate-600">
              Marks submission deadline for Semester 6 is Jan 15, 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
