import React, { useState } from 'react';
import { RefreshCw, AlertCircle, Clock, CheckCircle, CreditCard, Download, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { generatePaymentReceipt } from '../../utils/pdfGenerator';
import { EmptyState } from '../../components/shared/EmptyState';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface KTSubject {
  id: string;
  code: string;
  name: string;
  semester: number;
  type: 'Internal' | 'External';
  attempts: number;
  status: 'Active' | 'Cleared';
  fee: number;
  lastAttempt?: string;
}

interface PaymentHistory {
  id: string;
  transactionId?: string;
  subjectName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

const KTSection: React.FC = () => {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    { id: '1', transactionId: 'TXN123456789', subjectName: 'CS201', amount: 800, status: 'Paid', date: 'Dec 10, 2025' },
    { id: '2', transactionId: 'TXN987654321', subjectName: 'CS201, CS203', amount: 1600, status: 'Paid', date: 'June 15, 2025' },
  ]);

  // Mock KT subjects data
  const ktSubjects: KTSubject[] = [
    { id: '1', code: 'CS201', name: 'Object Oriented Programming', semester: 4, type: 'External', attempts: 1, status: 'Active', fee: 800, lastAttempt: 'June 2025' },
    { id: '2', code: 'CS203', name: 'Computer Organization', semester: 4, type: 'External', attempts: 2, status: 'Active', fee: 1000, lastAttempt: 'Dec 2025' },
  ];

  const pendingBacklogs = ktSubjects.filter(s => s.status === 'Active');
  const totalFee = pendingBacklogs.filter(s => selectedSubjects.includes(s.id)).reduce((sum, s) => sum + s.fee, 0);

  const handleSubjectToggle = (id: string) => {
    setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.head.appendChild(script);
      script.onload = resolve;
    });
  };

  const handlePayment = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    try {
      await loadRazorpay();
      const subjectNames = pendingBacklogs.filter(s => selectedSubjects.includes(s.id)).map(s => s.code).join(', ');
      
      const options = {
        key: 'rzp_test_gQ6gnFrig0c5xy',
        amount: totalFee * 100,
        currency: 'INR',
        name: 'EduSync',
        description: `KT Payment for ${subjectNames}`,
        handler: function(response: any) {
          const transactionId = response.razorpay_payment_id;
          const newPayment: PaymentHistory = {
            id: Date.now().toString(),
            transactionId,
            subjectName: subjectNames,
            amount: totalFee,
            status: 'Paid',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          };
          setPaymentHistory(prev => [newPayment, ...prev]);
          setSelectedSubjects([]);
          toast.success('Payment successful!');
        },
        prefill: {
          name: user?.name || 'Student',
          email: user?.email || 'student@example.com',
        },
        theme: { color: '#334155' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function() {
        toast.error('Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const downloadReceipt = (payment: PaymentHistory) => {
    if (!payment.transactionId) {
      toast.error('No receipt available for this payment');
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
      generatePaymentReceipt(studentInfo, {
        receiptId: `RCP${payment.id}`,
        transactionId: payment.transactionId,
        amount: payment.amount,
        paymentDate: payment.date,
        description: `KT Examination Fee - ${payment.subjectName}`,
        paymentMethod: 'Online Payment (Razorpay)',
        status: payment.status,
      });
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate receipt');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'Pending': return <span className="badge badge-warning"><Clock className="w-3 h-3" /> Pending</span>;
      default: return <span className="badge badge-error"><AlertCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">KT Section</h1>
        <p className="mt-1 text-sm text-slate-500">Apply for backlog examinations and manage KT applications.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pending Backlogs</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-semibold text-slate-800">{pendingBacklogs.length}</span>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Attempts</span>
            <RefreshCw className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-semibold text-slate-800">{ktSubjects.reduce((sum, s) => sum + s.attempts, 0)}</span>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Cleared</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold text-slate-800">{ktSubjects.filter(s => s.status === 'Cleared').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backlog Subjects */}
        <section className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Pending Backlog Subjects</h2>
            <p className="text-sm text-slate-500 mt-1">Select subjects to apply for KT examination</p>
          </div>
          
          {pendingBacklogs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {pendingBacklogs.map((subject) => (
                <label key={subject.id} className="flex items-center px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors focus-within:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectToggle(subject.id)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Select ${subject.name} (${subject.code}) for KT examination`}
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{subject.name}</span>
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Semester {subject.semester} • {subject.attempts} attempt(s) • Last: {subject.lastAttempt}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">₹{subject.fee}</span>
                </label>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="No pending backlogs"
              description="All your subjects have been cleared. Great job!"
            />
          )}
        </section>

        {/* Apply Panel */}
        <div className="space-y-6">
          <section className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-800">Application Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Selected Subjects</span>
                <span className="font-medium text-slate-800">{selectedSubjects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">KT Exam Fee</span>
                <span className="font-medium text-slate-800">₹{totalFee}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-slate-800">Total Payable</span>
                <span className="text-lg font-semibold text-slate-800">₹{totalFee}</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button 
                onClick={handlePayment} 
                disabled={selectedSubjects.length === 0} 
                className="btn-primary w-full flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={selectedSubjects.length === 0 ? 'Select subjects to proceed with payment' : `Proceed to payment for ${selectedSubjects.length} subject(s)`}
              >
                <CreditCard className="w-4 h-4" aria-hidden="true" /> Proceed to Payment
              </button>
            </div>
          </section>

          <div className="card p-4 bg-slate-50">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1">KT Exam Guidelines</p>
                <ul className="space-y-1 text-xs">
                  <li>• Fee increases by ₹200 after each failed attempt</li>
                  <li>• Maximum 4 attempts allowed per subject</li>
                  <li>• Application deadline: 5 days before exam</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <section className="mt-6 card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50">
                <th scope="col" className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Date</th>
                <th scope="col" className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subjects</th>
                <th scope="col" className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Transaction ID</th>
                <th scope="col" className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Amount</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
                <th scope="col" className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Receipt</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100">
            {paymentHistory.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-sm text-slate-700">{payment.date}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{payment.subjectName}</td>
                <td className="px-5 py-4 text-sm font-mono text-slate-500">{payment.transactionId || '-'}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-800 text-right">₹{payment.amount}</td>
                <td className="px-5 py-4 text-center">{getStatusBadge(payment.status)}</td>
                <td className="px-5 py-4 text-center">
                  <button 
                    onClick={() => downloadReceipt(payment)} 
                    disabled={payment.status !== 'Paid'} 
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Download receipt for ${payment.subjectName}`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        {paymentHistory.length === 0 && (
          <EmptyState
            icon={CreditCard}
            title="No payment history"
            description="Your payment history will appear here once you make a payment."
          />
        )}
      </section>
    </div>
  );
};

export default KTSection;
