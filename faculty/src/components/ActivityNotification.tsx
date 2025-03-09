import React from 'react';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

interface ActivityNotificationProps {
  id: string;
  timestamp: string;
  type: 'suspicious' | 'normal';
  description: string;
  classroom: string;
  onReport: (id: string) => void;
  onFalseAlarm: (id: string) => void;
}

const ActivityNotification: React.FC<ActivityNotificationProps> = ({
  id,
  timestamp,
  type,
  description,
  classroom,
  onReport,
  onFalseAlarm,
}) => {
  return (
    <div className={`p-4 rounded-lg mb-3 border ${
      type === 'suspicious' 
        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
        : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          type === 'suspicious' 
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {type === 'suspicious' ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${
              type === 'suspicious' 
                ? 'text-red-800 dark:text-red-300' 
                : 'text-green-800 dark:text-green-300'
            }`}>
              {type === 'suspicious' ? 'Suspicious Activity Detected' : 'Normal Activity'}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{description}</p>
          
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>Classroom: {classroom}</span>
          </div>
          
          {type === 'suspicious' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onReport(id)}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Report UFM
              </button>
              <button
                onClick={() => onFalseAlarm(id)}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Mark False Alarm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityNotification;