-- Eliminar la política anterior
DROP POLICY IF EXISTS "Ver propia membresia" ON workspace_members;
DROP POLICY IF EXISTS "Ver miembros del mismo workspace" ON workspace_members;

-- Crear nueva política permitiendo ver a todos los del mismo workspace
-- Usamos la función SECURITY DEFINER (is_workspace_member) para evitar 
-- recursión infinita en PostgreSQL, ya que la función bypassa RLS internamente.
CREATE POLICY "Ver miembros del mismo workspace" ON workspace_members
  FOR SELECT
  USING (public.is_workspace_member(workspace_id));
