import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Filter, Search, FileText, BookOpen, Clock3, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import RequestChangeModal from '../components/RequestChangeModal';
import { useNotifications } from '../context/NotificationContext';
import { NotificationCategory } from '../context/NotificationContext';
import SectionDashboard from '../components/SectionDashboard';

interface DutyAssignment {
  id: string;
  facultyName: string;
  timeSlot: string;
  classroom: string;
  status: 'pending' | 'approved' | 'none';
}

interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  classroom: string;
  duration: string;
}

interface UserInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  institution: string;
  accountType: string;
  photoUrl?: string;
}

interface NonAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; startDate: string; endDate: string }) => void;
  facultyName: string;
}

const NonAvailabilityModal: React.FC<NonAvailabilityModalProps> = ({ isOpen, onClose, onSubmit, facultyName }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mark Non-Availability</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Faculty Name
            </label>
            <input
              type="text"
              value={facultyName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SupervisorDuty: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timetable' | 'dutysheet'>('timetable');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestChangeModalOpen, setIsRequestChangeModalOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [isNonAvailabilityModalOpen, setIsNonAvailabilityModalOpen] = useState(false);
  
  const { addNotification } = useNotifications();
  
  // Mock available time slots
  const availableTimeSlots = [
    '09:00 AM - 11:00 AM',
    '11:30 AM - 01:30 PM',
    '02:00 PM - 04:00 PM',
    '04:30 PM - 06:30 PM'
  ];
  
  // Mock exam schedule data
  const examSchedule: ExamSchedule[] = [
    {
      id: '1',
      subject: 'Data Structures and Algorithms',
      date: '2025-05-10',
      time: '09:00 AM - 11:00 AM',
      classroom: 'CS-101',
      duration: '2 hours'
    },
    {
      id: '2',
      subject: 'Database Management Systems',
      date: '2025-05-12',
      time: '02:00 PM - 04:00 PM',
      classroom: 'CS-102',
      duration: '2 hours'
    },
    {
      id: '3',
      subject: 'Computer Networks',
      date: '2025-05-14',
      time: '09:00 AM - 11:00 AM',
      classroom: 'CS-103',
      duration: '2 hours'
    },
    {
      id: '4',
      subject: 'Operating Systems',
      date: '2025-05-16',
      time: '02:00 PM - 04:00 PM',
      classroom: 'CS-104',
      duration: '2 hours'
    },
    {
      id: '5',
      subject: 'Software Engineering',
      date: '2025-05-18',
      time: '09:00 AM - 11:00 AM',
      classroom: 'CS-105',
      duration: '2 hours'
    }
  ];
  
  // Mock duty assignments
  const dutyAssignments: DutyAssignment[] = [
    {
      id: '1',
      facultyName: 'Dr. Jane Smith',
      timeSlot: '09:00 AM - 11:00 AM',
      classroom: 'CS-101',
      status: 'none'
    },
    {
      id: '2',
      facultyName: 'Dr. Jane Smith',
      timeSlot: '02:00 PM - 04:00 PM',
      classroom: 'CS-102',
      status: 'none'
    },
    {
      id: '3',
      facultyName: 'Dr. Jane Smith',
      timeSlot: '09:00 AM - 11:00 AM',
      classroom: 'CS-103',
      status: 'none'
    },
    {
      id: '4',
      facultyName: 'Prof. Robert Johnson',
      timeSlot: '02:00 PM - 04:00 PM',
      classroom: 'CS-104',
      status: 'none'
    },
    {
      id: '5',
      facultyName: 'Dr. Emily Davis',
      timeSlot: '09:00 AM - 11:00 AM',
      classroom: 'CS-105',
      status: 'none'
    }
  ];
  
  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('eduSyncUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // In a real app, you would fetch complete user details from an API
      // For this demo, we'll extend the stored user with mock data
      setUserInfo({
        ...parsedUser,
        email: 'jane.smith@university.edu',
        phone: '+1 (555) 123-4567',
        institution: 'EdVantage University',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      });
    }
  }, []);

  const handleRequestChange = (duty: DutyAssignment) => {
    setSelectedDuty(duty);
    setIsRequestChangeModalOpen(true);
  };

  const handleSubmitChangeRequest = (timeSlot: string, substituteTeacher: string | null) => {
    if (selectedDuty) {
      // Add to pending requests
      setPendingRequests(prev => new Set(prev).add(selectedDuty.id));
      
      // Add a notification for the request
      addNotification({
        title: 'Time Slot Change Request Submitted',
        message: `You have requested to change your supervision duty for classroom ${selectedDuty.classroom} from ${selectedDuty.timeSlot} to ${timeSlot}.`,
        timestamp: new Date().toLocaleString(),
        type: 'announcement',
        sender: 'System',
        category: NotificationCategory.SLOT_REQUEST_MADE
      });
      
      // Show appropriate toast message based on substitute teacher selection
      if (substituteTeacher) {
        toast.success(`Request sent to ${substituteTeacher}`);
      } else {
        toast.success('Request sent successfully');
      }
    }
    setIsRequestChangeModalOpen(false);
  };

  // Filter exam schedule based on search term
  const filteredExamSchedule = examSchedule.filter(exam => 
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.classroom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter duty assignments based on search term
  const filteredDutyAssignments = dutyAssignments.filter(duty => 
    duty.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duty.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNonAvailabilitySubmit = (data: { name: string; startDate: string; endDate: string }) => {
    // Here you would typically send this data to your backend
    toast.success('Non-availability period marked successfully');
  };

  return (
    <SectionDashboard title="Supervisor Duty" userInfo={userInfo}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* View Exam Timetable Card */}
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 ${
              activeTab === 'timetable' ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
            } hover:shadow-md cursor-pointer`}
            onClick={() => setActiveTab('timetable')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">View Exam Timetable</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  End Semester Exam Schedule
                </p>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>View complete exam schedule with dates and times</span>
            </div>
          </div>
          
          {/* View Duty Sheet Card */}
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 ${
              activeTab === 'dutysheet' ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''
            } hover:shadow-md cursor-pointer`}
            onClick={() => setActiveTab('dutysheet')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">View Duty Sheet</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supervisor Allotment Details
                </p>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>View and manage your supervision assignments</span>
            </div>
          </div>

          {/* Non-Availability Card */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md cursor-pointer"
            onClick={() => setIsNonAvailabilityModalOpen(true)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mark Non-Availability</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Declare Unavailable Periods
                </p>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Mark periods when you are unavailable for duty</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              {activeTab === 'timetable' ? (
                <>
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-medium text-gray-900 dark:text-white">End Semester Exam Schedule</h2>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="font-medium text-gray-900 dark:text-white">Supervisor Duty Allotment - {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                </>
              )}
            </div>
            
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'timetable' ? "Search by subject or classroom..." : "Search by faculty or classroom..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'timetable' ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Classroom
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExamSchedule.length > 0 ? (
                    filteredExamSchedule.map((exam, index) => (
                      <tr 
                        key={exam.id} 
                        className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'} hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {exam.subject}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {exam.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {exam.time}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {exam.classroom}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            {exam.duration}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No exams found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Faculty Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time Slot Assigned
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Classroom Assigned
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDutyAssignments.length > 0 ? (
                    filteredDutyAssignments.map((duty, index) => (
                      <tr 
                        key={duty.id} 
                        className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'} hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            {duty.facultyName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {duty.timeSlot}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {duty.classroom}
                        </td>
                        <td className="px-4 py-3">
                          {pendingRequests.has(duty.id) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                              Pending Approval
                            </span>
                          ) : duty.status === 'approved' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              No Request
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleRequestChange(duty)}
                            disabled={pendingRequests.has(duty.id)}
                            className={`text-sm ${
                              pendingRequests.has(duty.id)
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                            }`}
                          >
                            {pendingRequests.has(duty.id) ? 'Request Pending' : 'Request'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No duties found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'timetable' 
                ? `Showing ${filteredExamSchedule.length} of ${examSchedule.length} exams` 
                : `Showing ${filteredDutyAssignments.length} of ${dutyAssignments.length} duties`}
            </p>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">Supervision Guidelines</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-1">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Arrive 15 minutes early</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ensure you arrive at the exam venue at least 15 minutes before the scheduled start time.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-1">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Check seating arrangement</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Verify that the seating arrangement complies with examination protocols.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-1">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Verify student identity</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check student ID cards against the attendance sheet before distributing question papers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedDuty && (
        <RequestChangeModal
          isOpen={isRequestChangeModalOpen}
          onClose={() => setIsRequestChangeModalOpen(false)}
          dutyDetails={{
            facultyName: userInfo?.name || 'Faculty',
            timeSlot: selectedDuty.timeSlot,
            classroom: selectedDuty.classroom
          }}
          availableTimeSlots={availableTimeSlots}
          onSubmit={(timeSlot, substituteTeacher) => handleSubmitChangeRequest(timeSlot, substituteTeacher)}
        />
      )}

      {/* Add NonAvailabilityModal */}
      <NonAvailabilityModal
        isOpen={isNonAvailabilityModalOpen}
        onClose={() => setIsNonAvailabilityModalOpen(false)}
        onSubmit={handleNonAvailabilitySubmit}
        facultyName={userInfo?.name || 'Faculty'}
      />
    </SectionDashboard>
  );
};

export default SupervisorDuty;