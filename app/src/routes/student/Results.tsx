import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Award, BookOpen, ChevronDown, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { generateMarksheet } from '../../utils/pdfGenerator';
import { EmptyState } from '../../components/shared/EmptyState';

// Validation schema for RV/PV/RC application
const applicationSchema = z.object({
  applicationType: z.enum(['RV', 'PV', 'RC'], { required_error: "Please select an application type" }),
  reason: z.string().optional(),
  agreementChecked: z.boolean().refine(val => val === true, "You must agree to the terms")
});

interface Subject {
  id: string;
  code: string;
  name: string;
  grade: string;
  gradePoints: number;
  credits: number;
}

interface SemesterResult {
  semester: number;
  subjects: Subject[];
  cgpa: number;
  sgpa: number;
  status: 'Pass' | 'Fail';
  year: string;
  totalCredits: number;
}

const Results: React.FC = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [applicationType, setApplicationType] = useState<'RV' | 'PV' | 'RC'>('RV');
  const [reason, setReason] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Mock data
  const semesterResults: SemesterResult[] = [
    {
      semester: 5,
      subjects: [
        { id: '1', code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A', gradePoints: 9 },
        { id: '2', code: 'CS302', name: 'Database Systems', credits: 4, grade: 'A+', gradePoints: 10 },
        { id: '3', code: 'CS303', name: 'Computer Networks', credits: 3, grade: 'B+', gradePoints: 8 },
        { id: '4', code: 'CS304', name: 'Operating Systems', credits: 4, grade: 'A', gradePoints: 9 },
        { id: '5', code: 'CS305', name: 'Software Engineering', credits: 3, grade: 'A', gradePoints: 9 },
        { id: '6', code: 'CS306', name: 'Web Technologies', credits: 4, grade: 'B+', gradePoints: 8 },
      ],
      cgpa: 8.65,
      sgpa: 8.75,
      totalCredits: 22,
      status: 'Pass',
      year: '2025-26'
    },
    {
      semester: 4,
      subjects: [
        { id: '1', code: 'CS201', name: 'Object Oriented Programming', credits: 4, grade: 'A', gradePoints: 9 },
        { id: '2', code: 'CS202', name: 'Discrete Mathematics', credits: 3, grade: 'B+', gradePoints: 8 },
        { id: '3', code: 'CS203', name: 'Computer Organization', credits: 4, grade: 'A', gradePoints: 9 },
        { id: '4', code: 'CS204', name: 'Theory of Computation', credits: 3, grade: 'B', gradePoints: 7 },
        { id: '5', code: 'CS205', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
        { id: '6', code: 'CS206', name: 'Computer Graphics', credits: 3, grade: 'A', gradePoints: 9 },
      ],
      cgpa: 8.50,
      sgpa: 8.67,
      totalCredits: 21,
      status: 'Pass',
      year: '2024-25'
    },
  ];

  const performanceData = [
    { semester: 1, sgpa: 8.2 },
    { semester: 2, sgpa: 8.4 },
    { semester: 3, sgpa: 8.3 },
    { semester: 4, sgpa: 8.67 },
    { semester: 5, sgpa: 8.75 },
  ];

  const currentResult = semesterResults.find(result => result.semester === selectedSemester);
  const cgpa = 8.65;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'badge-success';
    if (grade.startsWith('B')) return 'badge-info';
    if (grade.startsWith('C')) return 'badge-warning';
    return 'badge-error';
  };

  const handleApplicationSubmit = async () => {
    try {
      setLoading(true);
      applicationSchema.parse({ applicationType, reason, agreementChecked });
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${applicationType} application submitted successfully`);
      setShowApplicationModal(false);
      setReason('');
      setAgreementChecked(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadScorecard = async () => {
    if (!currentResult) {
      toast.error('No results available to download');
      return;
    }
    try {
      const studentInfo = {
        name: user?.name || 'Student Name',
        studentId: user?.studentId || 'STU2025001',
        email: user?.email || 'student@example.com',
        course: user?.course || 'Computer Science',
        semester: user?.semester || '6',
      };
      generateMarksheet(studentInfo, {
        semester: currentResult.semester,
        subjects: currentResult.subjects.map(s => ({
          code: s.code, name: s.name, grade: s.grade, gradePoints: s.gradePoints,
        })),
        sgpa: currentResult.sgpa,
        cgpa: currentResult.cgpa,
        status: currentResult.status,
        year: currentResult.year,
      });
      toast.success('Marksheet downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate marksheet. Please try again.');
    }
  };

  const openApplicationModal = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setShowApplicationModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Results</h1>
        <p className="mt-1 text-sm text-slate-500">View your semester results and academic performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current CGPA</span>
            <div className="p-2 rounded-lg bg-amber-50"><Award className="w-5 h-5 text-amber-600" /></div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{cgpa.toFixed(2)}</span>
            <span className="text-sm font-medium text-emerald-500 flex items-center gap-0.5 mb-1">
              <TrendingUp className="w-4 h-4" /> +0.15
            </span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Semester SGPA</span>
            <div className="p-2 rounded-lg bg-blue-50"><BookOpen className="w-5 h-5 text-blue-600" /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{currentResult?.sgpa.toFixed(2)}</span>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Credits</span>
            <div className="p-2 rounded-lg bg-emerald-50"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{currentResult?.totalCredits}</span>
            <span className="text-sm text-slate-500 mb-1">this semester</span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <section className="card mb-6">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Performance Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Semester-wise SGPA progression</p>
        </div>
        <div className="p-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="semester" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="sgpa" stroke="#334155" strokeWidth={2} dot={{ fill: '#334155', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="card overflow-hidden">
        <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-800">Semester Results</h2>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Select semester to view results"
              >
                {semesterResults.map(r => <option key={r.semester} value={r.semester}>Semester {r.semester}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPreviewModal(true)} 
              className="btn-secondary flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Preview results"
            >
              <Eye className="w-4 h-4" aria-hidden="true" /> Preview
            </button>
            <button 
              onClick={downloadScorecard} 
              className="btn-secondary flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Download marksheet"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> Download Marksheet
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50">
                <th scope="col" className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject Code</th>
                <th scope="col" className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject Name</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Credits</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Grade</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Points</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Action</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100">
            {currentResult?.subjects && currentResult.subjects.length > 0 ? (
              currentResult.subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                </td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-slate-800">{subject.name}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm text-slate-600">{subject.credits}</span></td>
                <td className="px-5 py-4 text-center"><span className={`badge ${getGradeColor(subject.grade)}`}>{subject.grade}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm font-semibold text-slate-700">{subject.gradePoints}</span></td>
                <td className="px-5 py-4 text-center">
                  <button 
                    onClick={() => openApplicationModal(subject.id)} 
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                    aria-label={`Apply for revaluation, photocopy, or rechecking for ${subject.name}`}
                  >
                    Apply RV/PV/RC
                  </button>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12">
                  <EmptyState
                    icon={Award}
                    title="No results available"
                    description="Results for this semester are not yet published."
                  />
                </td>
              </tr>
            )}
          </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td colSpan={2} className="px-5 py-4 text-sm font-semibold text-slate-700">Semester Grade Point Average (SGPA)</td>
                <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{currentResult?.totalCredits}</td>
                <td colSpan={3} className="px-5 py-4 text-center"><span className="text-xl font-bold text-slate-800">{currentResult?.sgpa.toFixed(2)}</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Grade Scale */}
      <section className="mt-6 card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Grade Scale & Application Types</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { grade: 'A+', points: '10', range: '90-100' },
            { grade: 'A', points: '9', range: '80-89' },
            { grade: 'B+', points: '8', range: '70-79' },
            { grade: 'B', points: '7', range: '60-69' },
            { grade: 'C', points: '6', range: '50-59' },
            { grade: 'F', points: '0', range: '<50' },
          ].map((item) => (
            <div key={item.grade} className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`badge ${getGradeColor(item.grade)}`}>{item.grade}</span>
              <span>= {item.points} pts ({item.range}%)</span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-sm text-slate-600 border-t border-slate-100 pt-4">
          <span><strong>RV:</strong> Revaluation</span>
          <span><strong>PV:</strong> Paper Viewing</span>
          <span><strong>RC:</strong> Rechecking</span>
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Apply for RV/PV/RC</h3>
              <button onClick={() => setShowApplicationModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Application Type</label>
                <div className="space-y-2">
                  {(['RV', 'PV', 'RC'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={applicationType === type} onChange={() => setApplicationType(type)} className="text-slate-600" />
                      <span className="text-sm text-slate-700">{type === 'RV' ? 'Revaluation' : type === 'PV' ? 'Paper Viewing' : 'Rechecking'} ({type})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" rows={3} />
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreementChecked} onChange={(e) => setAgreementChecked(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-slate-300 text-slate-600" />
                <span className="text-sm text-slate-600">I understand that the application fee is non-refundable</span>
              </label>
              <div className="flex gap-3">
                <button onClick={handleApplicationSubmit} disabled={loading || !agreementChecked} className="btn-primary flex-1">
                  {loading ? 'Submitting...' : 'Proceed to Payment'}
                </button>
                <button onClick={() => setShowApplicationModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && currentResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">End Semester Examination</h3>
                <p className="text-sm text-slate-500">Semester {currentResult.semester} Results • {currentResult.year}</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)} 
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close preview modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div><p className="text-sm text-slate-500">Name</p><p className="font-medium text-slate-800">{user?.name}</p></div>
                <div><p className="text-sm text-slate-500">Roll Number</p><p className="font-medium text-slate-800">{user?.rollNumber || user?.studentId}</p></div>
                <div><p className="text-sm text-slate-500">Course</p><p className="font-medium text-slate-800">{user?.course}</p></div>
                <div><p className="text-sm text-slate-500">Semester</p><p className="font-medium text-slate-800">{currentResult.semester}</p></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Code</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Subject</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Grade</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentResult.subjects.map(subject => (
                    <tr key={subject.id}>
                      <td className="px-4 py-3 font-mono text-sm text-slate-600">{subject.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{subject.name}</td>
                      <td className="px-4 py-3 text-center"><span className={`badge ${getGradeColor(subject.grade)}`}>{subject.grade}</span></td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700">{subject.gradePoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center"><p className="text-sm text-slate-500">Status</p><p className="text-lg font-semibold text-emerald-600">{currentResult.status}</p></div>
                <div className="text-center"><p className="text-sm text-slate-500">SGPA</p><p className="text-lg font-semibold text-slate-800">{currentResult.sgpa.toFixed(2)}</p></div>
                <div className="text-center"><p className="text-sm text-slate-500">CGPA</p><p className="text-lg font-semibold text-slate-800">{currentResult.cgpa.toFixed(2)}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
