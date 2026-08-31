import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Board } from '@/features/tasks/Board'
import { redirect } from 'next/navigation'
import { InviteMemberModal } from '@/features/workspace/InviteMemberModal'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: workspace } = await supabase.from('workspaces').select('name').eq('id', id).single();
  return {
    title: workspace?.name || 'Tablero',
  };
}

export default async function KanbanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // 1. Validar que el usuario pertenece a este workspace específico
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('workspace_id', id)
    .single()

  if (!member) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No tienes acceso a este proyecto.</p>
      </div>
    )
  }

  const queryClient = new QueryClient()

  // 2. Pre-cargar la caché de React Query en el servidor usando `id`
  await queryClient.prefetchQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', id)
        .order('lexorank', { ascending: true })
      return data || []
    }
  })

  // Obtener los miembros para el mapa
  const { data: rawMembers, error: membersError } = await supabase
    .from('workspace_members')
    .select('user_id, role')
    .eq('workspace_id', id);

  if (membersError) {
    console.error("Error al obtener miembros del workspace:", membersError);
  }

  // Obtener los emails cruzando con user_profiles en una segunda consulta eficiente
  const userIds = (rawMembers || []).map((m) => m.user_id);
  const { data: profilesData } = await supabase
    .from('user_profiles')
    .select('id, email')
    .in('id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

  // Aplanar la respuesta
  const userMap: Record<string, string> = {}
  ;(rawMembers || []).forEach((m) => {
    const profile = (profilesData || []).find((p) => p.id === m.user_id);
    userMap[m.user_id] = profile?.email || 'Usuario Desconocido'
  })

  // 3. Serializar y enviar al cliente (Hidratación sin estado de carga visual)
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tablero de Tareas</h2>
        {member.role === 'admin' && (
          <InviteMemberModal workspaceId={id} />
        )}
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Pasamos también currentUserId para que el hook de Realtime ignore nuestras propias mutaciones */}
        <Board workspaceId={id} currentUserId={user.id} userMap={userMap} />
      </HydrationBoundary>
    </div>
  )
}
