'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function createWorkspaceAction(name: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'No autorizado' };
  }

  // Creamos el workspace con supabaseAdmin para sortear posibles restricciones iniciales, 
  // o con supabase si el RLS lo permite. (Dado que no hay política de insert en workspaces por defecto, 
  // usamos admin o añadimos una política. Por simplicidad y asegurar la creación, usamos Admin).
  const { data: newWorkspace, error: createError } = await supabaseAdmin
    .from('workspaces')
    .insert({ name })
    .select()
    .single();

  if (createError || !newWorkspace) {
    console.error(createError);
    return { error: 'Error al crear el proyecto' };
  }

  // Agregamos al usuario como admin del workspace
  const { error: memberError } = await supabaseAdmin
    .from('workspace_members')
    .insert({
      workspace_id: newWorkspace.id,
      user_id: user.id,
      role: 'admin'
    });

  if (memberError) {
    console.error(memberError);
    return { error: 'Error al asignar permisos en el proyecto' };
  }

  return { workspace: newWorkspace };
}

export async function deleteWorkspaceAction(workspaceId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'No autorizado' };
  }

  // Verificar si el usuario es el CREADOR original del proyecto
  // El creador original es el admin más antiguo (el primero en ser añadido)
  const { data: originalCreator, error: creatorError } = await supabaseAdmin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (creatorError || !originalCreator) {
    console.error("Error al buscar el creador:", creatorError);
    return { error: 'Error al verificar permisos del proyecto' };
  }

  if (originalCreator.user_id !== user.id) {
    return { error: 'Solo el creador original del proyecto puede eliminarlo' };
  }

  // Eliminar el workspace usando Admin (el CASCADE borrará tareas, miembros e invitaciones)
  const { error: deleteError } = await supabaseAdmin
    .from('workspaces')
    .delete()
    .eq('id', workspaceId);

  if (deleteError) {
    console.error("Error al eliminar el proyecto:", deleteError);
    return { error: 'Error al eliminar el proyecto' };
  }

  return { success: true };
}
