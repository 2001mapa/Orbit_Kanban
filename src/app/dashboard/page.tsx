import { createClient } from '@/lib/supabase/server';
import { logoutAction } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Plus, FolderKanban } from 'lucide-react';
import { DashboardClient } from './DashboardClient';
import { PendingInvites } from './PendingInvites';
// unused
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener los workspaces del usuario
  const { data: memberships, error } = await supabase
    .from('workspace_members')
    .select('role, workspaces(id, name, created_at)')
    .eq('user_id', user.id);
    
  if (error) {
    console.error("Error fetching memberships:", error);
  }

  // Supabase join types
  interface WorkspaceJoin {
    id: string;
    name: string;
    created_at: string;
  }

  const workspaces = memberships?.map((m) => {
    const ws = m.workspaces as unknown as WorkspaceJoin;
    return {
      id: ws.id,
      name: ws.name,
      role: m.role,
      created_at: ws.created_at
    };
  }) || [];

  // 2. Obtener invitaciones pendientes del usuario por email usando Admin
  const { data: pendingInvites } = await supabaseAdmin
    .from('workspace_invitations')
    .select('id, role, workspace_id, workspaces(name)')
    .eq('email', user.email);

  const initial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#F4F1EB] flex flex-col">
      <header className="h-16 border-b bg-[#FDFBF7] flex items-center justify-between px-8">
        <h1 className="text-2xl font-serif font-black tracking-tight text-stone-900">Orbit</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-stone-600">{user.email}</div>
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-teal-100 text-teal-800 font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <form action={logoutAction}>
            <button type="submit" className="text-stone-500 hover:text-stone-800 p-2 rounded-md hover:bg-stone-100 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Tus Proyectos</h2>
            <p className="text-stone-500 mt-1">Selecciona un proyecto para continuar o crea uno nuevo.</p>
          </div>
          <DashboardClient />
        </div>

        {/* Sección de Invitaciones */}
        {pendingInvites && pendingInvites.length > 0 && (
          <PendingInvites invites={pendingInvites as any} />
        )}

        {workspaces.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-dashed border-stone-300 rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-teal-50 p-4 rounded-full mb-4">
              <FolderKanban className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Aún no tienes proyectos</h3>
            <p className="text-stone-500 max-w-sm mb-6">Comienza creando tu primer proyecto para organizar tus tareas e invitar a tu equipo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <Link key={ws.id} href={`/workspace/${ws.id}/kanban`}>
                <div className="bg-[#FDFBF7] border border-stone-200 rounded-xl p-6 hover:shadow-md hover:border-teal-300 transition-all group h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-teal-50 p-2 rounded-lg group-hover:bg-teal-100 transition-colors">
                      <FolderKanban className="h-5 w-5 text-teal-700" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                      {ws.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-1 group-hover:text-teal-700 transition-colors">{ws.name}</h3>
                  <p className="text-sm text-stone-500 mt-auto pt-4">Creado el {new Date(ws.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
