import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Info, Calendar, User, Clock, MapPin, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import NotificationDetailsModal from './NotificationDetailsModal';
import { NotificationCategory } from '../context/NotificationContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'announcement' | 'request';
  read: boolean;
  sender?: string;
  category: NotificationCategory;
  details?: {
    requesterName: string;
    originalTimeSlot: string;
    requestedTimeSlot: string;
    requestedClassroom: string;
  };
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onAcceptRequest?: (id: string) => void;
  onIgnoreRequest?: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onAcceptRequest,
  onIgnoreRequest,
  isOpen,
  onClose
}) => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Filter to only show essential notifications
  const essentialNotifications = notifications.filter(notification => 
    notification.category === NotificationCategory.ANNOUNCEMENT || 
    notification.category === NotificationCategory.SLOT_CHANGE_REQUEST ||
    notification.category === NotificationCategory.SLOT_REQUEST_MADE
  );
  
  const unreadCount = essentialNotifications.filter(notification => !notification.read).length;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && !document.querySelector('.notification-modal-container')?.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Listen for global notification view events
  useEffect(() => {
    const handleViewNotification = (event: CustomEvent) => {
      const { notification } = event.detail;
      if (notification) {
        handleViewDetails(notification);
      }
    };

    window.addEventListener('viewNotificationDetails', handleViewNotification as EventListener);
    
    return () => {
      window.removeEventListener('viewNotificationDetails', handleViewNotification as EventListener);
    };
  }, []);
  
  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    toast.success('All notifications marked as read');
  };
  
  const handleViewDetails = (notification: Notification) => {
    // Automatically mark as read when viewing details
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };
  
  const handleAcceptRequest = (id: string) => {
    if (onAcceptRequest) {
      onAcceptRequest(id);
      setIsDetailsModalOpen(false);
      toast.success('Request accepted successfully');
    }
  };
  
  const handleIgnoreRequest = (id: string) => {
    if (onIgnoreRequest) {
      onIgnoreRequest(id);
      setIsDetailsModalOpen(false);
      toast.success('Request ignored');
    }
  };
  
  // Get notification icon based on category
  const getNotificationIcon = (notification: Notification) => {
    switch (notification.category) {
      case NotificationCategory.SLOT_CHANGE_REQUEST:
        return <Calendar className="h-4 w-4" />;
      case NotificationCategory.SLOT_REQUEST_MADE:
        return <Clock className="h-4 w-4" />;
      case NotificationCategory.ANNOUNCEMENT:
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get notification background color based on category
  const getNotificationColor = (notification: Notification) => {
    switch (notification.category) {
      case NotificationCategory.SLOT_CHANGE_REQUEST:
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case NotificationCategory.SLOT_REQUEST_MADE:
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case NotificationCategory.ANNOUNCEMENT:
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  return (
    <div className="relative" ref={panelRef}>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-40 overflow-hidden animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all as read
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {essentialNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {essentialNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification)}`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${
                            notification.read 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.timestamp}
                          </span>
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          notification.read 
                            ? 'text-gray-500 dark:text-gray-500' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {notification.sender && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            From: {notification.sender}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                          <button
                            onClick={() => handleViewDetails(notification)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  When you receive notifications, they'll appear here
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {selectedNotification && (
        <NotificationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          notification={selectedNotification}
          onAccept={onAcceptRequest ? () => handleAcceptRequest(selectedNotification.id) : undefined}
          onIgnore={onIgnoreRequest ? () => handleIgnoreRequest(selectedNotification.id) : undefined}
          onMarkAsRead={() => onMarkAsRead(selectedNotification.id)}
        />
      )}
    </div>
  );
};

export default NotificationPanel;