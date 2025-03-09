import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ClassroomList from '../components/ClassroomList';
import StudentResults from '../components/StudentResults';

interface Classroom {
  id: string;
  classroomNumber: string;
  year: number;
  semester: number;
  division: string;
}

interface Student {
  rollNumber: string;
  name: string;
  passFail: 'Pass' | 'Fail';
  sgpa: number;
  internalMarks: number;
  endSemMarks: number;
}

interface SubjectTopper {
  subject: string;
  rollNumber: string;
  name: string;
  sgpa: number;
}

const ViewResults: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Mock data - replace with actual API calls
  const classrooms: Classroom[] = [
    { id: '1', classroomNumber: '101', year: 2024, semester: 1, division: 'A' },
    { id: '2', classroomNumber: '102', year: 2024, semester: 1, division: 'B' },
    { id: '3', classroomNumber: '201', year: 2024, semester: 2, division: 'A' },
    { id: '4', classroomNumber: '202', year: 2024, semester: 2, division: 'B' },
  ];

  // Mock data for student results - replace with actual API calls
  const getStudentResults = (classroomId: string) => {
    return {
      students: [
        { rollNumber: '001', name: 'John Doe', passFail: 'Pass', sgpa: 8.5, internalMarks: 85, endSemMarks: 90 },
        { rollNumber: '002', name: 'Jane Smith', passFail: 'Pass', sgpa: 9.0, internalMarks: 90, endSemMarks: 95 },
        { rollNumber: '003', name: 'Bob Johnson', passFail: 'Fail', sgpa: 4.5, internalMarks: 45, endSemMarks: 40 },
      ] as Student[],
      averageSGPA: 7.33,
      subjectToppers: [
        { subject: 'Mathematics', rollNumber: '002', name: 'Jane Smith', sgpa: 9.0 },
        { subject: 'Physics', rollNumber: '001', name: 'John Doe', sgpa: 8.5 },
      ] as SubjectTopper[],
      overallTopper: {
        rollNumber: '002',
        name: 'Jane Smith',
        sgpa: 9.0,
      },
    };
  };

  const handleViewResult = (classroomId: string) => {
    setSelectedClassroom(classroomId);
    setShowResults(true);
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">View Results</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <ClassroomList 
              classrooms={classrooms} 
              onViewResult={handleViewResult} 
            />
          </div>
        </main>
      </div>

      {showResults && selectedClassroom && (
        <StudentResults
          {...getStudentResults(selectedClassroom)}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default ViewResults;