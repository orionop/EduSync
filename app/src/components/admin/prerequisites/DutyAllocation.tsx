import React, { useState } from 'react';
import { Users, Download, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateDutyAllocationReport } from '../../../utils/pdfGenerator';

interface Faculty {
  id: string;
  name: string;
  department: string;
  availability: boolean;
  assignedDuty?: string;
}

const DutyAllocation: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', availability: true, assignedDuty: 'Room 101' },
    { id: '2', name: 'Prof. Michael Chen', department: 'Electronics', availability: true },
    { id: '3', name: 'Dr. Emily Brown', department: 'Mathematics', availability: false },
    { id: '4', name: 'Prof. David Wilson', department: 'Physics', availability: true, assignedDuty: 'Room 102' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    try {
      // Build allocation data from faculties with assigned duties
      const allocations = faculties
        .filter(f => f.assignedDuty && f.availability)
        .map(faculty => ({
          faculty: {
            name: faculty.name,
            facultyId: `FAC${faculty.id.padStart(3, '0')}`,
            email: `${faculty.name.toLowerCase().replace(/\s+/g, '.')}@edvantage.edu.in`,
            department: faculty.department,
            designation: 'Professor',
          },
          duties: [{
            date: new Date().toISOString().split('T')[0],
            time: '10:00 AM - 1:00 PM',
            venue: faculty.assignedDuty || '',
            subject: 'General Supervision',
            role: 'Supervisor' as const,
          }],
        }));

      if (allocations.length === 0) {
        toast.error('No duty allocations to download');
        return;
      }

      generateDutyAllocationReport(allocations);
      toast.success('Duty allocation report downloaded');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Duty Allocation
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            Auto Generate
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Faculty Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned Duty
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {faculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {faculty.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {faculty.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    faculty.availability
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {faculty.availability ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={faculty.assignedDuty || ''}
                    onChange={(e) => {
                      const updatedFaculties = faculties.map(f =>
                        f.id === faculty.id ? { ...f, assignedDuty: e.target.value } : f
                      );
                      setFaculties(updatedFaculties);
                    }}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Assign duty"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DutyAllocation;