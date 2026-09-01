ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- Forzar replica identity si es necesario para realtime
ALTER TABLE tasks REPLICA IDENTITY FULL;
