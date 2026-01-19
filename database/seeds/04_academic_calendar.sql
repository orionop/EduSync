-- Insert Academic Years
INSERT INTO academic_years (id, year_name, start_date, end_date, is_current)
VALUES
  ('AY2023', '2023-24', '2023-06-01', '2024-05-31', true),
  ('AY2024', '2024-25', '2024-06-01', '2025-05-31', false);

-- Insert Academic Terms
INSERT INTO academic_terms (id, academic_year_id, term_name, start_date, end_date, is_current)
VALUES
  -- 2023-24 Academic Year
  ('T2023_1', 'AY2023', 'Fall 2023', '2023-06-01', '2023-11-30', false),
  ('T2023_2', 'AY2023', 'Spring 2024', '2023-12-01', '2024-05-31', true),
  
  -- 2024-25 Academic Year
  ('T2024_1', 'AY2024', 'Fall 2024', '2024-06-01', '2024-11-30', false),
  ('T2024_2', 'AY2024', 'Spring 2025', '2024-12-01', '2025-05-31', false);
