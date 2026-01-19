/**
 * Shared Data Service
 * Provides unified access to cross-portal data (duties, seating, holidays)
 * Data is visible to relevant users across different portals
 */

import { supabase } from './supabase';

// Note: Notifications are now handled by communicationService.ts
// This service focuses on shared data visibility (duties, seating, holidays)

// ============ SUPERVISORY DUTIES ============

export interface SupervisoryDuty {
  id: string;
  faculty_id: string;
  exam_id?: string;
  date: string;
  time_slot: string;
  classroom: string;
  subject_code?: string;
  subject_name?: string;
  status: 'assigned' | 'confirmed' | 'completed' | 'cancelled' | 'swapped';
  swap_request_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchSupervisoryDuties(facultyId: string): Promise<SupervisoryDuty[]> {
  try {
    const { data, error } = await supabase
      .from('supervisory_duties')
      .select('*')
      .eq('faculty_id', facultyId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching supervisory duties:', error);
      return [];
    }

    return (data || []) as SupervisoryDuty[];
  } catch (error) {
    console.error('Error in fetchSupervisoryDuties:', error);
    return [];
  }
}

export async function fetchAllSupervisoryDuties(): Promise<SupervisoryDuty[]> {
  try {
    const { data, error } = await supabase
      .from('supervisory_duties')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching all supervisory duties:', error);
      return [];
    }

    return (data || []) as SupervisoryDuty[];
  } catch (error) {
    console.error('Error in fetchAllSupervisoryDuties:', error);
    return [];
  }
}

// ============ SEATING ARRANGEMENTS ============

export interface SeatingArrangement {
  id: string;
  exam_id?: string;
  student_id: string;
  classroom: string;
  seat_number: string;
  exam_date: string;
  time_slot: string;
  hall_ticket_id?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchStudentSeating(studentId: string): Promise<SeatingArrangement[]> {
  try {
    const { data, error } = await supabase
      .from('seating_arrangements')
      .select('*')
      .eq('student_id', studentId)
      .order('exam_date', { ascending: true });

    if (error) {
      console.error('Error fetching seating arrangements:', error);
      return [];
    }

    return (data || []) as SeatingArrangement[];
  } catch (error) {
    console.error('Error in fetchStudentSeating:', error);
    return [];
  }
}

export async function fetchAllSeatingArrangements(examDate?: string): Promise<SeatingArrangement[]> {
  try {
    let query = supabase
      .from('seating_arrangements')
      .select('*');

    if (examDate) {
      query = query.eq('exam_date', examDate);
    }

    const { data, error } = await query.order('exam_date', { ascending: true });

    if (error) {
      console.error('Error fetching all seating arrangements:', error);
      return [];
    }

    return (data || []) as SeatingArrangement[];
  } catch (error) {
    console.error('Error in fetchAllSeatingArrangements:', error);
    return [];
  }
}

// ============ HOLIDAYS ============

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'general' | 'exam' | 'institutional';
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchHolidays(startDate?: string, endDate?: string): Promise<Holiday[]> {
  try {
    let query = supabase
      .from('holidays')
      .select('*');

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    } else if (startDate) {
      query = query.gte('date', startDate);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) {
      console.error('Error fetching holidays:', error);
      return [];
    }

    return (data || []) as Holiday[];
  } catch (error) {
    console.error('Error in fetchHolidays:', error);
    return [];
  }
}

// ============ DUTY SWAP REQUESTS ============

export interface DutySwapRequest {
  id: string;
  requester_id: string;
  target_duty_id: string;
  requested_duty_id?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchDutySwapRequests(userId: string): Promise<DutySwapRequest[]> {
  try {
    const { data, error } = await supabase
      .from('duty_swap_requests')
      .select('*')
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching duty swap requests:', error);
      return [];
    }

    return (data || []) as DutySwapRequest[];
  } catch (error) {
    console.error('Error in fetchDutySwapRequests:', error);
    return [];
  }
}

export async function fetchAllDutySwapRequests(): Promise<DutySwapRequest[]> {
  try {
    const { data, error } = await supabase
      .from('duty_swap_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all duty swap requests:', error);
      return [];
    }

    return (data || []) as DutySwapRequest[];
  } catch (error) {
    console.error('Error in fetchAllDutySwapRequests:', error);
    return [];
  }
}
