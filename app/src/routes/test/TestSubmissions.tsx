import React, { useState, useEffect } from 'react';
import { Upload, FileText, Clock, CheckCircle, AlertTriangle, Download, Eye, X } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { SkeletonTable } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

const TestSubmissions: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const assignments = [
    { id: '1', subject: 'Data Structures', subjectCode: 'CS301', title: 'Binary Tree Implementation', dueDate: 'Jan 15, 2026', status: 'graded', submittedAt: 'Jan 14, 2026', maxMarks: 20, marks: 18, grade: 'A' },
    { id: '2', subject: 'Database Systems', subjectCode: 'CS302', title: 'SQL Query Optimization', dueDate: 'Jan 18, 2026', status: 'submitted', submittedAt: 'Jan 17, 2026', maxMarks: 20 },
    { id: '3', subject: 'Computer Networks', subjectCode: 'CS303', title: 'Network Protocol Analysis', dueDate: 'Jan 20, 2026', status: 'pending', maxMarks: 25 },
    { id: '4', subject: 'Operating Systems', subjectCode: 'CS304', title: 'Process Scheduling Simulation', dueDate: 'Jan 10, 2026', status: 'late', submittedAt: 'Jan 12, 2026', maxMarks: 20, marks: 14, grade: 'B' },
    { id: '5', subject: 'Software Engineering', subjectCode: 'CS305', title: 'UML Diagrams', dueDate: 'Jan 25, 2026', status: 'pending', maxMarks: 15 },
  ];

  const filteredAssignments = selectedFilter === 'all' ? assignments : assignments.filter(a => a.status === selectedFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded': return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Graded</span>;
      case 'submitted': return <span className="badge badge-info"><CheckCircle className="w-3 h-3" /> Submitted</span>;
      case 'late': return <span className="badge badge-warning"><AlertTriangle className="w-3 h-3" /> Late</span>;
      default: return <span className="badge badge-neutral"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const handleUpload = () => {
    showToast.success('File uploaded successfully');
    setUploadingFor(null);
  };

  if (loading) {
    return (
      <TestLayout title="Submissions" subtitle="View and submit your assignments and coursework.">
        <SkeletonTable rows={5} cols={6} />
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Submissions" subtitle="View and submit your assignments and coursework.">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', count: assignments.length, color: 'text-slate-800', filter: 'all' },
          { label: 'Pending', count: assignments.filter(a => a.status === 'pending').length, color: 'text-amber-500', filter: 'pending' },
          { label: 'Submitted', count: assignments.filter(a => a.status === 'submitted').length, color: 'text-blue-500', filter: 'submitted' },
          { label: 'Graded', count: assignments.filter(a => a.status === 'graded').length, color: 'text-emerald-500', filter: 'graded' },
        ].map((stat, index) => (
          <button
            key={index}
            onClick={() => setSelectedFilter(stat.filter)}
            className={`card p-4 text-left transition-all ${selectedFilter === stat.filter ? 'ring-2 ring-slate-400 border-slate-400' : ''}`}
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.count}</p>
          </button>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Assignments</h2>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Assignment</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Due Date</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Marks</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-slate-100"><FileText className="w-4 h-4 text-slate-600" /></div>
                    <span className="text-sm font-medium text-slate-800">{assignment.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-slate-700">{assignment.subject}</div>
                  <div className="text-xs text-slate-500 font-mono">{assignment.subjectCode}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">{assignment.dueDate}</span>
                  {assignment.submittedAt && <div className="text-xs text-slate-500 mt-0.5">Submitted: {assignment.submittedAt}</div>}
                </td>
                <td className="px-5 py-4 text-center">{getStatusBadge(assignment.status)}</td>
                <td className="px-5 py-4 text-center">
                  {assignment.marks !== undefined ? (
                    <span className="text-sm font-medium text-slate-800">{assignment.marks}/{assignment.maxMarks}</span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {assignment.status === 'pending' && (
                      <button onClick={() => setUploadingFor(assignment.id)} className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                    {(assignment.status === 'submitted' || assignment.status === 'graded' || assignment.status === 'late') && (
                      <>
                        <button onClick={() => showToast.info('Opening submission...')} className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => showToast.success('Downloading...')} className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAssignments.length === 0 && (
          <div className="px-5 py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No assignments found</p>
            <p className="text-sm text-slate-500 mt-1">Try changing the filter.</p>
          </div>
        )}
      </section>

      {uploadingFor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Upload Submission</h3>
              <button onClick={() => setUploadingFor(null)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-lg p-8 text-center cursor-pointer transition-colors">
                <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">Drop your file here or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setUploadingFor(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleUpload} className="btn-primary flex-1">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TestLayout>
  );
};

export default TestSubmissions;
