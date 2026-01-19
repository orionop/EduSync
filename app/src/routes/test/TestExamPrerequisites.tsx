import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, Clock, Info, CreditCard } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { StepsProgress } from '../../components/test/Progress';
import { SkeletonCard } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: 'Regular' | 'Backlog';
  fee: number;
}

const TestExamPrerequisites: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const subjects: Subject[] = [
    { id: '1', code: 'CS301', name: 'Data Structures', credits: 4, type: 'Regular', fee: 500 },
    { id: '2', code: 'CS302', name: 'Database Systems', credits: 4, type: 'Regular', fee: 500 },
    { id: '3', code: 'CS303', name: 'Computer Networks', credits: 3, type: 'Regular', fee: 500 },
    { id: '4', code: 'CS304', name: 'Operating Systems', credits: 4, type: 'Regular', fee: 500 },
    { id: '5', code: 'CS305', name: 'Software Engineering', credits: 3, type: 'Regular', fee: 500 },
  ];

  const prerequisites = [
    { label: 'Fees Payment', status: 'completed', description: 'All dues cleared' },
    { label: 'Attendance', status: 'completed', description: '82% (Min: 75%)' },
    { label: 'Internal Marks', status: 'completed', description: 'All submitted' },
    { label: 'Library Dues', status: 'completed', description: 'No pending dues' },
  ];

  const applicationSteps = ['Eligibility', 'Select Subjects', 'Payment', 'Confirmation'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const handleSubjectToggle = (id: string) => {
    setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    if (currentStep < 2) setCurrentStep(2);
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map(s => s.id));
    }
    if (currentStep < 2) setCurrentStep(2);
  };

  const totalFee = subjects.filter(s => selectedSubjects.includes(s.id)).reduce((sum, s) => sum + s.fee, 0);

  const handleSubmit = () => {
    if (selectedSubjects.length === 0) {
      showToast.error('Please select at least one subject');
      return;
    }
    if (!agreementChecked) {
      showToast.error('Please accept the declaration');
      return;
    }
    setCurrentStep(3);
    showToast.success('Application submitted successfully!');
  };

  if (loading) {
    return (
      <TestLayout title="Exam Prerequisites" subtitle="Apply for examinations and download your hall ticket.">
        <SkeletonCard />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonCard /></div>
          <SkeletonCard />
        </div>
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Exam Prerequisites" subtitle="Apply for examinations and download your hall ticket.">
      <div className="card p-6 mb-6">
        <StepsProgress steps={applicationSteps} currentStep={currentStep} />
      </div>

      <section className="card mb-6">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Eligibility Status</h2>
          <p className="text-sm text-slate-500 mt-1">All prerequisites must be completed to apply for exams</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {prerequisites.map((item, index) => (
            <div key={index} className={`px-5 py-4 ${index < prerequisites.length - 1 ? 'border-r border-slate-100' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(item.status)}
                <span className="text-sm font-medium text-slate-800">{item.label}</span>
              </div>
              <p className="text-xs text-slate-500 ml-7">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Select Subjects</h2>
              <p className="text-sm text-slate-500 mt-1">Choose subjects for examination</p>
            </div>
            <button onClick={handleSelectAll} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {selectedSubjects.length === subjects.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {subjects.map((subject) => (
              <label key={subject.id} className="flex items-center px-5 py-4 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{subject.name}</span>
                    <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{subject.credits} Credits • {subject.type}</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">₹{subject.fee}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-800">Fee Summary</h2>
            </div>
            <div className="card-body space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Selected Subjects</span>
                <span className="font-medium text-slate-800">{selectedSubjects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Examination Fee</span>
                <span className="font-medium text-slate-800">₹{totalFee}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-800">Total Amount</span>
                <span className="text-2xl font-bold text-slate-800">₹{totalFee}</span>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
              />
              <span className="text-sm text-slate-600 leading-relaxed">
                I declare that all the information provided is correct and I agree to abide by the examination rules.
              </span>
            </label>
          </section>

          <div className="space-y-3">
            <button onClick={handleSubmit} disabled={selectedSubjects.length === 0 || !agreementChecked} className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Pay & Submit Application
            </button>
            <button onClick={() => showToast.success('Downloading hall ticket...')} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Hall Ticket
            </button>
          </div>

          <div className="card p-4 bg-amber-50/50 border-amber-200">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Dates</p>
                <p className="text-amber-700">Application Deadline: Jan 15, 2026</p>
                <p className="text-amber-700">Hall Ticket Available: Jan 16, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TestLayout>
  );
};

export default TestExamPrerequisites;
