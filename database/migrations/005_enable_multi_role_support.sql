-- Migration: Enable Multi-Role Support and Cross-Portal Connectivity
-- This allows users to have multiple roles (student, faculty, admin) and ensures shared data flows across portals

-- Step 1: Create user_roles junction table for multi-role support
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_primary ON public.user_roles(user_id, is_primary) WHERE is_primary = true;

-- Step 2: Migrate existing single role to user_roles table
INSERT INTO public.user_roles (user_id, role, is_primary)
SELECT id, role, true
FROM public.users
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Create shared notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('student', 'faculty', 'admin', NULL)), -- NULL means all roles
  type TEXT NOT NULL CHECK (type IN ('info', 'request', 'announcement', 'system')),
  category TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sender_name TEXT,
  read BOOLEAN DEFAULT false,
  metadata JSONB, -- For flexible additional data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON public.notifications(role);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Step 4: Create supervisory_duties table (shared across admin/faculty)
CREATE TABLE IF NOT EXISTS public.supervisory_duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_id UUID, -- Reference to exam if exists
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  classroom TEXT NOT NULL,
  subject_code TEXT,
  subject_name TEXT,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled', 'swapped')),
  swap_request_id UUID, -- Reference to swap request if exists
  created_by UUID REFERENCES public.users(id), -- Admin who assigned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supervisory_duties_faculty_id ON public.supervisory_duties(faculty_id);
CREATE INDEX IF NOT EXISTS idx_supervisory_duties_date ON public.supervisory_duties(date);
CREATE INDEX IF NOT EXISTS idx_supervisory_duties_status ON public.supervisory_duties(status);

-- Step 5: Create duty_swap_requests table
CREATE TABLE IF NOT EXISTS public.duty_swap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_duty_id UUID NOT NULL REFERENCES public.supervisory_duties(id) ON DELETE CASCADE,
  requested_duty_id UUID REFERENCES public.supervisory_duties(id) ON DELETE SET NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_duty_swap_requests_requester ON public.duty_swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_duty_swap_requests_status ON public.duty_swap_requests(status);

-- Step 6: Create seating_arrangements table (shared across student/admin)
CREATE TABLE IF NOT EXISTS public.seating_arrangements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  classroom TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  exam_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  hall_ticket_id UUID, -- Reference to hall ticket
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, exam_date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_seating_arrangements_student_id ON public.seating_arrangements(student_id);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_exam_date ON public.seating_arrangements(exam_date);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_classroom ON public.seating_arrangements(classroom, exam_date);

-- Step 7: Create holidays table (shared across all roles)
CREATE TABLE IF NOT EXISTS public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'exam', 'institutional')),
  description TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_holidays_date ON public.holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_type ON public.holidays(type);

-- Step 8: Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisory_duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duty_swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Step 9: RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 10: RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR role IS NULL);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 11: RLS Policies for supervisory_duties
CREATE POLICY "Faculty can view own duties"
  ON public.supervisory_duties FOR SELECT
  USING (auth.uid() = faculty_id);

CREATE POLICY "Admins can view all duties"
  ON public.supervisory_duties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage duties"
  ON public.supervisory_duties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 12: RLS Policies for duty_swap_requests
CREATE POLICY "Users can view own swap requests"
  ON public.duty_swap_requests FOR SELECT
  USING (auth.uid() = requester_id);

CREATE POLICY "Users can create swap requests"
  ON public.duty_swap_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Admins can view all swap requests"
  ON public.duty_swap_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 13: RLS Policies for seating_arrangements
CREATE POLICY "Students can view own seating"
  ON public.seating_arrangements FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all seating"
  ON public.seating_arrangements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage seating"
  ON public.seating_arrangements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 14: RLS Policies for holidays
CREATE POLICY "Everyone can view holidays"
  ON public.holidays FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage holidays"
  ON public.holidays FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 15: Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.supervisory_duties TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.duty_swap_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.seating_arrangements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.holidays TO authenticated;

GRANT SELECT ON public.holidays TO anon;

-- Step 16: Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = user_uuid AND is_primary = true
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Step 17: Create function to get all user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID)
RETURNS TEXT[] AS $$
  SELECT ARRAY_AGG(role ORDER BY is_primary DESC, created_at)
  FROM public.user_roles
  WHERE user_id = user_uuid;
$$ LANGUAGE sql STABLE;

-- Step 18: Create function to check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(user_uuid UUID, check_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role = check_role
  );
$$ LANGUAGE sql STABLE;

-- Step 19: Add trigger to update updated_at for all new tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supervisory_duties_updated_at
  BEFORE UPDATE ON public.supervisory_duties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_duty_swap_requests_updated_at
  BEFORE UPDATE ON public.duty_swap_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seating_arrangements_updated_at
  BEFORE UPDATE ON public.seating_arrangements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON public.holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.user_roles IS 'Junction table for multi-role support. Users can have multiple roles (student, faculty, admin)';
COMMENT ON TABLE public.notifications IS 'Shared notifications table accessible across all user roles';
COMMENT ON TABLE public.supervisory_duties IS 'Supervisory duty assignments shared between admin and faculty portals';
COMMENT ON TABLE public.duty_swap_requests IS 'Requests to swap supervisory duties between faculty members';
COMMENT ON TABLE public.seating_arrangements IS 'Exam seating arrangements shared between student and admin portals';
COMMENT ON TABLE public.holidays IS 'Institutional holidays visible to all users across all portals';
