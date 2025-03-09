import React from 'react';
import { Calendar, Clock, ArrowLeftRight } from 'lucide-react';
import SummaryPanel from './SummaryPanel';

interface SupervisorySummaryProps {
  upcomingDuties: {
    id: string;
    date: string;
    timeSlot: string;
    classroom: string;
  }[];
  slotChangeRequests: {
    sent: number;
    received: number;
    approved: number;
    pending: number;
  };
  onViewMore: () => void;
}

const SupervisorySummary: React.FC<SupervisorySummaryProps> = ({
  upcomingDuties,
  slotChangeRequests,
  onViewMore
}) => {
  return (
    <SummaryPanel 
      title="Supervisory Section" 
      icon={<Calendar className="h-5 w-5" />}
      color="purple"
      onViewMore={onViewMore}
    >
      <div className="flex flex-col h-full">
        {/* Upcoming Duties */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upcoming Duties</h4>
          
          {upcomingDuties.length > 0 ? (
            <div className="space-y-2 max-h-[120px] overflow-y-auto">
              {upcomingDuties.map(duty => (
                <div 
                  key={duty.id}
                  className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{duty.classroom}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{duty.date}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-shrink-0 ml-2">
                    {duty.timeSlot.split(' - ')[0]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              No upcoming duties
            </p>
          )}
        </div>
        
        {/* Duty Status */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duty Status</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">12</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
        
        {/* Slot Change Requests */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Slot Change Requests</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{slotChangeRequests.sent}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {slotChangeRequests.approved} approved
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{slotChangeRequests.received}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {slotChangeRequests.pending} pending
              </p>
            </div>
          </div>
        </div>
      </div>
    </SummaryPanel>
  );
};

export default SupervisorySummary;