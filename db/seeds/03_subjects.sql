-- Insert Subjects
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

-- Insert Program Subjects
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
