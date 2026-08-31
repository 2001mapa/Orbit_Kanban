-- Permitir que los usuarios vean sus propias membresías
CREATE POLICY "Ver propia membresia" ON workspace_members 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Permitir que los usuarios vean los workspaces a los que pertenecen
CREATE POLICY "Ver workspaces propios" ON workspaces 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspaces.id 
      AND workspace_members.user_id = auth.uid()
    )
  );
