import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Clock, CheckCircle, CreditCard, Download, Info } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { SkeletonStat, SkeletonListItem } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

const TestKTSection: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const backlogs = [
    { id: '1', code: 'CS201', name: 'Object Oriented Programming', semester: 4, attempts: 1, lastAttempt: 'June 2025', fee: 800, status: 'pending' },
    { id: '2', code: 'CS203', name: 'Computer Organization', semester: 4, attempts: 2, lastAttempt: 'Dec 2025', fee: 1000, status: 'pending' },
  ];

  const paymentHistory = [
    { id: '1', date: 'Dec 10, 2025', amount: 800, subjects: ['CS201'], status: 'success', transactionId: 'TXN123456789' },
    { id: '2', date: 'June 15, 2025', amount: 1600, subjects: ['CS201', 'CS203'], status: 'success', transactionId: 'TXN987654321' },
  ];

  const pendingBacklogs = backlogs.filter(b => b.status === 'pending');
  const totalFee = pendingBacklogs.filter(b => selectedSubjects.includes(b.id)).reduce((sum, b) => sum + b.fee, 0);

  const handleSubjectToggle = (id: string) => {
    setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleApply = () => {
    if (selectedSubjects.length === 0) {
      showToast.error('Please select at least one subject');
      return;
    }
    showToast.success('Redirecting to payment gateway...');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'pending': return <span className="badge badge-warning"><Clock className="w-3 h-3" /> Pending</span>;
      default: return <span className="badge badge-error"><AlertCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  if (loading) {
    return (
      <TestLayout title="KT Section" subtitle="Apply for backlog examinations and manage KT applications.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SkeletonStat /><SkeletonStat /><SkeletonStat />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">{[1, 2].map(i => <SkeletonListItem key={i} />)}</div>
          <SkeletonStat />
        </div>
      </TestLayout>
    );
  }

  return (
    <TestLayout title="KT Section" subtitle="Apply for backlog examinations and manage KT applications.">
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
          <span className="text-3xl font-semibold text-slate-800">{backlogs.reduce((sum, b) => sum + b.attempts, 0)}</span>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Cleared</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold text-slate-800">{backlogs.filter(b => b.status === 'cleared').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Pending Backlog Subjects</h2>
            <p className="text-sm text-slate-500 mt-1">Select subjects to apply for KT examination</p>
          </div>
          
          {pendingBacklogs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {pendingBacklogs.map((subject) => (
                <label key={subject.id} className="flex items-center px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectToggle(subject.id)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
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
            <div className="px-5 py-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
              <p className="text-sm font-medium text-slate-600">No pending backlogs</p>
              <p className="text-sm text-slate-500 mt-1">All your subjects have been cleared.</p>
            </div>
          )}
        </section>

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
              <button onClick={handleApply} disabled={selectedSubjects.length === 0} className="btn-primary w-full flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Proceed to Payment
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

      <section className="mt-6 card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Payment History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subjects</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Transaction ID</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Amount</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paymentHistory.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-sm text-slate-700">{payment.date}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{payment.subjects.join(', ')}</td>
                <td className="px-5 py-4 text-sm font-mono text-slate-500">{payment.transactionId}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-800 text-right">₹{payment.amount}</td>
                <td className="px-5 py-4 text-center">{getStatusBadge(payment.status)}</td>
                <td className="px-5 py-4 text-center">
                  <button onClick={() => showToast.success('Downloading receipt...')} className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </TestLayout>
  );
};

export default TestKTSection;
