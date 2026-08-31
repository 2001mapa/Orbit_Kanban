'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function removeMemberAction(userIdToRemove: string, workspaceId: string) {
  const supabase = await createClient()
  
  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 2. Seguridad estricta: Verificar que el ejecutor es admin en este workspace
  const { data: executorMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!executorMember || executorMember.role !== 'admin') {
    return { error: 'Privilegios insuficientes' }
  }

  // 3. Proteger contra auto-eliminación
  if (user.id === userIdToRemove) {
    return { error: 'No puedes eliminarte a ti mismo' }
  }

  // 4. Ejecutar la eliminación con supabaseAdmin (ya validamos el RBAC arriba)
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin')
  const { error } = await supabaseAdmin
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userIdToRemove)

  if (error) {
    console.error("Error al eliminar miembro:", error)
    return { error: error.message }
  }

  revalidatePath('/workspace/team')
  return { success: true }
}

export async function revokeInviteAction(inviteId: string, workspaceId: string) {
  const supabase = await createClient()
  
  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 2. Seguridad estricta: Verificar que el ejecutor es admin en este workspace
  const { data: executorMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!executorMember || executorMember.role !== 'admin') {
    return { error: 'Privilegios insuficientes' }
  }

  // 3. Ejecutar la eliminación de la invitación con supabaseAdmin
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin')
  const { error } = await supabaseAdmin
    .from('workspace_invitations')
    .delete()
    .eq('id', inviteId)
    .eq('workspace_id', workspaceId)

  if (error) {
    console.error("Error al revocar invitación:", error)
    return { error: error.message }
  }

  revalidatePath('/workspace/team')
  return { success: true }
}
