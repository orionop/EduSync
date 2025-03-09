import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Download, Eye, Save, Filter, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import PreviewModal from '../components/PreviewModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import UserProfileModal from '../components/UserProfileModal';

interface Student {
  id: string;
  name: string;
  marks: number;
  totalMarks: number;
  grade: string;
}

interface ClassroomSubmission {
  id: string;
  classroom: string;
  subject: string;
  date: string;
  students: Student[];
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

const MarksSubmissionView: React.FC = () => {
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editedStudents, setEditedStudents] = useState<{ [key: string]: number }>({});
  const [submission, setSubmission] = useState<ClassroomSubmission | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Mock data - in a real app, this would come from an API
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
    
    // Simulate API call to get submission data
    const mockSubmission: ClassroomSubmission = {
      id: classroomId || '1',
      classroom: classroomId || 'CS-101',
      subject: 'Introduction to Programming',
      date: '2025-04-15',
      students: [
        { id: 'S001', name: 'John Doe', marks: 85, totalMarks: 100, grade: 'B' },
        { id: 'S002', name: 'Jane Smith', marks: 92, totalMarks: 100, grade: 'A' },
        { id: 'S003', name: 'Robert Johnson', marks: 78, totalMarks: 100, grade: 'C' },
        { id: 'S004', name: 'Emily Davis', marks: 95, totalMarks: 100, grade: 'A' },
        { id: 'S005', name: 'Michael Brown', marks: 65, totalMarks: 100, grade: 'D' },
        { id: 'S006', name: 'Sarah Wilson', marks: 88, totalMarks: 100, grade: 'B' },
        { id: 'S007', name: 'David Miller', marks: 55, totalMarks: 100, grade: 'F' },
        { id: 'S008', name: 'Jennifer Taylor', marks: 91, totalMarks: 100, grade: 'A' },
      ]
    };
    
    setSubmission(mockSubmission);
  }, [classroomId]);

  const handleLogout = () => {
    localStorage.removeItem('eduSyncUser');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/view-results');
  };

  const calculateGrade = (marks: number, totalMarks: number): string => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleMarksChange = (studentId: string, marks: number) => {
    if (!submission) return;
    
    // Validate marks
    const student = submission.students.find(s => s.id === studentId);
    if (!student) return;
    
    if (marks > student.totalMarks) {
      toast.error(`Marks cannot exceed total marks (${student.totalMarks})`);
      return;
    }
    
    // Update edited students
    setEditedStudents(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  const handleSaveChanges = () => {
    if (Object.keys(editedStudents).length === 0) {
      toast.error('No changes to save');
      return;
    }
    
    setIsConfirmDialogOpen(true);
  };

  const confirmSaveChanges = () => {
    if (!submission) return;
    
    // Update students with edited marks
    const updatedStudents = submission.students.map(student => {
      if (editedStudents[student.id] !== undefined) {
        const newMarks = editedStudents[student.id];
        const newGrade = calculateGrade(newMarks, student.totalMarks);
        return { ...student, marks: newMarks, grade: newGrade };
      }
      return student;
    });
    
    // Update submission
    setSubmission({
      ...submission,
      students: updatedStudents
    });
    
    // Clear edited students
    setEditedStudents({});
    setIsConfirmDialogOpen(false);
    toast.success('Marks updated successfully');
  };

  const handlePreviewMarks = (student: Student) => {
    setSelectedStudent(student);
    setIsPreviewModalOpen(true);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast.success('PDF download started');
  };

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  // Filter students based on search term and grade filter
  const filteredStudents = submission?.students.filter(student => {
    const matchesSearch = 
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
    
    return matchesSearch && matchesGrade;
  }) || [];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Marks Submission
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {userInfo && (
              <button 
                onClick={handleOpenProfile}
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
        
        <main className="flex-1 overflow-y-auto p-6">
          {submission ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Classroom Code</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{submission.classroom}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Subject</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{submission.subject}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{submission.date}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{submission.students.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="font-medium text-gray-900 dark:text-white">Student Marks</h2>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by ID or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div className="relative">
                      <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm appearance-none"
                      >
                        <option value="">All Grades</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                        <option value="D">Grade D</option>
                        <option value="F">Grade F</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Marks
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {student.id}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {student.name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="number"
                                min="0"
                                max={student.totalMarks}
                                value={editedStudents[student.id] !== undefined ? editedStudents[student.id] : student.marks}
                                onChange={(e) => handleMarksChange(student.id, parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {student.totalMarks}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                student.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                student.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                student.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {student.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => handlePreviewMarks(student)}
                                className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Preview Answer Sheet"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredStudents.length} of {submission.students.length} students
                  </p>
                  
                  <div className="flex gap-3">
                    {Object.keys(editedStudents).length > 0 && (
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    )}
                    
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="loader"></span>
            </div>
          )}
        </main>
      </div>
      
      {selectedStudent && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          student={selectedStudent}
        />
      )}
      
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmSaveChanges}
        title="Save Changes"
        message="Are you sure you want to save these changes? This action cannot be undone."
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

export default MarksSubmissionView;