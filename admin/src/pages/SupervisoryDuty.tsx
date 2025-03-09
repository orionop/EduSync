import React, { useState } from 'react';
import { Calendar, Clock, Users, Download, RefreshCw, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

interface Faculty {
  id: string;
  name: string;
  department: string;
  availability: boolean;
  assignedDuty?: string;
}

interface DutyFormData {
  startDate: string;
  endDate: string;
  timeSlot: string;
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
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [formData, setFormData] = useState<DutyFormData>({
    startDate: '',
    endDate: '',
    timeSlot: ''
  });
  const [dailyAllocations, setDailyAllocations] = useState<DailyAllocation[]>([]);
  const [faculties] = useState<Faculty[]>([
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', availability: true },
    { id: '2', name: 'Prof. Michael Chen', department: 'Electronics', availability: true },
    { id: '3', name: 'Dr. Emily Brown', department: 'Mathematics', availability: false },
    { id: '4', name: 'Prof. David Wilson', department: 'Physics', availability: true },
    { id: '5', name: 'Dr. Lisa Anderson', department: 'Computer Science', availability: true },
    { id: '6', name: 'Prof. Robert Taylor', department: 'Electronics', availability: true },
    { id: '7', name: 'Dr. Maria Garcia', department: 'Mathematics', availability: true },
    { id: '8', name: 'Prof. James Lee', department: 'Physics', availability: true }
  ]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const classrooms = [
    'Room 101', 'Room 102', 'Room 103', 'Room 104',
    'Room 201', 'Room 202', 'Room 203', 'Room 204'
  ];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '1:00 PM - 4:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDatesInRange = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleGenerateDutySheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      
      // Check if exam dates are available from timetable
      if (!window.examDates || window.examDates.length === 0) {
        toast.error('Please generate exam timetable first');
        return;
      }

      // Use exam dates from timetable
      const dates = window.examDates;
      
      // Generate allocations for each exam date
      const allAllocations = dates.map(date => {
        // Use the time slot from the timetable for this date
        const timeSlot = window.examTimeSlots?.[date] || '';
        
        const { allocations, substitutes } = generateRandomAllocation(date, timeSlot);
        return {
          date,
          allocations,
          substitutes
        };
      });

      setDailyAllocations(allAllocations);
      
      // Show success message and open allocation modal
      toast.success('Duty sheet generated successfully!');
      setShowDutyModal(false);
      setShowAllocationModal(true);
    } catch (error) {
      toast.error('Failed to generate duty sheet');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomAllocation = (date: string, timeSlot: string) => {
    const availableFaculties = faculties.filter(f => f.availability);
    const allocations: DutyAllocation[] = [];
    const substitutes: Faculty[] = [];
    
    // Randomly assign duties to available faculty
    const shuffledFaculties = [...availableFaculties].sort(() => Math.random() - 0.5);
    const shuffledClassrooms = [...classrooms].sort(() => Math.random() - 0.5);
    
    // Assign duties to first set of faculty
    shuffledClassrooms.forEach((classroom, index) => {
      if (index < shuffledFaculties.length - 2) { // Leave 2 faculty as substitutes
        allocations.push({
          faculty: shuffledFaculties[index],
          classroom,
          timeSlot,
          date
        });
      }
    });
    
    // Add remaining faculty as substitutes
    substitutes.push(...shuffledFaculties.slice(shuffledFaculties.length - 2));
    
    return { allocations, substitutes };
  };

  const features = [
    {
      id: 'generate-duty',
      title: 'Generate Supervisor Duty Sheet',
      description: 'Create and manage supervisor duty allocations with AI-based automation.',
      icon: Users,
      action: () => setShowDutyModal(true),
      stats: {
        label: 'Pending Allocation',
        value: '15'
      }
    },
    {
      id: 'emergency-duty',
      title: 'Emergency Duty Management',
      description: 'Handle last-minute supervisor changes and emergency duty allocations.',
      icon: Clock,
      stats: {
        label: 'Pending Requests',
        value: '3'
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Supervisory Duty Section
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and monitor examination supervision duties
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="relative group cursor-pointer"
                onClick={feature.action}
              >
                <div className="mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>

                <div className="mt-auto">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.stats.label}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.stats.value}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Non-Availability Periods
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View supervisor non-availability schedules
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supervisor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  {
                    id: '1',
                    name: 'Dr. Sarah Johnson',
                    startDate: '2025-03-15',
                    endDate: '2025-03-17',
                    reason: 'Conference Attendance'
                  },
                  {
                    id: '2',
                    name: 'Prof. Michael Chen',
                    startDate: '2025-03-18',
                    endDate: '2025-03-19',
                    reason: 'Medical Leave'
                  },
                  {
                    id: '3',
                    name: 'Dr. Emily Brown',
                    startDate: '2025-03-20',
                    endDate: '2025-03-22',
                    reason: 'Personal Emergency'
                  }
                ].map((period) => (
                  <tr key={period.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {period.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(period.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(period.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {period.reason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Generate Duty Sheet Modal */}
      <Modal
        isOpen={showDutyModal}
        onClose={() => setShowDutyModal(false)}
        title="Generate Supervisor Duty Sheet"
      >
        <form onSubmit={handleGenerateDutySheet} className="space-y-6">
          <div className="space-y-4">
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Duty sheet will be generated for exam dates from the timetable
              </p>
              {window.examDates && window.examDates.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Exam Schedule:
                  </p>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {window.examDates.map((date, index) => (
                      <div key={date} className="mb-1">
                        <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                        <span className="ml-2 text-gray-500">({window.examTimeSlots?.[date]})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isGenerating || !window.examDates || window.examDates.length === 0}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Duty Sheet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Duty Allocation Modal */}
      <Modal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        title="Supervisor Duty Allocation"
      >
        <div className="space-y-6">
          {/* Section Menu */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            {dailyAllocations.map((allocation, index) => (
              <button
                key={index}
                onClick={() => setCurrentDayIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  currentDayIndex === index
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Day {index + 1} - {new Date(allocation.date).toLocaleDateString()}
              </button>
            ))}
          </div>

          {dailyAllocations.length > 0 && (
            <div className="space-y-6">
              {/* Assigned Supervisors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Assigned Supervisors
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Faculty Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Classroom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Time Slot
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dailyAllocations[currentDayIndex].allocations.map((allocation, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {allocation.faculty.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {allocation.classroom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {allocation.timeSlot}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Substitute Supervisors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Available Substitute Supervisors
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Faculty Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Department
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dailyAllocations[currentDayIndex].substitutes.map((faculty, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {faculty.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {faculty.department}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
                disabled={currentDayIndex === 0}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDayIndex(prev => Math.min(dailyAllocations.length - 1, prev + 1))}
                disabled={currentDayIndex === dailyAllocations.length - 1}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => {
                toast.success('Duty sheet downloaded successfully');
                setShowAllocationModal(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Download Duty Sheet
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupervisoryDuty;