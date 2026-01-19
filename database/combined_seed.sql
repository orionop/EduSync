-- Combined seed file for EduSync Portal
-- This file contains all seed data in a single file for easy copy-paste into Supabase SQL Editor

-- Users
INSERT INTO users (id, email, password_hash, user_type, first_name, last_name, phone_number, is_active, last_login)
VALUES
  -- Admin users
  ('ADM001', 'admin@edusync.com', '$2a$10$your_hashed_password', 'admin', 'Admin', 'User', '+1234567890', true, NOW()),
  ('ADM002', 'coordinator@edusync.com', '$2a$10$your_hashed_password', 'admin', 'Exam', 'Coordinator', '+1234567891', true, NOW()),
  
  -- Faculty users
  ('FAC001', 'john.doe@edusync.com', '$2a$10$your_hashed_password', 'faculty', 'John', 'Doe', '+1234567892', true, NOW()),
  ('FAC002', 'jane.smith@edusync.com', '$2a$10$your_hashed_password', 'faculty', 'Jane', 'Smith', '+1234567893', true, NOW()),
  ('FAC003', 'mike.wilson@edusync.com', '$2a$10$your_hashed_password', 'faculty', 'Mike', 'Wilson', '+1234567894', true, NOW()),
  
  -- Student users
  ('STU001', 'alice.johnson@edusync.com', '$2a$10$your_hashed_password', 'student', 'Alice', 'Johnson', '+1234567895', true, NOW()),
  ('STU002', 'bob.brown@edusync.com', '$2a$10$your_hashed_password', 'student', 'Bob', 'Brown', '+1234567896', true, NOW()),
  ('STU003', 'carol.white@edusync.com', '$2a$10$your_hashed_password', 'student', 'Carol', 'White', '+1234567897', true, NOW());

-- Students
INSERT INTO students (id, roll_number, registration_number, branch, program, current_semester, admission_year, date_of_birth, parent_guardian_name, parent_guardian_contact, address)
VALUES
  ('STU001', 'CSE2023001', 'REG2023001', 'Computer Science', 'B.Tech', 1, 2023, '2000-01-15', 'John Johnson', '+1234567898', '123 Main St, City'),
  ('STU002', 'CSE2023002', 'REG2023002', 'Computer Science', 'B.Tech', 1, 2023, '2000-02-20', 'Mary Brown', '+1234567899', '456 Oak St, City'),
  ('STU003', 'ECE2023001', 'REG2023003', 'Electronics', 'B.Tech', 1, 2023, '2000-03-25', 'Peter White', '+1234567900', '789 Pine St, City');

-- Faculty
INSERT INTO faculty (id, employee_id, department, designation, joining_date, specialization, qualification, experience_years)
VALUES
  ('FAC001', 'EMP001', 'Computer Science', 'Professor', '2020-01-01', 'Database Systems', 'Ph.D.', 10),
  ('FAC002', 'EMP002', 'Electronics', 'Associate Professor', '2021-01-01', 'Digital Electronics', 'Ph.D.', 8),
  ('FAC003', 'EMP003', 'Computer Science', 'Assistant Professor', '2022-01-01', 'Machine Learning', 'M.Tech.', 5);

-- Admins
INSERT INTO admins (id, employee_id, department, role, permissions)
VALUES
  ('ADM001', 'ADM001', 'Administration', 'Super Admin', '{"all": true}'::jsonb),
  ('ADM002', 'ADM002', 'Examination', 'Exam Coordinator', '{"exam_management": true, "hall_ticket": true, "results": true}'::jsonb);

-- Departments
INSERT INTO departments (id, name, code, hod_id, description)
VALUES
  ('DEPT001', 'Computer Science', 'CSE', 'FAC001', 'Department of Computer Science and Engineering'),
  ('DEPT002', 'Electronics', 'ECE', 'FAC002', 'Department of Electronics and Communication Engineering'),
  ('DEPT003', 'Mathematics', 'MATH', 'FAC003', 'Department of Mathematics');

-- Programs
INSERT INTO programs (id, name, code, department_id, duration_years, total_semesters, degree_type)
VALUES
  ('PROG001', 'Bachelor of Technology in Computer Science', 'BTECH_CSE', 'DEPT001', 4, 8, 'B.Tech'),
  ('PROG002', 'Bachelor of Technology in Electronics', 'BTECH_ECE', 'DEPT002', 4, 8, 'B.Tech'),
  ('PROG003', 'Master of Technology in Computer Science', 'MTECH_CSE', 'DEPT001', 2, 4, 'M.Tech');

-- Subjects
INSERT INTO subjects (id, code, name, department_id, credits, category, semester, description, syllabus_url)
VALUES
  -- Computer Science Subjects
  ('SUB001', 'CS101', 'Programming Fundamentals', 'DEPT001', 4, 'core', 1, 'Introduction to programming concepts', 'https://example.com/syllabus/cs101'),
  ('SUB002', 'CS102', 'Data Structures', 'DEPT001', 4, 'core', 2, 'Basic data structures and algorithms', 'https://example.com/syllabus/cs102'),
  ('SUB003', 'CS201', 'Database Systems', 'DEPT001', 4, 'core', 3, 'Database design and SQL', 'https://example.com/syllabus/cs201'),
  ('SUB004', 'CS202', 'Computer Networks', 'DEPT001', 4, 'core', 4, 'Network protocols and architecture', 'https://example.com/syllabus/cs202'),
  ('SUB005', 'CS301', 'Machine Learning', 'DEPT001', 3, 'elective', 5, 'Introduction to ML algorithms', 'https://example.com/syllabus/cs301'),
  ('SUB006', 'CS302', 'Cloud Computing', 'DEPT001', 3, 'elective', 6, 'Cloud platforms and services', 'https://example.com/syllabus/cs302'),
  
  -- Electronics Subjects
  ('SUB007', 'EC101', 'Digital Electronics', 'DEPT002', 4, 'core', 1, 'Digital logic and circuits', 'https://example.com/syllabus/ec101'),
  ('SUB008', 'EC102', 'Analog Electronics', 'DEPT002', 4, 'core', 2, 'Analog circuit design', 'https://example.com/syllabus/ec102'),
  ('SUB009', 'EC201', 'Communication Systems', 'DEPT002', 4, 'core', 3, 'Analog and digital communication', 'https://example.com/syllabus/ec201'),
  ('SUB010', 'EC202', 'Control Systems', 'DEPT002', 4, 'core', 4, 'Control system analysis', 'https://example.com/syllabus/ec202'),
  
  -- Mathematics Subjects
  ('SUB011', 'MATH101', 'Engineering Mathematics', 'DEPT003', 4, 'core', 1, 'Basic engineering mathematics', 'https://example.com/syllabus/math101'),
  ('SUB012', 'MATH102', 'Linear Algebra', 'DEPT003', 3, 'core', 2, 'Matrix operations and linear transformations', 'https://example.com/syllabus/math102');

-- Program Subjects
INSERT INTO program_subjects (id, program_id, subject_id, is_mandatory)
VALUES
  -- B.Tech CSE Program
  ('PS001', 'PROG001', 'SUB001', true),
  ('PS002', 'PROG001', 'SUB002', true),
  ('PS003', 'PROG001', 'SUB003', true),
  ('PS004', 'PROG001', 'SUB004', true),
  ('PS005', 'PROG001', 'SUB005', false),
  ('PS006', 'PROG001', 'SUB006', false),
  ('PS007', 'PROG001', 'SUB011', true),
  ('PS008', 'PROG001', 'SUB012', true),
  
  -- B.Tech ECE Program
  ('PS009', 'PROG002', 'SUB007', true),
  ('PS010', 'PROG002', 'SUB008', true),
  ('PS011', 'PROG002', 'SUB009', true),
  ('PS012', 'PROG002', 'SUB010', true),
  ('PS013', 'PROG002', 'SUB011', true),
  ('PS014', 'PROG002', 'SUB012', true);

-- Academic Years
INSERT INTO academic_years (id, year_name, start_date, end_date, is_current)
VALUES
  ('AY2023', '2023-24', '2023-06-01', '2024-05-31', true),
  ('AY2024', '2024-25', '2024-06-01', '2025-05-31', false);

-- Academic Terms
INSERT INTO academic_terms (id, academic_year_id, term_name, start_date, end_date, is_current)
VALUES
  -- 2023-24 Academic Year
  ('T2023_1', 'AY2023', 'Fall 2023', '2023-06-01', '2023-11-30', false),
  ('T2023_2', 'AY2023', 'Spring 2024', '2023-12-01', '2024-05-31', true),
  
  -- 2024-25 Academic Year
  ('T2024_1', 'AY2024', 'Fall 2024', '2024-06-01', '2024-11-30', false),
  ('T2024_2', 'AY2024', 'Spring 2025', '2024-12-01', '2025-05-31', false);

-- Exam Types
INSERT INTO exam_types (id, name, description, max_marks, passing_marks, weightage)
VALUES
  ('ET001', 'Mid Semester Examination', 'Internal assessment examination', 50, 20, 30.00),
  ('ET002', 'End Semester Examination', 'Final examination', 100, 40, 70.00),
  ('ET003', 'Laboratory Examination', 'Practical examination', 50, 20, 30.00);

-- Exam Schedules
INSERT INTO exam_schedules (id, academic_term_id, exam_type_id, name, start_date, end_date, registration_start_date, registration_end_date)
VALUES
  ('ES001', 'T2023_2', 'ET002', 'Spring 2024 End Semester Examination', '2024-04-01', '2024-04-30', '2024-02-01', '2024-02-28'),
  ('ES002', 'T2023_2', 'ET001', 'Spring 2024 Mid Semester Examination', '2024-02-15', '2024-02-28', '2024-01-15', '2024-01-31');

-- Exam Timetables
INSERT INTO exam_timetables (id, exam_schedule_id, program_id, semester)
VALUES
  ('ETT001', 'ES001', 'PROG001', 1),
  ('ETT002', 'ES001', 'PROG001', 2),
  ('ETT003', 'ES001', 'PROG002', 1),
  ('ETT004', 'ES001', 'PROG002', 2);

-- Exam Days
INSERT INTO exam_days (id, timetable_id, date, type, subject_id, time_slot, duration_minutes)
VALUES
  -- Spring 2024 End Semester Examination
  ('ED001', 'ETT001', '2024-04-01', 'EXAM', 'SUB001', '09:00-12:00', 180),
  ('ED002', 'ETT001', '2024-04-02', 'EXAM', 'SUB002', '09:00-12:00', 180),
  ('ED003', 'ETT001', '2024-04-03', 'STUDY_LEAVE', NULL, '09:00-17:00', 480),
  ('ED004', 'ETT001', '2024-04-04', 'EXAM', 'SUB003', '09:00-12:00', 180),
  ('ED005', 'ETT001', '2024-04-05', 'EXAM', 'SUB004', '09:00-12:00', 180);

-- Exam Applications
INSERT INTO exam_applications (id, student_id, exam_schedule_id, semester, status, submitted_at, processed_at, processed_by, payment_status, payment_amount, payment_reference)
VALUES
  ('EA001', 'STU001', 'ES001', 1, 'approved', '2024-02-15 10:00:00', '2024-02-16 14:30:00', 'ADM001', 'completed', 1000.00, 'PAY123456'),
  ('EA002', 'STU002', 'ES001', 1, 'approved', '2024-02-15 11:00:00', '2024-02-16 15:00:00', 'ADM001', 'completed', 1000.00, 'PAY123457'),
  ('EA003', 'STU003', 'ES001', 1, 'pending', '2024-02-15 12:00:00', NULL, NULL, 'pending', 1000.00, NULL);

-- Application Subjects
INSERT INTO application_subjects (id, application_id, subject_id)
VALUES
  ('AS001', 'EA001', 'SUB001'),
  ('AS002', 'EA001', 'SUB002'),
  ('AS003', 'EA001', 'SUB003'),
  ('AS004', 'EA001', 'SUB004'),
  ('AS005', 'EA002', 'SUB001'),
  ('AS006', 'EA002', 'SUB002'),
  ('AS007', 'EA002', 'SUB003'),
  ('AS008', 'EA002', 'SUB004'),
  ('AS009', 'EA003', 'SUB001'),
  ('AS010', 'EA003', 'SUB002'),
  ('AS011', 'EA003', 'SUB003'),
  ('AS012', 'EA003', 'SUB004');

-- Hall Tickets
INSERT INTO hall_tickets (id, application_id, issue_date, is_valid, pdf_url)
VALUES
  ('HT001', 'EA001', '2024-03-15', true, 'https://example.com/halltickets/HT001.pdf'),
  ('HT002', 'EA002', '2024-03-15', true, 'https://example.com/halltickets/HT002.pdf');

-- Buildings
INSERT INTO buildings (id, name, code, location, floors)
VALUES
  ('BLD001', 'Main Academic Block', 'MAB', 'Central Campus', 5),
  ('BLD002', 'Science Block', 'SB', 'East Campus', 3),
  ('BLD003', 'Engineering Block', 'EB', 'West Campus', 4);

