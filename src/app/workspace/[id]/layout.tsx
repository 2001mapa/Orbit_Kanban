import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BarChart3, LogOut, Users, FolderKanban } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkspaceSidebar } from '@/features/workspace/WorkspaceSidebar'
import { SidebarToggle } from '@/features/workspace/SidebarToggle'

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Lógica de Servidor para renderizado instantáneo
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Obtener el nombre del proyecto actual
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name')
    .eq('id', id)
    .single()

  const workspaceName = workspace?.name || 'Proyecto Desconocido'

  // Inicial para el Avatar
  const initial = user.email?.charAt(0).toUpperCase() || 'O'

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white font-sans">
      <WorkspaceSidebar workspaceName={workspaceName} workspaceId={id} />

      {/* Área Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header con estructura estática y menú interactivo */}
        <header className="h-14 md:h-16 shrink-0 border-b border-stone-200 flex items-center justify-between px-4 md:px-6 bg-[#FDFBF7] shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-10">
          <div className="flex items-center gap-2.5 md:gap-3">
            <SidebarToggle />
            <Link href="/dashboard" className="md:hidden p-1.5 bg-stone-100 rounded-md mr-1 text-stone-600">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            <div className="h-7 w-7 md:h-8 md:w-8 bg-teal-100 text-teal-800 rounded-lg flex items-center justify-center font-bold font-serif text-sm md:text-base">
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-base md:text-lg font-bold text-stone-800 font-serif line-clamp-1">{workspaceName}</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-stone-200 cursor-pointer hover:ring-2 hover:ring-teal-200 transition-all">
                <AvatarFallback className="bg-stone-100 text-stone-700 font-medium text-xs md:text-sm">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-sans">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-stone-800">Conectado como</p>
                    <p className="text-xs leading-none text-stone-500">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-stone-100" />
              <DropdownMenuItem className="focus:bg-stone-100 cursor-pointer">
                <form action={logoutAction} className="w-full">
                  <button type="submit" className="w-full text-left flex items-center text-stone-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Contenido (El Tablero Kanban irá aquí) */}
        <div className="flex-1 overflow-auto bg-[#F4F1EB] p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Navegación Inferior (Solo Móviles) */}
      <nav className="md:hidden border-t border-stone-200 bg-[#FDFBF7] h-14 shrink-0 flex items-center justify-around px-2 z-20 shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
        <Link href={`/workspace/${id}/kanban`} className="flex flex-col items-center gap-1 p-2 text-stone-500 hover:text-teal-700 transition-colors">
          <FolderKanban className="h-5 w-5" />
          <span className="text-[10px] font-medium">Kanban</span>
        </Link>
        <Link href={`/workspace/${id}/team`} className="flex flex-col items-center gap-1 p-2 text-stone-500 hover:text-teal-700 transition-colors">
          <Users className="h-5 w-5" />
          <span className="text-[10px] font-medium">Equipo</span>
        </Link>
        <Link href={`/workspace/${id}/analytics`} className="flex flex-col items-center gap-1 p-2 text-stone-500 hover:text-teal-700 transition-colors">
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] font-medium">Analíticas</span>
        </Link>
      </nav>
    </div>
  )
}
