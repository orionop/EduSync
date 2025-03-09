import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, AlertCircle, TrendingUp, GraduationCap, BookOpen, Info } from 'lucide-react';
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
  name: string;
  marks: number;
  totalMarks: number;
  grade: string;
  status: 'Pass' | 'Fail';
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
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationType, setApplicationType] = useState<'RV' | 'PV' | 'RC'>('RV');
  const [reason, setReason] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Mock data
  const semesterResults: SemesterResult[] = [
    {
      semester: 6,
      subjects: [
        {
          id: '1',
          name: 'Data Structures',
          marks: 85,
          totalMarks: 100,
          grade: 'A',
          status: 'Pass'
        },
        {
          id: '2',
          name: 'Database Management',
          marks: 75,
          totalMarks: 100,
          grade: 'B',
          status: 'Pass'
        },
        {
          id: '3',
          name: 'Web Development',
          marks: 32,
          totalMarks: 100,
          grade: 'F',
          status: 'Fail'
        }
      ],
      cgpa: 3.8,
      sgpa: 3.5,
      status: 'Fail',
      year: '2024-25'
    }
  ];

  const performanceData = [
    { semester: 1, sgpa: 3.8 },
    { semester: 2, sgpa: 3.9 },
    { semester: 3, sgpa: 3.7 },
    { semester: 4, sgpa: 3.8 },
    { semester: 5, sgpa: 3.6 },
    { semester: 6, sgpa: 3.5 }
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
    toast.success('Scorecard download started');
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
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Marks</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Grade</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult?.subjects.map(subject => (
                      <tr key={subject.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-4 text-gray-900 dark:text-white">{subject.name}</td>
                        <td className="py-4 text-gray-900 dark:text-white">
                          {subject.marks}/{subject.totalMarks}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            subject.grade === 'F'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                            {subject.grade}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            subject.status === 'Pass'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {subject.status}
                          </span>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Results;