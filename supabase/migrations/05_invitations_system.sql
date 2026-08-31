CREATE TABLE workspace_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, email)
);

-- Habilitar RLS
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar invitaciones" ON workspace_invitations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = workspace_invitations.workspace_id AND user_id = auth.uid() AND role = 'admin')
  );

-- Modificar el Trigger Existente (Versión Robusta para procesar múltiples invitaciones simultáneas)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$ 
DECLARE   
  invitation RECORD;   
  new_workspace_id UUID;
  has_invitations BOOLEAN := false;
BEGIN   
  -- Iterar sobre TODAS las invitaciones que este correo pueda tener
  FOR invitation IN SELECT * FROM public.workspace_invitations WHERE email = NEW.email LOOP
    -- Asignarlo a la organización existente
    INSERT INTO public.workspace_members (workspace_id, user_id, role)     
    VALUES (invitation.workspace_id, NEW.id, invitation.role);          
    
    -- Limpiar la invitación usada
    DELETE FROM public.workspace_invitations WHERE id = invitation.id;   
    has_invitations := true;
  END LOOP;

  -- Solo si no tenía NINGUNA invitación, le creamos su propio workspace por defecto
  IF NOT has_invitations THEN     
    INSERT INTO public.workspaces (name) VALUES ('Workspace de ' || NEW.email) RETURNING id INTO new_workspace_id;     
    INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES (new_workspace_id, NEW.id, 'admin');   
  END IF;    
  
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;
