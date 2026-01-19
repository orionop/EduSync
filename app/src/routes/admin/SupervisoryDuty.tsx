import React, { useState } from 'react';
import { Calendar, Clock, Users, Download, RefreshCw, Save, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Faculty {
  id: string;
  name: string;
  department: string;
  availability: boolean;
}

interface DutyAllocation {
  faculty: Faculty;
  classroom: string;
  timeSlot: string;
  date: string;
}

interface DailyAllocation {
  date: string;
  allocations: DutyAllocation[];
  substitutes: Faculty[];
}

const SupervisoryDuty: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', timeSlot: '' });
  const [dailyAllocations, setDailyAllocations] = useState<DailyAllocation[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const [faculties] = useState<Faculty[]>([
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', availability: true },
    { id: '2', name: 'Prof. Michael Chen', department: 'Electronics', availability: true },
    { id: '3', name: 'Dr. Emily Brown', department: 'Mathematics', availability: false },
    { id: '4', name: 'Prof. David Wilson', department: 'Physics', availability: true },
    { id: '5', name: 'Dr. Lisa Anderson', department: 'Computer Science', availability: true },
    { id: '6', name: 'Prof. Robert Taylor', department: 'Electronics', availability: true },
  ]);

  const classrooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 201', 'Room 202'];
  const timeSlots = ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM'];

  const stats = {
    totalFaculty: faculties.length,
    available: faculties.filter(f => f.availability).length,
    unavailable: faculties.filter(f => !f.availability).length,
  };

  const handleGenerateDutySheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select date range');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const availableFaculties = faculties.filter(f => f.availability);
    const dates = getDatesInRange(formData.startDate, formData.endDate);
    
    const allocations: DailyAllocation[] = dates.map(date => ({
      date,
      allocations: classrooms.slice(0, 4).map((classroom, idx) => ({
        faculty: availableFaculties[idx % availableFaculties.length],
        classroom,
        timeSlot: timeSlots[0],
        date,
      })),
      substitutes: availableFaculties.slice(-2),
    }));

    setDailyAllocations(allocations);
    setShowDutyModal(false);
    setIsGenerating(false);
    toast.success('Duty allocations generated successfully');
  };

  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Supervisory Duty Allocation', 14, 22);
    
    dailyAllocations.forEach((day, index) => {
      if (index > 0) doc.addPage();
      doc.setFontSize(14);
      doc.text(`Date: ${day.date}`, 14, 40);
      
      autoTable(doc, {
        startY: 50,
        head: [['Classroom', 'Faculty', 'Department', 'Time Slot']],
        body: day.allocations.map(a => [a.classroom, a.faculty.name, a.faculty.department, a.timeSlot]),
      });
    });
    
    doc.save('duty_allocation.pdf');
    toast.success('PDF downloaded');
  };

  const currentAllocation = dailyAllocations[currentDayIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Supervisory Duty</h1>
        <p className="mt-1 text-sm text-slate-500">Allocate and manage examination supervision duties.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Faculty</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.totalFaculty}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Available</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600">{stats.available}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Unavailable</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-600">{stats.unavailable}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setShowDutyModal(true)} className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Generate Duty Sheet
        </button>
        {dailyAllocations.length > 0 && (
          <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      {/* Allocations */}
      {dailyAllocations.length > 0 && currentAllocation && (
        <section className="card overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                disabled={currentDayIndex === 0}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-base font-semibold text-slate-800">{currentAllocation.date}</h2>
                <p className="text-xs text-slate-500">Day {currentDayIndex + 1} of {dailyAllocations.length}</p>
              </div>
              <button
                onClick={() => setCurrentDayIndex(Math.min(dailyAllocations.length - 1, currentDayIndex + 1))}
                disabled={currentDayIndex === dailyAllocations.length - 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Classroom</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Faculty</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Department</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Time Slot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentAllocation.allocations.map((allocation, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">{allocation.classroom}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{allocation.faculty.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{allocation.faculty.department}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{allocation.timeSlot}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentAllocation.substitutes.length > 0 && (
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Substitutes:</p>
              <div className="flex gap-2">
                {currentAllocation.substitutes.map((sub) => (
                  <span key={sub.id} className="badge badge-info">{sub.name}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Faculty List */}
      <section className="mt-6 card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Faculty Availability</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {faculties.map((faculty) => (
            <div key={faculty.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{faculty.name}</p>
                <p className="text-xs text-slate-500">{faculty.department}</p>
              </div>
              <span className={`badge ${faculty.availability ? 'badge-success' : 'badge-error'}`}>
                {faculty.availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Generate Modal */}
      {showDutyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Generate Duty Sheet</h3>
              <button onClick={() => setShowDutyModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateDutySheet} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDutyModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isGenerating} className="btn-primary flex-1">
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisoryDuty;
