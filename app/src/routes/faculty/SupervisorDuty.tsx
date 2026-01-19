import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface DutyAssignment {
  id: string;
  date: string;
  time: string;
  subject: string;
  subjectCode: string;
  classroom: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
}

const SupervisorDuty: React.FC = () => {
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null);
  const [requestReason, setRequestReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const duties: DutyAssignment[] = [
    { id: '1', date: 'Jan 20, 2026', time: '10:00 AM', subject: 'Data Structures', subjectCode: 'CS301', classroom: 'Hall A', status: 'upcoming', duration: '3 hours' },
    { id: '2', date: 'Jan 22, 2026', time: '02:00 PM', subject: 'Database Systems', subjectCode: 'CS302', classroom: 'Hall B', status: 'upcoming', duration: '3 hours' },
    { id: '3', date: 'Jan 15, 2026', time: '10:00 AM', subject: 'Computer Networks', subjectCode: 'CS303', classroom: 'Hall C', status: 'completed', duration: '3 hours' },
    { id: '4', date: 'Jan 18, 2026', time: '02:00 PM', subject: 'Operating Systems', subjectCode: 'CS304', classroom: 'Hall A', status: 'cancelled', duration: '3 hours' },
    { id: '5', date: 'Jan 24, 2026', time: '10:00 AM', subject: 'Software Engineering', subjectCode: 'CS305', classroom: 'Hall B', status: 'upcoming', duration: '3 hours' },
  ];

  const stats = {
    total: duties.length,
    upcoming: duties.filter(d => d.status === 'upcoming').length,
    completed: duties.filter(d => d.status === 'completed').length,
    cancelled: duties.filter(d => d.status === 'cancelled').length,
  };

  const filteredDuties = filterStatus === 'all' ? duties : duties.filter(d => d.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'cancelled': return <span className="badge badge-error"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="badge badge-info"><Clock className="w-3 h-3" /> Upcoming</span>;
    }
  };

  const handleRequestChange = (duty: DutyAssignment) => {
    setSelectedDuty(duty);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    if (!requestReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    toast.success('Change request submitted successfully');
    setShowRequestModal(false);
    setRequestReason('');
    setSelectedDuty(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Supervisor Duty</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage your examination supervision assignments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`card p-4 text-left transition-all ${filterStatus === 'all' ? 'ring-2 ring-slate-400 border-slate-400' : ''}`}
        >
          <p className="text-sm text-slate-500">Total Duties</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </button>
        <button
          onClick={() => setFilterStatus('upcoming')}
          className={`card p-4 text-left transition-all ${filterStatus === 'upcoming' ? 'ring-2 ring-slate-400 border-slate-400' : ''}`}
        >
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`card p-4 text-left transition-all ${filterStatus === 'completed' ? 'ring-2 ring-slate-400 border-slate-400' : ''}`}
        >
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`card p-4 text-left transition-all ${filterStatus === 'cancelled' ? 'ring-2 ring-slate-400 border-slate-400' : ''}`}
        >
          <p className="text-sm text-slate-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </button>
      </div>

      {/* Duties List */}
      <section className="card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Duty Schedule</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Date & Time</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Venue</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Duration</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDuties.map((duty) => (
              <tr key={duty.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{duty.date}</p>
                      <p className="text-xs text-slate-500">{duty.time}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">{duty.subject}</p>
                  <p className="text-xs text-slate-500 font-mono">{duty.subjectCode}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{duty.classroom}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm text-slate-600">{duty.duration}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  {getStatusBadge(duty.status)}
                </td>
                <td className="px-5 py-4 text-center">
                  {duty.status === 'upcoming' && (
                    <button
                      onClick={() => handleRequestChange(duty)}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      Request Change
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDuties.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No duties found</p>
            <p className="text-sm text-slate-500 mt-1">Try changing the filter.</p>
          </div>
        )}
      </section>

      {/* Request Change Modal */}
      {showRequestModal && selectedDuty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Request Duty Change</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-800">{selectedDuty.subject}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>{selectedDuty.date}</span>
                  <span>{selectedDuty.time}</span>
                  <span>{selectedDuty.classroom}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Change Request</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Please provide your reason..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRequestModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmitRequest} className="btn-primary flex-1">Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDuty;
