import React from 'react';
import { X, Download, FileText } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  marks: number;
  grade: string;
  cgpa: number;
  sgpa: number;
}

interface MarksBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classroomNumber: string;
}

const MarksBreakdownModal: React.FC<MarksBreakdownModalProps> = ({
  isOpen,
  onClose,
  students,
  classroomNumber,
}) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Marks Breakdown - Classroom {classroomNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto flex-1">
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{students.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average CGPA</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(students.reduce((sum, student) => sum + student.cgpa, 0) / students.length).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average SGPA</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(students.reduce((sum, student) => sum + student.sgpa, 0) / students.length).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    SGPA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{student.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{student.marks}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        student.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        student.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        student.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{student.cgpa.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{student.sgpa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarksBreakdownModal;