'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Task } from './useMoveTaskMutation';
import { useUpdateTaskMutation } from './useUpdateTaskMutation';
import { User, Tag, AlertCircle } from 'lucide-react';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  userMap?: Record<string, string>;
}

export function EditTaskModal({ task, isOpen, onClose, workspaceId, userMap = {} }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('none');
  const [tagsInput, setTagsInput] = useState('');
  
  const { mutate: updateTask, isPending } = useUpdateTaskMutation(workspaceId);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setAssignedTo(task.assigned_to || 'none');
      setTagsInput(task.tags ? task.tags.join(', ') : '');
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    
    // Parse tags manually (comma separated)
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    updateTask({
      taskId: task.id,
      updates: { 
        title, 
        description,
        priority: priority as 'low' | 'medium' | 'high' | 'urgent',
        assigned_to: assignedTo === 'none' ? null : assignedTo,
        tags
      }
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="font-sans border-stone-200 bg-[#FDFBF7] shadow-xl rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-stone-800 text-xl">Editar Tarea</DialogTitle>
          <DialogDescription className="text-stone-500 sr-only">Edita los detalles de la tarea actual.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
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
              className="bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl min-h-[90px] resize-y" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-stone-400" /> Prioridad</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-stone-700"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5"><User className="w-4 h-4 text-stone-400" /> Asignada a</label>
              <select 
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-stone-700"
              >
                <option value="none">Sin asignar</option>
                {Object.entries(userMap).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5"><Tag className="w-4 h-4 text-stone-400" /> Etiquetas (separadas por coma)</label>
            <Input 
              value={tagsInput} 
              onChange={(e) => setTagsInput(e.target.value)} 
              placeholder="Ej: Frontend, Urgente, Backend"
              className="bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="border-stone-200 text-stone-700 rounded-xl">Cancelar</Button>
          <Button onClick={handleSave} disabled={isPending || !title.trim()} className="bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl">
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
