import React, { useState } from 'react';
import { FileText, Package, CheckCircle, Clock, Users, X, Download, Eye, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnswerSheetBundle {
  id: string;
  examName: string;
  roomNumber: string;
  totalSheets: number;
  submittedBy: string;
  submittedAt: string;
  status: 'received' | 'pending' | 'verified';
}

interface AttendanceReport {
  id: string;
  examName: string;
  date: string;
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}

const PostExam: React.FC = () => {
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<AnswerSheetBundle | null>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceReport | null>(null);

  const [bundles] = useState<AnswerSheetBundle[]>([
    { id: '1', examName: 'Data Structures', roomNumber: 'Room 101', totalSheets: 30, submittedBy: 'Dr. Sarah Johnson', submittedAt: '1:30 PM', status: 'verified' },
    { id: '2', examName: 'Data Structures', roomNumber: 'Room 102', totalSheets: 28, submittedBy: 'Prof. Michael Chen', submittedAt: '1:45 PM', status: 'received' },
    { id: '3', examName: 'Database Systems', roomNumber: 'Room 103', totalSheets: 32, submittedBy: 'Dr. Emily Brown', submittedAt: '2:00 PM', status: 'pending' },
    { id: '4', examName: 'Database Systems', roomNumber: 'Room 104', totalSheets: 29, submittedBy: 'Prof. James Wilson', submittedAt: '2:15 PM', status: 'received' },
  ]);

  const [attendanceReports] = useState<AttendanceReport[]>([
    { id: '1', examName: 'Data Structures', date: 'May 15, 2025', totalPresent: 58, totalAbsent: 2, percentage: 96.7 },
    { id: '2', examName: 'Database Systems', date: 'May 16, 2025', totalPresent: 55, totalAbsent: 5, percentage: 91.7 },
    { id: '3', examName: 'Operating Systems', date: 'May 17, 2025', totalPresent: 60, totalAbsent: 0, percentage: 100 },
  ]);

  const stats = {
    totalBundles: bundles.length,
    verified: bundles.filter(b => b.status === 'verified').length,
    pending: bundles.filter(b => b.status === 'pending').length,
    avgAttendance: Math.round(attendanceReports.reduce((acc, r) => acc + r.percentage, 0) / attendanceReports.length),
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified': return 'badge-success';
      case 'received': return 'badge-info';
      case 'pending': return 'badge-warning';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleVerifyBundle = (id: string) => {
    toast.success('Bundle verified successfully');
    setShowBundleModal(false);
  };

  const downloadAttendanceReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Examination Attendance Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    
    autoTable(doc, {
      startY: 45,
      head: [['Exam Name', 'Date', 'Present', 'Absent', 'Attendance %']],
      body: attendanceReports.map(r => [r.examName, r.date, r.totalPresent.toString(), r.totalAbsent.toString(), `${r.percentage}%`]),
    });
    
    doc.save('attendance_report.pdf');
    toast.success('Report downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Post Exam</h1>
        <p className="mt-1 text-sm text-slate-500">Manage answer sheet collection and attendance verification.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Bundles</span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.totalBundles}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Verified</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600">{stats.verified}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600">{stats.pending}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Avg Attendance</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.avgAttendance}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={downloadAttendanceReport} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Attendance Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Answer Sheet Bundles */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Answer Sheet Bundles</h2>
            <p className="text-sm text-slate-500 mt-1">Track submitted bundles from each room</p>
          </div>
          <div className="divide-y divide-slate-100">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{bundle.examName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(bundle.status)}`}>{bundle.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{bundle.roomNumber} • {bundle.totalSheets} sheets</p>
                    <p className="text-xs text-slate-400 mt-1">Submitted by {bundle.submittedBy} at {bundle.submittedAt}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedBundle(bundle); setShowBundleModal(true); }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Reports */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Attendance Reports</h2>
            <p className="text-sm text-slate-500 mt-1">View attendance statistics for each exam</p>
          </div>
          <div className="divide-y divide-slate-100">
            {attendanceReports.map((report) => (
              <div key={report.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{report.examName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${report.percentage >= 95 ? 'badge-success' : report.percentage >= 90 ? 'badge-info' : 'badge-warning'}`}>
                        {report.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{report.date}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-emerald-600">Present: {report.totalPresent}</span>
                      <span className="text-xs text-red-500">Absent: {report.totalAbsent}</span>
                    </div>
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${report.percentage}%` }}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedAttendance(report); setShowAttendanceModal(true); }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bundle Detail Modal */}
      {showBundleModal && selectedBundle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Bundle Details</h3>
              <button onClick={() => setShowBundleModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Exam</p><p className="text-sm font-medium text-slate-800">{selectedBundle.examName}</p></div>
                <div><p className="text-xs text-slate-500">Room</p><p className="text-sm text-slate-800">{selectedBundle.roomNumber}</p></div>
                <div><p className="text-xs text-slate-500">Total Sheets</p><p className="text-sm text-slate-800">{selectedBundle.totalSheets}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><p className={`text-sm capitalize ${selectedBundle.status === 'verified' ? 'text-emerald-600' : selectedBundle.status === 'pending' ? 'text-amber-600' : 'text-blue-600'}`}>{selectedBundle.status}</p></div>
                <div className="col-span-2"><p className="text-xs text-slate-500">Submitted By</p><p className="text-sm text-slate-800">{selectedBundle.submittedBy} at {selectedBundle.submittedAt}</p></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBundleModal(false)} className="btn-secondary flex-1">Close</button>
                {selectedBundle.status !== 'verified' && (
                  <button onClick={() => handleVerifyBundle(selectedBundle.id)} className="btn-primary flex-1">Mark Verified</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Detail Modal */}
      {showAttendanceModal && selectedAttendance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Attendance Details</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Exam</p><p className="text-sm font-medium text-slate-800">{selectedAttendance.examName}</p></div>
                <div><p className="text-xs text-slate-500">Date</p><p className="text-sm text-slate-800">{selectedAttendance.date}</p></div>
                <div><p className="text-xs text-slate-500">Present</p><p className="text-sm text-emerald-600 font-medium">{selectedAttendance.totalPresent}</p></div>
                <div><p className="text-xs text-slate-500">Absent</p><p className="text-sm text-red-500 font-medium">{selectedAttendance.totalAbsent}</p></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Attendance Rate</p>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full flex items-center justify-end pr-2" style={{ width: `${selectedAttendance.percentage}%` }}>
                    <span className="text-[10px] font-medium text-white">{selectedAttendance.percentage}%</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAttendanceModal(false)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostExam;
