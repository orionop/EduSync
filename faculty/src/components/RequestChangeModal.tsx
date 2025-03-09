import React, { useState } from 'react';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface RequestChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dutyDetails: {
    facultyName: string;
    timeSlot: string;
    classroom: string;
  };
  availableTimeSlots: string[];
  onSubmit: (timeSlot: string, substituteTeacher: string | null) => void;
}

// Mock list of substitute teachers
const substituteTeachers = [
  'Dr. Michael Brown',
  'Prof. Sarah Wilson',
  'Dr. David Miller',
  'Prof. Emily Taylor',
  'Dr. Robert Anderson'
];

const RequestChangeModal: React.FC<RequestChangeModalProps> = ({
  isOpen,
  onClose,
  dutyDetails,
  availableTimeSlots,
  onSubmit,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedSubstitute, setSelectedSubstitute] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      toast.error('Please select a preferred time slot');
      return;
    }
    onSubmit(selectedTimeSlot, selectedSubstitute || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Request Time Slot Change
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Faculty Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{dutyDetails.facultyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Time Slot</p>
                <p className="font-medium text-gray-900 dark:text-white">{dutyDetails.timeSlot}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Classroom Assigned</p>
                <p className="font-medium text-gray-900 dark:text-white">{dutyDetails.classroom}</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Time Slot
              </label>
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a time slot</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="substitute" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Substitute Teacher (Optional)
              </label>
              <select
                id="substitute"
                value={selectedSubstitute}
                onChange={(e) => setSelectedSubstitute(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a substitute teacher</option>
                {substituteTeachers.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestChangeModal;