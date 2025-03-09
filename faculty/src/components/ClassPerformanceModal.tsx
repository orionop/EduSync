import React, { useState, useEffect, useRef } from 'react';
import { X, BarChart3, Award, BookOpen } from 'lucide-react';
import Chart from 'chart.js/auto';

interface ClassroomPerformance {
  internalAssessment: number;
  midSemester: number;
  endSemester: number;
  practicals: number;
  topperName: string;
  topperMarks: number;
}

interface ClassPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomNumber: string;
  performance: ClassroomPerformance;
}

interface Student {
  id: string;
  name: string;
  internal: number;
  midSemester: number;
  termWork: number;
  practicals: number;
}

// Calculate EPI for a student
const calculateEPI = (internal: number, midSemester: number, termWork: number, practicals: number): number => {
  const totalMarks = internal + midSemester + termWork + practicals;
  const maxMarks = 90; // 20 + 20 + 25 + 25
  return (totalMarks / maxMarks) * 100;
};

// Generate bell curve data points
const generateBellCurveData = (epiScores: number[]) => {
  const mean = epiScores.reduce((sum, score) => sum + score, 0) / epiScores.length;
  const variance = epiScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / epiScores.length;
  const stdDev = Math.sqrt(variance);

  const points = 50;
  const range = stdDev * 4;
  const step = range / points;

  const labels: string[] = [];
  const data: number[] = [];

  for (let i = 0; i <= points; i++) {
    const x = mean - range / 2 + step * i;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));

    labels.push(x.toFixed(1));
    data.push(y * epiScores.length * step);
  }

  return { labels, data };
};

const ClassPerformanceModal: React.FC<ClassPerformanceModalProps> = ({
  isOpen,
  onClose,
  classroomNumber,
  performance,
}) => {
  const [students, setStudents] = useState<(Student & { epi: number })[]>([]);
  const [classEPI, setClassEPI] = useState(0);
  const [topper, setTopper] = useState({ name: '', epi: 0 });
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Mock student data and calculate EPI
    const mockStudents = [
      { id: 'S001', name: 'John Doe', internal: 18, midSemester: 17, termWork: 22, practicals: 23 },
      { id: 'S002', name: 'Jane Smith', internal: 19, midSemester: 18, termWork: 24, practicals: 24 },
      { id: 'S003', name: 'Bob Wilson', internal: 16, midSemester: 15, termWork: 20, practicals: 21 },
      { id: 'S004', name: 'Alice Brown', internal: 17, midSemester: 16, termWork: 21, practicals: 22 },
      { id: 'S005', name: 'Charlie Davis', internal: 15, midSemester: 14, termWork: 19, practicals: 20 },
    ].map(student => ({
      ...student,
      epi: calculateEPI(student.internal, student.midSemester, student.termWork, student.practicals)
    }));

    // Calculate class average EPI
    const avgEPI = mockStudents.reduce((sum, student) => sum + student.epi, 0) / mockStudents.length;

    // Find topper
    const topStudent = mockStudents.reduce((prev, current) => 
      prev.epi > current.epi ? prev : current
    );

    setStudents(mockStudents);
    setClassEPI(avgEPI);
    setTopper({ name: topStudent.name, epi: topStudent.epi });

    // Render bell curve
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const epiScores = mockStudents.map(student => student.epi);
        const { labels, data } = generateBellCurveData(epiScores);

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'EPI Distribution',
              data,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(156, 163, 175, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'EPI Score'
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Class Performance Analysis - {classroomNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Performance Summary */}
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">Class Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Class EPI</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{classEPI.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Top Performer</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">{topper.name}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">EPI: {topper.epi.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{students.length}</p>
              </div>
            </div>

            {/* Bell Curve */}
            <div className="h-48">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Subject-wise Performance Trends */}
          <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Subject-wise Performance Trends</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { subject: 'Data Structures', current: 76, previous: 72, trend: 'up' },
                { subject: 'Algorithms', current: 72, previous: 68, trend: 'up' },
                { subject: 'Database Systems', current: 68, previous: 71, trend: 'down' },
                { subject: 'Computer Networks', current: 74, previous: 70, trend: 'up' },
                { subject: 'Operating Systems', current: 70, previous: 69, trend: 'up' }
              ].map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.current}%</span>
                      <span className={`text-xs ${item.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.trend === 'up' ? '↑' : '↓'} {Math.abs(item.current - item.previous)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        item.trend === 'up' ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'
                      }`}
                      style={{ width: `${item.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EPI Distribution Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">EPI Distribution</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Range</th>
                    <th className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Count</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { range: '90-100', color: 'text-green-600 dark:text-green-400' },
                    { range: '80-89', color: 'text-blue-600 dark:text-blue-400' },
                    { range: '70-79', color: 'text-yellow-600 dark:text-yellow-400' },
                    { range: '60-69', color: 'text-orange-600 dark:text-orange-400' },
                    { range: 'Below 60', color: 'text-red-600 dark:text-red-400' },
                  ].map((item) => (
                    <tr key={item.range}>
                      <td className="py-1 text-gray-600 dark:text-gray-300">{item.range}</td>
                      <td className={`py-1 ${item.color}`}>
                        {students.filter(s => {
                          const score = s.epi;
                          if (item.range === '90-100') return score >= 90;
                          if (item.range === '80-89') return score >= 80 && score < 90;
                          if (item.range === '70-79') return score >= 70 && score < 80;
                          if (item.range === '60-69') return score >= 60 && score < 70;
                          return score < 60;
                        }).length}
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

export default ClassPerformanceModal;