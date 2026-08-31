ALTER TABLE tasks 
ADD COLUMN assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Asegurarnos de que Realtime envíe esta columna también (aunque REPLICA IDENTITY FULL ya lo hace)
