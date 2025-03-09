import React, { useState } from 'react';
import { Download, Search, Eye, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  studentName: string;
  rollNumber: string;
  course: string;
  semester: number;
  subjects: string[];
  appliedDate: string;
  remarks?: string;
}

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationsModal: React.FC<ApplicationsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      studentName: 'John Smith',
      rollNumber: '2025CS001',
      course: 'Computer Science',
      semester: 6,
      subjects: ['Data Structures', 'Algorithms', 'Database Management'],
      appliedDate: '2025-03-15'
    },
    {
      id: '2',
      studentName: 'Emma Davis',
      rollNumber: '2025EC002',
      course: 'Electronics',
      semester: 6,
      subjects: ['Digital Electronics', 'Signals and Systems'],
      appliedDate: '2025-03-16',
      remarks: 'All documents verified'
    },
    {
      id: '3',
      studentName: 'Michael Wilson',
      rollNumber: '2025ME003',
      course: 'Mechanical',
      semester: 6,
      subjects: ['Thermodynamics', 'Fluid Mechanics'],
      appliedDate: '2025-03-17',
      remarks: 'Additional verification needed'
    }
  ]);

  const filteredApplications = applications.filter(app => 
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications(prev => {
      if (prev.includes(id)) {
        return prev.filter(appId => appId !== id);
      }
      return [...prev, id];
    });
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Application deleted successfully');
  };

  const handleDownloadPDF = (application: Application) => {
    // Simulate PDF download
    toast.success('Application PDF downloaded successfully');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Applications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course & Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => handleSelectApplication(application.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.studentName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {application.rollNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {application.course} (Sem {application.semester})
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {application.subjects.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingApplication(application)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/30"
                        title="View Application"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(application.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/30"
                        title="Delete Application"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Application Modal */}
        {viewingApplication && (
          <Modal
            isOpen={!!viewingApplication}
            onClose={() => setViewingApplication(null)}
            title="Application Details"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {viewingApplication.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {viewingApplication.rollNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {viewingApplication.course}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Semester</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {viewingApplication.semester}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Subjects
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {viewingApplication.subjects.map((subject, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>

              {viewingApplication.remarks && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Remarks
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {viewingApplication.remarks}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handleDownloadPDF(viewingApplication)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <Modal
            isOpen={!!showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            title="Confirm Delete"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Are you sure you want to delete this application?</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteApplication(showDeleteConfirm)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => {
              toast.success('Report downloaded successfully');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationsModal;