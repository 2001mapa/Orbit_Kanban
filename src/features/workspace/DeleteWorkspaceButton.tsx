'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteWorkspaceAction } from '@/app/actions/workspaces';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteWorkspaceButton({ workspaceId }: { workspaceId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    toast.loading('Eliminando proyecto...', { id: 'delete-workspace' });

    try {
      const res = await deleteWorkspaceAction(workspaceId);
      
      if (res.error) {
        toast.error(res.error, { id: 'delete-workspace' });
        setIsDeleting(false);
        return;
      }

      toast.success('Proyecto eliminado correctamente', { id: 'delete-workspace' });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error('Ocurrió un error inesperado.', { id: 'delete-workspace' });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" className="w-full md:w-auto" disabled={isDeleting} onClick={() => setIsOpen(true)}>
        {isDeleting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="mr-2 h-4 w-4" />
        )}
        Eliminar Proyecto
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y removerá todos los datos asociados de nuestros servidores, incluyendo tareas, notas y configuraciones de equipo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sí, eliminar proyecto"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
