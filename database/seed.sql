-- Master seed script for EduSync Portal
-- This script runs all individual seed files in the correct order

-- Run individual seed files
\i seeds/01_users.sql
\i seeds/02_departments_programs.sql
\i seeds/03_subjects.sql
\i seeds/04_academic_calendar.sql
\i seeds/05_exam_setup.sql
\i seeds/06_buildings_classrooms.sql
\i seeds/07_supervision_duties.sql

-- Verify successful seeding
DO $$
BEGIN
  -- Check if all required tables have data
  IF EXISTS (
    SELECT 1 FROM users WHERE user_type IN ('admin', 'faculty', 'student')
    AND EXISTS (SELECT 1 FROM departments)
    AND EXISTS (SELECT 1 FROM programs)
    AND EXISTS (SELECT 1 FROM subjects)
    AND EXISTS (SELECT 1 FROM academic_years)
    AND EXISTS (SELECT 1 FROM exam_schedules)
    AND EXISTS (SELECT 1 FROM buildings)
    AND EXISTS (SELECT 1 FROM supervision_duties)
  ) THEN
    RAISE NOTICE 'Database seeding completed successfully!';
  ELSE
    RAISE EXCEPTION 'Database seeding failed! Please check the individual seed files.';
  END IF;
END $$;
