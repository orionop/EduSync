/**
 * PDF Generator Utility for EduSync
 * Uses jsPDF to dynamically generate PDFs for various documents
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type for autoTable
interface ExtendedJsPDF extends jsPDF {
  previousAutoTable?: {
    finalY: number;
  };
}

// Common styling
const COLORS = {
  primary: [37, 99, 235] as [number, number, number], // Blue-600
  secondary: [107, 114, 128] as [number, number, number], // Gray-500
  dark: [31, 41, 55] as [number, number, number], // Gray-800
  light: [249, 250, 251] as [number, number, number], // Gray-50
  success: [34, 197, 94] as [number, number, number], // Green-500
  warning: [234, 179, 8] as [number, number, number], // Yellow-500
  danger: [239, 68, 68] as [number, number, number], // Red-500
};

const FONT = {
  title: 20,
  subtitle: 14,
  body: 11,
  small: 9,
};

// Institution Details (can be configured)
const INSTITUTION = {
  name: 'EdVantage University',
  address: 'Academic Complex, Education City',
  city: 'Mumbai, Maharashtra - 400001',
  phone: '+91 22 1234 5678',
  email: 'exams@edvantage.edu.in',
  website: 'www.edvantage.edu.in',
};

/**
 * Add common header to PDF
 */
const addHeader = (doc: jsPDF, title: string): number => {
  // Institution name
  doc.setFontSize(FONT.title);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(INSTITUTION.name, 105, 20, { align: 'center' });

  // Address
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.setFont('helvetica', 'normal');
  doc.text(INSTITUTION.address, 105, 28, { align: 'center' });
  doc.text(INSTITUTION.city, 105, 33, { align: 'center' });

  // Horizontal line
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(15, 38, 195, 38);

  // Document title
  doc.setFontSize(FONT.subtitle);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 105, 48, { align: 'center' });

  return 55; // Return Y position for content
};

/**
 * Add footer to PDF
 */
