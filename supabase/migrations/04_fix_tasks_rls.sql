-- Eliminar la política general que puede causar conflictos
DROP POLICY IF EXISTS "Miembros pueden acceder a tareas del workspace" ON tasks;

-- Política de Lectura (SELECT)
CREATE POLICY "Permitir select a miembros" ON tasks 
  FOR SELECT 
  USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Política de Inserción (INSERT)
CREATE POLICY "Permitir insert a miembros" ON tasks 
  FOR INSERT 
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Política de Actualización (UPDATE)
CREATE POLICY "Permitir update a miembros" ON tasks 
  FOR UPDATE 
  USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Política de Borrado (DELETE)
CREATE POLICY "Permitir delete a miembros" ON tasks 
  FOR DELETE 
  USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );
