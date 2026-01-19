-- Migration: Create users table with role-based access
-- This table extends Supabase auth.users with additional profile information
-- Updated to include all fields used in the application

-- Create users table
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
  cgpa NUMERIC(4, 2), -- CGPA can be up to 10.00 (e.g., 9.47)
  
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON public.users(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_faculty_id ON public.users(faculty_id) WHERE faculty_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON public.users(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_roll_number ON public.users(roll_number) WHERE roll_number IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (but not role or id)
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

-- Policy: Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Faculty can view students (for grading purposes)
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

-- Policy: Admins can update all users (for user management)
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

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user updates
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users with role-based access';
COMMENT ON COLUMN public.users.role IS 'User role: student, faculty, or admin';
COMMENT ON COLUMN public.users.id IS 'References auth.users(id) - Supabase auth user ID';
COMMENT ON COLUMN public.users.cgpa IS 'Cumulative Grade Point Average (0.00 to 10.00)';
COMMENT ON COLUMN public.users.student_id IS 'Unique student identifier (e.g., STU2025001)';
COMMENT ON COLUMN public.users.faculty_id IS 'Unique faculty identifier (e.g., FAC2025001)';
COMMENT ON COLUMN public.users.admin_id IS 'Unique admin identifier (e.g., ADM2025001)';
