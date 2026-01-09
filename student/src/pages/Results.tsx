import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, AlertCircle, TrendingUp, GraduationCap, BookOpen, Info, Eye } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Validation schema for RV/PV/RC application
const applicationSchema = z.object({
  applicationType: z.enum(['RV', 'PV', 'RC'], { required_error: "Please select an application type" }),
  reason: z.string().optional(),
  agreementChecked: z.boolean().refine(val => val === true, "You must agree to the terms")
});

interface Subject {
  id: string;
  code: string;
  name: string;
  grade: string;
  gradePoints: number;
}

interface SemesterResult {
  semester: number;
  subjects: Subject[];
  cgpa: number;
  sgpa: number;
  status: 'Pass' | 'Fail';
  year: string;
}

const Results: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(4);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [applicationType, setApplicationType] = useState<'RV' | 'PV' | 'RC'>('RV');
  const [reason, setReason] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Mock data
  const semesterResults: SemesterResult[] = [
    {
      semester: 4,
      subjects: [
        {
          id: '1',
          code: 'CS301',
          name: 'Data Structures and Algorithms',
          grade: 'O',
          gradePoints: 10
        },
        {
          id: '2',
          code: 'CS302',
          name: 'Database Management Systems',
          grade: 'O',
          gradePoints: 10
        },
        {
          id: '3',
          code: 'CS303',
          name: 'Web Development Technologies',
          grade: 'A',
          gradePoints: 9
        },
        {
          id: '4',
          code: 'CS304',
          name: 'Operating Systems',
          grade: 'B',
          gradePoints: 8
        },
        {
          id: '5',
          code: 'CS305',
          name: 'Computer Networks',
          grade: 'A',
          gradePoints: 9
        }
      ],
      cgpa: 8.9,
      sgpa: 9.2,
      status: 'Pass',
      year: '2024-25'
    }
  ];

  const performanceData = [
    { semester: 1, sgpa: 8.7 },
    { semester: 2, sgpa: 8.8 },
    { semester: 3, sgpa: 8.6 },
    { semester: 4, sgpa: 9.2 }
  ];

  const currentResult = semesterResults.find(result => result.semester === selectedSemester);

  const handleApplicationSubmit = async () => {
    try {
      setLoading(true);
      // Validate form data
      applicationSchema.parse({
        applicationType,
        reason,
        agreementChecked
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${applicationType} application submitted successfully`);
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

  const downloadScorecard = () => {
    const pdfUrl = "https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/Marksheet.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL01hcmtzaGVldC5wZGYiLCJpYXQiOjE3NDE1MDkwMjMsImV4cCI6MTc3MzA0NTAyM30.QqffKxi9ZXrlZlWb5MqOujghVXqadmHe1tBMSQk--lk";
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = 'Marksheet.pdf';
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Scorecard download started');
  };

  const viewScorecard = () => {
    setShowPreviewModal(true);
  };

  const openApplicationModal = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setShowApplicationModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Results</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Legend Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8 shadow-sm">
              <div className="flex items-center space-x-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Application Types:</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>RV:</strong> Revaluation
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>PV:</strong> Paper Viewing
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>RC:</strong> Rechecking
                  </span>
                </div>
              </div>
            </div>

            {/* Result Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current CGPA</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {currentResult?.cgpa.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current SGPA</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {currentResult?.sgpa.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div className={`mt-1 px-2 py-1 rounded-full text-sm inline-flex ${
                      currentResult?.status === 'Pass'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {currentResult?.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Academic Year</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentResult?.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Graph */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Semester-wise SGPA progression</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sgpa" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      name="SGPA"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Semester Results</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Detailed subject-wise marks</p>
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
                    onClick={viewScorecard}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Preview</span>
                  </button>
                  <button
                    onClick={downloadScorecard}
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
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Code</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Name</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Grade</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Grade Points</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult?.subjects.map(subject => (
                      <tr key={subject.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-4 text-gray-900 dark:text-white">{subject.code}</td>
                        <td className="py-4 text-gray-900 dark:text-white">{subject.name}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {subject.grade}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900 dark:text-white">
                          {subject.gradePoints}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => openApplicationModal(subject.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Apply for RV/PV/RC
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Apply for RV/PV/RC
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={applicationType === 'RV'}
                            onChange={() => setApplicationType('RV')}
                            className="text-blue-600"
                          />
                          <span className="text-gray-900 dark:text-white">Revaluation (RV)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={applicationType === 'PV'}
                            onChange={() => setApplicationType('PV')}
                            className="text-blue-600"
                          />
                          <span className="text-gray-900 dark:text-white">Paper Viewing (PV)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={applicationType === 'RC'}
                            onChange={() => setApplicationType('RC')}
                            className="text-blue-600"
                          />
                          <span className="text-gray-900 dark:text-white">Rechecking (RC)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reason (Optional)
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
                        I understand that the application fee is non-refundable
                      </span>
                    </label>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleApplicationSubmit}
                        disabled={loading || !agreementChecked}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        {loading ? 'Submitting...' : 'Proceed to Payment'}
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

            {/* Preview Modal */}
            {showPreviewModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        End Semester Examination
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        4th Semester Results
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Student Info */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Student Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-gray-900 dark:text-white">John Doe</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
                          <p className="text-gray-900 dark:text-white">CS2021001</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Branch</p>
                          <p className="text-gray-900 dark:text-white">Computer Science and Engineering</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Semester</p>
                          <p className="text-gray-900 dark:text-white">4th Semester</p>
                        </div>
                      </div>
                    </div>

                    {/* Results Table */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject-wise Results</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b-2 border-gray-200 dark:border-gray-700">
                              <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Code</th>
                              <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Name</th>
                              <th className="pb-3 font-semibold text-gray-900 dark:text-white">Grade</th>
                              <th className="pb-3 font-semibold text-gray-900 dark:text-white">Grade Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentResult?.subjects.map(subject => (
                              <tr key={subject.id} className="border-b border-gray-100 dark:border-gray-700/50">
                                <td className="py-4 text-gray-900 dark:text-white font-medium">{subject.code}</td>
                                <td className="py-4 text-gray-900 dark:text-white">{subject.name}</td>
                                <td className="py-4">
                                  <span className="px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                    {subject.grade}
                                  </span>
                                </td>
                                <td className="py-4 text-gray-900 dark:text-white font-medium">{subject.gradePoints}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Result Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Result Summary</h4>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                            {currentResult?.status.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">SGPA Earned</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {currentResult?.sgpa.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total CGPA</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {currentResult?.cgpa.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Results;