-- Migration: Add missing fields to users table
-- This migration adds fields that were missing from the original schema
-- Run this if you already have the users table created

-- Add missing student fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'roll_number') THEN
    ALTER TABLE public.users ADD COLUMN roll_number TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'division') THEN
    ALTER TABLE public.users ADD COLUMN division TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'cgpa') THEN
    ALTER TABLE public.users ADD COLUMN cgpa NUMERIC(4, 2);
  END IF;
END $$;

-- Add missing faculty fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'faculty_id') THEN
    ALTER TABLE public.users ADD COLUMN faculty_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'department') THEN
    ALTER TABLE public.users ADD COLUMN department TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'designation') THEN
    ALTER TABLE public.users ADD COLUMN designation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'specialization') THEN
    ALTER TABLE public.users ADD COLUMN specialization TEXT;
  END IF;
END $$;

-- Add missing admin fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'admin_id') THEN
    ALTER TABLE public.users ADD COLUMN admin_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'admin_role') THEN
    ALTER TABLE public.users ADD COLUMN admin_role TEXT;
  END IF;
END $$;

-- Create additional indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_faculty_id ON public.users(faculty_id) WHERE faculty_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON public.users(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_roll_number ON public.users(roll_number) WHERE roll_number IS NOT NULL;

-- Update comments
COMMENT ON COLUMN public.users.cgpa IS 'Cumulative Grade Point Average (0.00 to 10.00)';
COMMENT ON COLUMN public.users.student_id IS 'Unique student identifier (e.g., STU2025001)';
COMMENT ON COLUMN public.users.faculty_id IS 'Unique faculty identifier (e.g., FAC2025001)';
COMMENT ON COLUMN public.users.admin_id IS 'Unique admin identifier (e.g., ADM2025001)';
