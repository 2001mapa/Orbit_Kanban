-- Desactivar políticas problemáticas
DROP POLICY IF EXISTS "Miembros pueden acceder a tareas del workspace" ON tasks;
DROP POLICY IF EXISTS "Permitir select a miembros" ON tasks;
DROP POLICY IF EXISTS "Permitir insert a miembros" ON tasks;
DROP POLICY IF EXISTS "Permitir update a miembros" ON tasks;
DROP POLICY IF EXISTS "Permitir delete a miembros" ON tasks;

-- Política Definitiva para Tasks
CREATE POLICY "Acceso total a miembros del workspace" ON tasks
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );
