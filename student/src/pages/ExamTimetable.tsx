import React from 'react';
import { Download, Calendar, MapPin, Clock, Info } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

interface ExamSchedule {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'Theory' | 'Practical' | 'KT';
  instructions?: string[];
}

const ExamTimetable: React.FC = () => {
  // Mock exam schedule data
  const examSchedule: ExamSchedule[] = [
    {
      id: '1',
      subjectCode: 'CS301',
      subjectName: 'Data Structures and Algorithms',
      date: '2025-03-20',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'Examination Hall A',
      type: 'Theory',
      instructions: [
        'Bring your hall ticket and college ID',
        'No electronic devices allowed',
        'Report 30 minutes before exam time'
      ]
    },
    {
      id: '2',
      subjectCode: 'CS302',
      subjectName: 'Database Management Systems',
      date: '2025-03-22',
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      venue: 'Examination Hall B',
      type: 'Theory'
    },
    {
      id: '3',
      subjectCode: 'CS303P',
      subjectName: 'Web Development Lab',
      date: '2025-03-24',
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      venue: 'Computer Lab 1',
      type: 'Practical'
    },
    {
      id: '4',
      subjectCode: 'CS304',
      subjectName: 'Operating Systems',
      date: '2025-03-26',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'Examination Hall C',
      type: 'KT'
    }
  ];

  const downloadTimetable = () => {
    // In a real application, this would generate a PDF
    toast.success('Timetable download started');
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Theory':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Practical':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'KT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Exam Timetable</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={downloadTimetable}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                aria-label="Download timetable as PDF"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Important Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Important Instructions</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Arrive at the examination venue at least 30 minutes before the scheduled time</li>
                    <li>Carry your hall ticket and college ID card</li>
                    <li>No electronic devices are allowed in the examination hall</li>
                    <li>Read all instructions on the question paper carefully</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exam Schedule Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {examSchedule.map((exam) => (
                      <tr 
                        key={exam.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {exam.subjectName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {exam.subjectCode}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white">
                                {new Date(exam.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>{exam.startTime} - {exam.endTime}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-900 dark:text-white">{exam.venue}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExamTypeColor(exam.type)}`}>
                            {exam.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamTimetable;