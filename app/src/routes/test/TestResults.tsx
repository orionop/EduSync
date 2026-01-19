import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Award, BookOpen, ChevronDown } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { SkeletonStat, SkeletonTable } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

const TestResults: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const semesterResults = [
    {
      semester: 5, sgpa: 8.75, totalCredits: 22,
      subjects: [
        { code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS302', name: 'Database Systems', credits: 4, grade: 'A+', gradePoints: 10 },
        { code: 'CS303', name: 'Computer Networks', credits: 3, grade: 'B+', gradePoints: 8 },
        { code: 'CS304', name: 'Operating Systems', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS305', name: 'Software Engineering', credits: 3, grade: 'A', gradePoints: 9 },
        { code: 'CS306', name: 'Web Technologies', credits: 4, grade: 'B+', gradePoints: 8 },
      ]
    },
    {
      semester: 4, sgpa: 8.50, totalCredits: 21,
      subjects: [
        { code: 'CS201', name: 'Object Oriented Programming', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS202', name: 'Discrete Mathematics', credits: 3, grade: 'B+', gradePoints: 8 },
        { code: 'CS203', name: 'Computer Organization', credits: 4, grade: 'A', gradePoints: 9 },
        { code: 'CS204', name: 'Theory of Computation', credits: 3, grade: 'B', gradePoints: 7 },
        { code: 'CS205', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
        { code: 'CS206', name: 'Computer Graphics', credits: 3, grade: 'A', gradePoints: 9 },
      ]
    },
  ];

  const currentResult = semesterResults.find(r => r.semester === selectedSemester);
  const cgpa = 8.65;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'badge-success';
    if (grade.startsWith('B')) return 'badge-info';
    if (grade.startsWith('C')) return 'badge-warning';
    return 'badge-error';
  };

  if (loading) {
    return (
      <TestLayout title="Results" subtitle="View your semester results and academic performance.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SkeletonStat /><SkeletonStat /><SkeletonStat />
        </div>
        <SkeletonTable rows={6} cols={5} />
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Results" subtitle="View your semester results and academic performance.">
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

      <section className="card overflow-hidden">
        <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-800">Semester Results</h2>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
              >
                {semesterResults.map(r => <option key={r.semester} value={r.semester}>Semester {r.semester}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => showToast.success('Downloading marksheet PDF...')} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Marksheet
          </button>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject Code</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject Name</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Credits</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Grade</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentResult?.subjects.map((subject) => (
              <tr key={subject.code} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                </td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-slate-800">{subject.name}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm text-slate-600">{subject.credits}</span></td>
                <td className="px-5 py-4 text-center"><span className={`badge ${getGradeColor(subject.grade)}`}>{subject.grade}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm font-semibold text-slate-700">{subject.gradePoints}</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-200">
              <td colSpan={2} className="px-5 py-4 text-sm font-semibold text-slate-700">Semester Grade Point Average (SGPA)</td>
              <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{currentResult?.totalCredits}</td>
              <td colSpan={2} className="px-5 py-4 text-center"><span className="text-xl font-bold text-slate-800">{currentResult?.sgpa.toFixed(2)}</span></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="mt-6 card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Grade Scale</h3>
        <div className="flex flex-wrap gap-4">
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
      </section>
    </TestLayout>
  );
};

export default TestResults;
