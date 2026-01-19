import React, { useState } from 'react';
import { FileText, Ticket, FileCheck, ChevronRight, Clock, Calendar, Users, CheckCircle } from 'lucide-react';
import TimetableModal from '../../components/admin/modals/TimetableModal';
import HallTicketModal from '../../components/admin/modals/HallTicketModal';
import ApplicationsModal from '../../components/admin/modals/ApplicationsModal';

interface DutySwapLog {
  id: string;
  date: string;
  time: string;
  facultyName: string;
  oldSlot: string;
  newSlot: string;
  swappedWith: string;
}

const ExamPrerequisites: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'timetable' | 'hallTickets' | 'applications' | null>(null);

  const [dutyLogs] = useState<DutySwapLog[]>([
    { id: '1', date: 'Jan 15, 2026', time: '09:30 AM', facultyName: 'Dr. Sarah Johnson', oldSlot: 'Room 101 (9:00 AM)', newSlot: 'Room 203 (2:00 PM)', swappedWith: 'Prof. Robert Wilson' },
    { id: '2', date: 'Jan 15, 2026', time: '10:15 AM', facultyName: 'Prof. Michael Chen', oldSlot: 'Room 202 (11:00 AM)', newSlot: 'Room 105 (3:00 PM)', swappedWith: 'Dr. Lisa Anderson' },
    { id: '3', date: 'Jan 16, 2026', time: '08:45 AM', facultyName: 'Dr. Emily Brown', oldSlot: 'Room 303 (10:00 AM)', newSlot: 'Room 401 (1:00 PM)', swappedWith: 'Prof. James Taylor' },
  ]);

  const features = [
    { id: 'timetable', title: 'Exam Timetable', description: 'Create and manage examination schedules', icon: Calendar, color: 'bg-blue-50 text-blue-600', stats: { label: 'Upcoming Exams', value: '12' }, modalType: 'timetable' as const },
    { id: 'hall-tickets', title: 'Hall Tickets', description: 'Generate and distribute hall tickets', icon: Ticket, color: 'bg-purple-50 text-purple-600', stats: { label: 'Pending', value: '45' }, modalType: 'hallTickets' as const },
    { id: 'applications', title: 'Applications', description: 'Review examination applications', icon: FileCheck, color: 'bg-emerald-50 text-emerald-600', stats: { label: 'To Review', value: '28' }, modalType: 'applications' as const },
  ];

  const stats = [
    { label: 'Total Students', value: '2,450', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Exams Scheduled', value: '15', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Hall Tickets Generated', value: '1,890', icon: Ticket, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Applications Approved', value: '2,120', icon: CheckCircle, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Exam Prerequisites</h1>
        <p className="mt-1 text-sm text-slate-500">Manage timetables, hall tickets, and applications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveModal(feature.modalType)}
              className="card card-hover p-5 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{feature.stats.label}: {feature.stats.value}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Duty Swap Logs */}
      <section className="card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Recent Duty Swap Logs</h2>
          <p className="text-sm text-slate-500 mt-1">Track faculty duty changes and swaps</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Date/Time</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Faculty</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Old Slot</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">New Slot</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Swapped With</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dutyLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{log.date}</p>
                      <p className="text-xs text-slate-500">{log.time}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{log.facultyName}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{log.oldSlot}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{log.newSlot}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{log.swappedWith}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modals */}
      {activeModal === 'timetable' && <TimetableModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'hallTickets' && <HallTicketModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'applications' && <ApplicationsModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default ExamPrerequisites;
