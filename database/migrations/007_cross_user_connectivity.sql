-- Migration: Enable Cross-User Connectivity Across Portals
-- This enables communication and data sharing between different users (admin→students, admin→faculty, faculty→students)
-- NOT for multi-role users - each user has ONE role, but they can communicate across portals

-- Step 1: Enhanced notifications table with recipient targeting
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_name TEXT,
  sender_role TEXT CHECK (sender_role IN ('student', 'faculty', 'admin')),
  
  -- Recipient targeting (flexible targeting options)
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('all', 'role', 'specific', 'group')),
  recipient_role TEXT CHECK (recipient_role IN ('student', 'faculty', 'admin')), -- For 'role' type
  recipient_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- For 'specific' type
  recipient_group_id UUID, -- For 'group' type (future: student groups, classes, etc.)
  
  type TEXT NOT NULL CHECK (type IN ('info', 'request', 'announcement', 'system', 'message')),
  category TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Action/response fields
  action_required BOOLEAN DEFAULT false,
  action_url TEXT, -- Link to relevant page
  metadata JSONB, -- Flexible additional data
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON public.notifications(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_user_id ON public.notifications(recipient_user_id) WHERE recipient_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON public.notifications(recipient_role) WHERE recipient_role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_type ON public.notifications(recipient_type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(recipient_user_id, read) WHERE recipient_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority, created_at DESC);

-- Step 2: Create notification_recipients junction table for efficient querying
CREATE TABLE IF NOT EXISTS public.notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, recipient_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification_id ON public.notification_recipients(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_recipient_id ON public.notification_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_read ON public.notification_recipients(recipient_id, read);

-- Step 3: Create messages table for direct faculty→student communication
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_name TEXT,
  sender_role TEXT CHECK (sender_role IN ('student', 'faculty', 'admin')),
  
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_name TEXT,
  recipient_role TEXT CHECK (recipient_role IN ('student', 'faculty', 'admin')),
  
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'reminder', 'alert', 'assignment')),
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  replied_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL, -- For threading
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, recipient_id, created_at DESC);

-- Step 4: Create announcement_targets for admin announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT DEFAULT 'general' CHECK (announcement_type IN ('general', 'exam', 'holiday', 'deadline', 'important')),
  
  -- Targeting
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'students', 'faculty', 'admin', 'specific')),
  target_role TEXT CHECK (target_role IN ('student', 'faculty', 'admin')),
  target_course TEXT, -- For course-specific announcements
  target_semester TEXT, -- For semester-specific announcements
  target_department TEXT, -- For department-specific announcements
  
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_pinned BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_target_role ON public.announcements(target_role);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON public.announcements(is_pinned, created_at DESC);