-- Classrooms
INSERT INTO classrooms (id, building_id, room_number, floor, capacity, number_of_benches, is_exam_ready)
VALUES
  -- Main Academic Block
  ('CLR001', 'BLD001', '101', 1, 60, 30, true),
  ('CLR002', 'BLD001', '102', 1, 60, 30, true),
  ('CLR003', 'BLD001', '201', 2, 60, 30, true),
  ('CLR004', 'BLD001', '202', 2, 60, 30, true),
  
  -- Science Block
  ('CLR005', 'BLD002', '101', 1, 40, 20, true),
  ('CLR006', 'BLD002', '102', 1, 40, 20, true),
  
  -- Engineering Block
  ('CLR007', 'BLD003', '101', 1, 80, 40, true),
  ('CLR008', 'BLD003', '102', 1, 80, 40, true);

-- Seating Arrangements
INSERT INTO seating_arrangements (id, exam_day_id, classroom_id, created_by)
VALUES
  ('SA001', 'ED001', 'CLR001', 'ADM001'),
  ('SA002', 'ED001', 'CLR002', 'ADM001'),
  ('SA003', 'ED002', 'CLR003', 'ADM001'),
  ('SA004', 'ED002', 'CLR004', 'ADM001');

-- Bench Arrangements
INSERT INTO bench_arrangements (id, seating_arrangement_id, bench_number)
VALUES
  -- Seating Arrangement 1
  ('BA001', 'SA001', 1),
  ('BA002', 'SA001', 2),
  ('BA003', 'SA001', 3),
  ('BA004', 'SA001', 4),
  ('BA005', 'SA001', 5),
  
  -- Seating Arrangement 2
  ('BA006', 'SA002', 1),
  ('BA007', 'SA002', 2),
  ('BA008', 'SA002', 3),
  ('BA009', 'SA002', 4),
  ('BA010', 'SA002', 5);

-- Student Positions
INSERT INTO student_positions (id, bench_arrangement_id, student_id, position, attendance_status)
VALUES
  -- Bench Arrangement 1
  ('SP001', 'BA001', 'STU001', 'LEFT', 'present'),
  ('SP002', 'BA001', 'STU002', 'RIGHT', 'present'),
  ('SP003', 'BA002', 'STU003', 'LEFT', 'absent');

-- Faculty Non-Availability Slots
INSERT INTO faculty_non_availability (id, faculty_id, date, time_slot, reason)
VALUES
  ('FNA001', 'FAC001', '2024-04-01', '09:00-12:00', 'Department Meeting'),
  ('FNA002', 'FAC002', '2024-04-02', '09:00-12:00', 'Research Work'),
  ('FNA003', 'FAC003', '2024-04-03', '09:00-12:00', 'Conference');

-- Supervision Duty Types
INSERT INTO supervision_duty_types (id, name, description, priority, faculty_count_required)
VALUES
  ('SDT001', 'Chief Superintendent', 'Overall in-charge of examination hall', 1, 1),
  ('SDT002', 'Hall Superintendent', 'In-charge of specific examination hall', 2, 1),
  ('SDT003', 'Invigilator', 'Regular examination invigilator', 3, 2),
  ('SDT004', 'Relief Invigilator', 'Relief duty for regular invigilators', 4, 1);

-- Supervision Duties
INSERT INTO supervision_duties (id, seating_arrangement_id, duty_type_id, faculty_id, status, remarks)
VALUES
  -- Chief Superintendent
  ('SD001', 'SA001', 'SDT001', 'FAC001', 'confirmed', 'Chief Superintendent for Main Hall'),
  ('SD002', 'SA002', 'SDT001', 'FAC002', 'confirmed', 'Chief Superintendent for Science Hall'),
  
  -- Hall Superintendents
  ('SD003', 'SA001', 'SDT002', 'FAC002', 'confirmed', 'Hall Superintendent for Room 101'),
  ('SD004', 'SA002', 'SDT002', 'FAC003', 'confirmed', 'Hall Superintendent for Room 102'),
  
  -- Invigilators
  ('SD005', 'SA001', 'SDT003', 'FAC001', 'confirmed', 'Regular invigilator'),
  ('SD006', 'SA001', 'SDT003', 'FAC002', 'confirmed', 'Regular invigilator'),
  ('SD007', 'SA002', 'SDT003', 'FAC003', 'confirmed', 'Regular invigilator'),
  ('SD008', 'SA002', 'SDT003', 'FAC001', 'confirmed', 'Regular invigilator'),
  
  -- Relief Invigilators
  ('SD009', 'SA001', 'SDT004', 'FAC003', 'assigned', 'Relief duty for Room 101'),
  ('SD010', 'SA002', 'SDT004', 'FAC001', 'assigned', 'Relief duty for Room 102');

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
    RAISE EXCEPTION 'Database seeding failed! Please check the data.';
  END IF;
END $$; 