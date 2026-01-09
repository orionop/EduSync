import React, { useState } from 'react';
import { Download, AlertCircle, FileText, History, CreditCard, Receipt, CreditCardIcon } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { z } from 'zod';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Validation schema for KT application
const ktApplicationSchema = z.object({
  reason: z.string().optional(),
  agreementChecked: z.boolean().refine(val => val === true, "You must agree to the terms")
});

interface KTSubject {
  id: string;
  name: string;
  semester: number;
  type: 'Internal' | 'External';
  attempts: number;
  status: 'Active' | 'Cleared';
  lastDate?: string;
}

interface PaymentHistory {
  id: string;
  transactionId?: string;
  subjectName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

interface PaymentModalProps {
  payment: PaymentHistory;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.head.appendChild(script);
      script.onload = resolve;
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      await loadRazorpay();

      const options = {
        key: 'rzp_test_gQ6gnFrig0c5xy',
        amount: payment.amount * 100,
        currency: 'INR',
        name: 'EduSync',
        description: `KT Payment for ${payment.subjectName}`,
        image: 'https://example.com/your_logo.png',
        handler: function(response: any) {
          const transactionId = response.razorpay_payment_id;
          onSuccess(transactionId);
          toast.success('Payment successful!');
          onClose();
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9876543210'
        },
        notes: {
          subject: payment.subjectName,
          paymentFor: 'KT Examination'
        },
        theme: {
          color: '#2563EB'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response: any) {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Confirmation
        </h3>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Subject</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">{payment.subjectName}</p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Amount</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{payment.amount}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-4 w-4" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const KTSection: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [reason, setReason] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Mock student data
  const studentInfo = {
    name: 'John Doe',
    id: 'STU2025001',
    email: 'john.doe@example.com',
    phone: '9876543210'
  };

  // Mock data
  const ktSubjects: KTSubject[] = [
    {
      id: '1',
      name: 'Data Structures',
      semester: 6,
      type: 'External',
      attempts: 1,
      status: 'Active',
      lastDate: '2025-03-20'
    },
    {
      id: '2',
      name: 'Database Management',
      semester: 6,
      type: 'Internal',
      attempts: 2,
      status: 'Active',
      lastDate: '2025-03-25'
    },
    {
      id: '3',
      name: 'Web Development',
      semester: 5,
      type: 'External',
      attempts: 1,
      status: 'Cleared'
    }
  ];

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      transactionId: 'TXN123456789',
      subjectName: 'Data Structures',
      amount: 500,
      status: 'Paid',
      date: '2025-02-15'
    },
    {
      id: '2',
      subjectName: 'Database Management',
      amount: 500,
      status: 'Pending',
      date: '2025-02-20'
    }
  ]);

  const handleApplicationSubmit = async () => {
    try {
      setLoading(true);
      // Validate form data
      ktApplicationSchema.parse({
        reason,
        agreementChecked
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('KT application submitted successfully');
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

  const downloadScorecard = (semester: number) => {
    toast.success(`Downloading KT scorecard for Semester ${semester}`);
  };

  const openApplicationModal = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setShowApplicationModal(true);
  };

  const openPaymentModal = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string, transactionId: string) => {
    setPaymentHistory(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: 'Paid', 
            transactionId,
            date: new Date().toISOString()
          }
        : payment
    ));
  };

  const downloadReceipt = async (payment: PaymentHistory) => {
    try {
      toast.loading('Downloading receipt...');
      
      const pdfUrl = "https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/PAYMENT%20RECEIPT%20updated.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1BBWU1FTlQgUkVDRUlQVCB1cGRhdGVkLnBkZiIsImlhdCI6MTc0MTQzODg4MywiZXhwIjoxNzcyOTc0ODgzfQ.vIH7eXIL6ENKBKeuvSzT0SMRqqL1wqzqUN-a0URno1E";
      
      // Open PDF in a new tab which will trigger the download
      window.open(pdfUrl, '_blank');

      toast.dismiss();
      toast.success('Receipt download started');
    } catch (error) {
      toast.dismiss();
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">KT Section</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active KTs</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {ktSubjects.filter(s => s.status === 'Active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cleared KTs</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {ktSubjects.filter(s => s.status === 'Cleared').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Attempts</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {ktSubjects.reduce((sum, subject) => sum + subject.attempts, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KT Subjects Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">KT Subjects</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">List of all KT subjects and their status</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => downloadScorecard(selectedSemester)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Scorecard</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Semester</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Attempts</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Last Date</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ktSubjects.map(subject => (
                      <tr key={subject.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-4 text-gray-900 dark:text-white">{subject.name}</td>
                        <td className="py-4 text-gray-900 dark:text-white">Semester {subject.semester}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            subject.type === 'Internal'
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}>
                            {subject.type}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900 dark:text-white">{subject.attempts}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            subject.status === 'Cleared'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {subject.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900 dark:text-white">
                          {subject.lastDate ? new Date(subject.lastDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4">
                          {subject.status === 'Active' && (
                            <button
                              onClick={() => openApplicationModal(subject.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Apply for KT
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recent KT payment transactions</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Amount</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Date</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map(payment => (
                      <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-4 text-gray-900 dark:text-white">{payment.subjectName}</td>
                        <td className="py-4 text-gray-900 dark:text-white">₹{payment.amount}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            payment.status === 'Paid'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : payment.status === 'Pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900 dark:text-white">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            {payment.status === 'Pending' && (
                              <button
                                onClick={() => openPaymentModal(payment)}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                              >
                                <CreditCardIcon className="h-4 w-4" />
                                <span>Pay Now</span>
                              </button>
                            )}
                            {payment.status === 'Paid' && (
                              <button
                                onClick={() => downloadReceipt(payment)}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                              >
                                <Receipt className="h-4 w-4" />
                                <span>Download Receipt</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KT Application Modal */}
            {showApplicationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Apply for KT Examination
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                      />
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={agreementChecked}
                        onChange={(e) => setAgreementChecked(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I understand and agree to the KT examination rules and fees
                      </span>
                    </label>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleApplicationSubmit}
                        disabled={loading || !agreementChecked}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                      </button>
                      <button
                        onClick={() => setShowApplicationModal(false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedPayment && (
              <PaymentModal
                payment={selectedPayment}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={(transactionId) => handlePaymentSuccess(selectedPayment.id, transactionId)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KTSection;