-- Step 5: Create announcement_views to track who has seen announcements
CREATE TABLE IF NOT EXISTS public.announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_views_announcement_id ON public.announcement_views(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_views_user_id ON public.announcement_views(user_id);

-- Step 6: Enhanced supervisory_duties with cross-user visibility
CREATE TABLE IF NOT EXISTS public.supervisory_duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_id UUID,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  classroom TEXT NOT NULL,
  subject_code TEXT,
  subject_name TEXT,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled', 'swapped')),
  
  -- Admin assignment tracking
  assigned_by UUID REFERENCES public.users(id), -- Admin who assigned
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Faculty confirmation
  confirmed_by UUID REFERENCES public.users(id), -- Faculty who confirmed
  confirmed_at TIMESTAMPTZ,
  
  swap_request_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supervisory_duties_faculty_id ON public.supervisory_duties(faculty_id);
CREATE INDEX IF NOT EXISTS idx_supervisory_duties_assigned_by ON public.supervisory_duties(assigned_by);
CREATE INDEX IF NOT EXISTS idx_supervisory_duties_date ON public.supervisory_duties(date);
CREATE INDEX IF NOT EXISTS idx_supervisory_duties_status ON public.supervisory_duties(status);

-- Step 7: Enhanced seating_arrangements with cross-user visibility
CREATE TABLE IF NOT EXISTS public.seating_arrangements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  classroom TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  exam_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  hall_ticket_id UUID,
  
  -- Admin assignment tracking
  assigned_by UUID REFERENCES public.users(id), -- Admin who assigned
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, exam_date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_seating_arrangements_student_id ON public.seating_arrangements(student_id);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_assigned_by ON public.seating_arrangements(assigned_by);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_exam_date ON public.seating_arrangements(exam_date);
CREATE INDEX IF NOT EXISTS idx_seating_arrangements_classroom ON public.seating_arrangements(classroom, exam_date);

-- Step 8: Holidays table (shared across all users)
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

-- Step 9: Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisory_duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Step 10: RLS Policies for notifications
-- Users can view notifications sent to them
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (
    recipient_user_id = auth.uid() OR
    id IN (
      SELECT notification_id FROM public.notification_recipients
      WHERE recipient_id = auth.uid()
    )
  );

-- Users can view notifications sent to their role
CREATE POLICY "Users can view role-based notifications"
  ON public.notifications FOR SELECT
  USING (
    recipient_type = 'role' AND
    recipient_role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- Admins can create notifications
CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 11: RLS Policies for notification_recipients
CREATE POLICY "Users can view own notification recipients"
  ON public.notification_recipients FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notification read status"
  ON public.notification_recipients FOR UPDATE
  USING (recipient_id = auth.uid());

-- Step 12: RLS Policies for messages
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own received messages"
  ON public.messages FOR UPDATE
  USING (recipient_id = auth.uid());

-- Step 13: RLS Policies for announcements
CREATE POLICY "Everyone can view announcements"
  ON public.announcements FOR SELECT
  USING (
    target_audience = 'all' OR
    (target_audience = 'role' AND target_role = (SELECT role FROM public.users WHERE id = auth.uid())) OR
    (target_audience = 'students' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'student') OR
    (target_audience = 'faculty' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'faculty')
  );

CREATE POLICY "Admins can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 14: RLS Policies for announcement_views
CREATE POLICY "Users can view own announcement views"
  ON public.announcement_views FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own announcement views"
  ON public.announcement_views FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Step 15: RLS Policies for supervisory_duties
CREATE POLICY "Faculty can view own duties"
  ON public.supervisory_duties FOR SELECT
  USING (faculty_id = auth.uid());

CREATE POLICY "Admins can view all duties"
  ON public.supervisory_duties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage duties"
  ON public.supervisory_duties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 16: RLS Policies for seating_arrangements
CREATE POLICY "Students can view own seating"
  ON public.seating_arrangements FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all seating"
  ON public.seating_arrangements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage seating"
  ON public.seating_arrangements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 17: RLS Policies for holidays
CREATE POLICY "Everyone can view holidays"
  ON public.holidays FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage holidays"
  ON public.holidays FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 18: Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notification_recipients TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.announcements TO authenticated;
GRANT SELECT, INSERT ON public.announcement_views TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.supervisory_duties TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.seating_arrangements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.holidays TO authenticated;

GRANT SELECT ON public.holidays TO anon;
GRANT SELECT ON public.announcements TO anon;

-- Step 19: Function to create notification and populate recipients
CREATE OR REPLACE FUNCTION public.create_notification_with_recipients(
  p_sender_id UUID,
  p_recipient_type TEXT,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_recipient_role TEXT DEFAULT NULL,
  p_recipient_user_id UUID DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_recipient_ids UUID[];
BEGIN
  -- Create notification
  INSERT INTO public.notifications (
    sender_id,
    sender_name,
    sender_role,
    recipient_type,
    recipient_role,
    recipient_user_id,
    type,
    category,
    title,
    message,
    priority
  )
  SELECT 
    p_sender_id,
    u.name,
    u.role,
    p_recipient_type,
    p_recipient_role,
    p_recipient_user_id,
    p_type,
    p_category,
    p_title,
    p_message,
    p_priority
  FROM public.users u
  WHERE u.id = p_sender_id
  RETURNING id INTO v_notification_id;

  -- Determine recipients based on recipient_type
  IF p_recipient_type = 'all' THEN
    -- All users
    SELECT ARRAY_AGG(id) INTO v_recipient_ids FROM public.users;
  ELSIF p_recipient_type = 'role' AND p_recipient_role IS NOT NULL THEN
    -- All users with specific role
    SELECT ARRAY_AGG(id) INTO v_recipient_ids 
    FROM public.users 
    WHERE role = p_recipient_role;
  ELSIF p_recipient_type = 'specific' AND p_recipient_user_id IS NOT NULL THEN
    -- Single user
    v_recipient_ids := ARRAY[p_recipient_user_id];
  END IF;

  -- Insert into notification_recipients
  IF v_recipient_ids IS NOT NULL AND array_length(v_recipient_ids, 1) > 0 THEN
    INSERT INTO public.notification_recipients (notification_id, recipient_id)
    SELECT v_notification_id, unnest(v_recipient_ids)
    ON CONFLICT (notification_id, recipient_id) DO NOTHING;
  END IF;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 20: Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(
  p_notification_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update notification_recipients
  UPDATE public.notification_recipients
  SET read = true, read_at = NOW()
  WHERE notification_id = p_notification_id AND recipient_id = p_user_id;

  -- Also update direct notification if exists
  UPDATE public.notifications
  SET read = true, read_at = NOW()
  WHERE id = p_notification_id AND recipient_user_id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 21: Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supervisory_duties_updated_at
  BEFORE UPDATE ON public.supervisory_duties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seating_arrangements_updated_at
  BEFORE UPDATE ON public.seating_arrangements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON public.holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comments
COMMENT ON TABLE public.notifications IS 'Cross-portal notifications. Admin can send to all students/faculty, faculty can send to students.';
COMMENT ON TABLE public.messages IS 'Direct messages between users (e.g., faculty to students)';
COMMENT ON TABLE public.announcements IS 'Admin announcements visible to targeted audiences';
COMMENT ON TABLE public.supervisory_duties IS 'Supervisory duties visible to both assigned faculty and admins';
COMMENT ON TABLE public.seating_arrangements IS 'Seating arrangements visible to both students and admins';
COMMENT ON TABLE public.holidays IS 'Institutional holidays visible to all users';
