/**
 * Communication Service
 * Handles cross-user communication across portals:
 * - Admin → All Students/Faculty (notifications, announcements)
 * - Faculty → Students (messages, notifications)
 * - Cross-portal data visibility (duties, seating, holidays)
 */

import { supabase } from './supabase';
import { UserRole } from '../context/AuthContext';

// ============ NOTIFICATIONS ============

export interface Notification {
  id: string;
  sender_id: string;
  sender_name?: string;
  sender_role?: UserRole;
  recipient_type: 'all' | 'role' | 'specific' | 'group';
  recipient_role?: UserRole;
  recipient_user_id?: string;
  type: 'info' | 'request' | 'announcement' | 'system' | 'message';
  category?: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  action_required: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  read: boolean;
  read_at?: string;
  created_at: string;
}

/**
 * Create a notification targeting specific users/roles
 * Admin can send to: all, all students, all faculty, specific users
 * Faculty can send to: specific students
 */
export async function createNotification(
  senderId: string,
  options: {
    recipientType: 'all' | 'role' | 'specific';
    recipientRole?: UserRole;
    recipientUserId?: string;
    type: 'info' | 'request' | 'announcement' | 'system' | 'message';
    title: string;
    message: string;
    category?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    actionRequired?: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
  }
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('create_notification_with_recipients', {
      p_sender_id: senderId,
      p_recipient_type: options.recipientType,
      p_type: options.type,
      p_title: options.title,
      p_message: options.message,
      p_recipient_role: options.recipientRole || null,
      p_recipient_user_id: options.recipientUserId || null,
      p_category: options.category || null,
      p_priority: options.priority || 'normal'
    });

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return null;
  }
}

/**
 * Fetch notifications for current user
 * Includes notifications sent to: user specifically, user's role, or all users
 */
