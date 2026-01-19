import React, { useState } from 'react';
import { Shield, Camera, AlertTriangle, CheckCircle, Clock, Eye, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Activity {
  id: string;
  timestamp: string;
  type: 'suspicious' | 'normal';
  description: string;
  classroom: string;
  studentId?: string;
}

const ProctorSection: React.FC = () => {
  const { user } = useAuth();
  const [classroomNumber, setClassroomNumber] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showUFMModal, setShowUFMModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [ufmReason, setUfmReason] = useState('');
  
  const [activities] = useState<Activity[]>([
    { id: '1', timestamp: '10:15 AM', type: 'suspicious', description: 'Student looking away from screen repeatedly', classroom: 'CS-101', studentId: 'S003' },
    { id: '2', timestamp: '10:12 AM', type: 'normal', description: 'All students focused on exam', classroom: 'CS-101' },
    { id: '3', timestamp: '10:08 AM', type: 'suspicious', description: 'Multiple objects detected near student', classroom: 'CS-102', studentId: 'S007' },
    { id: '4', timestamp: '10:05 AM', type: 'normal', description: 'Exam started successfully', classroom: 'CS-101' },
    { id: '5', timestamp: '10:02 AM', type: 'suspicious', description: 'Audio anomaly detected', classroom: 'CS-102', studentId: 'S012' },
  ]);

  const stats = {
    totalAlerts: activities.filter(a => a.type === 'suspicious').length,
    resolvedAlerts: 1,
    activeClassrooms: 2,
    studentsMonitored: 120,
  };

  const handleStartMonitoring = () => {
    if (!classroomNumber) {
      toast.error('Please enter a classroom number');
      return;
    }
    setIsMonitoring(true);
    toast.success(`Started monitoring classroom ${classroomNumber}`);
  };

  const handleReportUFM = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowUFMModal(true);
  };

  const handleSubmitUFM = () => {
    if (!ufmReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    toast.success('UFM report submitted successfully');
    setShowUFMModal(false);
    setUfmReason('');
    setSelectedActivity(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Proctor Section</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor examinations and detect irregularities.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.totalAlerts}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Resolved</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.resolvedAlerts}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Active Classrooms</span>
            <Camera className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.activeClassrooms}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Students Monitored</span>
            <Eye className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.studentsMonitored}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monitoring Control */}
          <section className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-800">Monitoring Control</h2>
            </div>
            <div className="p-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Classroom Number</label>
                  <input
                    type="text"
                    value={classroomNumber}
                    onChange={(e) => setClassroomNumber(e.target.value)}
                    placeholder="e.g., CS-101"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleStartMonitoring}
                    disabled={isMonitoring}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isMonitoring
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'btn-primary'
                    }`}
                  >
                    {isMonitoring ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Monitoring
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Start Monitoring
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-800">Activity Feed</h2>
              <p className="text-sm text-slate-500 mt-1">Real-time monitoring alerts</p>
            </div>
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`px-5 py-4 flex items-start gap-4 ${activity.type === 'suspicious' ? 'bg-red-50/50' : ''}`}
                >
                  <div className={`p-2 rounded-lg ${activity.type === 'suspicious' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                    {activity.type === 'suspicious' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{activity.classroom}</span>
                      <span className="text-xs text-slate-400">{activity.timestamp}</span>
                      {activity.studentId && (
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {activity.studentId}
                        </span>
                      )}
                    </div>
                  </div>
                  {activity.type === 'suspicious' && (
                    <button
                      onClick={() => handleReportUFM(activity)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" /> Report UFM
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" /> View Live Feed
              </button>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Download Report
              </button>
            </div>
          </section>

          <div className="card p-4 bg-amber-50 border-amber-200">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Attention Required</p>
                <p className="text-amber-700 mt-1">{stats.totalAlerts - stats.resolvedAlerts} unresolved alerts need your attention.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UFM Report Modal */}
      {showUFMModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Report UFM</h3>
              <button
                onClick={() => setShowUFMModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Incident</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{selectedActivity.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>{selectedActivity.classroom}</span>
                  <span>{selectedActivity.timestamp}</span>
                  {selectedActivity.studentId && <span>Student: {selectedActivity.studentId}</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for UFM Report</label>
                <textarea
                  value={ufmReason}
                  onChange={(e) => setUfmReason(e.target.value)}
                  placeholder="Describe the reason..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUFMModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmitUFM} className="btn-primary flex-1">Submit Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProctorSection;
