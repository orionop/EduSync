import React, { useState, useEffect } from 'react';
import { Download, Calendar, MapPin, Clock, Info } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { SkeletonTable } from '../../components/test/Skeleton';
import { showToast } from '../../components/test/Toast';

const TestExamTimetable: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const exams = [
    { id: '1', date: 'Jan 20, 2026', day: 'Monday', subject: 'Data Structures', code: 'CS301', time: '10:00 AM', duration: '3 hours', venue: 'Examination Hall A', seat: 'A-24' },
    { id: '2', date: 'Jan 22, 2026', day: 'Wednesday', subject: 'Database Systems', code: 'CS302', time: '10:00 AM', duration: '3 hours', venue: 'Examination Hall B', seat: 'B-15' },
    { id: '3', date: 'Jan 24, 2026', day: 'Friday', subject: 'Computer Networks', code: 'CS303', time: '02:00 PM', duration: '3 hours', venue: 'Examination Hall A', seat: 'A-24' },
    { id: '4', date: 'Jan 27, 2026', day: 'Monday', subject: 'Operating Systems', code: 'CS304', time: '10:00 AM', duration: '3 hours', venue: 'Examination Hall C', seat: 'C-08' },
    { id: '5', date: 'Jan 29, 2026', day: 'Wednesday', subject: 'Software Engineering', code: 'CS305', time: '02:00 PM', duration: '3 hours', venue: 'Examination Hall B', seat: 'B-15' },
  ];

  const instructions = [
    'Report to the examination hall 30 minutes before the scheduled time.',
    'Carry your hall ticket and college ID card.',
    'Electronic devices are strictly prohibited.',
    'Use only blue or black pen for writing.',
    'Do not leave the examination hall before 1 hour.',
  ];

  if (loading) {
    return (
      <TestLayout title="Exam Timetable" subtitle="Your examination schedule for the current semester.">
        <SkeletonTable rows={5} cols={4} />
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Exam Timetable" subtitle="Your examination schedule for the current semester.">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Semester 6 • January 2026</span>
        </div>
        <button onClick={() => showToast.success('Downloading timetable PDF...')} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800">{exam.date}</div>
                    <div className="text-xs text-slate-500">{exam.day}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800">{exam.subject}</div>
                    <div className="text-xs text-slate-500 font-mono">{exam.code}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {exam.time}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{exam.duration}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {exam.venue}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Seat: {exam.seat}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

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
    </TestLayout>
  );
};

export default TestExamTimetable;
