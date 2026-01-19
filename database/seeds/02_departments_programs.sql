-- Insert Departments
INSERT INTO departments (id, name, code, hod_id, description)
VALUES
  ('DEPT001', 'Computer Science', 'CSE', 'FAC001', 'Department of Computer Science and Engineering'),
  ('DEPT002', 'Electronics', 'ECE', 'FAC002', 'Department of Electronics and Communication Engineering'),
  ('DEPT003', 'Mathematics', 'MATH', 'FAC003', 'Department of Mathematics');

-- Insert Programs
INSERT INTO programs (id, name, code, department_id, duration_years, total_semesters, degree_type)
VALUES
  ('PROG001', 'Bachelor of Technology in Computer Science', 'BTECH_CSE', 'DEPT001', 4, 8, 'B.Tech'),
  ('PROG002', 'Bachelor of Technology in Electronics', 'BTECH_ECE', 'DEPT002', 4, 8, 'B.Tech'),
  ('PROG003', 'Master of Technology in Computer Science', 'MTECH_CSE', 'DEPT001', 2, 4, 'M.Tech');
