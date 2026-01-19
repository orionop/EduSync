import React from 'react';
import { Bell, ChevronRight, Calendar, User } from 'lucide-react';
import { EmptyState } from '../shared/EmptyState';

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  sender: string;
  isImportant: boolean;
}

interface AnnouncementSectionProps {
  announcements: Announcement[];
  onViewMore: () => void;
}

const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({
  announcements,
  onViewMore
}) => {
  // Get the top 2 announcements
  const topAnnouncements = announcements.slice(0, 2);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Announcements</h2>
        </div>
        
        <button 
          onClick={onViewMore}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="View all announcements"
        >
          View All
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      
      <div className="space-y-4">
        {topAnnouncements.length > 0 ? (
          topAnnouncements.map((announcement) => (
            <div 
              key={announcement.id}
              className={`p-4 rounded-lg border ${
                announcement.isImportant 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                  : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-medium ${
                  announcement.isImportant 
                    ? 'text-red-800 dark:text-red-300' 
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  {announcement.title}
                  {announcement.isImportant && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      Important
                    </span>
                  )}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</span>
              </div>
              
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{announcement.message}</p>
              
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>From: {announcement.sender}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{announcement.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Bell}
            title="No announcements available"
            description="Check back later for new announcements."
          />
        )}
      </div>
    </div>
  );
};

export default AnnouncementSection