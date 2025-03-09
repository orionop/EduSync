import React, { useState } from 'react';
import { Download, Printer, Mail, Eye, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface HallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const hallTicketSchema = z.object({
  examTitle: z.string().min(1, 'Exam title is required'),
  branch: z.string().min(1, 'Branch is required'),
  semester: z.string().min(1, 'Semester is required'),
  batch: z.string().min(1, 'Batch is required'),
  sendEmail: z.boolean(),
  bulkDownload: z.boolean(),
});

type HallTicketForm = z.infer<typeof hallTicketSchema>;

const HallTicketModal: React.FC<HallTicketModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Partial<HallTicketForm>>({});
  const [formData, setFormData] = useState<HallTicketForm>({
    examTitle: '',
    branch: '',
    semester: '',
    batch: '',
    sendEmail: false,
    bulkDownload: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      hallTicketSchema.parse(formData);
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Hall tickets generated successfully!');
      if (formData.sendEmail) {
        toast.success('Hall tickets sent to student emails');
      }
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<HallTicketForm> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof HallTicketForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Hall Tickets">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Batch
            </label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Batch</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            {errors.batch && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.batch}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendEmail"
                name="sendEmail"
                checked={formData.sendEmail}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sendEmail" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send hall tickets to student emails
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bulkDownload"
                name="bulkDownload"
                checked={formData.bulkDownload}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="bulkDownload" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Enable bulk download
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Printer className="h-5 w-5" />
            {isGenerating ? 'Generating...' : 'Generate Hall Tickets'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default HallTicketModal;