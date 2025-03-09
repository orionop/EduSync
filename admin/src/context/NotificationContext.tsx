import React, { createContext, useContext, useState } from 'react';

export enum NotificationCategory {
  SLOT_CHANGE_REQUEST = 'SLOT_CHANGE_REQUEST',
  SLOT_REQUEST_MADE = 'SLOT_REQUEST_MADE',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface NotificationDetails {
  requesterName?: string;
  originalTimeSlot?: string;
  requestedTimeSlot?: string;
  requestedClassroom?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'request';
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  sender?: string;
  details?: NotificationDetails;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acceptRequest: (id: string) => void;
  ignoreRequest: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
  markAllAsRead: () => {},
  acceptRequest: () => {},
  ignoreRequest: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      category: NotificationCategory.ANNOUNCEMENT,
      title: 'New Announcement',
      message: 'Exam schedule for next week has been updated. Please review the changes and confirm your availability.',
      timestamp: new Date().toISOString(),
      read: false,
      sender: 'Exam Controller'
    },
    {
      id: '2',
      type: 'request',
      category: NotificationCategory.SLOT_CHANGE_REQUEST,
      title: 'Time Slot Change Request',
      message: 'Dr. Sarah Johnson has requested to swap their supervision duty.',
      timestamp: new Date().toISOString(),
      read: false,
      sender: 'Dr. Sarah Johnson',
      details: {
        requesterName: 'Dr. Sarah Johnson',
        originalTimeSlot: 'March 15, 2025 (9:00 AM - 12:00 PM)',
        requestedTimeSlot: 'March 15, 2025 (2:00 PM - 5:00 PM)',
        requestedClassroom: 'Room 301'
      }
    },
    {
      id: '3',
      type: 'info',
      category: NotificationCategory.SLOT_REQUEST_MADE,
      title: 'Slot Change Request Update',
      message: 'Your request to change supervision duty has been approved.',
      timestamp: new Date().toISOString(),
      read: false,
      sender: 'System'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const acceptRequest = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const ignoreRequest = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        acceptRequest,
        ignoreRequest,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};