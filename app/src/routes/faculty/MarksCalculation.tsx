import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Lock, CheckCircle, BookOpen, Award, Download, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Faculty {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface ClassroomPerformance {
  internalAssessment: number;
  midSemester: number;
  endSemester: number;
  practicals: number;
  averageAttendance: number;
  topperName: string;
  topperMarks: number;
}

const MarksCalculation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classroomNumber, setClassroomNumber] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showClassroomSummary, setShowClassroomSummary] = useState(false);
  
  // Mock data
  const classroomPerformance: ClassroomPerformance = {
    internalAssessment: 78,
    midSemester: 72,
    endSemester: 68,
    practicals: 85,
    averageAttendance: 82,
    topperName: "Emily Johnson",
    topperMarks: 92
  };
  
  const faculties: Faculty[] = [
    { id: "1", name: "Dr. Jane Smith" },
    { id: "2", name: "Prof. Robert Johnson" },
    { id: "3", name: "Dr. Sarah Williams" },
  ];
  
  const subjects: Subject[] = [
    { id: "1", name: "Data Structures and Algorithms" },
    { id: "2", name: "Database Management Systems" },
    { id: "3", name: "Computer Networks" },
    { id: "4", name: "Operating Systems" },
  ];

  const examTypes = [
    { id: 'ia', name: 'Internal Assessment', percentage: 20, color: 'bg-blue-50 text-blue-600' },
    { id: 'mid', name: 'Mid Semester', percentage: 30, color: 'bg-purple-50 text-purple-600' },
    { id: 'end', name: 'End Semester', percentage: 40, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'prac', name: 'Practicals', percentage: 10, color: 'bg-amber-50 text-amber-600' },
  ];

  const handleAuthenticate = async () => {
    if (!classroomNumber || !facultyCode) {
      toast.error('Please enter both classroom number and faculty code');
      return;
    }
    setIsAuthenticating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setShowClassroomSummary(true);
    setIsAuthenticating(false);
    toast.success('Authentication successful!');
  };

  const handleExamTypeClick = (examType: string) => {
    if (!selectedFaculty || !selectedSubject) {
      toast.error('Please select faculty and subject first');
      return;
    }
    navigate(`/faculty/marks-submission/${classroomNumber}?exam=${examType}&subject=${selectedSubject}`);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Classroom Performance Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Classroom: ${classroomNumber}`, 14, 35);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
    
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Internal Assessment Avg', `${classroomPerformance.internalAssessment}%`],
        ['Mid Semester Avg', `${classroomPerformance.midSemester}%`],
        ['End Semester Avg', `${classroomPerformance.endSemester}%`],
        ['Practicals Avg', `${classroomPerformance.practicals}%`],
        ['Attendance', `${classroomPerformance.averageAttendance}%`],
        ['Topper', `${classroomPerformance.topperName} (${classroomPerformance.topperMarks}%)`],
      ],
    });
    
    doc.save(`classroom_${classroomNumber}_report.pdf`);
    toast.success('Report downloaded!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Marks Calculation</h1>
        <p className="mt-1 text-sm text-slate-500">Enter and manage student marks for different examinations.</p>
      </div>

      {!isAuthenticated ? (
        // Authentication Card
        <div className="max-w-md mx-auto">
          <section className="card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50"><Lock className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Classroom Authentication</h2>
                  <p className="text-sm text-slate-500">Enter your credentials to access marks</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Classroom Number</label>
                <input
                  type="text"
                  value={classroomNumber}
                  onChange={(e) => setClassroomNumber(e.target.value)}
                  placeholder="e.g., CS-101"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Faculty Code</label>
                <input
                  type="password"
                  value={facultyCode}
                  onChange={(e) => setFacultyCode(e.target.value)}
                  placeholder="Enter your code"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <button onClick={handleAuthenticate} disabled={isAuthenticating} className="btn-primary w-full flex items-center justify-center gap-2">
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Authenticate
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Selection & Exam Types */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Card */}
            <section className="card">
              <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-base font-semibold text-slate-800">Classroom: {classroomNumber}</span>
                </div>
                <button onClick={() => { setIsAuthenticated(false); setShowClassroomSummary(false); }} className="text-sm text-slate-500 hover:text-slate-700">
                  Change Classroom
                </button>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Select Faculty...</option>
                    {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Select Subject...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Exam Types */}
            <section className="card">
              <div className="card-header">
                <h2 className="text-base font-semibold text-slate-800">Select Examination Type</h2>
                <p className="text-sm text-slate-500 mt-1">Choose an exam type to enter marks</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {examTypes.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamTypeClick(exam.id)}
                    disabled={!selectedFaculty || !selectedSubject}
                    className={`card card-hover p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${exam.color}`}>
                        <Calculator className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{exam.name}</span>
                    </div>
                    <p className="text-xs text-slate-500">Weightage: {exam.percentage}%</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Performance Summary */}
          <div className="space-y-6">
            {showClassroomSummary && (
              <section className="card">
                <div className="card-header flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-800">Classroom Summary</h2>
                  <button onClick={downloadReport} className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Internal Assessment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${classroomPerformance.internalAssessment}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{classroomPerformance.internalAssessment}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mid Semester</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${classroomPerformance.midSemester}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{classroomPerformance.midSemester}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">End Semester</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${classroomPerformance.endSemester}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{classroomPerformance.endSemester}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Practicals</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${classroomPerformance.practicals}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{classroomPerformance.practicals}%</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Avg Attendance</span>
                      <span className="text-sm font-semibold text-slate-800">{classroomPerformance.averageAttendance}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Class Topper</span>
                      <span className="text-sm font-semibold text-slate-800">{classroomPerformance.topperName}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="card p-4 bg-slate-50">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-700 mb-1">Instructions</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Select faculty and subject first</li>
                    <li>• Click on exam type to enter marks</li>
                    <li>• All marks will be saved automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksCalculation;