const addFooter = (doc: jsPDF): void => {
  const pageHeight = doc.internal.pageSize.height;
  
  // Line above footer
  doc.setDrawColor(...COLORS.secondary);
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 20, 195, pageHeight - 20);

  // Footer text
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`,
    15,
    pageHeight - 12
  );
  doc.text('EduSync - Examination Management System', 195, pageHeight - 12, { align: 'right' });
};

// ==================== STUDENT PDFs ====================

export interface StudentInfo {
  name: string;
  studentId: string;
  email: string;
  course: string;
  semester: string;
  department?: string;
  photoUrl?: string;
}

export interface ExamScheduleItem {
  subjectCode: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'Theory' | 'Practical' | 'KT';
}

/**
 * Generate Hall Ticket PDF
 */
export const generateHallTicket = (
  student: StudentInfo,
  examSchedule: ExamScheduleItem[],
  examSession: string = 'End Semester Examination - Spring 2025'
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'HALL TICKET / ADMIT CARD');

  // Exam Session
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(examSession, 105, yPos, { align: 'center' });
  yPos += 12;

  // Student Details Box
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 40, 3, 3, 'F');

  // Student Info (left side)
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'normal');

  const infoStartY = yPos + 8;
  doc.text(`Name: ${student.name}`, 20, infoStartY);
  doc.text(`Student ID: ${student.studentId}`, 20, infoStartY + 8);
  doc.text(`Course: ${student.course}`, 20, infoStartY + 16);
  doc.text(`Semester: ${student.semester}`, 20, infoStartY + 24);

  // Photo placeholder (right side)
  doc.setDrawColor(...COLORS.secondary);
  doc.setLineWidth(0.5);
  doc.rect(155, yPos + 5, 30, 35);
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.text('Photo', 170, yPos + 25, { align: 'center' });

  yPos += 50;

  // Exam Schedule Table
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Examination Schedule', 15, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Subject', 'Time', 'Venue', 'Type']],
    body: examSchedule.map((exam) => [
      new Date(exam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      `${exam.subjectCode} - ${exam.subjectName}`,
      `${exam.startTime} - ${exam.endTime}`,
      exam.venue,
      exam.type,
    ]),
    styles: { fontSize: FONT.small, cellPadding: 3 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 50;
  yPos += 15;

  // Instructions
  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Instructions:', 15, yPos);
  yPos += 7;

  const instructions = [
    '1. This hall ticket must be presented at the examination hall.',
    '2. Carry a valid photo ID card along with this hall ticket.',
    '3. Electronic devices are strictly prohibited in the examination hall.',
    '4. Report at least 30 minutes before the scheduled examination time.',
    '5. Any malpractice will result in cancellation of the examination.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT.small);
  instructions.forEach((instruction) => {
    doc.text(instruction, 15, yPos);
    yPos += 5;
  });

  // Signature section
  yPos += 15;
  doc.setFontSize(FONT.small);
  doc.text('_______________________', 30, yPos);
  doc.text('_______________________', 140, yPos);
  yPos += 5;
  doc.text('Student Signature', 30, yPos);
  doc.text('Controller of Examinations', 140, yPos);

  addFooter(doc);
  doc.save(`HallTicket_${student.studentId}.pdf`);
};

/**
 * Generate Exam Application Form PDF
 */
export const generateExamApplication = (
  student: StudentInfo,
  selectedSubjects: { code: string; name: string; isKT: boolean }[],
  applicationId: string,
  examSession: string = 'End Semester Examination - Spring 2025'
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'EXAMINATION APPLICATION FORM');

  // Application ID
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(`Application ID: ${applicationId}`, 15, yPos);
  yPos += 10;

  // Exam Session
  doc.setTextColor(...COLORS.dark);
  doc.text(`Examination: ${examSession}`, 15, yPos);
  yPos += 10;

  // Student Details
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 35, 3, 3, 'F');

  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'normal');
  const detailsY = yPos + 8;
  doc.text(`Name: ${student.name}`, 20, detailsY);
  doc.text(`Student ID: ${student.studentId}`, 110, detailsY);
  doc.text(`Course: ${student.course}`, 20, detailsY + 10);
  doc.text(`Semester: ${student.semester}`, 110, detailsY + 10);
  doc.text(`Email: ${student.email}`, 20, detailsY + 20);

  yPos += 45;

  // Subjects Table
  doc.setFont('helvetica', 'bold');
  doc.text('Subjects Applied For:', 15, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Subject Code', 'Subject Name', 'Type']],
    body: selectedSubjects.map((subject, index) => [
      (index + 1).toString(),
      subject.code,
      subject.name,
      subject.isKT ? 'KT/ATKT' : 'Regular',
    ]),
    styles: { fontSize: FONT.small, cellPadding: 3 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 50;
  yPos += 15;

  // Fee Summary
  const regularCount = selectedSubjects.filter(s => !s.isKT).length;
  const ktCount = selectedSubjects.filter(s => s.isKT).length;
  const regularFee = regularCount * 500;
  const ktFee = ktCount * 750;
  const totalFee = regularFee + ktFee;

  doc.setFont('helvetica', 'bold');
  doc.text('Fee Summary:', 15, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT.small);
  doc.text(`Regular Subjects (${regularCount} x ₹500):`, 20, yPos);
  doc.text(`₹${regularFee}`, 180, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`KT Subjects (${ktCount} x ₹750):`, 20, yPos);
  doc.text(`₹${ktFee}`, 180, yPos, { align: 'right' });
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 20, yPos);
  doc.text(`₹${totalFee}`, 180, yPos, { align: 'right' });

  yPos += 15;

  // Declaration
  doc.setFontSize(FONT.small);
  doc.setFont('helvetica', 'bold');
  doc.text('Declaration:', 15, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('I hereby declare that all the information provided above is true and correct.', 15, yPos);
  yPos += 5;
  doc.text('I agree to abide by all examination rules and regulations.', 15, yPos);

  // Signature
  yPos += 20;
  doc.text('_______________________', 130, yPos);
  yPos += 5;
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, yPos);
  doc.text('Student Signature', 130, yPos);

  addFooter(doc);
  doc.save(`ExamApplication_${applicationId}.pdf`);
};

export interface PaymentInfo {
  receiptId: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  description: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

/**
 * Generate Payment Receipt PDF
 */
export const generatePaymentReceipt = (
  student: StudentInfo,
  payment: PaymentInfo
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'PAYMENT RECEIPT');

  // Receipt details
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt No: ${payment.receiptId}`, 15, yPos);
  doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString('en-IN')}`, 195, yPos, { align: 'right' });
  yPos += 15;

  // Status badge
  const statusColor = payment.status === 'Paid' ? COLORS.success : payment.status === 'Pending' ? COLORS.warning : COLORS.danger;
  doc.setFillColor(...statusColor);
  doc.roundedRect(15, yPos - 4, 35, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONT.small);
  doc.text(payment.status.toUpperCase(), 32.5, yPos + 1, { align: 'center' });
  yPos += 15;

  // Student Details
  doc.setTextColor(...COLORS.dark);
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 30, 3, 3, 'F');

  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'bold');
  doc.text('Received From:', 20, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name, 60, yPos + 8);
  doc.setFont('helvetica', 'bold');
  doc.text('Student ID:', 20, yPos + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(student.studentId, 60, yPos + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('Course:', 20, yPos + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.course} - Semester ${student.semester}`, 60, yPos + 24);

  yPos += 40;

  // Payment Details Table
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Amount']],
    body: [
      [payment.description, `₹${payment.amount.toLocaleString('en-IN')}`],
      ['Processing Fee', '₹0'],
      [{ content: 'Total', styles: { fontStyle: 'bold' } }, { content: `₹${payment.amount.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }],
    ],
    styles: { fontSize: FONT.body, cellPadding: 5 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 40;
  yPos += 15;

  // Transaction Details
  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Details:', 15, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT.small);
  doc.text(`Transaction ID: ${payment.transactionId}`, 20, yPos);
  yPos += 6;
  doc.text(`Payment Method: ${payment.paymentMethod}`, 20, yPos);
  yPos += 6;
  doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleString('en-IN')}`, 20, yPos);

  // Note
  yPos += 20;
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos - 4, 180, 20, 3, 3, 'F');
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.text('This is a computer-generated receipt and does not require a signature.', 105, yPos + 4, { align: 'center' });
  doc.text('For any queries, contact the accounts department.', 105, yPos + 10, { align: 'center' });

  addFooter(doc);
  doc.save(`Receipt_${payment.receiptId}.pdf`);
};

