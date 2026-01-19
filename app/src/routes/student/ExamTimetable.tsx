import React from 'react';
import { Download, Calendar, MapPin, Clock, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { generateExamTimetable } from '../../utils/pdfGenerator';

interface ExamSchedule {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'Theory' | 'Practical' | 'KT';
}

const ExamTimetable: React.FC = () => {
  const { user } = useAuth();

  // Mock exam schedule data
  const examSchedule: ExamSchedule[] = [
    { id: '1', subjectCode: 'CS301', subjectName: 'Data Structures and Algorithms', date: '2026-01-20', startTime: '10:00 AM', endTime: '01:00 PM', venue: 'Examination Hall A', type: 'Theory' },
    { id: '2', subjectCode: 'CS302', subjectName: 'Database Management Systems', date: '2026-01-22', startTime: '10:00 AM', endTime: '01:00 PM', venue: 'Examination Hall B', type: 'Theory' },
    { id: '3', subjectCode: 'CS303P', subjectName: 'Web Development Lab', date: '2026-01-24', startTime: '02:00 PM', endTime: '05:00 PM', venue: 'Computer Lab 1', type: 'Practical' },
    { id: '4', subjectCode: 'CS304', subjectName: 'Operating Systems', date: '2026-01-27', startTime: '10:00 AM', endTime: '01:00 PM', venue: 'Examination Hall C', type: 'KT' },
    { id: '5', subjectCode: 'CS305', subjectName: 'Computer Networks', date: '2026-01-29', startTime: '02:00 PM', endTime: '05:00 PM', venue: 'Examination Hall A', type: 'Theory' },
  ];

  const instructions = [
    'Report to the examination hall 30 minutes before the scheduled time.',
    'Carry your hall ticket and college ID card.',
    'Electronic devices are strictly prohibited.',
    'Use only blue or black pen for writing.',
    'Do not leave the examination hall before 1 hour.',
  ];

  const downloadTimetable = () => {
    try {
      toast.loading('Generating timetable...');
      const studentInfo = {
        name: user?.name || 'Student Name',
        studentId: user?.studentId || 'STU2025001',
        email: user?.email || 'student@example.com',
        course: user?.course || 'Computer Science',
        semester: user?.semester || '6',
      };
      generateExamTimetable(studentInfo, examSchedule);
      toast.dismiss();
      toast.success('Timetable downloaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate timetable. Please try again.');
    }
  };

  const getExamTypeBadge = (type: string) => {
    switch (type) {
      case 'Theory': return 'badge-info';
      case 'Practical': return 'badge-success';
      case 'KT': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Exam Timetable</h1>
        <p className="mt-1 text-sm text-slate-500">Your examination schedule for the current semester.</p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Semester 6 • January 2026</span>
        </div>
        <button onClick={downloadTimetable} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timetable */}
        <section className="lg:col-span-2 card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Subject</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Time</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Venue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examSchedule.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800">
                      {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{exam.subjectName}</span>
                      <span className={`badge ${getExamTypeBadge(exam.type)} text-xs`}>{exam.type}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{exam.subjectCode}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {exam.startTime}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{exam.startTime} - {exam.endTime}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {exam.venue}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Instructions */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Instructions</h2>
          </div>
          <div className="p-5">
            <ul className="space-y-3">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mx-5 mb-5 rounded-lg p-4 bg-amber-50 border border-amber-200">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Important Notice</p>
                <p className="text-amber-700 mt-1">Please check the notice board regularly for any schedule changes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamTimetable;
