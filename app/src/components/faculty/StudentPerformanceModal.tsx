import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Edit2, Save, Search, Filter, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExamType {
  id: string;
  name: string;
  icon: React.ReactNode;
  percentage: number;
  color: string;
}

interface Student {
  id: string;
  name: string;
  batch: string;
  marks?: number;
  totalMarks?: number;
  grade?: string;
  previousGrade?: string;
  error?: string;
  attendance?: number;
  
  submissions?: number;
}

interface StudentPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  examType: ExamType;
  classroomNumber: string;
}

// Define calculateGrade function outside the component to avoid reference errors
const calculateGrade = (marks: number, totalMarks: number): string => {
  // Updated grade mapping logic based on total marks
  if (totalMarks === 20) { // Internal Assessment or Mid-Semester
    if (marks >= 17) return 'A';
    if (marks >= 13) return 'B';
    if (marks >= 10) return 'C';
    if (marks >= 7) return 'D';
    return 'F';
  } else if (totalMarks === 25) { // Practicals
    if (marks >= 21) return 'A';
    if (marks >= 16) return 'B';
    if (marks >= 13) return 'C';
    if (marks >= 8) return 'D';
    return 'F';
  } else if (totalMarks === 60) { // End-Semester
    if (marks >= 51) return 'A';
    if (marks >= 41) return 'B';
    if (marks >= 31) return 'C';
    if (marks >= 21) return 'D';
    return 'F';
  } else {
    // Default percentage-based grading for any other total marks
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
};

// Calculate attendance marks based on percentage
const calculateAttendanceMarks = (attendancePercentage: number): number => {
  if (attendancePercentage >= 75) return 5;
  if (attendancePercentage >= 50) return 4;
  if (attendancePercentage >= 25) return 3;
  return 0;
};

const StudentPerformanceModal: React.FC<StudentPerformanceModalProps> = ({
  isOpen,
  onClose,
  examType,
  classroomNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedMarks, setEditedMarks] = useState<{ [key: string]: number }>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeChanges, setGradeChanges] = useState<{ [key: string]: 'up' | 'down' | 'same' }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set marks limit based on exam type
  const getMarksLimit = (): number => {
    switch (examType.id) {
      case 'internal':
        return 20;
      case 'mid':
        return 20;
      case 'end':
        return 60;
      case 'practical':
        return 25;
      default:
        return 100;
    }
  };
  
  useEffect(() => {
    // Initialize mock student data with appropriate total marks
    const marksLimit = getMarksLimit();
    
    // For Term Work, use attendance and submissions instead of regular marks
    const mockStudents: Student[] = examType.id === 'end' ? [
      { id: 'S001', name: 'John Doe', batch: '2023', attendance: 85, submissions: 18 },
      { id: 'S002', name: 'Jane Smith', batch: '2023', attendance: 92, submissions: 19 },
      { id: 'S003', name: 'Robert Johnson', batch: '2023', attendance: 65, submissions: 15 },
      { id: 'S004', name: 'Emily Davis', batch: '2023', attendance: 78, submissions: 17 },
      { id: 'S005', name: 'Michael Brown', batch: '2023', attendance: 45, submissions: 12 },
      { id: 'S006', name: 'Sarah Wilson', batch: '2023', attendance: 88, submissions: 16 },
      { id: 'S007', name: 'David Miller', batch: '2023', attendance: 72, submissions: 14 },
      { id: 'S008', name: 'Jennifer Taylor', batch: '2023', attendance: 95, submissions: 20 },
    ] : [
      // Regular exam type students with marks and grades
      { id: 'S001', name: 'John Doe', batch: '2023', marks: Math.round(17 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(17 * marksLimit / 100), marksLimit) },
      { id: 'S002', name: 'Jane Smith', batch: '2023', marks: Math.round(19 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(19 * marksLimit / 100), marksLimit) },
      { id: 'S003', name: 'Robert Johnson', batch: '2023', marks: Math.round(15 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(15 * marksLimit / 100), marksLimit) },
      { id: 'S004', name: 'Emily Davis', batch: '2023', marks: Math.round(19 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(19 * marksLimit / 100), marksLimit) },
      { id: 'S005', name: 'Michael Brown', batch: '2023', marks: Math.round(13 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(13 * marksLimit / 100), marksLimit) },
      { id: 'S006', name: 'Sarah Wilson', batch: '2023', marks: Math.round(17 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(17 * marksLimit / 100), marksLimit) },
      { id: 'S007', name: 'David Miller', batch: '2023', marks: Math.round(11 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(11 * marksLimit / 100), marksLimit) },
      { id: 'S008', name: 'Jennifer Taylor', batch: '2023', marks: Math.round(18 * marksLimit / 100), totalMarks: marksLimit, grade: calculateGrade(Math.round(18 * marksLimit / 100), marksLimit) },
    ];
    
    setStudents(mockStudents);
  }, [examType.id]);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text('EdVantage University', 105, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text('Student Performance Report', 105, 25, { align: 'center' });
      
      // Details
      doc.setFontSize(11);
      doc.text(`Classroom: ${classroomNumber}`, 15, 40);
      doc.text(`Exam Type: ${examType.name}`, 15, 48);
      doc.text(`Weightage: ${examType.percentage}%`, 15, 56);
      doc.text(`Total Students: ${students.length}`, 15, 64);

      // Table
      autoTable(doc, {
        startY: 75,
        head: [['#', 'Student ID', 'Name', 'Batch', 'Marks', 'Total', 'Grade']],
        body: students.map((student, index) => [
          (index + 1).toString(),
          student.id,
          student.name,
          student.batch,
          (student.marks || 0).toString(),
          (student.totalMarks || 0).toString(),
          student.grade || '-',
        ]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { 
          fillColor: [37, 99, 235], 
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      // Statistics
      const finalY = (doc as any).previousAutoTable?.finalY || 150;
      const avgMarks = students.reduce((sum, s) => sum + (s.marks || 0), 0) / students.length;
      const passCount = students.filter(s => s.grade && s.grade !== 'F').length;
      
      doc.setFontSize(10);
      doc.text(`Average Marks: ${avgMarks.toFixed(1)}`, 15, finalY + 15);
      doc.text(`Pass Rate: ${((passCount / students.length) * 100).toFixed(1)}%`, 15, finalY + 23);

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 15, pageHeight - 10);
      doc.text('EduSync - Examination Management System', 195, pageHeight - 10, { align: 'right' });

      doc.save(`Performance_${classroomNumber}_${examType.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('Performance report downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };
  
  const toggleEditMode = (studentId: string) => {
    setEditMode(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
    
    if (!editMode[studentId]) {
      // Initialize edited marks with current marks
      const student = students.find(s => s.id === studentId);
      if (student) {
        setEditedMarks(prev => ({
          ...prev,
          [studentId]: student.marks || 0
        }));
      }
    }
  };
  
  const handleMarksChange = (studentId: string, value: number, field: 'submissions' | 'marks') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    if (examType.id === 'end') {
      // Handle Term Work submissions changes
      if (field === 'submissions') {
        if (value > 20) {
          toast.error('Submissions cannot exceed 20');
          return;
        }
        setEditedMarks(prev => ({
          ...prev,
          [studentId]: value
        }));
      }
      return;
    }
    
    // For other exam types
    const totalMarks = student.totalMarks || getMarksLimit();
    if (value > totalMarks) {
      toast.error(`Marks cannot exceed ${totalMarks} for ${examType.name}`);
      return;
    }
    
    setEditedMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
    
    // Calculate new grade based on edited marks
    const newGrade = calculateGrade(value, totalMarks);
    const currentGrade = student.grade || 'F';
    
    // Determine if grade changed
    if (newGrade !== currentGrade) {
      const change = getGradeValue(newGrade) > getGradeValue(currentGrade) ? 'up' : 'down';
      setGradeChanges(prev => ({
        ...prev,
        [studentId]: change
      }));
    } else {
      setGradeChanges(prev => ({
        ...prev,
        [studentId]: 'same'
      }));
    }
  };
  
  const getGradeValue = (grade: string): number => {
    switch (grade) {
      case 'A': return 4;
      case 'B': return 3;
      case 'C': return 2;
      case 'D': return 1;
      case 'F': return 0;
      default: return 0;
    }
  };
  
  const saveMarks = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    if (examType.id === 'end') {
      // Save Term Work submissions
      const newSubmissions = editedMarks[studentId];
      
      setStudents(students.map(s => 
        s.id === studentId 
          ? { ...s, submissions: newSubmissions }
          : s
      ));
      
      toggleEditMode(studentId);
      toast.success(`Submissions updated for ${student.name}`);
      return;
    }
    
    // For other exam types
    const newMarks = editedMarks[studentId];
    const newGrade = calculateGrade(newMarks, student.totalMarks || 0);
    const gradeChange = gradeChanges[studentId] || 'same';
    
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, marks: newMarks, grade: newGrade, previousGrade: s.grade } 
        : s
    ));
    
    toggleEditMode(studentId);
    
    if (gradeChange === 'up') {
      toast.success(`Marks updated for ${student.name}. Grade upgraded to ${newGrade}!`);
    } else if (gradeChange === 'down') {
      toast.error(`Marks updated for ${student.name}. Grade downgraded to ${newGrade}.`);
    } else {
      toast.success(`Marks updated for ${student.name}`);
    }
    
    // Clear grade change for this student
    setGradeChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[studentId];
      return newChanges;
    });
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // Find the indices of required columns
    const idIndex = headers.findIndex(h => h.toLowerCase().includes('roll') || h.toLowerCase().includes('id'));
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
    const marksIndex = headers.findIndex(h => h.toLowerCase().includes('marks'));
    
    if (idIndex === -1 || nameIndex === -1 || marksIndex === -1) {
      toast.error('CSV format is invalid. Required columns: Roll Number/ID, Name, Marks');
      setUploadStatus('idle');
      setUploadProgress(0);
      return;
    }
    
    const marksLimit = getMarksLimit();
    const newStudents: Student[] = [];
    const errors: {[key: string]: string} = {};
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = lines[i].split(',');
      const id = values[idIndex]?.trim();
      const name = values[nameIndex]?.trim();
      const marksStr = values[marksIndex]?.trim();
      
      if (!id || !name || !marksStr) continue;
      
      const marks = parseInt(marksStr);
      
      if (isNaN(marks)) {
        errors[id] = 'Invalid marks value';
        continue;
      }
      
      if (marks > marksLimit) {
        errors[id] = `Marks cannot exceed ${marksLimit}`;
      }
      
      const grade = calculateGrade(marks > marksLimit ? marksLimit : marks, marksLimit);
      
      newStudents.push({
        id,
        name,
        batch: '2023', // Default batch
        marks: marks > marksLimit ? marksLimit : marks,
        totalMarks: marksLimit,
        grade,
        error: errors[id]
      });
      
      // Update progress
      setUploadProgress(Math.min(90, Math.round((i / lines.length) * 100)));
    }
    
    // Update students list
    setStudents(newStudents);
    setUploadStatus('completed');
    setUploadProgress(100);
    
    // Show success message
    toast.success(`Successfully processed ${newStudents.length} student records`);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(10);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setUploadProgress(50);
      setUploadStatus('processing');
      
      const csvText = event.target?.result as string;
      processCSV(csvText);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsUploading(false);
      setUploadStatus('idle');
      setUploadProgress(0);
    };
    
    reader.readAsText(file);
  };
  
  const handleViewTemplate = async () => {
    // TODO: Phase 5 - Replace hardcoded signed URL with dynamic generation
    // Use Supabase Storage API to generate signed URLs on-demand:
    // const { data } = await supabase.storage
    //   .from('csv file')
    //   .createSignedUrl('Template.csv', 3600);
    // const csvUrl = data?.signedUrl;
    
    // Temporary: Using hardcoded URL (will expire - needs production fix)
    const csvUrl = 'https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/csv%20file/Template.csv?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjc3YgZmlsZS9UZW1wbGF0ZS5jc3YiLCJpYXQiOjE3NDE0NTY2MjEsImV4cCI6MTc3Mjk5MjYyMX0.ha6rua4la25VYWO4FYSDueF1g9LLpNQJpNcl996A4hg';
    window.open(csvUrl, '_blank');
  };
  
  // Filter students based on search term and grade filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
    
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className={`p-1 rounded-full ${examType.color}`}>
              {examType.icon}
            </span>
            {examType.name} - {classroomNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto flex-1">
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {examType.id === 'end' ? (
                <>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average Attendance</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? (students.reduce((sum, student) => sum + (student.attendance || 0), 0) / students.length).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average Submissions</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? (students.reduce((sum, student) => sum + (student.submissions || 0), 0) / students.length).toFixed(1) : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{students.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average Total</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? (students.reduce((sum, student) => {
                        const attendance = student.attendance || 0;
                        const submissions = student.submissions || 0;
                        return sum + submissions + calculateAttendanceMarks(attendance);
                      }, 0) / students.length).toFixed(1) : 0}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average Score</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? (students.reduce((sum, student) => sum + (student.marks || 0), 0) / students.length).toFixed(1) : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Highest Score</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? Math.max(...students.map(student => student.marks || 0)) : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Score</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {students.length > 0 ? Math.min(...students.map(student => student.marks || 0)) : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{students.length}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* CSV Upload Section */}
          <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Bulk Upload Marks</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-70"
                >
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </button>
                <button
                  onClick={handleViewTemplate}
                  className="flex items-center gap-2 px-4 py-2 mt-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  View Template
                </button>
              </div>
            </div>
            
            {uploadStatus !== 'idle' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploadStatus === 'uploading' ? 'Uploading...' : 
                     uploadStatus === 'processing' ? 'Processing...' : 
                     'Completed'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      uploadStatus === 'completed' ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'
                    }`}
                    style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease-in-out' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {uploadStatus === 'uploading' ? 'Reading file...' : 
                   uploadStatus === 'processing' ? 'Parsing student data...' : 
                   'Upload complete!'}
                </p>
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>CSV should include columns for: Roll Number, Name, and Marks</p>
              <p>Maximum marks for {examType.name}: {getMarksLimit()}</p>
            </div>
          </div>
          
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
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
                    Batch
                  </th>
                  {examType.id === 'end' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Attendance (%)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submissions (/20)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total (/25)
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Grade
                      </th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${student.error ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {student.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {student.batch}
                      </td>
                      {examType.id === 'end' ? (
                        <>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 dark:text-gray-100">
                                {student.attendance !== undefined ? `${student.attendance}%` : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {editMode[student.id] ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={editedMarks[student.id] ?? student.submissions}
                                  onChange={(e) => handleMarksChange(student.id, parseInt(e.target.value) || 0, 'submissions')}
                                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              ) : (
                                <span className="text-gray-900 dark:text-gray-100">
                                  {student.submissions !== undefined ? `${student.submissions} / 20` : 'N/A'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {student.attendance !== undefined && student.submissions !== undefined 
                              ? `${student.submissions + calculateAttendanceMarks(student.attendance)} / 25`
                              : 'N/A'
                            }
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {editMode[student.id] ? (
                                <input
                                  type="number"
                                  min="0"
                                  max={student.totalMarks}
                                  value={editedMarks[student.id]}
                                  onChange={(e) => handleMarksChange(student.id, parseInt(e.target.value) || 0, 'marks')}
                                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              ) : (
                                <span className="text-gray-900 dark:text-gray-100">
                                  {student.marks !== undefined ? `${student.marks} / ${student.totalMarks}` : 'N/A'}
                                </span>
                              )}
                            </div>
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
                        </>
                      )}
                      <td className="px-4 py-3 text-sm">
                        {editMode[student.id] ? (
                          <button
                            onClick={() => saveMarks(student.id)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleEditMode(student.id)}
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
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
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceModal;