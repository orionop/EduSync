import React, { useState } from 'react';
import { FileText, Lock, XCircle, RotateCcw, Eye, CheckCircle, Clock, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ isOpen, onClose, fileUrl, title }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full h-[95vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Rotate"
            >
              <RotateCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <iframe
              src={fileUrl}
              className="rounded-lg transition-transform duration-200"
              style={{ 
                width: '100%', 
                height: '100%',
                transform: `scale(${scale})`
              }}
              title="PDF Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

interface MarksEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFreezeMarks: (data: { facultyName: string; subjectName: string; department: string; year: string }) => void;
}

const MarksEntryModal: React.FC<MarksEntryModalProps> = ({ isOpen, onClose, onFreezeMarks }) => {
  const [formData, setFormData] = useState({
    facultyName: '',
    subjectName: '',
    department: 'CE',
    year: 'FE'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFreezeMarks(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Freeze Marks</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Faculty Name
            </label>
            <input
              type="text"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="CE">Computer Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="EE">Electrical Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="FE">First Year</option>
              <option value="SE">Second Year</option>
              <option value="TE">Third Year</option>
              <option value="BE">Fourth Year</option>
            </select>
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
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AnswerBooklet {
  id: string;
  code: string;
  status: 'not_viewed' | 'pending' | 'evaluated';
}

const EndSemesterEvaluation: React.FC = () => {
  const [formData, setFormData] = useState({
    questionPaperCode: '',
    questionPaper: null as File | null,
    answerKey: null as File | null,
    evaluatorName: ''
  });
  const [showList, setShowList] = useState(false);
  const [answerBooklets, setAnswerBooklets] = useState<AnswerBooklet[]>([
    { id: '1', code: 'AB001', status: 'not_viewed' },
    { id: '2', code: 'AB002', status: 'pending' },
    { id: '3', code: 'AB003', status: 'evaluated' },
    { id: '4', code: 'AB004', status: 'not_viewed' },
  ]);
  const [showAnswerSheetModal, setShowAnswerSheetModal] = useState(false);
  const [selectedAnswerBooklet, setSelectedAnswerBooklet] = useState<AnswerBooklet | null>(null);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; fileUrl: string; title: string }>({
    isOpen: false,
    fileUrl: '',
    title: ''
  });
  const [marksEntryModal, setMarksEntryModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; type: 'undo' | 'freeze' }>({
    isOpen: false,
    type: 'undo'
  });
  const [isMarksLocked, setIsMarksLocked] = useState(false);
  const [marks, setMarks] = useState({
    q1: Array(6).fill(0),
    q2: Array(6).fill(0),
    q3: Array(3).fill(0)
  });

  // Enhanced cleanup for PDF preview URL
  React.useEffect(() => {
    return () => {
      if (previewModal.fileUrl) {
        URL.revokeObjectURL(previewModal.fileUrl);
      }
    };
  }, [previewModal.fileUrl]);

  // Calculate total marks for each question
  const calculateQuestionTotal = (question: 'q1' | 'q2' | 'q3') => {
    const marksArray = marks[question];
    const sortedMarks = [...marksArray].sort((a, b) => b - a);
    
    if (question === 'q3') {
      // For Q3, take top 2 out of 3
      return sortedMarks.slice(0, 2).reduce((sum, mark) => sum + mark, 0);
    } else {
      // For Q1 and Q2, take top 4 out of 6
      return sortedMarks.slice(0, 4).reduce((sum, mark) => sum + mark, 0);
    }
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return calculateQuestionTotal('q1') + calculateQuestionTotal('q2') + calculateQuestionTotal('q3');
  };

  // Validate marks before submission
  const validateMarks = () => {
    const q1Total = calculateQuestionTotal('q1');
    const q2Total = calculateQuestionTotal('q2');
    const q3Total = calculateQuestionTotal('q3');

    if (q1Total > 20) {
      toast.error('Question 1 marks cannot exceed 20 (4 questions × 5 marks)');
      return false;
    }
    if (q2Total > 20) {
      toast.error('Question 2 marks cannot exceed 20 (4 questions × 5 marks)');
      return false;
    }
    if (q3Total > 20) {
      toast.error('Question 3 marks cannot exceed 20 (2 questions × 10 marks)');
      return false;
    }

    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionPaperCode || !formData.questionPaper || !formData.answerKey || !formData.evaluatorName) {
      toast.error('Please fill in all fields');
      return;
    }
    setShowList(true);
    toast.success('Form submitted successfully');
  };

  const handleViewAnswerBook = (booklet: AnswerBooklet) => {
    // Update status from 'not_viewed' to 'pending' when viewing
    if (booklet.status === 'not_viewed') {
      setAnswerBooklets(prev => prev.map(b => 
        b.id === booklet.id ? { ...b, status: 'pending' } : b
      ));
    }
    setSelectedAnswerBooklet(booklet);
    setShowAnswerSheetModal(true);
  };

  const handleMarksChange = (question: 'q1' | 'q2' | 'q3', index: number, value: number) => {
    // Validate input value
    const maxValue = question === 'q3' ? 10 : 5;
    const validatedValue = Math.min(Math.max(0, value), maxValue);

    setMarks(prev => ({
      ...prev,
      [question]: prev[question].map((mark, i) => i === index ? validatedValue : mark)
    }));
  };

  const handleFreezeMarks = (data: { facultyName: string; subjectName: string; department: string; year: string }) => {
    if (!validateMarks()) {
      return;
    }
    
    // Update status to 'evaluated' when freezing marks
    if (selectedAnswerBooklet) {
      setAnswerBooklets(prev => prev.map(b => 
        b.id === selectedAnswerBooklet.id ? { ...b, status: 'evaluated' } : b
      ));
    }
    
    setIsMarksLocked(true);
    toast.success(`Marks have been locked successfully for ${data.subjectName} (${data.department} ${data.year}) by ${data.facultyName}`);
  };

  const handleUndoSubmission = () => {
    setMarks({
      q1: Array(6).fill(0),
      q2: Array(6).fill(0),
      q3: Array(3).fill(0)
    });
    
    // Revert status back to 'pending' when undoing submission
    if (selectedAnswerBooklet) {
      setAnswerBooklets(prev => prev.map(b => 
        b.id === selectedAnswerBooklet.id ? { ...b, status: 'pending' } : b
      ));
    }
    
    toast.success('Marks submission has been undone');
  };

  const handleSubmitMarks = () => {
    if (!validateMarks() || !selectedAnswerBooklet) {
      return;
    }
    
    // Update status from 'pending' to 'evaluated' when submitting marks
    setAnswerBooklets(prev => prev.map(b => 
      b.id === selectedAnswerBooklet.id ? { ...b, status: 'evaluated' } : b
    ));
    
    toast.success('Marks submitted successfully');
    setShowAnswerSheetModal(false);
  };

  const getStatusColor = (status: AnswerBooklet['status']) => {
    switch (status) {
      case 'not_viewed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'evaluated':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AnswerBooklet['status']) => {
    switch (status) {
      case 'not_viewed':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'evaluated':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Paper Management Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Question Paper Management
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Paper Code
            </label>
            <input
              type="text"
              value={formData.questionPaperCode}
              onChange={(e) => setFormData({ ...formData, questionPaperCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Question Paper
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({ ...formData, questionPaper: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Answer Key
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({ ...formData, answerKey: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name of Evaluator
            </label>
            <input
              type="text"
              value={formData.evaluatorName}
              onChange={(e) => setFormData({ ...formData, evaluatorName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Answer Booklet List */}
      {showList && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Answer Booklet List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Answer Booklet Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {answerBooklets.map((booklet) => (
                  <tr key={booklet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {booklet.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booklet.status)}`}>
                        {getStatusIcon(booklet.status)}
                        <span className="ml-1">
                          {booklet.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewAnswerBook(booklet)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Answer Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Answer Sheet Evaluation Modal */}
      {showAnswerSheetModal && selectedAnswerBooklet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full h-[95vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Answer Sheet Evaluation - {selectedAnswerBooklet.code}
              </h2>
              <button
                onClick={() => setShowAnswerSheetModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* PDF Viewer */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Answer Sheet Viewer</h3>
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {/* TODO: Phase 5 - Replace hardcoded signed URL with dynamic generation
                        Use Supabase Storage API to generate signed URLs on-demand
                        Temporary: Using hardcoded URL (will expire - needs production fix) */}
                    <iframe
                      src="https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/S.E_CHEMICAL_Sem_IV_-CET-I_-SOUTION_DEC.19.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1MuRV9DSEVNSUNBTF9TZW1fSVZfLUNFVC1JXy1TT1VUSU9OX0RFQy4xOS5wZGYiLCJpYXQiOjE3NDE0MzkzNjAsImV4cCI6MTc3Mjk3NTM2MH0.QBUeQAt2lycPHGsCp1eGf3LSWjCQg_D4bIEGjKoCeW0"
                      className="w-full h-full rounded-lg"
                      title="Answer Sheet Preview"
                    />
                  </div>
                </div>

                {/* Marks Entry Table */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Marks Entry</h3>
                  <div className="space-y-6">
                    {/* Question 1 */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Question 1</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {calculateQuestionTotal('q1')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q1.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Q1.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={mark}
                              onChange={(e) => handleMarksChange('q1', index, Number(e.target.value))}
                              disabled={isMarksLocked}
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Question 2</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {calculateQuestionTotal('q2')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q2.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Q2.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={mark}
                              onChange={(e) => handleMarksChange('q2', index, Number(e.target.value))}
                              disabled={isMarksLocked}
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Question 3</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {calculateQuestionTotal('q3')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q3.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Q3.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={mark}
                              onChange={(e) => handleMarksChange('q3', index, Number(e.target.value))}
                              disabled={isMarksLocked}
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Grand Total</h4>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {calculateGrandTotal()}/60
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={handleSubmitMarks}
                      disabled={isMarksLocked}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Marks
                    </button>
                    {!isMarksLocked ? (
                      <>
                        <button
                          onClick={() => setConfirmationModal({ isOpen: true, type: 'undo' })}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Undo
                        </button>
                        <button
                          onClick={() => setConfirmationModal({ isOpen: true, type: 'freeze' })}
                          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Freeze Marks
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        Marks Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, fileUrl: '', title: '' })}
        fileUrl={previewModal.fileUrl}
        title={previewModal.title}
      />

      <MarksEntryModal
        isOpen={marksEntryModal}
        onClose={() => setMarksEntryModal(false)}
        onFreezeMarks={handleFreezeMarks}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: 'undo' })}
        onConfirm={() => {
          if (confirmationModal.type === 'undo') {
            handleUndoSubmission();
          } else {
            setMarksEntryModal(true);
          }
          setConfirmationModal({ isOpen: false, type: 'undo' });
        }}
        title={confirmationModal.type === 'undo' ? 'Undo Submission' : 'Freeze Marks'}
        message={confirmationModal.type === 'undo' 
          ? 'Are you sure you want to undo the marks submission? This action cannot be undone.'
          : 'Are you sure you want to freeze the marks? This action cannot be undone.'}
      />
    </div>
  );
};

export default EndSemesterEvaluation; 