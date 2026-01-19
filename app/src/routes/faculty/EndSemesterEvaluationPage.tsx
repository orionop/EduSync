import React, { useState } from 'react';
import { ClipboardCheck, Users, CheckCircle, AlertCircle, Download, Search, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  status: 'evaluated' | 'pending';
}

interface Subject {
  id: string;
  code: string;
  name: string;
  totalStudents: number;
  evaluated: number;
  pending: number;
}

const EndSemesterEvaluationPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState({ internal: 0, external: 0 });

  const subjects: Subject[] = [
    { id: '1', code: 'CS301', name: 'Data Structures', totalStudents: 60, evaluated: 45, pending: 15 },
    { id: '2', code: 'CS302', name: 'Database Systems', totalStudents: 58, evaluated: 58, pending: 0 },
    { id: '3', code: 'CS303', name: 'Computer Networks', totalStudents: 55, evaluated: 30, pending: 25 },
  ];

  const students: Student[] = [
    { id: '1', rollNo: '001', name: 'John Doe', internalMarks: 22, externalMarks: 68, totalMarks: 90, grade: 'A', status: 'evaluated' },
    { id: '2', rollNo: '002', name: 'Jane Smith', internalMarks: 24, externalMarks: 72, totalMarks: 96, grade: 'A+', status: 'evaluated' },
    { id: '3', rollNo: '003', name: 'Bob Johnson', internalMarks: 0, externalMarks: 0, totalMarks: 0, grade: '-', status: 'pending' },
    { id: '4', rollNo: '004', name: 'Alice Brown', internalMarks: 20, externalMarks: 65, totalMarks: 85, grade: 'B+', status: 'evaluated' },
    { id: '5', rollNo: '005', name: 'Charlie Wilson', internalMarks: 0, externalMarks: 0, totalMarks: 0, grade: '-', status: 'pending' },
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.includes(searchQuery)
  );

  const handleEvaluate = (student: Student) => {
    setSelectedStudent(student);
    setMarks({ internal: student.internalMarks, external: student.externalMarks });
    setShowEvaluationModal(true);
  };

  const handleSubmitEvaluation = () => {
    if (marks.internal > 25 || marks.external > 75) {
      toast.error('Marks exceed maximum limit');
      return;
    }
    toast.success('Evaluation saved successfully');
    setShowEvaluationModal(false);
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">End Semester Evaluation</h1>
        <p className="mt-1 text-sm text-slate-500">Evaluate and submit student marks for end semester examinations.</p>
      </div>

      {/* Subject Selection */}
      <section className="card mb-6">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Select Subject</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`card p-4 text-left transition-all ${
                  selectedSubject === subject.id ? 'ring-2 ring-slate-400 border-slate-400' : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                  {subject.pending === 0 ? (
                    <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Done</span>
                  ) : (
                    <span className="badge badge-warning"><AlertCircle className="w-3 h-3" /> {subject.pending} left</span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800">{subject.name}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>{subject.totalStudents} students</span>
                  <span>{subject.evaluated} evaluated</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedSubject && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-800">{selectedSubjectData?.totalStudents}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500">Evaluated</p>
              <p className="text-2xl font-bold text-emerald-600">{selectedSubjectData?.evaluated}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{selectedSubjectData?.pending}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500">Progress</p>
              <p className="text-2xl font-bold text-slate-800">
                {Math.round(((selectedSubjectData?.evaluated || 0) / (selectedSubjectData?.totalStudents || 1)) * 100)}%
              </p>
            </div>
          </div>

          {/* Students List */}
          <section className="card overflow-hidden">
            <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-base font-semibold text-slate-800">Student Evaluation</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Roll No</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Name</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Internal (25)</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">External (75)</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Total (100)</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Grade</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono text-sm text-slate-600">{student.rollNo}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">{student.name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 text-center">{student.status === 'evaluated' ? student.internalMarks : '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 text-center">{student.status === 'evaluated' ? student.externalMarks : '-'}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800 text-center">{student.status === 'evaluated' ? student.totalMarks : '-'}</td>
                    <td className="px-5 py-4 text-center">
                      {student.status === 'evaluated' ? (
                        <span className={`badge ${student.grade.startsWith('A') ? 'badge-success' : 'badge-info'}`}>{student.grade}</span>
                      ) : (
                        <span className="badge badge-neutral">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleEvaluate(student)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        {student.status === 'evaluated' ? 'Edit' : 'Evaluate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Evaluate Student</h3>
              <button onClick={() => setShowEvaluationModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Student</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.name}</p>
                <p className="text-xs text-slate-500 mt-1">Roll No: {selectedStudent.rollNo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Marks (Max: 25)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={marks.internal}
                    onChange={(e) => setMarks({ ...marks, internal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">External Marks (Max: 75)</label>
                  <input
                    type="number"
                    min="0"
                    max="75"
                    value={marks.external}
                    onChange={(e) => setMarks({ ...marks, external: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-500">Total Marks</p>
                <p className="text-2xl font-bold text-slate-800">{marks.internal + marks.external}/100</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEvaluationModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmitEvaluation} className="btn-primary flex-1">Save Evaluation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndSemesterEvaluationPage;
