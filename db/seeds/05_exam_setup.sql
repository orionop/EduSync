-- Insert Exam Types
INSERT INTO exam_types (id, name, description, max_marks, passing_marks, weightage)
VALUES
  ('ET001', 'Mid Semester Examination', 'Internal assessment examination', 50, 20, 30.00),
  ('ET002', 'End Semester Examination', 'Final examination', 100, 40, 70.00),
  ('ET003', 'Laboratory Examination', 'Practical examination', 50, 20, 30.00);

-- Insert Exam Schedules
INSERT INTO exam_schedules (id, academic_term_id, exam_type_id, name, start_date, end_date, registration_start_date, registration_end_date)
VALUES
  ('ES001', 'T2023_2', 'ET002', 'Spring 2024 End Semester Examination', '2024-04-01', '2024-04-30', '2024-02-01', '2024-02-28'),
  ('ES002', 'T2023_2', 'ET001', 'Spring 2024 Mid Semester Examination', '2024-02-15', '2024-02-28', '2024-01-15', '2024-01-31');

-- Insert Exam Timetables
INSERT INTO exam_timetables (id, exam_schedule_id, program_id, semester)
VALUES
  ('ETT001', 'ES001', 'PROG001', 1),
  ('ETT002', 'ES001', 'PROG001', 2),
  ('ETT003', 'ES001', 'PROG002', 1),
  ('ETT004', 'ES001', 'PROG002', 2);

-- Insert Exam Days
INSERT INTO exam_days (id, timetable_id, date, type, subject_id, time_slot, duration_minutes)
VALUES
  -- Spring 2024 End Semester Examination
  ('ED001', 'ETT001', '2024-04-01', 'EXAM', 'SUB001', '09:00-12:00', 180),
  ('ED002', 'ETT001', '2024-04-02', 'EXAM', 'SUB002', '09:00-12:00', 180),
  ('ED003', 'ETT001', '2024-04-03', 'STUDY_LEAVE', NULL, '09:00-17:00', 480),
  ('ED004', 'ETT001', '2024-04-04', 'EXAM', 'SUB003', '09:00-12:00', 180),
  ('ED005', 'ETT001', '2024-04-05', 'EXAM', 'SUB004', '09:00-12:00', 180);

-- Insert Exam Applications
INSERT INTO exam_applications (id, student_id, exam_schedule_id, semester, status, submitted_at, processed_at, processed_by, payment_status, payment_amount, payment_reference)
VALUES
  ('EA001', 'STU001', 'ES001', 1, 'approved', '2024-02-15 10:00:00', '2024-02-16 14:30:00', 'ADM001', 'completed', 1000.00, 'PAY123456'),
  ('EA002', 'STU002', 'ES001', 1, 'approved', '2024-02-15 11:00:00', '2024-02-16 15:00:00', 'ADM001', 'completed', 1000.00, 'PAY123457'),
  ('EA003', 'STU003', 'ES001', 1, 'pending', '2024-02-15 12:00:00', NULL, NULL, 'pending', 1000.00, NULL);

-- Insert Application Subjects
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

-- Insert Hall Tickets
INSERT INTO hall_tickets (id, application_id, issue_date, is_valid, pdf_url)
VALUES
  ('HT001', 'EA001', '2024-03-15', true, 'https://example.com/halltickets/HT001.pdf'),
  ('HT002', 'EA002', '2024-03-15', true, 'https://example.com/halltickets/HT002.pdf');
