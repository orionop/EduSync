import React, { useState } from 'react';
import { Award, Users, TrendingUp, ChevronRight, X, Search } from 'lucide-react';

interface Classroom {
  id: string;
  classroomNumber: string;
  year: number;
  semester: number;
  division: string;
  students: number;
  avgSGPA: number;
}

interface Student {
  rollNumber: string;
  name: string;
  passFail: 'Pass' | 'Fail';
  sgpa: number;
  internalMarks: number;
  endSemMarks: number;
}

const ViewResults: React.FC = () => {
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const classrooms: Classroom[] = [
    { id: '1', classroomNumber: 'CS-101', year: 2024, semester: 5, division: 'A', students: 60, avgSGPA: 8.2 },
    { id: '2', classroomNumber: 'CS-102', year: 2024, semester: 5, division: 'B', students: 58, avgSGPA: 7.9 },
    { id: '3', classroomNumber: 'CS-201', year: 2024, semester: 6, division: 'A', students: 55, avgSGPA: 8.5 },
    { id: '4', classroomNumber: 'CS-202', year: 2024, semester: 6, division: 'B', students: 52, avgSGPA: 8.1 },
  ];

  const students: Student[] = [
    { rollNumber: '001', name: 'John Doe', passFail: 'Pass', sgpa: 9.2, internalMarks: 45, endSemMarks: 88 },
    { rollNumber: '002', name: 'Jane Smith', passFail: 'Pass', sgpa: 9.5, internalMarks: 48, endSemMarks: 92 },
    { rollNumber: '003', name: 'Bob Johnson', passFail: 'Fail', sgpa: 4.2, internalMarks: 22, endSemMarks: 35 },
    { rollNumber: '004', name: 'Alice Brown', passFail: 'Pass', sgpa: 8.8, internalMarks: 42, endSemMarks: 85 },
    { rollNumber: '005', name: 'Charlie Wilson', passFail: 'Pass', sgpa: 7.6, internalMarks: 38, endSemMarks: 72 },
  ];

  const filteredClassrooms = classrooms.filter(c => 
    c.classroomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewResult = (classroomId: string) => {
    setSelectedClassroom(classroomId);
    setShowResults(true);
  };

  const selectedClass = classrooms.find(c => c.id === selectedClassroom);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">View Results</h1>
        <p className="mt-1 text-sm text-slate-500">View and analyze student results by classroom.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Classrooms</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{classrooms.length}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Students</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{classrooms.reduce((sum, c) => sum + c.students, 0)}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Avg SGPA</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{(classrooms.reduce((sum, c) => sum + c.avgSGPA, 0) / classrooms.length).toFixed(2)}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pass Rate</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">92%</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classrooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Classrooms Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassrooms.map((classroom) => (
          <div key={classroom.id} className="card card-hover p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{classroom.classroomNumber}</h3>
                <p className="text-sm text-slate-500">Division {classroom.division} • Sem {classroom.semester}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Students</p>
                <p className="text-lg font-semibold text-slate-800">{classroom.students}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg SGPA</p>
                <p className="text-lg font-semibold text-slate-800">{classroom.avgSGPA.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => handleViewResult(classroom.id)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              View Results <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {/* Results Modal */}
      {showResults && selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Results: {selectedClass.classroomNumber}</h3>
                <p className="text-sm text-slate-500">Division {selectedClass.division} • Semester {selectedClass.semester}</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm text-slate-500">Total Students</p>
                  <p className="text-2xl font-bold text-slate-800">{students.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <p className="text-sm text-emerald-600">Passed</p>
                  <p className="text-2xl font-bold text-emerald-700">{students.filter(s => s.passFail === 'Pass').length}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-700">{students.filter(s => s.passFail === 'Fail').length}</p>
                </div>
              </div>

              {/* Results Table */}
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Roll No</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Name</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Internal</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">End Sem</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">SGPA</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.rollNumber} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-sm text-slate-600">{student.rollNumber}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-center">{student.internalMarks}/50</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-center">{student.endSemMarks}/100</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-center">{student.sgpa.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`badge ${student.passFail === 'Pass' ? 'badge-success' : 'badge-error'}`}>
                          {student.passFail}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResults;
