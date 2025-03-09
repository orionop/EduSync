import React, { useState } from 'react';
import { Mail, FileText, Search, Filter, Calendar, Download, Eye, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  copCode: string;
}

interface AnswerBook {
  id: string;
  subject: string;
  faculty: string;
  uploadDate: string;
  fileUrl: string;
  status: 'pending' | 'evaluated';
}

interface EmailFormData {
  facultyId: string;
  subject: string;
  deadline: string;
}

const ExamEvaluation: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedAnswerBook, setSelectedAnswerBook] = useState<AnswerBook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    facultyId: '',
    subject: '',
    deadline: ''
  });

  const [faculties] = useState<Faculty[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      department: 'Computer Science',
      copCode: 'COP2025001'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      department: 'Electronics',
      copCode: 'COP2025002'
    }
  ]);

  const [answerBooks] = useState<AnswerBook[]>([
    {
      id: '1',
      subject: 'Advanced Mathematics',
      faculty: 'Dr. Sarah Johnson',
      uploadDate: '2025-03-15',
      fileUrl: 'https://example.com/answer-book-1.pdf',
      status: 'pending'
    },
    {
      id: '2',
      subject: 'Digital Electronics',
      faculty: 'Prof. Michael Chen',
      uploadDate: '2025-03-16',
      fileUrl: 'https://example.com/answer-book-2.pdf',
      status: 'evaluated'
    }
  ]);

  const handleSendEmail = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Evaluation request emails sent successfully');
      setShowEmailModal(false);
    } catch (error) {
      toast.error('Failed to send evaluation request emails');
    }
  };

  const handleDownloadPdf = (answerBook: AnswerBook) => {
    toast.success('Downloading answer book PDF...');
  };

  const filteredAnswerBooks = answerBooks.filter(book => {
    const matchesSearch = 
      book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || book.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const features = [
    {
      id: 'email-generation',
      title: 'Evaluation Request Emails',
      description: 'Generate and send evaluation request emails to faculty members.',
      icon: Mail,
      action: () => setShowEmailModal(true)
    },
    {
      id: 'answer-books',
      title: 'Answer Book Management',
      description: 'View and manage scanned answer books.',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Subjects</option>
                <option value="Advanced Mathematics">Advanced Mathematics</option>
                <option value="Digital Electronics">Digital Electronics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnswerBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {book.subject}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.faculty}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    book.status === 'evaluated'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(book.uploadDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAnswerBook(book);
                      setShowPdfModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(book)}
                    className="flex items-center gap-2 px-3 py-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam Evaluation Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage evaluation requests and answer book distribution
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
                    Generate Evaluation Requests
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Email Generation Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Generate Evaluation Request Emails"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Faculty
            </label>
            <select
              value={emailForm.facultyId}
              onChange={(e) => setEmailForm({ ...emailForm, facultyId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name} ({faculty.copCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Subject</option>
              <option value="Advanced Mathematics">Advanced Mathematics</option>
              <option value="Digital Electronics">Digital Electronics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Evaluation Deadline
            </label>
            <input
              type="date"
              value={emailForm.deadline}
              onChange={(e) => setEmailForm({ ...emailForm, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5" />
              Send Requests
            </button>
          </div>
        </div>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => {
          setShowPdfModal(false);
          setSelectedAnswerBook(null);
        }}
        title="View Answer Book"
      >
        {selectedAnswerBook && (
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {selectedAnswerBook.subject}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAnswerBook.faculty}
                </p>
              </div>
              <button
                onClick={() => handleDownloadPdf(selectedAnswerBook)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamEvaluation;