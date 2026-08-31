import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'
import { TeamTabs } from '@/features/team/TeamTabs'

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: currentMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('workspace_id', id)
    .single()

  if (!currentMember || currentMember.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Acceso denegado. Solo administradores pueden gestionar el equipo.</p>
      </div>
    )
  }

  // Obtener la lista de miembros
  const { data: membersList, error: membersError } = await supabaseAdmin
    .from('workspace_members')
    .select('user_id, role, created_at')
    .eq('workspace_id', id)

  // Obtener invitaciones pendientes (Fix SEC-03)
  const { data: invitesList, error: invitesError } = await supabaseAdmin
    .from('workspace_invitations')
    .select('id, workspace_id, email, role, created_at')
    .eq('workspace_id', id)

  if (membersError) {
    return <div>Error cargando miembros.</div>
  }

  // Obtener los perfiles de usuario en una segunda consulta
  const userIds = (membersList || []).map((m) => m.user_id);
  const { data: profilesData } = await supabaseAdmin
    .from('user_profiles')
    .select('id, email')
    .in('id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

  // Cruzar datos
  const activeMembers = membersList.map((m) => {
    const profile = (profilesData || []).find((p) => p.id === m.user_id);
    return {
      user_id: m.user_id,
      role: m.role,
      created_at: m.created_at,
      email: profile?.email || 'Usuario desconocido'
    }
  })

  const pendingInvites = invitesList || []

  return (
    <div className="max-w-4xl mx-auto h-full p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">Gestión del Equipo</h2>
        <p className="text-gray-500">Administra los miembros de tu proyecto y las invitaciones pendientes.</p>
      </div>

      <TeamTabs 
        workspaceId={id}
        currentUserId={user.id}
        members={activeMembers} 
        invitations={pendingInvites} 
      />
    </div>
  )
}
