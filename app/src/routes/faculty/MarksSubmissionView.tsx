import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Download, Save, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  marks: number;
  maxMarks: number;
  status: 'entered' | 'pending';
}

const MarksSubmissionView: React.FC = () => {
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editedMarks, setEditedMarks] = useState<{ [key: string]: number }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const examType = searchParams.get('exam') || 'ia';
  const subjectId = searchParams.get('subject') || '';

  const examTypeLabel: { [key: string]: string } = {
    'ia': 'Internal Assessment',
    'mid': 'Mid Semester',
    'end': 'End Semester',
    'prac': 'Practicals',
  };

  const maxMarks: { [key: string]: number } = {
    'ia': 20,
    'mid': 30,
    'end': 40,
    'prac': 10,
  };

  const [students, setStudents] = useState<Student[]>([
    { id: '1', rollNo: 'S001', name: 'John Doe', marks: 0, maxMarks: maxMarks[examType], status: 'pending' },
    { id: '2', rollNo: 'S002', name: 'Jane Smith', marks: 18, maxMarks: maxMarks[examType], status: 'entered' },
    { id: '3', rollNo: 'S003', name: 'Bob Johnson', marks: 0, maxMarks: maxMarks[examType], status: 'pending' },
    { id: '4', rollNo: 'S004', name: 'Alice Brown', marks: 15, maxMarks: maxMarks[examType], status: 'entered' },
    { id: '5', rollNo: 'S005', name: 'Charlie Wilson', marks: 0, maxMarks: maxMarks[examType], status: 'pending' },
    { id: '6', rollNo: 'S006', name: 'Diana Ross', marks: 17, maxMarks: maxMarks[examType], status: 'entered' },
  ]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: students.length,
    entered: students.filter(s => s.status === 'entered').length,
    pending: students.filter(s => s.status === 'pending').length,
  };

  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue > maxMarks[examType]) {
      toast.error(`Marks cannot exceed ${maxMarks[examType]}`);
      return;
    }
    setEditedMarks({ ...editedMarks, [studentId]: numValue });
  };

  const handleSaveAll = () => {
    if (Object.keys(editedMarks).length === 0) {
      toast.error('No changes to save');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    setStudents(students.map(s => ({
      ...s,
      marks: editedMarks[s.id] !== undefined ? editedMarks[s.id] : s.marks,
      status: editedMarks[s.id] !== undefined ? 'entered' : s.status,
    })));
    setEditedMarks({});
    setShowConfirmModal(false);
    toast.success('Marks saved successfully');
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${examTypeLabel[examType]} - Marks Report`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Classroom: ${classroomId}`, 14, 35);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
    
    autoTable(doc, {
      startY: 55,
      head: [['Roll No', 'Name', `Marks (${maxMarks[examType]})`]],
      body: students.map(s => [s.rollNo, s.name, s.marks.toString()]),
    });
    
    doc.save(`marks_${classroomId}_${examType}.pdf`);
    toast.success('Report downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/faculty/marks-calculation')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{examTypeLabel[examType]}</h1>
            <p className="text-sm text-slate-500">Classroom: {classroomId} • Max Marks: {maxMarks[examType]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadReport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handleSaveAll} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Marks Entered</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.entered}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Students Table */}
      <section className="card overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Enter Marks</h2>
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
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Roll No</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Name</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Marks ({maxMarks[examType]})</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-sm text-slate-600">{student.rollNo}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-800">{student.name}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <input
                      type="number"
                      min="0"
                      max={maxMarks[examType]}
                      value={editedMarks[student.id] !== undefined ? editedMarks[student.id] : student.marks}
                      onChange={(e) => handleMarksChange(student.id, e.target.value)}
                      className="w-20 px-3 py-1.5 text-center bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  {student.status === 'entered' || editedMarks[student.id] !== undefined ? (
                    <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Entered</span>
                  ) : (
                    <span className="badge badge-warning"><AlertCircle className="w-3 h-3" /> Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Confirm Save</h3>
              <button onClick={() => setShowConfirmModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">
                You are about to save marks for {Object.keys(editedMarks).length} student(s). This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={confirmSave} className="btn-primary flex-1">Confirm Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksSubmissionView;
