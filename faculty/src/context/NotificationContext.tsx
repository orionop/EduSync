import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../components/NotificationPanel';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acceptRequest: (id: string) => void;
  ignoreRequest: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Define notification categories
export enum NotificationCategory {
  SLOT_REQUEST_MADE = 'slot_request_made',
  SLOT_CHANGE_REQUEST = 'slot_change_request',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system'
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Initial mock notifications - only essential ones
  const initialNotifications: Notification[] = [
    {
      id: '1',
      title: 'End Semester Exam Schedule Released',
      message: 'The end semester examination schedule has been released. Please check your duty assignments.',
      timestamp: '2025-04-15 09:30 AM',
      type: 'announcement',
      read: false,
      sender: 'Exam Coordinator',
      category: NotificationCategory.ANNOUNCEMENT
    },
    {
      id: '2',
      title: 'Faculty Meeting Reminder',
      message: 'Reminder: Faculty meeting tomorrow at 10:00 AM in the conference room.',
      timestamp: '2025-04-14 02:15 PM',
      type: 'announcement',
      read: false,
      sender: 'Department Head',
      category: NotificationCategory.ANNOUNCEMENT
    },
    {
      id: '3',
      title: 'Time Slot Change Request',
      message: 'Prof. Robert Johnson has requested to swap supervision duty with you.',
      timestamp: '2025-04-13 11:45 AM',
      type: 'request',
      read: false,
      sender: 'Exam Cell',
      category: NotificationCategory.SLOT_CHANGE_REQUEST,
      details: {
        requesterName: 'Prof. Robert Johnson',
        originalTimeSlot: '09:00 AM - 11:00 AM',
        requestedTimeSlot: '02:00 PM - 04:00 PM',
        requestedClassroom: 'CS-101'
      }
    },
    {
      id: '4',
      title: 'Your Time Slot Change Request Submitted',
      message: 'Your request to change supervision duty for CS-102 has been submitted and is pending approval.',
      timestamp: '2025-04-12 10:00 AM',
      type: 'announcement',
      read: true,
      sender: 'System',
      category: NotificationCategory.SLOT_REQUEST_MADE
    }
  ];
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Try to get notifications from localStorage
    const savedNotifications = localStorage.getItem('eduSyncNotifications');
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });
  
  // Calculate unread count - only for essential notifications
  const unreadCount = notifications.filter(notification => 
    !notification.read && 
    (notification.category === NotificationCategory.ANNOUNCEMENT || 
     notification.category === NotificationCategory.SLOT_CHANGE_REQUEST ||
     notification.category === NotificationCategory.SLOT_REQUEST_MADE)
  ).length;
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('eduSyncNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Auto-expire notifications older than 7 days (except for announcements)
  useEffect(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const filteredNotifications = notifications.filter(notification => {
      // Keep all announcements regardless of age
      if (notification.category === NotificationCategory.ANNOUNCEMENT && !notification.read) {
        return true;
      }
      
      // For other notifications, check age
      const notificationDate = new Date(notification.timestamp);
      return notificationDate > sevenDaysAgo;
    });
    
    if (filteredNotifications.length !== notifications.length) {
      setNotifications(filteredNotifications);
    }
  }, [notifications]);
  
  // Show toast for new notifications on initial load
  useEffect(() => {
    const unreadEssentialNotifications = notifications.filter(notification => 
      !notification.read && 
      (notification.category === NotificationCategory.ANNOUNCEMENT || 
       notification.category === NotificationCategory.SLOT_CHANGE_REQUEST ||
       notification.category === NotificationCategory.SLOT_REQUEST_MADE)
    );
    
    if (unreadEssentialNotifications.length > 0) {
      toast((t) => (
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">You have {unreadEssentialNotifications.length} unread notifications</p>
            <button 
              onClick={() => {
                markAllAsRead();
                toast.dismiss(t.id);
              }}
              className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
            >
              Mark all as read
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    }
  }, []);
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => {
      // Check if the notification is already read
      const notification = prevNotifications.find(n => n.id === id);
      if (notification && notification.read) {
        return prevNotifications; // No change needed
      }
      
      // Mark the notification as read
      return prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const acceptRequest = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Add a confirmation notification
    addNotification({
      title: 'Time Slot Change Request Accepted',
      message: 'You have accepted the time slot change request.',
      timestamp: new Date().toLocaleString(),
      type: 'announcement',
      sender: 'System',
      category: NotificationCategory.SLOT_REQUEST_MADE
    });
    
    // In a real app, you would send this to the backend
  };
  
  const ignoreRequest = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Add a confirmation notification
    addNotification({
      title: 'Time Slot Change Request Ignored',
      message: 'You have ignored the time slot change request.',
      timestamp: new Date().toLocaleString(),
      type: 'announcement',
      sender: 'System',
      category: NotificationCategory.SLOT_REQUEST_MADE
    });
    
    // In a real app, you would send this to the backend
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    // Only add essential notifications
    if (notification.category !== NotificationCategory.ANNOUNCEMENT && 
        notification.category !== NotificationCategory.SLOT_CHANGE_REQUEST && 
        notification.category !== NotificationCategory.SLOT_REQUEST_MADE) {
      return; // Skip non-essential notifications
    }
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Show toast for new notification with consistent styling
    toast((t) => (
      <div className="flex items-start gap-3 animate-in slide-in-from-top duration-300">
        <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm">{notification.message}</p>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                markAsRead(newNotification.id);
                toast.dismiss(t.id);
              }}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
            >
              Mark as read
            </button>
            <button 
              onClick={() => {
                // Find the notification in the state
                const notif = notifications.find(n => n.id === newNotification.id);
                if (notif) {
                  // Set as selected notification and open modal
                  const event = new CustomEvent('viewNotificationDetails', { 
                    detail: { notification: notif } 
                  });
                  window.dispatchEvent(event);
                }
                toast.dismiss(t.id);
              }}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors"
            >
              View details
            </button>
          </div>
        </div>
      </div>
    ), { 
      duration: 5000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '0.5rem',
      }
    });
  };
  
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    acceptRequest,
    ignoreRequest,
    addNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};