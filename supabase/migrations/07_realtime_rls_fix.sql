-- Eliminar la política anterior
DROP POLICY IF EXISTS "Acceso total a miembros del workspace" ON tasks;

-- 1. Crear una función SECURITY DEFINER para verificar la membresía
-- Esto es CRUCIAL para Supabase Realtime. Realtime tiene un bug conocido
-- al evaluar políticas RLS anidadas (cuando la política consulta otra tabla que a su vez tiene RLS).
-- SECURITY DEFINER permite que la función se ejecute con privilegios de administrador,
-- saltándose el RLS anidado y devolviendo un booleano limpio a Realtime.
CREATE OR REPLACE FUNCTION public.is_workspace_member(check_workspace_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.workspace_members 
    WHERE workspace_id = check_workspace_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear la nueva política utilizando la función
CREATE POLICY "Acceso total a miembros del workspace" ON tasks
  FOR ALL
  USING (
    public.is_workspace_member(workspace_id)
  )
  WITH CHECK (
    public.is_workspace_member(workspace_id)
  );
