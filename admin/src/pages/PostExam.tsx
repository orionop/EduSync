import React, { useState } from 'react';
import { 
  FileText, 
  AlertCircle, 
  FileCheck, 
  CreditCard, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Calendar
} from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

interface Grievance {
  id: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

interface Application {
  id: string;
  studentName: string;
  rollNumber: string;
  type: 'RE' | 'PC' | 'NPC';
  subject: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

interface KTApplication {
  id: string;
  studentName: string;
  rollNumber: string;
  subjects: string[];
  semester: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

interface PaymentRequest {
  id: string;
  facultyName: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'completed';
  timestamp: string;
}

const PostExam: React.FC = () => {
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      id: '1',
      studentName: 'John Smith',
      rollNumber: '2025CS001',
      subject: 'Advanced Mathematics',
      description: 'Request for revaluation',
      status: 'pending',
      timestamp: '2025-03-15T09:30:00'
    },
    {
      id: '2',
      studentName: 'Emma Davis',
      rollNumber: '2025EC002',
      subject: 'Digital Electronics',
      description: 'Marks totaling error',
      status: 'pending',
      timestamp: '2025-03-15T10:15:00'
    }
  ]);

  const handlePublishResults = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Results published successfully!');
      setShowConfirmPublishModal(false);
    } catch (error) {
      toast.error('Failed to publish results');
    }
  };

  const handleGrievanceAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGrievances(prev => prev.map(grievance => 
        grievance.id === id 
          ? { ...grievance, status: action === 'accept' ? 'accepted' : 'rejected' }
          : grievance
      ));
      toast.success(`Grievance ${action}ed successfully`);
    } catch (error) {
      toast.error('Failed to process grievance');
    }
  };

  const handlePaymentConfirmation = async (id: string, transactionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Payment confirmed: ${transactionId}`);
    } catch (error) {
      toast.error('Failed to confirm payment');
    }
  };

  const features = [
    {
      id: 'result-publication',
      title: 'Result Publication',
      description: 'Publish and manage examination results.',
      icon: FileText,
      action: () => setShowConfirmPublishModal(true)
    },
    {
      id: 'grievances',
      title: 'Grievance Management',
      description: 'Handle student grievances and revaluation requests.',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {grievances.map((grievance) => (
                  <tr key={grievance.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {grievance.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {grievance.rollNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {grievance.subject}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {grievance.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        grievance.status === 'accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : grievance.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {grievance.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGrievanceAction(grievance.id, 'accept')}
                            className="p-1 text-green-600 hover:bg-green-100 rounded-full dark:text-green-400 dark:hover:bg-green-900/30"
                            title="Accept"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleGrievanceAction(grievance.id, 'reject')}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/30"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      description: 'Process and track examination-related payments.',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Faculty Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  {
                    id: '1',
                    facultyName: 'Dr. Sarah Johnson',
                    amount: 5000,
                    purpose: 'Paper evaluation',
                    status: 'pending',
                    timestamp: '2025-03-15T09:30:00'
                  },
                  {
                    id: '2',
                    facultyName: 'Prof. Michael Chen',
                    amount: 3000,
                    purpose: 'Supervision duty',
                    status: 'completed',
                    timestamp: '2025-03-15T10:15:00'
                  }
                ].map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.facultyName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ₹{payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handlePaymentConfirmation(payment.id, 'TXN123')}
                          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Post Exam Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Handle post-examination tasks and processes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {feature.content}
                {feature.action && (
                  <button
                    onClick={feature.action}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    Publish Results
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Confirm Publish Modal */}
      <Modal
        isOpen={showConfirmPublishModal}
        onClose={() => setShowConfirmPublishModal(false)}
        title="Confirm Results Publication"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to publish the results? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirmPublishModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublishResults}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm & Publish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostExam;