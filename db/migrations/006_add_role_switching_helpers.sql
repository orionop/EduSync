-- Migration: Add helper functions and views for role switching
-- This provides utilities for managing multi-role users

-- Function to add a role to a user
CREATE OR REPLACE FUNCTION public.add_user_role(
  user_uuid UUID,
  new_role TEXT,
  set_as_primary BOOLEAN DEFAULT false
)
RETURNS BOOLEAN AS $$
DECLARE
  role_exists BOOLEAN;
BEGIN
  -- Check if role is valid
  IF new_role NOT IN ('student', 'faculty', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_uuid) THEN
    RAISE EXCEPTION 'User does not exist: %', user_uuid;
  END IF;

  -- Check if role already exists
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role = new_role
  ) INTO role_exists;

  IF role_exists THEN
    RETURN false; -- Role already exists
  END IF;

  -- If setting as primary, unset other primary roles
  IF set_as_primary THEN
    UPDATE public.user_roles
    SET is_primary = false
    WHERE user_id = user_uuid;
  END IF;

  -- Insert new role
  INSERT INTO public.user_roles (user_id, role, is_primary)
  VALUES (user_uuid, new_role, set_as_primary)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove a role from a user
CREATE OR REPLACE FUNCTION public.remove_user_role(
  user_uuid UUID,
  role_to_remove TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  remaining_roles_count INTEGER;
  has_other_primary BOOLEAN;
BEGIN
  -- Don't allow removing the last role
  SELECT COUNT(*) INTO remaining_roles_count
  FROM public.user_roles
  WHERE user_id = user_uuid;

  IF remaining_roles_count <= 1 THEN
    RAISE EXCEPTION 'Cannot remove the last role from a user';
  END IF;

  -- Check if this is the primary role
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role = role_to_remove AND is_primary = true
  ) THEN
    -- Set another role as primary
    UPDATE public.user_roles
    SET is_primary = true
    WHERE user_id = user_uuid
      AND role != role_to_remove
    ORDER BY created_at
    LIMIT 1;
  END IF;

  -- Remove the role
  DELETE FROM public.user_roles
  WHERE user_id = user_uuid AND role = role_to_remove;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set primary role
CREATE OR REPLACE FUNCTION public.set_primary_role(
  user_uuid UUID,
  new_primary_role TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has this role
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role = new_primary_role
  ) THEN
    RAISE EXCEPTION 'User does not have role: %', new_primary_role;
  END IF;

  -- Unset all primary roles
  UPDATE public.user_roles
  SET is_primary = false
  WHERE user_id = user_uuid;

  -- Set new primary role
  UPDATE public.user_roles
  SET is_primary = true
  WHERE user_id = user_uuid AND role = new_primary_role;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for user roles summary
CREATE OR REPLACE VIEW public.user_roles_summary AS
SELECT 
  u.id,
  u.email,
  u.name,
  ur.role,
  ur.is_primary,
  ur.created_at as role_assigned_at,
  CASE 
    WHEN ur.role = 'student' THEN u.student_id
    WHEN ur.role = 'faculty' THEN u.faculty_id
    WHEN ur.role = 'admin' THEN u.admin_id
  END as role_specific_id
FROM public.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.id, ur.is_primary DESC, ur.created_at;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.add_user_role(UUID, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_primary_role(UUID, TEXT) TO authenticated;

-- Grant select on view
GRANT SELECT ON public.user_roles_summary TO authenticated;

-- Comments
COMMENT ON FUNCTION public.add_user_role IS 'Adds a role to a user. Only admins should call this.';
COMMENT ON FUNCTION public.remove_user_role IS 'Removes a role from a user. Cannot remove the last role.';
COMMENT ON FUNCTION public.set_primary_role IS 'Sets the primary role for a user. Used when switching portals.';
COMMENT ON VIEW public.user_roles_summary IS 'Summary view showing all users and their roles';
