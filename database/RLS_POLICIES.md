# Row Level Security (RLS) Policies Documentation

## Overview

Row Level Security (RLS) is enabled on the `public.users` table to ensure that users can only access data they're authorized to see. All policies use Supabase's `auth.uid()` function to identify the current authenticated user.

## RLS Status

✅ **RLS is ENABLED** on `public.users` table

## Policies Configured

### 1. Users can view own profile
- **Type**: SELECT
- **Condition**: `auth.uid() = id`
- **Purpose**: Users can read their own profile data
- **Applies to**: All authenticated users

### 2. Users can update own profile
- **Type**: UPDATE
- **Condition**: 
  - `auth.uid() = id` (USING clause)
  - `auth.uid() = id AND role unchanged AND id unchanged` (WITH CHECK clause)
- **Purpose**: Users can update their own profile, but cannot change their role or ID
- **Applies to**: All authenticated users
- **Restrictions**: Cannot modify `role` or `id` fields

### 3. Admins can view all users
- **Type**: SELECT
- **Condition**: Current user's role is 'admin'
- **Purpose**: Admins can view all user profiles for management purposes
- **Applies to**: Users with role = 'admin'

### 4. Admins can update all users
- **Type**: UPDATE
- **Condition**: Current user's role is 'admin'
- **Purpose**: Admins can update any user profile for user management
- **Applies to**: Users with role = 'admin'
- **Note**: Admins can modify roles and other restricted fields

### 5. Faculty can view students
- **Type**: SELECT
- **Condition**: 
  - Target user's role is 'student'
  - Current user's role is 'faculty'
- **Purpose**: Faculty can view student profiles for grading and academic purposes
- **Applies to**: Users with role = 'faculty' viewing users with role = 'student'

### 6. System can insert users on signup
- **Type**: INSERT
- **Condition**: Always true (handled by trigger function)
- **Purpose**: Allows the `handle_new_user()` trigger function to create user profiles
- **Note**: The trigger function uses `SECURITY DEFINER` to bypass RLS, which is intentional

## Security Features

### Role Protection
- Users cannot change their own role
- Only admins can modify user roles
- Role is checked in UPDATE policies to prevent privilege escalation

### ID Protection
- Users cannot change their own ID
- ID is immutable once created
- ID is checked in UPDATE policies

### Automatic Profile Creation
- When a user signs up via Supabase Auth, the `handle_new_user()` trigger automatically creates a profile in `public.users`
- The trigger function uses `SECURITY DEFINER` to bypass RLS (this is safe because it only inserts based on the new auth user)

## Testing RLS Policies

### Test as Student
```sql
-- Should work: View own profile
SELECT * FROM public.users WHERE id = auth.uid();

-- Should work: Update own profile (non-restricted fields)
UPDATE public.users 
SET phone = '+1234567890' 
WHERE id = auth.uid();

-- Should fail: View other users
SELECT * FROM public.users WHERE role = 'faculty';

-- Should fail: Change own role
UPDATE public.users 
SET role = 'admin' 
WHERE id = auth.uid();
```

### Test as Faculty
```sql
-- Should work: View own profile
SELECT * FROM public.users WHERE id = auth.uid();

-- Should work: View students
SELECT * FROM public.users WHERE role = 'student';

-- Should fail: View other faculty
SELECT * FROM public.users WHERE role = 'faculty' AND id != auth.uid();

-- Should fail: View admins
SELECT * FROM public.users WHERE role = 'admin';
```

### Test as Admin
```sql
-- Should work: View all users
SELECT * FROM public.users;

-- Should work: Update any user
UPDATE public.users 
SET role = 'faculty' 
WHERE id = 'some-user-id';

-- Should work: View own profile
SELECT * FROM public.users WHERE id = auth.uid();
```

## Policy Evaluation Order

Supabase evaluates policies using OR logic - if ANY policy allows access, the operation succeeds. This means:

1. A user can view their own profile (Policy 1) OR
2. An admin can view all users (Policy 3) OR
3. Faculty can view students (Policy 5)

For UPDATE operations:
1. A user can update their own profile (Policy 2) OR
2. An admin can update any user (Policy 4)

## Best Practices

1. ✅ Always use `auth.uid()` to identify the current user
2. ✅ Check user roles in policies using EXISTS subqueries
3. ✅ Use WITH CHECK clauses to prevent privilege escalation
4. ✅ Test policies with different user roles
5. ✅ Document any SECURITY DEFINER functions

## Migration Files

- `001_create_users_table.sql` - Initial RLS setup
- `003_enhance_rls_policies.sql` - Enhanced policies (optional, for existing databases)

## Troubleshooting

### "Permission denied" errors
- Check that RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- Verify user is authenticated: `SELECT auth.uid();`
- Check user's role: `SELECT role FROM public.users WHERE id = auth.uid();`

### Policies not working
- Ensure policies are created: `SELECT * FROM pg_policies WHERE tablename = 'users';`
- Check policy conditions are correct
- Verify user has the expected role

### Trigger not creating profiles
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Verify function is SECURITY DEFINER: `SELECT prosecdef FROM pg_proc WHERE proname = 'handle_new_user';`
