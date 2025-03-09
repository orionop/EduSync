-- Insert Faculty Non-Availability Slots
INSERT INTO faculty_non_availability (id, faculty_id, date, time_slot, reason)
VALUES
  ('FNA001', 'FAC001', '2024-04-01', '09:00-12:00', 'Department Meeting'),
  ('FNA002', 'FAC002', '2024-04-02', '09:00-12:00', 'Research Work'),
  ('FNA003', 'FAC003', '2024-04-03', '09:00-12:00', 'Conference');

-- Insert Supervision Duty Types
INSERT INTO supervision_duty_types (id, name, description, priority, faculty_count_required)
VALUES
  ('SDT001', 'Chief Superintendent', 'Overall in-charge of examination hall', 1, 1),
  ('SDT002', 'Hall Superintendent', 'In-charge of specific examination hall', 2, 1),
  ('SDT003', 'Invigilator', 'Regular examination invigilator', 3, 2),
  ('SDT004', 'Relief Invigilator', 'Relief duty for regular invigilators', 4, 1);

-- Insert Supervision Duties
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
