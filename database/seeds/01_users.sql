-- Master seed script
-- Insert Users
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

-- Insert Students
INSERT INTO students (id, roll_number, registration_number, branch, program, current_semester, admission_year, date_of_birth, parent_guardian_name, parent_guardian_contact, address)
VALUES
  ('STU001', 'CSE2023001', 'REG2023001', 'Computer Science', 'B.Tech', 1, 2023, '2000-01-15', 'John Johnson', '+1234567898', '123 Main St, City'),
  ('STU002', 'CSE2023002', 'REG2023002', 'Computer Science', 'B.Tech', 1, 2023, '2000-02-20', 'Mary Brown', '+1234567899', '456 Oak St, City'),
  ('STU003', 'ECE2023001', 'REG2023003', 'Electronics', 'B.Tech', 1, 2023, '2000-03-25', 'Peter White', '+1234567900', '789 Pine St, City');

-- Insert Faculty
INSERT INTO faculty (id, employee_id, department, designation, joining_date, specialization, qualification, experience_years)
VALUES
  ('FAC001', 'EMP001', 'Computer Science', 'Professor', '2020-01-01', 'Database Systems', 'Ph.D.', 10),
  ('FAC002', 'EMP002', 'Electronics', 'Associate Professor', '2021-01-01', 'Digital Electronics', 'Ph.D.', 8),
  ('FAC003', 'EMP003', 'Computer Science', 'Assistant Professor', '2022-01-01', 'Machine Learning', 'M.Tech.', 5);

-- Insert Admins
INSERT INTO admins (id, employee_id, department, role, permissions)
VALUES
  ('ADM001', 'ADM001', 'Administration', 'Super Admin', '{"all": true}'::jsonb),
  ('ADM002', 'ADM002', 'Examination', 'Exam Coordinator', '{"exam_management": true, "hall_ticket": true, "results": true}'::jsonb);
