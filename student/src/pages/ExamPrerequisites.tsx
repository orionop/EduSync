import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Download, Check } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { z } from 'zod';

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
}

const ExamPrerequisites: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [showKTOnly, setShowKTOnly] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');

  // Mock data
  const exams: Exam[] = [
    {
      id: '1',
      code: 'CS301',
      subject: 'Data Structures and Algorithms',
      semester: 6,
      isKT: false,
      isCore: true
    },
    {
      id: '2',
      code: 'CS302',
      subject: 'Database Management Systems',
      semester: 6,
      isKT: false,
      isCore: true
    },
    {
      id: '3',
      code: 'CS303',
      subject: 'Web Development Technologies',
      semester: 6,
      isKT: true,
      isCore: true
    },
    {
      id: '4',
      code: 'CS304',
      subject: 'Operating Systems',
      semester: 6,
      isKT: false,
      isCore: true
    },
    {
      id: '5',
      code: 'CS305',
      subject: 'Computer Networks',
      semester: 6,
      isKT: false,
      isCore: true
    }
  ];

  // Initialize selected subjects with core subjects
  useEffect(() => {
    const coreSubjects = exams
      .filter(exam => exam.isCore && exam.semester === selectedSemester)
      .map(exam => exam.id);
    setSelectedSubjects(coreSubjects);
  }, [selectedSemester]);

  const filteredExams = exams.filter(exam => {
    if (showKTOnly) {
      return exam.isKT && exam.semester === selectedSemester;
    }
    return exam.semester === selectedSemester;
  });

  const handleSubjectToggle = (subjectId: string) => {
    const subject = exams.find(exam => exam.id === subjectId);
    if (subject?.isCore) return; // Prevent toggling core subjects

    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      examApplicationSchema.parse({
        subjects: selectedSubjects,
        agreementChecked
      });

      // Generate a random application ID
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
      toast.loading('Downloading hall ticket...');
      
      const pdfUrl = "https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/EdVantage%20Hallticket.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL0VkVmFudGFnZSBIYWxsdGlja2V0LnBkZiIsImlhdCI6MTc0MTQzOTA5MSwiZXhwIjoxNzcyOTc1MDkxfQ.knUFQsTBASYKD0H6bn61av2JcKzmsDtqXcYoGvp4dlo";
      
      // Open PDF in a new tab which will trigger the download
      window.open(pdfUrl, '_blank');

      toast.dismiss();
      toast.success('Hall ticket download started');
    } catch (error) {
      toast.dismiss();
      console.error('Error downloading hall ticket:', error);
      toast.error('Failed to download hall ticket. Please try again.');
    }
  };

  const downloadApplicationForm = async () => {
    try {
      toast.loading('Downloading application form...');
      
      const pdfUrl = "https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/exam%20application%20form.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL2V4YW0gYXBwbGljYXRpb24gZm9ybS5wZGYiLCJpYXQiOjE3NDE0MzgwOTAsImV4cCI6MTc3Mjk3NDA5MH0.pTTr8KBAdAG6c8oxzLsi-FNp2f6xzx-83ahcEqed_Pc";
      
      // Open PDF in a new tab which will trigger the download
      window.open(pdfUrl, '_blank');

      toast.dismiss();
      toast.success('Application form download started');
    } catch (error) {
      toast.dismiss();
      console.error('Error downloading application form:', error);
      toast.error('Failed to download application form. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Exam Prerequisites</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hall Ticket Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hall Ticket</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Download your exam hall ticket</p>
                  </div>
                </div>
                <button
                  onClick={downloadHallTicket}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Exam Application Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Application</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select subjects for examination</p>
                  </div>
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
                    onClick={() => setShowKTOnly(!showKTOnly)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showKTOnly
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <span>KT Only</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Code</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Subject Name</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Category</th>
                      <th className="pb-3 font-semibold text-gray-900 dark:text-white">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExams.map(exam => (
                      <tr key={exam.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-4 text-gray-900 dark:text-white">{exam.code}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 dark:text-white">{exam.subject}</span>
                            {exam.isKT && (
                              <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                                KT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            exam.isCore
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {exam.isCore ? 'Core' : 'Elective'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="relative inline-block">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(exam.id)}
                              onChange={() => handleSubjectToggle(exam.id)}
                              disabled={exam.isCore}
                              className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                                exam.isCore ? 'cursor-not-allowed opacity-60' : ''
                              }`}
                            />
                            {exam.isCore && (
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                                Core Subject (Required)
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-600 dark:text-gray-400">
                    I confirm that all the information provided is correct and I agree to the examination rules and regulations.
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={selectedSubjects.length === 0 || !agreementChecked}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Application Submitted!</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Your application has been submitted successfully. Your application ID is:
                    </p>
                    <p className="mt-2 text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {applicationId}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={downloadApplicationForm}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Application Form</span>
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
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

export default ExamPrerequisites;