
-- ARC-04 FIX: Refactor N+1 loop in invitations trigger

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE   
  new_workspace_id UUID;
  invitations_count INT;
BEGIN   
  -- 1. Count how many invitations this new user has
  SELECT count(*) INTO invitations_count FROM public.workspace_invitations WHERE email = NEW.email;

  IF invitations_count > 0 THEN
    -- 2. Insert all memberships at once (bulk insert)
    INSERT INTO public.workspace_members (workspace_id, user_id, role)
    SELECT workspace_id, NEW.id, role FROM public.workspace_invitations WHERE email = NEW.email;
    
    -- 3. Delete all processed invitations at once (bulk delete)
    DELETE FROM public.workspace_invitations WHERE email = NEW.email;
  ELSE
    -- 4. If no invitations, create a personal workspace
    INSERT INTO public.workspaces (name) VALUES ('Workspace de ' || NEW.email) RETURNING id INTO new_workspace_id;     
    INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES (new_workspace_id, NEW.id, 'admin');   
  END IF;    
  
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;
