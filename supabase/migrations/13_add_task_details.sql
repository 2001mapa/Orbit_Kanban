ALTER TABLE tasks 
ADD COLUMN description TEXT,
ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';

-- Actualizar REPLICA IDENTITY FULL si es necesario (ya se hizo en migraciones previas para toda la tabla)
