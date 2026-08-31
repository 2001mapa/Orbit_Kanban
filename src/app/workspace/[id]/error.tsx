'use client';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-800">Error de Espacio de Trabajo</h2>
        <p className="text-stone-500">
          Ocurrió un error al cargar este proyecto. Es posible que haya sido eliminado o no tengas permisos.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/dashboard" className="border-stone-200 text-stone-700 bg-white border h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 flex-1 rounded-xl">
            Volver
          </Link>
          <Button onClick={() => reset()} className="flex-1 bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl">
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
}
