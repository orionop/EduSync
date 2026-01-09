import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

export enum NotificationCategory {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  SLOT_CHANGE_REQUEST = 'SLOT_CHANGE_REQUEST',
  SLOT_REQUEST_MADE = 'SLOT_REQUEST_MADE'
}

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

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    toast(notification.title, {
      icon: notification.type === 'announcement' ? 'ℹ️' : '🔔'
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;