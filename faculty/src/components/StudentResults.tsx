import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, BoxPlot } from 'recharts';

interface Student {
  rollNumber: string;
  name: string;
  passFail: 'Pass' | 'Fail';
  sgpa: number;
  internalMarks: number;
  endSemMarks: number;
}

interface SubjectTopper {
  subject: string;
  rollNumber: string;
  name: string;
  sgpa: number;
}

interface StudentResultsProps {
  students: Student[];
  averageSGPA: number;
  subjectToppers: SubjectTopper[];
  overallTopper: {
    rollNumber: string;
    name: string;
    sgpa: number;
  };
  onClose: () => void;
}

const StudentResults: React.FC<StudentResultsProps> = ({
  students,
  averageSGPA,
  subjectToppers,
  overallTopper,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Results</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Result Summary */}
          <div className="space-y-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Result Summary</h3>
            
            {/* Average SGPA */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Average SGPA</h4>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {averageSGPA.toFixed(2)}
              </p>
            </div>

            {/* Subject-wise Toppers */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Subject-wise Toppers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectToppers.map((topper) => (
                  <div key={topper.subject} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white">{topper.subject}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {topper.name} ({topper.rollNumber})
                    </p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      SGPA: {topper.sgpa.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Topper */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Overall Topper</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {overallTopper.name} ({overallTopper.rollNumber})
              </p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                SGPA: {overallTopper.sgpa.toFixed(2)}
              </p>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scatter Plot */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Internal vs End-Sem Marks</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="internalMarks" name="Internal Marks" />
                      <YAxis type="number" dataKey="endSemMarks" name="End-Sem Marks" />
                      <Tooltip />
                      <Legend />
                      <Scatter data={students} fill="#8884d8" name="Student Marks" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Box Plot */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">SGPA Distribution</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{
                      name: 'SGPA',
                      min: Math.min(...students.map(s => s.sgpa)),
                      q1: calculateQ1(students.map(s => s.sgpa)),
                      median: calculateMedian(students.map(s => s.sgpa)),
                      q3: calculateQ3(students.map(s => s.sgpa)),
                      max: Math.max(...students.map(s => s.sgpa))
                    }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="median" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Student List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pass/Fail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SGPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student) => (
                    <tr key={student.rollNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.passFail === 'Pass' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {student.passFail}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.sgpa.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for statistics
const calculateQ1 = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.25);
  return sorted[index];
};

const calculateMedian = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.5);
  return sorted[index];
};

const calculateQ3 = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.75);
  return sorted[index];
};

export default StudentResults; 