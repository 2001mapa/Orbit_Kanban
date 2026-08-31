'use client';
import Link from 'next/link';
import { LayoutDashboard, BarChart3, Users, FolderKanban } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

export function WorkspaceSidebar({ workspaceName, workspaceId }: { workspaceName: string, workspaceId: string }) {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <aside 
      className={`hidden md:flex border-r border-stone-200 bg-[#FDFBF7] flex-col transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0'}`}
    >
      <div className="h-16 flex items-center px-6 border-b border-stone-200 min-w-[256px]">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-teal-700 p-1.5 rounded-md">
            <LayoutDashboard className="h-4 w-4 text-stone-50" />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-stone-800">Orbit</h1>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 min-w-[256px]">
        <Link 
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-stone-100/50 hover:bg-stone-200 text-stone-600 font-medium transition-colors mb-6 border border-stone-200 shadow-sm text-xs uppercase tracking-wider"
        >
          â† Volver a Proyectos
        </Link>

        <div className="px-3 pb-2 text-xs font-semibold text-stone-400 uppercase tracking-wider flex flex-col gap-1">
          <span>Proyecto Actual:</span>
          <span className="text-sm font-bold text-teal-900 normal-case tracking-normal truncate">{workspaceName}</span>
        </div>
        <Link 
          href={`/workspace/${workspaceId}/kanban`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <FolderKanban className="h-4 w-4" />
          <span className="text-sm font-medium">Tablero Kanban</span>
        </Link>
        
        <Link 
          href={`/workspace/${workspaceId}/team`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Equipo</span>
        </Link>

        <Link 
          href={`/workspace/${workspaceId}/analytics`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Analíticas</span>
        </Link>
        <Link 
          href={"/workspace/" + workspaceId + "/settings"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <div className="h-4 w-4 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></div>
          <span className="text-sm font-medium">Configuración</span>
        </Link>
      </nav>
    </aside>
  );
}
