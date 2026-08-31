import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsCharts } from '@/components/charts/AnalyticsCharts'

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('workspace_id', id)
    .single()

  if (!member) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Acceso denegado al Proyecto.</p>
      </div>
    )
  }

  // Fetch ultraligero: Solo trae las filas de agregación desde PostgreSQL.
  // Gracias a security_invoker=true en la vista, RLS se aplica automáticamente.
  const { data: stats } = await supabase
    .from('workspace_task_stats')
    .select('status, total_tasks')
    .eq('workspace_id', id)

  // Extraemos y formateamos para Recharts
  const todo = stats?.find(s => s.status === 'todo')?.total_tasks || 0
  const inProgress = stats?.find(s => s.status === 'in_progress')?.total_tasks || 0
  const done = stats?.find(s => s.status === 'done')?.total_tasks || 0
  const total = Number(todo) + Number(inProgress) + Number(done)

  const chartData = [
    { name: 'Por Hacer', total: Number(todo) },
    { name: 'En Progreso', total: Number(inProgress) },
    { name: 'Completado', total: Number(done) },
  ]

  return (
    <div className="max-w-5xl mx-auto h-full p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">Analíticas del Proyecto</h2>
        <p className="text-gray-500">Visualiza el estado de las tareas de tu equipo en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium">Total de Tareas</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium">Por Hacer</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{todo}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium">En Progreso</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium">Completadas</p>
          <p className="text-3xl font-bold text-green-500 mt-2">{done}</p>
        </div>
      </div>

      <AnalyticsCharts data={chartData} />
    </div>
  )
}
