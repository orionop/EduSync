-- Insert Buildings
INSERT INTO buildings (id, name, code, location, floors)
VALUES
  ('BLD001', 'Main Academic Block', 'MAB', 'Central Campus', 5),
  ('BLD002', 'Science Block', 'SB', 'East Campus', 3),
  ('BLD003', 'Engineering Block', 'EB', 'West Campus', 4);

-- Insert Classrooms
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

-- Insert Seating Arrangements
INSERT INTO seating_arrangements (id, exam_day_id, classroom_id, created_by)
VALUES
  ('SA001', 'ED001', 'CLR001', 'ADM001'),
  ('SA002', 'ED001', 'CLR002', 'ADM001'),
  ('SA003', 'ED002', 'CLR003', 'ADM001'),
  ('SA004', 'ED002', 'CLR004', 'ADM001');

-- Insert Bench Arrangements
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

-- Insert Student Positions
INSERT INTO student_positions (id, bench_arrangement_id, student_id, position, attendance_status)
VALUES
  -- Bench Arrangement 1
  ('SP001', 'BA001', 'STU001', 'LEFT', 'present'),
  ('SP002', 'BA001', 'STU002', 'RIGHT', 'present'),
  ('SP003', 'BA002', 'STU003', 'LEFT', 'absent'),
  ('SP004', 'BA002', NULL, 'RIGHT', NULL),
  
  -- Bench Arrangement 2
  ('SP005', 'BA006', NULL, 'LEFT', NULL),
  ('SP006', 'BA006', NULL, 'RIGHT', NULL),
  ('SP007', 'BA007', NULL, 'LEFT', NULL),
  ('SP008', 'BA007', NULL, 'RIGHT', NULL);
