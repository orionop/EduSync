# EduSync Database Seeding Instructions

This directory contains SQL scripts to seed the EduSync Portal database with demo data.

## Database Structure

The seed files are organized as follows:

1. `01_users.sql` - Users, Students, Faculty, and Admins
2. `02_departments_programs.sql` - Departments and Programs
3. `03_subjects.sql` - Subjects and Program-Subject relationships
4. `04_academic_calendar.sql` - Academic Years and Terms
5. `05_exam_setup.sql` - Exam Types, Schedules, Timetables, Applications, and Hall Tickets
6. `06_buildings_classrooms.sql` - Buildings, Classrooms, and Seating Arrangements
7. `07_supervision_duties.sql` - Supervision Duty Types and Assignments

## How to Seed the Database

### Option 1: Using Supabase SQL Editor (Recommended)

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the contents of `seed.sql` into the editor
5. Update the file paths in `seed.sql` to match your environment:
   ```sql
   -- Example: Change
   \i db/seeds/01_users.sql
   
   -- To (if you're uploading individual files)
   \i 01_users.sql
   ```
6. Execute the query

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Run the seed script
supabase db execute --project-ref YOUR_PROJECT_REF --file seed.sql
```

### Option 3: Manual Seeding

If the above options don't work, you can manually run each seed file in order:

1. Open the Supabase SQL Editor
2. Create a new query
3. Copy the contents of each seed file (in order from 01 to 07)
4. Execute each query separately

## Verifying the Seed

After running the seed scripts, you can verify that the data was inserted correctly by running:

```sql
-- Check user counts
SELECT user_type, COUNT(*) FROM users GROUP BY user_type;

-- Check exam applications
SELECT a.id, u.name, a.status 
FROM exam_applications a 
JOIN users u ON a.student_id = u.id;

-- Check seating arrangements
SELECT sa.id, c.room_number, ed.date, s.name
FROM seating_arrangements sa
JOIN classrooms c ON sa.classroom_id = c.id
JOIN exam_days ed ON sa.exam_day_id = ed.id
JOIN subjects s ON ed.subject_id = s.id;
```

## Resetting the Database

If you need to reset the database, you can run:

```sql
-- Reset script
TRUNCATE TABLE 
  supervision_duties,
  faculty_non_availability,
  student_positions,
  bench_arrangements,
  seating_arrangements,
  classrooms,
  buildings,
  hall_tickets,
  application_subjects,
  exam_applications,
  exam_days,
  exam_timetables,
  exam_schedules,
  exam_types,
  academic_terms,
  academic_years,
  program_subjects,
  subjects,
  programs,
  departments,
  students,
  faculty,
  admins,
  users
CASCADE;
``` 