export interface SubjectResult {
  code: string;
  name: string;
  grade: string;
  gradePoints: number;
  credits?: number;
}

export interface SemesterResultData {
  semester: number;
  subjects: SubjectResult[];
  sgpa: number;
  cgpa: number;
  status: 'Pass' | 'Fail';
  year: string;
}

/**
 * Generate Marksheet/Scorecard PDF
 */
export const generateMarksheet = (
  student: StudentInfo,
  result: SemesterResultData
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'GRADE CARD / MARKSHEET');

  // Exam Session
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.text(`Academic Year: ${result.year}`, 105, yPos, { align: 'center' });
  doc.text(`Semester ${result.semester} Examination`, 105, yPos + 7, { align: 'center' });
  yPos += 20;

  // Student Details
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 30, 3, 3, 'F');

  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'normal');
  const detailsY = yPos + 8;
  doc.text(`Name: ${student.name}`, 20, detailsY);
  doc.text(`Student ID: ${student.studentId}`, 120, detailsY);
  doc.text(`Course: ${student.course}`, 20, detailsY + 10);
  doc.text(`Semester: ${student.semester}`, 120, detailsY + 10);

  // Status badge
  const statusColor = result.status === 'Pass' ? COLORS.success : COLORS.danger;
  doc.setFillColor(...statusColor);
  doc.roundedRect(20, yPos + 20, 25, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONT.small);
  doc.text(result.status.toUpperCase(), 32.5, yPos + 25, { align: 'center' });

  yPos += 40;

  // Results Table
  autoTable(doc, {
    startY: yPos,
    head: [['Subject Code', 'Subject Name', 'Grade', 'Grade Points']],
    body: result.subjects.map((subject) => [
      subject.code,
      subject.name,
      subject.grade,
      subject.gradePoints.toString(),
    ]),
    styles: { fontSize: FONT.small, cellPadding: 4 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 80 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 35, halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 60;
  yPos += 15;

  // SGPA and CGPA
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 85, 25, 3, 3, 'F');
  doc.roundedRect(110, yPos, 85, 25, 3, 3, 'F');

  doc.setFontSize(FONT.subtitle);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text('SGPA', 57.5, yPos + 10, { align: 'center' });
  doc.text('CGPA', 152.5, yPos + 10, { align: 'center' });

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(FONT.title);
  doc.text(result.sgpa.toFixed(2), 57.5, yPos + 20, { align: 'center' });
  doc.text(result.cgpa.toFixed(2), 152.5, yPos + 20, { align: 'center' });

  yPos += 35;

  // Grade Scale
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.setFont('helvetica', 'normal');
  doc.text('Grade Scale: O (10) | A+ (9) | A (8) | B+ (7) | B (6) | C (5) | D (4) | F (0)', 105, yPos, { align: 'center' });

  // Signature
  yPos += 20;
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.dark);
  doc.text('_______________________', 140, yPos);
  yPos += 5;
  doc.text('Controller of Examinations', 140, yPos);

  addFooter(doc);
  doc.save(`Marksheet_${student.studentId}_Sem${result.semester}.pdf`);
};

