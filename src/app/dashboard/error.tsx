'use client';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F4F1EB] flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-800">Algo salió mal</h2>
        <p className="text-stone-500">
          No pudimos cargar tu panel de control. Esto puede ser un error de conexión con la base de datos.
        </p>
        <Button onClick={() => reset()} className="w-full bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl mt-4">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
