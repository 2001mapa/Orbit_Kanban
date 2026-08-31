'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function acceptInvitationAction(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: 'No autorizado' };
  }

  // 1. Obtener la invitación (usando admin para saltar RLS si es necesario, 
  // aunque el usuario no tiene permisos sobre invitaciones de admin)
  const { data: invitation, error: fetchError } = await supabaseAdmin
    .from('workspace_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();

  if (fetchError || !invitation) {
    return { error: 'Invitación no encontrada' };
  }

  // 2. Verificar que el email coincida (Seguridad)
  if (invitation.email !== user.email) {
    return { error: 'Esta invitación no te pertenece' };
  }

  // 3. Insertar en workspace_members
  const { error: insertError } = await supabaseAdmin
    .from('workspace_members')
    .insert({
      workspace_id: invitation.workspace_id,
      user_id: user.id,
      role: invitation.role
    });

  if (insertError) {
    console.error(insertError);
    return { error: 'Error al unirse al proyecto' };
  }

  // 4. Eliminar la invitación
  await supabaseAdmin
    .from('workspace_invitations')
    .delete()
    .eq('id', invitationId);

  return { success: true };
}
