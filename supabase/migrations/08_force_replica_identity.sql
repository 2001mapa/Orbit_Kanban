-- Asegurar que la tabla replica toda la fila (Crucial para que Supabase Realtime
-- envíe el workspace_id y se pueda evaluar la política RLS en un UPDATE)
ALTER TABLE public.tasks REPLICA IDENTITY FULL;

-- Re-crear la función SECURITY DEFINER asegurando que use correctamente 
-- el sub de JWT (que es lo que Realtime usa para simular auth.uid())
CREATE OR REPLACE FUNCTION public.is_workspace_member(check_workspace_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  jwt_uid UUID;
BEGIN
  -- Realtime simula auth.uid() asignando request.jwt.claim.sub
  jwt_uid := current_setting('request.jwt.claim.sub', true)::UUID;
  
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_members 
    WHERE workspace_id = check_workspace_id 
    AND user_id = jwt_uid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Asegurar permisos de ejecución para la función
GRANT EXECUTE ON FUNCTION public.is_workspace_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(UUID) TO service_role;
