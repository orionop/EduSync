-- Fix user profile for anurag@edv.ac.in
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists in auth.users and public.users
SELECT 
  'Auth User' as source,
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data
FROM auth.users au
WHERE au.email = 'anurag@edv.ac.in'

UNION ALL

SELECT 
  'Profile' as source,
  u.id,
  u.email,
  u.created_at,
  NULL as raw_user_meta_data
FROM public.users u
WHERE u.email = 'anurag@edv.ac.in';

-- Step 2: Create profile if it doesn't exist
-- This will create the profile from the auth user
INSERT INTO public.users (id, email, name, role, institution)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', 'Anurag') as name,
  COALESCE(au.raw_user_meta_data->>'role', 'admin') as role,
  'EdVantage University' as institution
FROM auth.users au
WHERE au.email = 'anurag@edv.ac.in'
AND NOT EXISTS (
  SELECT 1 FROM public.users WHERE id = au.id
)
RETURNING *;

-- Step 3: Update the profile with your details (Admin)
UPDATE public.users
SET 
  name = 'Anurag',
  role = 'admin',
  admin_id = 'ADM001',
  admin_role = 'Super Admin',
  institution = 'EdVantage University',
  phone = NULL,
  photo_url = NULL,
  -- Clear student fields
  student_id = NULL,
  course = NULL,
  semester = NULL,
  roll_number = NULL,
  division = NULL,
  cgpa = NULL,
  -- Clear faculty fields
  faculty_id = NULL,
  department = NULL,
  designation = NULL,
  specialization = NULL
WHERE email = 'anurag@edv.ac.in'
RETURNING *;

-- Step 4: Verify the profile
SELECT 
  id,
  email,
  name,
  role,
  admin_id,
  admin_role,
  institution
FROM public.users
WHERE email = 'anurag@edv.ac.in';