/**
 * Generate Exam Timetable PDF
 */
export const generateExamTimetable = (
  student: StudentInfo,
  examSchedule: ExamScheduleItem[],
  examSession: string = 'End Semester Examination - Spring 2025'
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'EXAMINATION TIMETABLE');

  // Exam Session
  doc.setFontSize(FONT.subtitle);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(examSession, 105, yPos, { align: 'center' });
  yPos += 10;

  // Student Details
  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'normal');
  doc.text(`Student: ${student.name} (${student.studentId})`, 15, yPos);
  doc.text(`Course: ${student.course} - Semester ${student.semester}`, 15, yPos + 7);
  yPos += 20;

  // Timetable Table
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Day', 'Subject Code', 'Subject Name', 'Time', 'Venue', 'Type']],
    body: examSchedule.map((exam) => {
      const examDate = new Date(exam.date);
      return [
        examDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        examDate.toLocaleDateString('en-IN', { weekday: 'short' }),
        exam.subjectCode,
        exam.subjectName,
        `${exam.startTime} - ${exam.endTime}`,
        exam.venue,
        exam.type,
      ];
    }),
    styles: { fontSize: FONT.small, cellPadding: 3 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 20 },
      3: { cellWidth: 50 },
      4: { cellWidth: 35 },
      5: { cellWidth: 30 },
      6: { cellWidth: 18 },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 60;
  yPos += 15;

  // Instructions
  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'bold');
  doc.text('General Instructions:', 15, yPos);
  yPos += 8;

  const instructions = [
    '• Report at the examination venue at least 30 minutes before the scheduled time.',
    '• Carry your hall ticket and valid college ID card.',
    '• Electronic devices including mobile phones are strictly prohibited.',
    '• Read all instructions on the question paper carefully before attempting.',
    '• Malpractice or violation of rules will result in disciplinary action.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT.small);
  instructions.forEach((instruction) => {
    doc.text(instruction, 15, yPos);
    yPos += 6;
  });

  addFooter(doc);
  doc.save(`ExamTimetable_${student.studentId}.pdf`);
};

// ==================== FACULTY PDFs ====================

export interface FacultyInfo {
  name: string;
  facultyId: string;
  email: string;
  department: string;
  designation: string;
}

export interface DutyAssignment {
  date: string;
  time: string;
  venue: string;
  subject: string;
  role: 'Supervisor' | 'Relief' | 'Flying Squad';
}

/**
 * Generate Supervisor Duty Sheet PDF
 */
