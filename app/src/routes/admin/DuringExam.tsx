import React, { useState } from 'react';
import { AlertTriangle, LayoutGrid, Search, Eye, Calendar, Building, Users, RefreshCw, CheckCircle, X, Download, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProctorNotification {
  id: string;
  proctorName: string;
  roomNumber: string;
  message: string;
  timestamp: string;
  urgency: 'urgent' | 'normal';
}

interface UFMReport {
  id: string;
  examName: string;
  candidateName: string;
  rollNumber: string;
  description: string;
  facultyName: string;
  timestamp: string;
}

const DuringExam: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUFMModal, setShowUFMModal] = useState(false);
  const [showSeatingModal, setShowSeatingModal] = useState(false);
  const [selectedUFM, setSelectedUFM] = useState<UFMReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seatingGenerated, setSeatingGenerated] = useState(false);

  const [notifications] = useState<ProctorNotification[]>([
    { id: '1', proctorName: 'Dr. Sarah Johnson', roomNumber: 'Room 101', message: 'Student requests washroom break', timestamp: '10:15 AM', urgency: 'normal' },
    { id: '2', proctorName: 'Prof. Michael Chen', roomNumber: 'Room 203', message: 'Suspected malpractice detected', timestamp: '10:30 AM', urgency: 'urgent' },
    { id: '3', proctorName: 'Dr. Emily Brown', roomNumber: 'Room 105', message: 'Question paper clarification needed', timestamp: '10:45 AM', urgency: 'normal' },
  ]);

  const [ufmReports] = useState<UFMReport[]>([
    { id: '1', examName: 'Data Structures', candidateName: 'John Doe', rollNumber: 'CS2025001', description: 'Using mobile phone during exam', facultyName: 'Dr. Sarah Johnson', timestamp: '10:30 AM' },
    { id: '2', examName: 'Database Systems', candidateName: 'Jane Smith', rollNumber: 'CS2025002', description: 'Chits found with exam-related content', facultyName: 'Prof. Michael Chen', timestamp: '11:00 AM' },
  ]);

  const stats = {
    activeExams: 8,
    activeRooms: 24,
    totalCandidates: 480,
    ufmCases: ufmReports.length,
  };

  const handleGenerateSeating = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setSeatingGenerated(true);
    setShowSeatingModal(false);
    toast.success('Seating arrangement generated successfully');
  };

  const downloadSeatingPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Examination Seating Arrangement', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    
    autoTable(doc, {
      startY: 45,
      head: [['Room', 'Capacity', 'Subject', 'Start Roll', 'End Roll']],
      body: [
        ['Room 101', '30', 'Data Structures', 'CS001', 'CS030'],
        ['Room 102', '30', 'Data Structures', 'CS031', 'CS060'],
        ['Room 103', '30', 'Database Systems', 'CS061', 'CS090'],
        ['Room 104', '30', 'Database Systems', 'CS091', 'CS120'],
      ],
    });
    
    doc.save('seating_arrangement.pdf');
    toast.success('PDF downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">During Exam</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor ongoing examinations and handle real-time issues.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Active Exams</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.activeExams}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Active Rooms</span>
            <Building className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.activeRooms}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Candidates</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.totalCandidates}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">UFM Cases</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-600">{stats.ufmCases}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setShowSeatingModal(true)} className="btn-primary flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" /> Generate Seating
        </button>
        {seatingGenerated && (
          <button onClick={downloadSeatingPDF} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Seating PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proctor Notifications */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Proctor Notifications</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time alerts from supervisors</p>
          </div>
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-5 py-4 ${notification.urgency === 'urgent' ? 'bg-red-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${notification.urgency === 'urgent' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {notification.urgency === 'urgent' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{notification.proctorName}</p>
                      <span className="text-xs text-slate-400">{notification.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500">{notification.roomNumber}</p>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UFM Reports */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">UFM Reports</h2>
            <p className="text-sm text-slate-500 mt-1">Unfair means cases reported</p>
          </div>
          <div className="divide-y divide-slate-100">
            {ufmReports.map((report) => (
              <div key={report.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{report.candidateName}</p>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{report.rollNumber}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{report.examName} • {report.facultyName}</p>
                    <p className="text-sm text-slate-600 mt-2">{report.description}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedUFM(report); setShowUFMModal(true); }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* UFM Detail Modal */}
      {showUFMModal && selectedUFM && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">UFM Report Details</h3>
              <button onClick={() => setShowUFMModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Candidate</p><p className="text-sm font-medium text-slate-800">{selectedUFM.candidateName}</p></div>
                <div><p className="text-xs text-slate-500">Roll Number</p><p className="text-sm font-mono text-slate-800">{selectedUFM.rollNumber}</p></div>
                <div><p className="text-xs text-slate-500">Exam</p><p className="text-sm text-slate-800">{selectedUFM.examName}</p></div>
                <div><p className="text-xs text-slate-500">Reported By</p><p className="text-sm text-slate-800">{selectedUFM.facultyName}</p></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg">{selectedUFM.description}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUFMModal(false)} className="btn-secondary flex-1">Close</button>
                <button onClick={() => { toast.success('Case forwarded to disciplinary committee'); setShowUFMModal(false); }} className="btn-primary flex-1">Forward Case</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seating Modal */}
      {showSeatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Generate Seating Arrangement</h3>
              <button onClick={() => setShowSeatingModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">This will generate a randomized seating arrangement for all scheduled exams today.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowSeatingModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleGenerateSeating} disabled={isGenerating} className="btn-primary flex-1">
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuringExam;
