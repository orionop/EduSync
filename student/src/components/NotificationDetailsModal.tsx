import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Check, X as XIcon, Bell, CheckCircle } from 'lucide-react';
import { Notification } from './NotificationPanel';
import { NotificationCategory } from '../context/NotificationContext';

interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification;
  onAccept?: () => void;
  onIgnore?: () => void;
  onMarkAsRead: () => void;
}

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({
  isOpen,
  onClose,
  notification,
  onAccept,
  onIgnore,
  onMarkAsRead
}) => {
  if (!isOpen) return null;

  // Get category badge color and text
  const getCategoryBadge = () => {
    switch (notification.category) {
      case NotificationCategory.SLOT_CHANGE_REQUEST:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Slot Change Request
          </span>
        );
      case NotificationCategory.SLOT_REQUEST_MADE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Slot Request Update
          </span>
        );
      case NotificationCategory.ANNOUNCEMENT:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Announcement
          </span>
        );
      default:
        return null;
    }
  };

  // Get header icon based on notification type
  const getHeaderIcon = () => {
    switch (notification.category) {
      case NotificationCategory.SLOT_CHANGE_REQUEST:
        return <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />;
      case NotificationCategory.SLOT_REQUEST_MADE:
        return <Clock className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />;
      case NotificationCategory.ANNOUNCEMENT:
        return <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 notification-modal-container">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden modal-animate-in">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            {getHeaderIcon()}
            {notification.type === 'announcement' ? (
              'Announcement Details'
            ) : (
              'Time Slot Change Request'
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h3>
            {getCategoryBadge()}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {notification.message}
          </p>
          
          {notification.type === 'request' && notification.details && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requester</p>
                  <p className="font-medium text-gray-900 dark:text-white">{notification.details.requesterName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Original Time Slot</p>
                  <p className="font-medium text-gray-900 dark:text-white">{notification.details.originalTimeSlot}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requested Time Slot</p>
                  <p className="font-medium text-gray-900 dark:text-white">{notification.details.requestedTimeSlot}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                  <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Classroom</p>
                  <p className="font-medium text-gray-900 dark:text-white">{notification.details.requestedClassroom}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 mb-4">
            {notification.sender && <p>From: {notification.sender}</p>}
            <p>Received: {notification.timestamp}</p>
          </div>
          
          {notification.category === NotificationCategory.SLOT_CHANGE_REQUEST && onAccept && onIgnore && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onAccept}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                Accept Request
              </button>
              <button
                onClick={onIgnore}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XIcon className="h-4 w-4" />
                Ignore Request
              </button>
            </div>
          )}
          
          {(notification.category === NotificationCategory.ANNOUNCEMENT || 
            notification.category === NotificationCategory.SLOT_REQUEST_MADE) && (
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onMarkAsRead}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Read
              </button>
              <button
                onClick={onClose}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;