export async function fetchUserNotifications(userId: string, userRole: UserRole): Promise<Notification[]> {
  try {
    // Fetch from notification_recipients (most efficient)
    const { data: recipientData, error: recipientError } = await supabase
      .from('notification_recipients')
      .select(`
        notification_id,
        read,
        read_at,
        notifications (*)
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (recipientError) {
      console.error('Error fetching notifications:', recipientError);
      return [];
    }

    // Also fetch direct notifications and role-based notifications
    const { data: directData, error: directError } = await supabase
      .from('notifications')
      .select('*')
      .or(`recipient_user_id.eq.${userId},recipient_type.eq.role.and(recipient_role.eq.${userRole}),recipient_type.eq.all`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (directError) {
      console.warn('Error fetching direct notifications:', directError);
    }

    // Combine and deduplicate
    const allNotifications: Notification[] = [];
    const seenIds = new Set<string>();

    if (recipientData) {
      recipientData.forEach(item => {
        if (item.notifications && !seenIds.has(item.notifications.id)) {
          allNotifications.push({
            ...item.notifications,
            read: item.read,
            read_at: item.read_at
          } as Notification);
          seenIds.add(item.notifications.id);
        }
      });
    }

    if (directData) {
      directData.forEach(notif => {
        if (!seenIds.has(notif.id)) {
          allNotifications.push(notif as Notification);
          seenIds.add(notif.id);
        }
      });
    }

    // Sort by created_at descending
    return allNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error in fetchUserNotifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('mark_notification_read', {
      p_notification_id: notificationId,
      p_user_id: userId
    });

    return !error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// ============ MESSAGES ============

export interface Message {
  id: string;
  sender_id: string;
  sender_name?: string;
  sender_role?: UserRole;
  recipient_id: string;
  recipient_name?: string;
  recipient_role?: UserRole;
  subject?: string;
  content: string;
  message_type: 'message' | 'reminder' | 'alert' | 'assignment';
  read: boolean;
  read_at?: string;
  replied_to_id?: string;
  created_at: string;
}

/**
 * Send a direct message (e.g., faculty to student)
 */
export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string,
  options?: {
    subject?: string;
    messageType?: 'message' | 'reminder' | 'alert' | 'assignment';
  }
): Promise<string | null> {
  try {
    // Get sender and recipient info
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, role')
      .in('id', [senderId, recipientId]);

    if (usersError || !users || users.length !== 2) {
      console.error('Error fetching user info:', usersError);
      return null;
    }

    const sender = users.find(u => u.id === senderId);
    const recipient = users.find(u => u.id === recipientId);

    if (!sender || !recipient) {
      console.error('Sender or recipient not found');
      return null;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        sender_name: sender.name,
        sender_role: sender.role,
        recipient_id: recipientId,
        recipient_name: recipient.name,
        recipient_role: recipient.role,
        subject: options?.subject,
        content,
        message_type: options?.messageType || 'message'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

/**
 * Fetch messages for current user (sent and received)
 */
export async function fetchUserMessages(userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return (data || []) as Message[];
  } catch (error) {
    console.error('Error in fetchUserMessages:', error);
    return [];
  }
}

/**
 * Mark message as read
 */
export async function markMessageRead(messageId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('recipient_id', userId);

    return !error;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}

// ============ ANNOUNCEMENTS ============

export interface Announcement {
  id: string;
  created_by: string;
  title: string;
  content: string;
  announcement_type: 'general' | 'exam' | 'holiday' | 'deadline' | 'important';
  target_audience: 'all' | 'students' | 'faculty' | 'admin' | 'specific';
  target_role?: UserRole;
  target_course?: string;
  target_semester?: string;
  target_department?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_pinned: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create an announcement (admin only)
 */
export async function createAnnouncement(
  createdBy: string,
  options: {
    title: string;
    content: string;
    announcementType?: 'general' | 'exam' | 'holiday' | 'deadline' | 'important';
    targetAudience: 'all' | 'students' | 'faculty' | 'admin' | 'specific';
    targetRole?: UserRole;
    targetCourse?: string;
    targetSemester?: string;
    targetDepartment?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    isPinned?: boolean;
    expiresAt?: string;
  }
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        created_by: createdBy,
        title: options.title,
        content: options.content,
        announcement_type: options.announcementType || 'general',
        target_audience: options.targetAudience,
        target_role: options.targetRole || null,
        target_course: options.targetCourse || null,
        target_semester: options.targetSemester || null,
        target_department: options.targetDepartment || null,
        priority: options.priority || 'normal',
        is_pinned: options.isPinned || false,
        expires_at: options.expiresAt || null
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in createAnnouncement:', error);
    return null;
  }
}

/**
 * Fetch announcements visible to current user
 */
export async function fetchAnnouncements(userRole: UserRole, filters?: {
  course?: string;
  semester?: string;
  department?: string;
}): Promise<Announcement[]> {
  try {
    let query = supabase
      .from('announcements')
      .select('*')
      .or(`target_audience.eq.all,target_audience.eq.${userRole === 'student' ? 'students' : userRole === 'faculty' ? 'faculty' : 'admin'}`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    // Apply filters if provided
    if (filters?.course) {
      query = query.or(`target_course.is.null,target_course.eq.${filters.course}`);
    }
    if (filters?.semester) {
      query = query.or(`target_semester.is.null,target_semester.eq.${filters.semester}`);
    }
    if (filters?.department) {
      query = query.or(`target_department.is.null,target_department.eq.${filters.department}`);
    }

    // Filter out expired announcements
    query = query.or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }

    return (data || []) as Announcement[];
  } catch (error) {
    console.error('Error in fetchAnnouncements:', error);
    return [];
  }
}

/**
 * Mark announcement as viewed
 */
export async function markAnnouncementViewed(announcementId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('announcement_views')
      .insert({
        announcement_id: announcementId,
        user_id: userId
      })
      .select()
      .single();

    return !error;
  } catch (error) {
    // Ignore duplicate key errors (already viewed)
    return true;
  }
}
