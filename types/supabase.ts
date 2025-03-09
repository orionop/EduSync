export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          user_type: 'admin' | 'faculty' | 'student'
          first_name: string
          last_name: string
          phone_number: string
          is_active: boolean
          last_login: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          password_hash: string
          user_type: 'admin' | 'faculty' | 'student'
          first_name: string
          last_name: string
          phone_number: string
          is_active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          user_type?: 'admin' | 'faculty' | 'student'
          first_name?: string
          last_name?: string
          phone_number?: string
          is_active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          roll_number: string
          registration_number: string
          branch: string
          program: string
          current_semester: number
          admission_year: number
          date_of_birth: string
          parent_guardian_name: string
          parent_guardian_contact: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          roll_number: string
          registration_number: string
          branch: string
          program: string
          current_semester: number
          admission_year: number
          date_of_birth: string
          parent_guardian_name: string
          parent_guardian_contact: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roll_number?: string
          registration_number?: string
          branch?: string
          program?: string
          current_semester?: number
          admission_year?: number
          date_of_birth?: string
          parent_guardian_name?: string
          parent_guardian_contact?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      exam_applications: {
        Row: {
          id: string
          student_id: string
          exam_schedule_id: string
          semester: number
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          processed_at: string | null
          processed_by: string | null
          payment_status: 'pending' | 'completed' | 'failed'
          payment_amount: number
          payment_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          student_id: string
          exam_schedule_id: string
          semester: number
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_amount: number
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          exam_schedule_id?: string
          semester?: number
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_amount?: number
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      application_subjects: {
        Row: {
          id: string
          application_id: string
          subject_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          application_id: string
          subject_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          subject_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 