-- Fix: Database error querying schema
-- This script ensures all necessary tables, permissions, and policies are set up correctly

-- Step 1: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  phone TEXT,
  institution TEXT,
  photo_url TEXT,
  
  -- Student-specific fields
  student_id TEXT,
  roll_number TEXT,
  course TEXT,
  semester TEXT,
  division TEXT,
  cgpa NUMERIC(4, 2),
  
  -- Faculty-specific fields
  faculty_id TEXT,
  department TEXT,
  designation TEXT,
  specialization TEXT,
  
  -- Admin-specific fields
  admin_id TEXT,
  admin_role TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON public.users(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_faculty_id ON public.users(faculty_id) WHERE faculty_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON public.users(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_roll_number ON public.users(roll_number) WHERE roll_number IS NOT NULL;

-- Step 3: Grant schema permissions (CRITICAL - this is often missing)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON SCHEMA public TO anon, authenticated;

-- Step 4: Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Step 5: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Faculty can view students" ON public.users;
DROP POLICY IF EXISTS "System can insert users on signup" ON public.users;

-- Step 7: Create RLS policies
-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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

-- Policy 4: Admins can update all users
CREATE POLICY "Admins can update all users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 5: Faculty can view students
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

-- Policy 6: Allow inserts (for signup trigger)
CREATE POLICY "Allow user signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Step 8: Create/Update trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, institution)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'institution', 'EdVantage University')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 10: Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create update timestamp trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 12: Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Schema setup complete!';
  RAISE NOTICE 'Table exists: %', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'));
  RAISE NOTICE 'RLS enabled: %', (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users');
  RAISE NOTICE 'Policies count: %', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users');
END $$;
