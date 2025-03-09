import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Lock, CheckCircle, BarChart3, BookOpen, Award, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import NotificationPanel from '../components/NotificationPanel';
import MarksBreakdownModal from '../components/MarksBreakdownModal';
import UserProfileModal from '../components/UserProfileModal';
import ClassPerformanceModal from '../components/ClassPerformanceModal';
import StudentPerformanceModal from '../components/StudentPerformanceModal';
import { useNotifications } from '../context/NotificationContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExtendedJsPDF extends jsPDF {
  previousAutoTable: {
    finalY: number;
  };
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

interface ClassroomPerformance {
  internalAssessment: number;
  midSemester: number;
  endSemester: number;
  practicals: number;
  averageAttendance: number;
  topperName: string;
  topperMarks: number;
}

interface ExamType {
  id: string;
  name: string;
  icon: React.ReactNode;
  percentage: number;
  color: string;
}

interface Faculty {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

const MarksCalculation: React.FC = () => {
  const navigate = useNavigate();
  const [classroomNumber, setClassroomNumber] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClassPerformanceModalOpen, setIsClassPerformanceModalOpen] = useState(false);
  const [isStudentPerformanceModalOpen, setIsStudentPerformanceModalOpen] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showClassroomSummary, setShowClassroomSummary] = useState(false);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    acceptRequest, 
    ignoreRequest 
  } = useNotifications();
  
  // Mock classroom performance data
  const classroomPerformance: ClassroomPerformance = {
    internalAssessment: 78,
    midSemester: 72,
    endSemester: 68,
    practicals: 85,
    averageAttendance: 82,
    topperName: "Emily Johnson",
    topperMarks: 92
  };
  
  // Mock faculty list
  const faculties: Faculty[] = [
    { id: "1", name: "Dr. Jane Smith" },
    { id: "2", name: "Prof. Robert Johnson" },
    { id: "3", name: "Dr. Emily Davis" },
    { id: "4", name: "Prof. Michael Brown" }
  ];
  
  // Mock subject list
  const subjects: Subject[] = [
    { id: "1", name: "Data Structures" },
    { id: "2", name: "Algorithms" },
    { id: "3", name: "Database Systems" },
    { id: "4", name: "Computer Networks" },
    { id: "5", name: "Operating Systems" }
  ];
  
  // Exam types
  const examTypes: ExamType[] = [
    { 
      id: 'internal', 
      name: 'Internal Assessment', 
      icon: <BookOpen className="h-5 w-5" />, 
      percentage: classroomPerformance.internalAssessment,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    { 
      id: 'mid', 
      name: 'Mid-Semester Exams', 
      icon: <BarChart3 className="h-5 w-5" />, 
      percentage: classroomPerformance.midSemester,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    { 
      id: 'end', 
      name: 'Term Work', 
      icon: <BookOpen className="h-5 w-5" />, 
      percentage: classroomPerformance.endSemester,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    { 
      id: 'practical', 
      name: 'Practicals', 
      icon: <BookOpen className="h-5 w-5" />, 
      percentage: classroomPerformance.practicals,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
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
        institution: 'University of Technology',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('eduSyncUser');
    navigate('/');
  };

  const handleAuthenticate = () => {
    setIsAuthenticating(true);
    
    // Simulate API call
    setTimeout(() => {
      if (facultyCode === '101') {
        setIsAuthenticated(true);
        toast.success('Authentication successful');
      } else {
        toast.error('Invalid Faculty Code');
      }
      setIsAuthenticating(false);
    }, 1000);
  };
  
  const handleViewDetails = () => {
    if (!classroomNumber) {
      toast.error('Please enter a classroom number');
      return;
    }
    
    if (!selectedFaculty) {
      toast.error('Please select a faculty');
      return;
    }
    
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }
    
    setShowClassroomSummary(true);
  };
  
  const handleExamTypeClick = (examTypeId: string) => {
    setSelectedExamType(examTypeId);
    setIsStudentPerformanceModalOpen(true);
  };

  const handleDownloadReport = () => {
    try {
      // Initialize PDF document (A4 size)
      const doc = new jsPDF() as ExtendedJsPDF;
      let yPos = 85;
      
      // Add header with institution logo
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 139); // Dark blue
      doc.text('University of Technology', 105, 20, { align: 'center' });
      
      // Add report title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Classroom Performance Report', 105, 35, { align: 'center' });
      
      // Add classroom info
      doc.setFontSize(12);
      doc.text([
        `Classroom: ${classroomNumber}`,
        `Faculty: ${faculties.find(f => f.id === selectedFaculty)?.name || ''}`,
        `Subject: ${subjects.find(s => s.id === selectedSubject)?.name || ''}`,
        `Date: ${new Date().toLocaleDateString()}`
      ], 20, 50);

      // Add performance summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 139);
      doc.text('Performance Summary', 20, 80);
      
      // Performance metrics table
      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Average Attendance', `${classroomPerformance.averageAttendance}%`],
          ['Average Score', `${((classroomPerformance.internalAssessment + 
            classroomPerformance.midSemester + 
            classroomPerformance.endSemester + 
            classroomPerformance.practicals) / 4).toFixed(1)}%`],
          ['Top Performer', classroomPerformance.topperName],
          ['Highest Marks', `${classroomPerformance.topperMarks}%`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 139] }
      });
      yPos = doc.previousAutoTable.finalY + 20;

      // Add subject performance section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 139);
      doc.text('Subject Performance', 20, yPos);

      // Subject performance table
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Subject', 'Score']],
        body: [
          ['Data Structures', '76%'],
          ['Algorithms', '72%'],
          ['Database Systems', '68%'],
          ['Computer Networks', '74%'],
          ['Operating Systems', '70%']
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 139] }
      });

      // Add footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(128);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `Generated on ${new Date().toLocaleString()}`,
          20,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      doc.save(`${classroomNumber}-performance-report.pdf`);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Marks Calculation</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationPanel 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onAcceptRequest={acceptRequest}
              onIgnoreRequest={ignoreRequest}
            />
            <ThemeToggle />
            {userInfo && (
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                {userInfo.photoUrl ? (
                  <img 
                    src={userInfo.photoUrl} 
                    alt={userInfo.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {userInfo.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userInfo.name}
                </span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Marks Calculation</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter classroom details and calculate grades, CGPA, and SGPA
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Classroom Number
                    </label>
                    <input
                      type="text"
                      id="classroom"
                      value={classroomNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClassroomNumber(e.target.value)}
                      placeholder="e.g., CS-101"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Faculty Name
                    </label>
                    <select
                      id="faculty"
                      value={selectedFaculty}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFaculty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Faculty Subject
                    </label>
                    <select
                      id="subject"
                      value={selectedSubject}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Faculty Authentication Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Faculty Authentication</h3>
                  </div>
                  
                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="facultyCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Faculty Code
                        </label>
                        <input
                          type="password"
                          id="facultyCode"
                          value={facultyCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFacultyCode(e.target.value)}
                          placeholder="Enter your faculty code"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={handleAuthenticate}
                        disabled={isAuthenticating || !facultyCode}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAuthenticating ? (
                          <span className="loader"></span>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            Authenticate
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Authentication Successful</span>
                    </div>
                  )}
                </div>
                
                {isAuthenticated && (
                  <>
                    {!showClassroomSummary ? (
                      <div className="flex justify-center">
                        <button
                          onClick={handleViewDetails}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          View Classroom Details
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Performance Summary */}
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Performance Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Average Attendance</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">{classroomPerformance.averageAttendance}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Average Score</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {((classroomPerformance.internalAssessment + 
                                   classroomPerformance.midSemester + 
                                   classroomPerformance.endSemester + 
                                   classroomPerformance.practicals) / 4).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Topper</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">{classroomPerformance.topperName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Highest Marks</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">{classroomPerformance.topperMarks}%</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Detailed Analysis */}
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Detailed Analysis</h3>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleDownloadReport}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Download Report
                              </button>
                              <button
                                onClick={() => setIsClassPerformanceModalOpen(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                              >
                                <BarChart3 className="h-4 w-4" />
                                View Full Report
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Grade Distribution */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Grade Distribution</h3>
                              </div>
                              
                              <div className="space-y-3">
                                {[
                                  { grade: 'A', count: 12, percentage: 28 },
                                  { grade: 'B', count: 18, percentage: 42 },
                                  { grade: 'C', count: 8, percentage: 19 },
                                  { grade: 'D', count: 3, percentage: 7 },
                                  { grade: 'F', count: 2, percentage: 4 },
                                ].map((item) => (
                                  <div key={item.grade}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Grade {item.grade} ({item.count} students)
                                      </span>
                                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          item.grade === 'A' ? 'bg-green-600 dark:bg-green-500' :
                                          item.grade === 'B' ? 'bg-blue-600 dark:bg-blue-500' :
                                          item.grade === 'C' ? 'bg-yellow-600 dark:bg-yellow-500' :
                                          item.grade === 'D' ? 'bg-orange-600 dark:bg-orange-500' :
                                          'bg-red-600 dark:bg-red-500'
                                        }`}
                                        style={{ width: `${item.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Subject Performance */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Subject-wise Toppers</h3>
                              </div>
                              
                              <div className="space-y-3">
                                {[
                                  { subject: 'Data Structures', topper: 'John Smith', score: 95 },
                                  { subject: 'Algorithms', topper: 'Emma Davis', score: 92 },
                                  { subject: 'Database Systems', topper: 'Michael Chen', score: 94 },
                                  { subject: 'Computer Networks', topper: 'Sarah Wilson', score: 96 },
                                  { subject: 'Operating Systems', topper: 'David Lee', score: 93 }
                                ].map((item) => (
                                  <div key={item.subject} className="flex justify-between items-center">
                                    <div>
                                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.subject}</span>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.topper}</p>
                                    </div>
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.score}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Exam Type Cards */}
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Exam Type Performance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {examTypes.map((examType) => (
                            <div 
                              key={examType.id}
                              onClick={() => handleExamTypeClick(examType.id)}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-full ${examType.color}`}>
                                  {examType.icon}
                                </div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">{examType.name}</h5>
                              </div>
                              <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{examType.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${examType.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MarksBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={[]}
        classroomNumber={classroomNumber}
      />
      
      <ClassPerformanceModal
        isOpen={isClassPerformanceModalOpen}
        onClose={() => setIsClassPerformanceModalOpen(false)}
        classroomNumber={classroomNumber}
        performance={classroomPerformance}
      />
      
      <StudentPerformanceModal
        isOpen={isStudentPerformanceModalOpen}
        onClose={() => setIsStudentPerformanceModalOpen(false)}
        examType={examTypes.find(et => et.id === selectedExamType) || examTypes[0]}
        classroomNumber={classroomNumber}
      />
      
      {userInfo && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userInfo={userInfo}
        />
      )}
    </div>
  );
};

export default MarksCalculation;