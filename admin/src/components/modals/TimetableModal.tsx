import React, { useState, useEffect } from 'react';
import { Upload, Download, RefreshCw, Calendar, Clock, X, Plus, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Add this to store exam dates globally
declare global {
  interface Window {
    examDates?: string[];
    examTimeSlots?: { [date: string]: string };
  }
}

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeneratedSchedule {
  date: string;
  type: 'exam' | 'study';
  subject?: string;
  timeSlot?: string;
}

const timetableSchema = z.object({
  examTitle: z.string().min(1, 'Exam title is required'),
  branch: z.string().min(1, 'Branch is required'),
  semester: z.string().min(1, 'Semester is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  numSubjects: z.number().min(1, 'At least one subject is required'),
  subjects: z.array(z.string().min(1, 'Subject name is required')),
});

type TimetableForm = z.infer<typeof timetableSchema>;

const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<TimetableForm>>({});
  const [generatedSchedule, setGeneratedSchedule] = useState<GeneratedSchedule[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [formData, setFormData] = useState<TimetableForm>({
    examTitle: '',
    branch: '',
    semester: '',
    startDate: '',
    endDate: '',
    timeSlot: '',
    numSubjects: 1,
    subjects: [''],
  });

  useEffect(() => {
    const currentSubjects = formData.subjects.length;
    const targetSubjects = formData.numSubjects;

    if (currentSubjects < targetSubjects) {
      // Add new empty subject fields
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, ...Array(targetSubjects - currentSubjects).fill('')],
      }));
    } else if (currentSubjects > targetSubjects) {
      // Remove excess subject fields
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.slice(0, targetSubjects),
      }));
    }
  }, [formData.numSubjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'numSubjects') {
      const numValue = Math.max(1, parseInt(value) || 1);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubjectChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => (i === index ? value : subject)),
    }));
  };

  const handleAddSubject = () => {
    setFormData(prev => ({
      ...prev,
      numSubjects: prev.numSubjects + 1,
      subjects: [...prev.subjects, ''],
    }));
  };

  const handleRemoveSubject = (index: number) => {
    if (formData.subjects.length > 1) {
      setFormData(prev => ({
        ...prev,
        numSubjects: prev.numSubjects - 1,
        subjects: prev.subjects.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      toast.success('File uploaded successfully');
    }
  };

  const generateSchedule = (data: TimetableForm) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const schedule: GeneratedSchedule[] = [];
    
    if (totalDays < data.numSubjects) {
      toast.error('The selected date range is too short for the number of subjects');
      return null;
    }

    let currentDate = new Date(start);
    let subjectIndex = 0;

    // Skip to first weekday if starting on weekend
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count available weekdays
    let availableWeekdays = 0;
    let tempDate = new Date(currentDate);
    while (tempDate <= end) {
      if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        availableWeekdays++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    if (availableWeekdays < data.numSubjects) {
      toast.error('Not enough weekdays available for the number of subjects');
      return null;
    }

    const extraDays = availableWeekdays - data.numSubjects;
    const studyDaysPerGap = extraDays > 0 ? Math.floor(extraDays / (data.numSubjects - 1)) : 0;
    
    // Calculate study days distribution
    const studyDaysDistribution = Array(data.numSubjects - 1).fill(studyDaysPerGap);
    let extraStudyDays = extraDays - (studyDaysPerGap * (data.numSubjects - 1));
    
    let distributionIndex = 0;
    while (extraStudyDays > 0 && distributionIndex < studyDaysDistribution.length) {
      studyDaysDistribution[distributionIndex]++;
      extraStudyDays--;
      distributionIndex++;
    }

    // Generate schedule with evenly distributed study days
    for (let i = 0; i < data.numSubjects; i++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Add exam day
      schedule.push({
        date: currentDate.toISOString().split('T')[0],
        type: 'exam',
        subject: data.subjects[i],
        timeSlot: data.timeSlot
      });

      // Add study days after each exam except the last one
      if (i < data.numSubjects - 1) {
        const studyDaysToAdd = studyDaysDistribution[i];
        for (let j = 0; j < studyDaysToAdd; j++) {
          do {
            currentDate.setDate(currentDate.getDate() + 1);
          } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);

          schedule.push({
            date: currentDate.toISOString().split('T')[0],
            type: 'study'
          });
        }
      }

      // Move to next date
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Store exam dates and time slots globally
    const examDays = schedule.filter(day => day.type === 'exam');
    window.examDates = examDays.map(day => day.date);
    window.examTimeSlots = examDays.reduce((acc, day) => {
      if (day.date && day.timeSlot) {
        acc[day.date] = day.timeSlot;
      }
      return acc;
    }, {} as { [date: string]: string });

    return schedule;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      timetableSchema.parse(formData);
      setIsGenerating(true);
      
      const schedule = generateSchedule(formData);
      if (schedule) {
        setGeneratedSchedule(schedule);
        setShowSchedule(true);
        toast.success('Timetable generated successfully!');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<TimetableForm> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof TimetableForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Exam Timetable">
      {!showSchedule ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                name="examTitle"
                value={formData.examTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter exam title"
              />
              {errors.examTitle && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.examTitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Branch</option>
                  <option value="CS">Computer Science</option>
                  <option value="EC">Electronics</option>
                  <option value="ME">Mechanical</option>
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.branch}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.semester}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Slot
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Time Slot</option>
                  <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                  <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM</option>
                </select>
              </div>
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.timeSlot}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Subjects
              </label>
              <input
                type="number"
                name="numSubjects"
                value={formData.numSubjects}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject Names
                </label>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </button>
              </div>
              {formData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {formData.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Course Data (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-800 text-gray-400 rounded-lg shadow-lg tracking-wide border-2 border-dashed border-blue-500 dark:border-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  <span className="mt-2 text-sm text-center">
                    {selectedFile ? selectedFile.name : 'Drop your file here or click to select'}
                  </span>
                  <input type='file' className="hidden" onChange={handleFileChange} accept=".csv,.xlsx,.pdf" />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: CSV, Excel, PDF (max 10MB)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Timetable'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 min-w-[800px]">
              {/* Week day headers */}
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="text-center font-medium text-sm text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {/* Placeholder cells for alignment */}
              {(() => {
                const firstDate = new Date(generatedSchedule[0].date);
                const dayOffset = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
                return Array(dayOffset).fill(null).map((_, index) => (
                  <div key={`empty-${index}`} className="h-32 rounded-lg border border-dashed border-gray-200 dark:border-gray-700" />
                ));
              })()}

              {/* Schedule cells */}
              {generatedSchedule.map((day, index) => (
                <div 
                  key={index}
                  className={`h-32 p-3 rounded-lg border ${
                    day.type === 'exam' 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
                      : 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    day.type === 'exam' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {day.type === 'exam' ? 'Exam' : 'Study Leave'}
                  </div>
                  {day.type === 'exam' && (
                    <>
                      <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {day.subject}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {day.timeSlot}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowSchedule(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Form
            </button>
            <button
              type="button"
              onClick={() => {
                const pdfUrl = "https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/TT.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1RULnBkZiIsImlhdCI6MTc0MTQ5NDgzOCwiZXhwIjoxNzczMDMwODM4fQ.X-dk2kR6QE01tRE8KvDVfQXrefiCabCu0NYJcI6njn0";
                window.open(pdfUrl, '_blank');
                toast.success('Opening PDF template...');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TimetableModal;