export const generateDutySheet = (
  faculty: FacultyInfo,
  duties: DutyAssignment[],
  examSession: string = 'End Semester Examination - Spring 2025'
): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'SUPERVISORY DUTY ASSIGNMENT');

  // Exam Session
  doc.setFontSize(FONT.subtitle);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(examSession, 105, yPos, { align: 'center' });
  yPos += 15;

  // Faculty Details
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');

  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${faculty.name}`, 20, yPos + 8);
  doc.text(`Faculty ID: ${faculty.facultyId}`, 120, yPos + 8);
  doc.text(`Department: ${faculty.department}`, 20, yPos + 18);
  doc.text(`Designation: ${faculty.designation}`, 120, yPos + 18);

  yPos += 35;

  // Duty Table
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Time', 'Venue', 'Subject', 'Role']],
    body: duties.map((duty) => [
      new Date(duty.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      duty.time,
      duty.venue,
      duty.subject,
      duty.role,
    ]),
    styles: { fontSize: FONT.small, cellPadding: 4 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.previousAutoTable?.finalY || yPos + 60;
  yPos += 15;

  // Note
  doc.setFontSize(FONT.small);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.secondary);
  doc.text('Please report at the assigned venue 15 minutes before the scheduled time.', 15, yPos);
  doc.text('For any changes, contact the Examination Department.', 15, yPos + 6);

  // Signature
  yPos += 25;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.dark);
  doc.text('_______________________', 30, yPos);
  doc.text('_______________________', 140, yPos);
  yPos += 5;
  doc.text('Faculty Signature', 30, yPos);
  doc.text('Exam Coordinator', 140, yPos);

  addFooter(doc);
  doc.save(`DutySheet_${faculty.facultyId}.pdf`);
};

// ==================== ADMIN PDFs ====================

export interface ApplicationData {
  applicationId: string;
  studentName: string;
  studentId: string;
  course: string;
  semester: string;
  applicationType: string;
  submissionDate: string;
  status: string;
  subjects: { code: string; name: string }[];
  remarks?: string;
}

/**
 * Generate Application Summary PDF (Admin)
 */
export const generateApplicationSummary = (application: ApplicationData): void => {
  const doc = new jsPDF() as ExtendedJsPDF;
  let yPos = addHeader(doc, 'APPLICATION SUMMARY');

  // Application ID and Status
  doc.setFontSize(FONT.body);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(`Application ID: ${application.applicationId}`, 15, yPos);
  
  const statusColor = application.status === 'Approved' ? COLORS.success : 
                     application.status === 'Pending' ? COLORS.warning : COLORS.danger;
  doc.setFillColor(...statusColor);
  doc.roundedRect(150, yPos - 4, 35, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONT.small);
  doc.text(application.status.toUpperCase(), 167.5, yPos + 1, { align: 'center' });
  yPos += 15;

  // Application Details
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(FONT.body);
  doc.setFont('helvetica', 'normal');
  doc.text(`Application Type: ${application.applicationType}`, 15, yPos);
  doc.text(`Submission Date: ${new Date(application.submissionDate).toLocaleDateString('en-IN')}`, 15, yPos + 8);
  yPos += 20;

  // Student Details
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');

  doc.text(`Student: ${application.studentName}`, 20, yPos + 8);
  doc.text(`ID: ${application.studentId}`, 120, yPos + 8);
  doc.text(`Course: ${application.course}`, 20, yPos + 18);
  doc.text(`Semester: ${application.semester}`, 120, yPos + 18);

  yPos += 35;

  // Subjects Table
  if (application.subjects.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Subjects:', 15, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Subject Code', 'Subject Name']],
      body: application.subjects.map((subject, index) => [
        (index + 1).toString(),
        subject.code,
        subject.name,
      ]),
      styles: { fontSize: FONT.small, cellPadding: 3 },
      headStyles: { 
        fillColor: COLORS.primary, 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.previousAutoTable?.finalY || yPos + 40;
    yPos += 15;
  }

  // Remarks
  if (application.remarks) {
    doc.setFont('helvetica', 'bold');
    doc.text('Remarks:', 15, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT.small);
    doc.text(application.remarks, 15, yPos);
  }

  addFooter(doc);
  doc.save(`Application_${application.applicationId}.pdf`);
};

export interface DutyAllocationData {
  faculty: FacultyInfo;
  duties: DutyAssignment[];
}

/**
 * Generate Duty Allocation Report PDF (Admin)
 */
export const generateDutyAllocationReport = (
  allocations: DutyAllocationData[],
  examSession: string = 'End Semester Examination - Spring 2025'
): void => {
  const doc = new jsPDF('landscape') as ExtendedJsPDF;
  
  // Header
  doc.setFontSize(FONT.title);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(INSTITUTION.name, 148.5, 15, { align: 'center' });

  doc.setFontSize(FONT.subtitle);
  doc.setTextColor(...COLORS.dark);
  doc.text('SUPERVISORY DUTY ALLOCATION REPORT', 148.5, 25, { align: 'center' });
  doc.setFontSize(FONT.body);
  doc.text(examSession, 148.5, 32, { align: 'center' });

  // Build table data
  const tableData = allocations.flatMap((allocation) =>
    allocation.duties.map((duty, index) => [
      index === 0 ? allocation.faculty.name : '',
      index === 0 ? allocation.faculty.department : '',
      new Date(duty.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      duty.time,
      duty.venue,
      duty.subject,
      duty.role,
    ])
  );

  autoTable(doc, {
    startY: 40,
    head: [['Faculty Name', 'Department', 'Date', 'Time', 'Venue', 'Subject', 'Role']],
    body: tableData,
    styles: { fontSize: FONT.small, cellPadding: 3 },
    headStyles: { 
      fillColor: COLORS.primary, 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 10, right: 10 },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLORS.secondary);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 10, pageHeight - 10);
  doc.text('EduSync - Examination Management System', 287, pageHeight - 10, { align: 'right' });

  doc.save(`DutyAllocationReport_${new Date().toISOString().split('T')[0]}.pdf`);
};
