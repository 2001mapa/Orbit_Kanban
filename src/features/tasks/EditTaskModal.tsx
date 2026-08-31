'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Task } from './useMoveTaskMutation';
import { useUpdateTaskMutation } from './useUpdateTaskMutation';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function EditTaskModal({ task, isOpen, onClose, workspaceId }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: updateTask, isPending } = useUpdateTaskMutation(workspaceId);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    
    updateTask({
      taskId: task.id,
      updates: { title, description }
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="font-sans border-stone-200 bg-[#FDFBF7] shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-stone-800 text-xl">Editar Tarea</DialogTitle>
          <DialogDescription className="text-stone-500 sr-only">Edita los detalles de la tarea actual.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Título</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Descripción</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Añade detalles más específicos a esta tarea..."
              className="bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl min-h-[120px] resize-y" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-stone-200 text-stone-700 rounded-xl">Cancelar</Button>
          <Button onClick={handleSave} disabled={isPending || !title.trim()} className="bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl">
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
