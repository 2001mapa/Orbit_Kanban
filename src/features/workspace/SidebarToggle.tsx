'use client';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

export function SidebarToggle() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <button 
      onClick={toggle}
      className="hidden md:flex items-center justify-center h-8 w-8 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
      aria-label={isOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
    >
      {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
    </button>
  );
}
