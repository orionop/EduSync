-- Diagnostic query to check if user profile exists
-- Run this in Supabase SQL Editor to check your user

-- Replace 'anurag@edv.ac.in' with your email
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at as auth_created_at,
  u.id as profile_id,
  u.name,
  u.role,
  u.student_id,
  u.course,
  u.semester
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.email = 'anurag@edv.ac.in';

-- If the profile doesn't exist, run this to create it:
-- (Replace the values with your actual data)
/*
INSERT INTO public.users (id, email, name, role, institution)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  COALESCE(au.raw_user_meta_data->>'role', 'student') as role,
  'EdVantage University' as institution
FROM auth.users au
WHERE au.email = 'anurag@edv.ac.in'
AND NOT EXISTS (
  SELECT 1 FROM public.users WHERE id = au.id
);
*/

-- After creating the profile, update it with your details:
/*
UPDATE public.users
SET 
  name = 'Anurag',
  role = 'student',
  student_id = 'STU001',
  course = 'B.Tech Computer Science',
  semester = '6th',
  roll_number = '2025CS001',
  division = 'A',
  institution = 'EdVantage University'
WHERE email = 'anurag@edv.ac.in';
*/
