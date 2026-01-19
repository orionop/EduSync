import React, { useState } from 'react';
import { Calendar, Download, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  department: string;
}

const ExamTimetable: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedules] = useState<ExamSchedule[]>([
    {
      id: '1',
      subject: 'Advanced Mathematics',
      date: '2025-03-15',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall A',
      department: 'Engineering'
    },
    {
      id: '2',
      subject: 'Digital Electronics',
      date: '2025-03-16',
      startTime: '14:00',
      endTime: '17:00',
      venue: 'Lab 101',
      department: 'Electronics'
    },
    {
      id: '3',
      subject: 'Computer Networks',
      date: '2025-03-17',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall B',
      department: 'Computer Science'
    }
  ]);

  const handleGenerateSchedule = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text('EdVantage University', 105, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text('Examination Timetable', 105, 25, { align: 'center' });
      doc.setFontSize(11);
      doc.text('End Semester Examination - Spring 2025', 105, 33, { align: 'center' });

      // Table
      autoTable(doc, {
        startY: 45,
        head: [['Date', 'Subject', 'Time', 'Venue', 'Department']],
        body: schedules.map((schedule) => [
          new Date(schedule.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          schedule.subject,
          `${schedule.startTime} - ${schedule.endTime}`,
          schedule.venue,
          schedule.department,
        ]),
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { 
          fillColor: [37, 99, 235], 
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 15, pageHeight - 10);
      doc.text('EduSync - Examination Management System', 195, pageHeight - 10, { align: 'right' });

      doc.save('ExamTimetable_Master.pdf');
      toast.success('Exam timetable downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Exam Timetable Generation
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateSchedule}
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
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {schedule.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(schedule.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.venue}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.department}
                  </div>
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
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ExamTimetable;