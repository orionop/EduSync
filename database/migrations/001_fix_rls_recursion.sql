-- Fix: Infinite recursion in RLS policies
-- The issue: Policies that check public.users while protecting public.users cause recursion
-- Solution: Use JWT claims or SECURITY DEFINER functions to avoid recursion

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Faculty can view students" ON public.users;
DROP POLICY IF EXISTS "Allow user signup" ON public.users;

-- Step 2: Create a helper function to get user role from JWT (avoids recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Try to get role from JWT claims first (set during login)
  RETURN COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb->>'role'),
    -- Fallback: query users table with SECURITY DEFINER to bypass RLS
    (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Step 3: Create simpler policies that avoid recursion

-- Policy 1: Users can read their own profile (no recursion - direct check)
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (no recursion - direct check)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can view all users (using function to avoid recursion)
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    public.get_user_role() = 'admin'
  );

-- Policy 4: Admins can update all users (using function to avoid recursion)
CREATE POLICY "Admins can update all users"
  ON public.users
  FOR UPDATE
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Policy 5: Faculty can view students (using function to avoid recursion)
CREATE POLICY "Faculty can view students"
  ON public.users
  FOR SELECT
  USING (
    role = 'student' AND public.get_user_role() = 'faculty'
  );

-- Policy 6: Allow inserts (for signup trigger - no recursion issue)
CREATE POLICY "Allow user signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Step 4: Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated, anon;

-- Step 5: Verify policies are created
DO $$
BEGIN
  RAISE NOTICE 'RLS policies fixed!';
  RAISE NOTICE 'Policy count: %', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users');
END $$;
