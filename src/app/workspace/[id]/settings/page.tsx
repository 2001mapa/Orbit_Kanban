import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DeleteWorkspaceButton } from '@/features/workspace/DeleteWorkspaceButton';

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verificar si es el creador original (el admin más antiguo)
  const { data: originalCreator } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  const isCreator = originalCreator?.user_id === user.id;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 tracking-tight mb-2">Configuración del Proyecto</h1>
        <p className="text-stone-500">Gestiona las preferencias y el ciclo de vida de tu espacio de trabajo.</p>
      </div>

      <div className="space-y-6">
        {/* Zona Peligrosa */}
        <section className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
          <div className="border-b border-red-100 bg-red-50/50 p-4 md:p-5">
            <h2 className="text-lg font-semibold text-red-800">Zona Peligrosa</h2>
          </div>
          <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-semibold text-stone-800 mb-1">Eliminar Proyecto</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Una vez que elimines un proyecto, no hay vuelta atrás. Esto borrará permanentemente todas las tareas, miembros y configuraciones asociadas al mismo.
              </p>
            </div>
            
            {isCreator ? (
              <DeleteWorkspaceButton workspaceId={id} />
            ) : (
              <div className="bg-stone-100 px-4 py-2 rounded-lg text-sm text-stone-500 font-medium text-center w-full md:w-auto">
                Solo el creador puede eliminarlo
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
