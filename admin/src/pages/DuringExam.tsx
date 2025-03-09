import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  LayoutGrid, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Building,
  Users,
  RefreshCw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

interface ProctorNotification {
  id: string;
  proctorName: string;
  roomNumber: string;
  message: string;
  timestamp: string;
  urgency: 'urgent' | 'normal';
}

interface UFMReport {
  id: string;
  examName: string;
  candidateName: string;
  rollNumber: string;
  description: string;
  facultyName: string;
  timestamp: string;
}

interface Student {
  branch: string;
  seatNumber: string;
  rollNumber: string;
}

interface Bench {
  benchNumber: number;
  students: Student[];
}

interface Room {
  roomNumber: string;
  benches: Bench[];
}

interface BranchInfo {
  name: string;
  studentCount: number;
}

interface SeatingFormData {
  examDate: string;
  candidateCount: number;
  roomCount: number;
  benchesPerRoom: number;
  branchCount: number;
  branches: BranchInfo[];
}

const DuringExam: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUFMModal, setShowUFMModal] = useState(false);
  const [showSeatingModal, setShowSeatingModal] = useState(false);
  const [selectedUFM, setSelectedUFM] = useState<UFMReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seatingForm, setSeatingForm] = useState<SeatingFormData>({
    examDate: '',
    candidateCount: 0,
    roomCount: 0,
    benchesPerRoom: 0,
    branchCount: 0,
    branches: []
  });
  const [showSeatingLayout, setShowSeatingLayout] = useState(false);
  const [generatedLayout, setGeneratedLayout] = useState<Room[] | null>(null);

  const [notifications] = useState<ProctorNotification[]>([
    {
      id: '1',
      proctorName: 'Dr. Sarah Johnson',
      roomNumber: 'Room 101',
      message: 'Additional answer sheets required',
      timestamp: '2025-03-15T09:30:00',
      urgency: 'normal'
    },
    {
      id: '2',
      proctorName: 'Prof. Michael Chen',
      roomNumber: 'Room 202',
      message: 'Student feeling unwell, medical assistance needed',
      timestamp: '2025-03-15T10:15:00',
      urgency: 'urgent'
    },
    {
      id: '3',
      proctorName: 'Dr. Emily Brown',
      roomNumber: 'Room 303',
      message: 'Technical issue with calculator',
      timestamp: '2025-03-15T11:00:00',
      urgency: 'normal'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.proctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterType === 'all' || notification.urgency === filterType;
    return matchesSearch && matchesUrgency;
  });

  const [ufmReports] = useState<UFMReport[]>([
    {
      id: '1',
      examName: 'Advanced Mathematics',
      candidateName: 'John Smith',
      rollNumber: '2025CS001',
      description: 'Found using unauthorized electronic device',
      facultyName: 'Dr. Sarah Johnson',
      timestamp: '2025-03-15T09:45:00'
    },
    {
      id: '2',
      examName: 'Digital Electronics',
      candidateName: 'Emma Davis',
      rollNumber: '2025EC002',
      description: 'Attempting to communicate with other candidates',
      facultyName: 'Prof. Michael Chen',
      timestamp: '2025-03-15T10:30:00'
    },
    {
      id: '3',
      examName: 'Computer Networks',
      candidateName: 'Michael Wilson',
      rollNumber: '2025CS003',
      description: 'Unauthorized materials found',
      facultyName: 'Dr. Emily Brown',
      timestamp: '2025-03-15T11:15:00'
    }
  ]);

  const calculateTotalStudents = (branches: BranchInfo[]): number => {
    return branches.reduce((total, branch) => total + (branch.studentCount || 0), 0);
  };

  const handleBranchCountChange = (count: number) => {
    const newBranches = Array(count).fill(null).map((_, index) => ({
      name: seatingForm.branches[index]?.name || '',
      studentCount: seatingForm.branches[index]?.studentCount || 0
    }));
    
    const totalStudents = calculateTotalStudents(newBranches);
    
    setSeatingForm({ 
      ...seatingForm, 
      branchCount: count,
      branches: newBranches,
      candidateCount: totalStudents
    });
  };

  const handleBranchInfoChange = (index: number, field: keyof BranchInfo, value: string | number) => {
    const newBranches = [...seatingForm.branches];
    newBranches[index] = {
      ...newBranches[index],
      [field]: field === 'studentCount' ? Number(value) : value
    };
    
    const totalStudents = calculateTotalStudents(newBranches);
    
    setSeatingForm({
      ...seatingForm,
      branches: newBranches,
      candidateCount: totalStudents
    });
  };

  const handleGenerateSeating = async () => {
    try {
      setIsGenerating(true);
      
      // Validate inputs
      if (seatingForm.branchCount !== seatingForm.branches.length) {
        toast.error('Please enter all branch names');
        return;
      }

      const totalSeats = seatingForm.roomCount * seatingForm.benchesPerRoom * 2; // 2 students per bench
      if (totalSeats < seatingForm.candidateCount) {
        toast.error('Not enough seats available for all candidates');
        return;
      }

      // Generate seating layout
      const layout = generateSeatingLayout(seatingForm);
      setGeneratedLayout(layout);
      
      // Show success message and open layout modal
      toast.success('Seating arrangement generated successfully!');
      setShowSeatingLayout(true);
      setShowSeatingModal(false);
    } catch (error) {
      toast.error('Failed to generate seating arrangement');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSeatingLayout = (formData: SeatingFormData): Room[] => {
    const { roomCount, benchesPerRoom, branches, candidateCount } = formData;
    const layout: Room[] = [];
    let remainingCandidates = candidateCount;
    let currentBranchIndex = 0;
    let rollNumberCounter: { [key: string]: number } = {};

    // Initialize roll number counters for each branch
    branches.forEach(branch => {
      rollNumberCounter[branch.name] = 1;
    });

    // Generate layout for each room
    for (let room = 0; room < roomCount && remainingCandidates > 0; room++) {
      const roomLayout: Room = {
        roomNumber: `Room ${room + 1}`,
        benches: []
      };

      // Generate benches for each room
      for (let bench = 0; bench < benchesPerRoom && remainingCandidates > 0; bench++) {
        const benchLayout: Bench = {
          benchNumber: bench + 1,
          students: []
        };

        // Add two students from different branches to each bench
        for (let seat = 0; seat < 2 && remainingCandidates > 0; seat++) {
          const branch = branches[currentBranchIndex].name;
          const rollNumber = `${branch.substring(0, 2).toUpperCase()}${String(rollNumberCounter[branch]).padStart(3, '0')}`;
          rollNumberCounter[branch]++;

          benchLayout.students.push({
            branch,
            seatNumber: `${room + 1}-${bench + 1}-${seat + 1}`,
            rollNumber
          });
          remainingCandidates--;
          currentBranchIndex = (currentBranchIndex + 1) % branches.length;
        }

        roomLayout.benches.push(benchLayout);
      }

      layout.push(roomLayout);
    }

    return layout;
  };

  const features = [
    {
      id: 'supervisor-notifications',
      title: 'Supervisor Notifications',
      description: 'View real-time alerts and notifications from exam supervisors.',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Notifications</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {notification.proctorName}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notification.urgency === 'urgent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {notification.urgency.charAt(0).toUpperCase() + notification.urgency.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.roomNumber}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'ufm-reports',
      title: 'UFM Reports',
      description: 'Review Unfair Means (UFM) reports submitted during exams.',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Exam Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {ufmReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.examName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.candidateName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {report.rollNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {report.facultyName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedUFM(report);
                          setShowUFMModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'seating-arrangement',
      title: 'Generate Seating Arrangement',
      description: 'Automatically generate and manage exam seating arrangements.',
      icon: LayoutGrid,
      action: () => setShowSeatingModal(true)
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            During Exam Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage ongoing examination activities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {feature.content}
                {feature.action && (
                  <button
                    onClick={feature.action}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    Generate New Arrangement
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* UFM Report Detail Modal */}
      <Modal
        isOpen={showUFMModal}
        onClose={() => {
          setShowUFMModal(false);
          setSelectedUFM(null);
        }}
        title="UFM Report Details"
      >
        {selectedUFM && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Exam Name
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedUFM.examName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Timestamp
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(selectedUFM.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Candidate Name
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedUFM.candidateName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Roll Number
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedUFM.rollNumber}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {selectedUFM.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Reported By
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {selectedUFM.facultyName}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => toast.success('Report downloaded successfully')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download Report
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Seating Arrangement Modal */}
      <Modal
        isOpen={showSeatingModal}
        onClose={() => setShowSeatingModal(false)}
        title="Generate Seating Arrangement"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={seatingForm.examDate}
                  onChange={(e) => setSeatingForm({ ...seatingForm, examDate: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Candidates
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={seatingForm.candidateCount}
                  onChange={(e) => setSeatingForm({ ...seatingForm, candidateCount: parseInt(e.target.value) })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Available Rooms
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={seatingForm.roomCount}
                  onChange={(e) => setSeatingForm({ ...seatingForm, roomCount: parseInt(e.target.value) })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Benches per Room
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={seatingForm.benchesPerRoom}
                  onChange={(e) => setSeatingForm({ ...seatingForm, benchesPerRoom: parseInt(e.target.value) })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Branches
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={seatingForm.branchCount}
                  onChange={(e) => handleBranchCountChange(parseInt(e.target.value))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>
            </div>
          </div>

          {seatingForm.branchCount > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Branch Details</h4>
              <div className="grid grid-cols-1 gap-4">
                {seatingForm.branches.map((branch, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Branch {index + 1} Name
                        </label>
                        <input
                          type="text"
                          value={branch.name}
                          onChange={(e) => handleBranchInfoChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder={`Enter branch name ${index + 1}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Number of Students
                        </label>
                        <input
                          type="number"
                          value={branch.studentCount}
                          onChange={(e) => handleBranchInfoChange(index, 'studentCount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          min="0"
                          placeholder="Enter number of students"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Total Students
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {seatingForm.candidateCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={handleGenerateSeating}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Seating Plan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Seating Layout Modal */}
      <Modal
        isOpen={showSeatingLayout}
        onClose={() => setShowSeatingLayout(false)}
        title="Seating Arrangement Layout"
      >
        <div className="space-y-6">
          <div className="grid gap-6">
            {generatedLayout?.map((room: Room, roomIndex: number) => (
              <div key={roomIndex} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {room.roomNumber}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {room.benches.map((bench: Bench, benchIndex: number) => (
                    <div key={benchIndex} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bench {bench.benchNumber}
                      </div>
                      <div className="flex gap-2">
                        {bench.students.map((student: Student, studentIndex: number) => (
                          <div
                            key={studentIndex}
                            className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {student.branch}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {student.rollNumber}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Seat {student.seatNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                toast.success('Seating layout downloaded successfully');
                setShowSeatingLayout(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Download Layout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DuringExam;