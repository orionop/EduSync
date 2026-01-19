import React, { useState } from 'react';
import { ClipboardCheck, Users, FileText, CheckCircle, Clock, AlertCircle, X, Download, Eye, Printer, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EvaluationTask {
  id: string;
  examName: string;
  subject: string;
  totalPapers: number;
  evaluatedPapers: number;
  assignedTo: string;
  deadline: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface ResultSummary {
  id: string;
  examName: string;
  totalStudents: number;
  passed: number;
  failed: number;
  avgMarks: number;
  highestMarks: number;
  lowestMarks: number;
}

const ExamEvaluation: React.FC = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [selectedResult, setSelectedResult] = useState<ResultSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'results'>('tasks');

  const [evaluationTasks] = useState<EvaluationTask[]>([
    { id: '1', examName: 'Mid-Semester 2025', subject: 'Data Structures', totalPapers: 60, evaluatedPapers: 60, assignedTo: 'Dr. Sarah Johnson', deadline: 'May 25, 2025', status: 'completed' },
    { id: '2', examName: 'Mid-Semester 2025', subject: 'Database Systems', totalPapers: 55, evaluatedPapers: 40, assignedTo: 'Prof. Michael Chen', deadline: 'May 26, 2025', status: 'in_progress' },
    { id: '3', examName: 'Mid-Semester 2025', subject: 'Operating Systems', totalPapers: 50, evaluatedPapers: 0, assignedTo: 'Dr. Emily Brown', deadline: 'May 27, 2025', status: 'pending' },
    { id: '4', examName: 'Mid-Semester 2025', subject: 'Computer Networks', totalPapers: 48, evaluatedPapers: 30, assignedTo: 'Prof. James Wilson', deadline: 'May 28, 2025', status: 'in_progress' },
  ]);

  const [resultSummaries] = useState<ResultSummary[]>([
    { id: '1', examName: 'Data Structures', totalStudents: 60, passed: 55, failed: 5, avgMarks: 72.5, highestMarks: 98, lowestMarks: 28 },
  ]);

  const stats = {
    totalTasks: evaluationTasks.length,
    completed: evaluationTasks.filter(t => t.status === 'completed').length,
    inProgress: evaluationTasks.filter(t => t.status === 'in_progress').length,
    pending: evaluationTasks.filter(t => t.status === 'pending').length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'in_progress': return 'badge-info';
      case 'pending': return 'badge-warning';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return null;
    }
  };

  const downloadEvaluationReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Evaluation Status Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    
    autoTable(doc, {
      startY: 45,
      head: [['Subject', 'Assigned To', 'Progress', 'Status', 'Deadline']],
      body: evaluationTasks.map(t => [
        t.subject,
        t.assignedTo,
        `${t.evaluatedPapers}/${t.totalPapers}`,
        t.status.replace('_', ' '),
        t.deadline,
      ]),
    });
    
    doc.save('evaluation_report.pdf');
    toast.success('Report downloaded');
  };

  const downloadResultSummary = (result: ResultSummary) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${result.examName} - Result Summary`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    
    doc.text(`Total Students: ${result.totalStudents}`, 14, 50);
    doc.text(`Passed: ${result.passed}`, 14, 60);
    doc.text(`Failed: ${result.failed}`, 14, 70);
    doc.text(`Average Marks: ${result.avgMarks}`, 14, 80);
    doc.text(`Highest Marks: ${result.highestMarks}`, 14, 90);
    doc.text(`Lowest Marks: ${result.lowestMarks}`, 14, 100);
    
    doc.save(`${result.examName.replace(/\s+/g, '_')}_result_summary.pdf`);
    toast.success('Summary downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Exam Evaluation</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor paper evaluation progress and view result summaries.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Tasks</span>
            <ClipboardCheck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.totalTasks}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600">{stats.completed}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">In Progress</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-blue-600">{stats.inProgress}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pending</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600">{stats.pending}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tasks' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Evaluation Tasks
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'results' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Result Summaries
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={downloadEvaluationReport} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Evaluation Report
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Evaluation Tasks</h2>
            <p className="text-sm text-slate-500 mt-1">Track paper evaluation progress</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluationTasks.map((task) => {
                  const progress = Math.round((task.evaluatedPapers / task.totalPapers) * 100);
                  return (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">{task.subject}</p>
                        <p className="text-xs text-slate-500">{task.examName}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{task.assignedTo}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500">{task.evaluatedPapers}/{task.totalPapers}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusStyle(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{task.deadline}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Result Summaries</h2>
            <p className="text-sm text-slate-500 mt-1">View completed evaluation results</p>
          </div>
          {resultSummaries.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {resultSummaries.map((result) => {
                const passRate = Math.round((result.passed / result.totalStudents) * 100);
                return (
                  <div key={result.id} className="px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{result.examName}</p>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-slate-500">Pass Rate</p>
                            <p className="text-lg font-semibold text-emerald-600">{passRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Average</p>
                            <p className="text-lg font-semibold text-slate-800">{result.avgMarks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Highest</p>
                            <p className="text-lg font-semibold text-blue-600">{result.highestMarks}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                          <span className="text-slate-500">Total: {result.totalStudents}</span>
                          <span className="text-emerald-600">Passed: {result.passed}</span>
                          <span className="text-red-500">Failed: {result.failed}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedResult(result); setShowResultModal(true); }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadResultSummary(result)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No results available yet</p>
              <p className="text-xs text-slate-400 mt-1">Results will appear here once evaluations are completed</p>
            </div>
          )}
        </section>
      )}

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Task Details</h3>
              <button onClick={() => setShowTaskModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Subject</p><p className="text-sm font-medium text-slate-800">{selectedTask.subject}</p></div>
                <div><p className="text-xs text-slate-500">Exam</p><p className="text-sm text-slate-800">{selectedTask.examName}</p></div>
                <div><p className="text-xs text-slate-500">Assigned To</p><p className="text-sm text-slate-800">{selectedTask.assignedTo}</p></div>
                <div><p className="text-xs text-slate-500">Deadline</p><p className="text-sm text-slate-800">{selectedTask.deadline}</p></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Progress</p>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.round((selectedTask.evaluatedPapers / selectedTask.totalPapers) * 100)}%` }}>
                    <span className="text-[10px] font-medium text-white">{Math.round((selectedTask.evaluatedPapers / selectedTask.totalPapers) * 100)}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedTask.evaluatedPapers} of {selectedTask.totalPapers} papers evaluated</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Result Detail Modal */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Result Summary</h3>
              <button onClick={() => setShowResultModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm font-medium text-slate-800">{selectedResult.examName}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800">{selectedResult.totalStudents}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">{selectedResult.passed}</p>
                  <p className="text-xs text-slate-500">Passed</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{selectedResult.failed}</p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xl font-bold text-slate-800">{selectedResult.avgMarks}</p>
                  <p className="text-xs text-slate-500">Average</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{selectedResult.highestMarks}</p>
                  <p className="text-xs text-slate-500">Highest</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-xl font-bold text-amber-600">{selectedResult.lowestMarks}</p>
                  <p className="text-xs text-slate-500">Lowest</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowResultModal(false)} className="btn-secondary flex-1">Close</button>
                <button onClick={() => { downloadResultSummary(selectedResult); setShowResultModal(false); }} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEvaluation;
