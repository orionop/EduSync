-- Migration: Enhance RLS policies for users table
-- This adds additional security policies and ensures comprehensive access control

-- Drop existing policies if they exist (to allow re-running)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Faculty can view students" ON public.users;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (but not role or id)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their own role or id
    role = (SELECT role FROM public.users WHERE id = auth.uid()) AND
    id = auth.uid()
  );

-- Policy 3: Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 4: Admins can update all users (for user management)
CREATE POLICY "Admins can update all users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 5: Faculty can view students (for grading purposes)
CREATE POLICY "Faculty can view students"
  ON public.users
  FOR SELECT
  USING (
    role = 'student' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'faculty'
    )
  );

-- Policy 6: Allow the trigger function to insert users (SECURITY DEFINER)
-- This is handled by the trigger function being SECURITY DEFINER, but we add a policy for clarity
CREATE POLICY "System can insert users on signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true); -- The trigger function handles the actual security

-- Note: The trigger function `handle_new_user()` is SECURITY DEFINER,
-- which means it runs with the privileges of the function creator (superuser),
-- so it can bypass RLS. This is intentional for the signup flow.

-- Grant necessary permissions (if not already granted)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Comments
COMMENT ON POLICY "Users can view own profile" ON public.users IS 
  'Allows users to view their own profile';
COMMENT ON POLICY "Users can update own profile" ON public.users IS 
  'Allows users to update their own profile, but prevents role changes';
COMMENT ON POLICY "Admins can view all users" ON public.users IS 
  'Allows admins to view all user profiles';
COMMENT ON POLICY "Admins can update all users" ON public.users IS 
  'Allows admins to update any user profile for user management';
COMMENT ON POLICY "Faculty can view students" ON public.users IS 
  'Allows faculty to view student profiles for grading purposes';
