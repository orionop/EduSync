import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, Clock, Info, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { generateHallTicket, generateExamApplication } from '../../utils/pdfGenerator';

// Validation schema
const examApplicationSchema = z.object({
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  agreementChecked: z.boolean().refine(val => val === true, "You must agree to the terms")
});

interface Exam {
  id: string;
  code: string;
  subject: string;
  semester: number;
  isKT: boolean;
  isCore: boolean;
  credits: number;
  fee: number;
}

const ExamPrerequisites: React.FC = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [showKTOnly, setShowKTOnly] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');

  // Mock data
  const exams: Exam[] = [
    { id: '1', code: 'CS301', subject: 'Data Structures and Algorithms', semester: 6, isKT: false, isCore: true, credits: 4, fee: 500 },
    { id: '2', code: 'CS302', subject: 'Database Management Systems', semester: 6, isKT: false, isCore: true, credits: 4, fee: 500 },
    { id: '3', code: 'CS303', subject: 'Web Development Technologies', semester: 6, isKT: true, isCore: true, credits: 3, fee: 500 },
    { id: '4', code: 'CS304', subject: 'Operating Systems', semester: 6, isKT: false, isCore: true, credits: 4, fee: 500 },
    { id: '5', code: 'CS305', subject: 'Computer Networks', semester: 6, isKT: false, isCore: true, credits: 3, fee: 500 },
  ];

  const prerequisites = [
    { label: 'Fees Payment', status: 'completed', description: 'All dues cleared' },
    { label: 'Attendance', status: 'completed', description: '82% (Min: 75%)' },
    { label: 'Internal Marks', status: 'completed', description: 'All submitted' },
    { label: 'Library Dues', status: 'completed', description: 'No pending dues' },
  ];

  // Initialize selected subjects with core subjects
  useEffect(() => {
    const coreSubjects = exams
      .filter(exam => exam.isCore && exam.semester === selectedSemester)
      .map(exam => exam.id);
    setSelectedSubjects(coreSubjects);
  }, [selectedSemester]);

  const filteredExams = exams.filter(exam => {
    if (showKTOnly) return exam.isKT && exam.semester === selectedSemester;
    return exam.semester === selectedSemester;
  });

  const handleSubjectToggle = (subjectId: string) => {
    const subject = exams.find(exam => exam.id === subjectId);
    if (subject?.isCore) return;
    setSelectedSubjects(prev => prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]);
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === filteredExams.length) {
      const coreSubjects = filteredExams.filter(e => e.isCore).map(e => e.id);
      setSelectedSubjects(coreSubjects);
    } else {
      setSelectedSubjects(filteredExams.map(e => e.id));
    }
  };

  const totalFee = filteredExams.filter(e => selectedSubjects.includes(e.id)).reduce((sum, e) => sum + e.fee, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const handleSubmit = async () => {
    try {
      examApplicationSchema.parse({ subjects: selectedSubjects, agreementChecked });
      const newApplicationId = `APP${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setApplicationId(newApplicationId);
      setShowConfirmation(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const downloadHallTicket = async () => {
    try {
      toast.loading('Generating hall ticket...');
      const studentInfo = {
        name: user?.name || 'Student Name',
        studentId: user?.studentId || 'STU2025001',
        email: user?.email || 'student@example.com',
        course: user?.course || 'Computer Science',
        semester: user?.semester || '6',
      };
      const examSchedule = exams
        .filter(exam => exam.semester === selectedSemester)
        .map((exam, index) => ({
          subjectCode: exam.code,
          subjectName: exam.subject,
          date: new Date(Date.now() + (index + 1) * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:00 AM',
          endTime: '01:00 PM',
          venue: `Examination Hall ${String.fromCharCode(65 + index)}`,
          type: exam.isKT ? 'KT' as const : 'Theory' as const,
        }));
      generateHallTicket(studentInfo, examSchedule);
      toast.dismiss();
      toast.success('Hall ticket downloaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate hall ticket. Please try again.');
    }
  };

  const downloadApplicationForm = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    try {
      toast.loading('Generating application form...');
      const studentInfo = {
        name: user?.name || 'Student Name',
        studentId: user?.studentId || 'STU2025001',
        email: user?.email || 'student@example.com',
        course: user?.course || 'Computer Science',
        semester: user?.semester || '6',
      };
      const subjects = selectedSubjects.map(subjectId => {
        const exam = exams.find(e => e.id === subjectId);
        return { code: exam?.code || '', name: exam?.subject || '', isKT: exam?.isKT || false };
      });
      const tempAppId = applicationId || `APP${Date.now().toString(36).toUpperCase()}`;
      generateExamApplication(studentInfo, subjects, tempAppId);
      toast.dismiss();
      toast.success('Application form downloaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate application form. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Exam Prerequisites</h1>
        <p className="mt-1 text-sm text-slate-500">Apply for examinations and download your hall ticket.</p>
      </div>

      {/* Eligibility Status */}
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
        {/* Subjects Table */}
        <section className="lg:col-span-2 card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Select Subjects</h2>
              <p className="text-sm text-slate-500 mt-1">Choose subjects for examination</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
              </select>
              <button
                onClick={() => setShowKTOnly(!showKTOnly)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showKTOnly ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                KT Only
              </button>
              <button onClick={handleSelectAll} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {selectedSubjects.length === filteredExams.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredExams.map((subject) => (
              <label key={subject.id} className={`flex items-center px-5 py-4 cursor-pointer transition-colors ${subject.isCore ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}>
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  disabled={subject.isCore}
                  className={`w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500 ${subject.isCore ? 'cursor-not-allowed opacity-60' : ''}`}
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{subject.subject}</span>
                    <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
                    {subject.isKT && <span className="badge badge-warning text-xs">KT</span>}
                    {subject.isCore && <span className="badge badge-info text-xs">Core</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{subject.credits} Credits</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">₹{subject.fee}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Fee Summary */}
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

          {/* Declaration */}
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

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={handleSubmit} disabled={selectedSubjects.length === 0 || !agreementChecked} className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Pay & Submit Application
            </button>
            <button onClick={downloadHallTicket} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Hall Ticket
            </button>
          </div>

          {/* Info Box */}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Application Submitted</h3>
              <button onClick={() => setShowConfirmation(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-600 mb-2">Your application has been submitted successfully.</p>
              <p className="text-sm text-slate-600 mb-2">Application ID:</p>
              <p className="text-xl font-mono font-bold text-slate-800 mb-4">{applicationId}</p>
              <div className="space-y-3">
                <button onClick={downloadApplicationForm} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Application Form
                </button>
                <button onClick={() => setShowConfirmation(false)} className="btn-secondary w-full">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPrerequisites;
