import React, { useState } from 'react';
import { Upload, Clock, CheckCircle, AlertTriangle, Download, Eye, X, FileText } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

interface Assignment {
  id: string;
  subjectName: string;
  title: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
  deadline: string;
  facultyRemarks?: string;
  submissionDate?: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
}

const Submissions: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Mock data
  const assignments: Assignment[] = [
    {
      id: '1',
      subjectName: 'Data Structures',
      title: 'Implementation of Binary Trees',
      status: 'Pending',
      deadline: '2025-03-20T23:59:59',
      facultyRemarks: 'Please include proper documentation'
    },
    {
      id: '2',
      subjectName: 'Database Management',
      title: 'SQL Query Optimization',
      status: 'Submitted',
      deadline: '2025-03-15T23:59:59',
      submissionDate: '2025-03-14T14:30:00',
      file: {
        name: 'sql_optimization.pdf',
        size: '2.4 MB',
        type: 'application/pdf'
      }
    },
    {
      id: '3',
      subjectName: 'Web Development',
      title: 'Responsive Design Project',
      status: 'Overdue',
      deadline: '2025-03-10T23:59:59',
      facultyRemarks: 'Late submission will affect grading'
    }
  ];

  const subjects = ['All Subjects', ...new Set(assignments.map(a => a.subjectName))];

  const filteredAssignments = selectedSubject === 'all' || selectedSubject === 'All Subjects'
    ? assignments
    : assignments.filter(a => a.subjectName === selectedSubject);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should not exceed 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, DOCX, and ZIP files are allowed');
        return;
      }
      
      setUploadFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadFile || !selectedAssignment) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Assignment submitted successfully');
      setShowUploadModal(false);
      setUploadFile(null);
      setSelectedAssignment(null);
    } catch (error) {
      toast.error('Failed to submit assignment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Submissions</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters and Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject === 'All Subjects' ? 'all' : subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Pending: {assignments.filter(a => a.status === 'Pending').length}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Submitted: {assignments.filter(a => a.status === 'Submitted').length}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Overdue: {assignments.filter(a => a.status === 'Overdue').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {assignment.subjectName}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {getStatusIcon(assignment.status)}
                                {assignment.status}
                              </span>
                              
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Due: {new Date(assignment.deadline).toLocaleString()}
                              </span>
                            </div>

                            {assignment.facultyRemarks && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Remarks:</span> {assignment.facultyRemarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {assignment.status === 'Submitted' ? (
                          <>
                            <button
                              onClick={() => {/* Handle download */}}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                            <button
                              onClick={() => {/* Handle view */}}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowUploadModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            disabled={assignment.status === 'Overdue'}
                          >
                            <Upload className="h-4 w-4" />
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Assignment
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assignment</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedAssignment.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedAssignment.deadline).toLocaleString()}
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.zip"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    PDF, DOC, DOCX or ZIP (max 10MB)
                  </p>
                </label>
              </div>

              {uploadFile && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{uploadFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!uploadFile}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Submit Assignment
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;