'use client';
import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { LexoRank } from 'lexorank';
import { useQuery } from '@tanstack/react-query';
import { useMoveTaskMutation, Task } from './useMoveTaskMutation';
import { useCreateTaskMutation } from './useCreateTaskMutation';
import { useWorkspaceRealtime } from '@/features/workspace/useWorkspaceRealtime';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Lock, User } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { fetchTasksAction } from '@/app/actions/tasks';
import { useLockStore } from '@/store/useLockStore';
import { toast } from 'sonner';
import { ZenMode } from '@/components/kanban/ZenMode';
import { EditTaskModal } from './EditTaskModal';
import { VoiceButton } from '@/components/kanban/VoiceButton';

export const Board = ({ 
  workspaceId, 
  currentUserId, 
  userMap 
}: { 
  workspaceId: string; 
  currentUserId: string;
  userMap: Record<string, string>;
}) => {
  // 1. Suscripción a Realtime
  const channel = useWorkspaceRealtime(workspaceId, currentUserId);
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  // 2. Extracción de caché
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      try {
        const res = await fetchTasksAction(workspaceId);
        return res as Task[];
      } catch (err) {
        console.error("Error al refrescar tareas en el cliente:", err);
        return [];
      }
    },
    staleTime: 1000 * 60,
  });

  const { lockedTasks, lockTask, unlockTask } = useLockStore();
  const { mutate: moveTask } = useMoveTaskMutation();
  const { mutate: createTask, isPending: isCreating } = useCreateTaskMutation(workspaceId, currentUserId);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const onDragStart = (start: any) => {
    // Optimistic UI lock (local)
    lockTask(start.draggableId, currentUserId);
    
    // Transmisión inmediata vía Broadcast para CERO latencia
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'task_lock',
        payload: { taskId: start.draggableId, userId: currentUserId }
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    const releaseLock = () => {
      unlockTask(draggableId);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'task_unlock',
          payload: { taskId: draggableId }
        });
      }
    };

    // Si se suelta fuera del tablero o en la misma posición exacta
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      releaseLock();
      return;
    }

    // Directiva Anti-Multitasking: Restricción de WIP basada en 'assigned_to'
    if (destination.droppableId === 'in_progress') {
      const activeTasks = tasks.filter(t => t.status === 'in_progress' && t.assigned_to === currentUserId);
      if (activeTasks.length >= 1) {
        toast.error('Límite WIP excedido. Termina tu tarea actual primero.');
        releaseLock();
        return; // Retorna sin mutar nada
      }
    }

    const destinationTasks = tasks
      .filter((t) => t.status === destination.droppableId)
      .sort((a, b) => a.lexorank.localeCompare(b.lexorank));

    let newLexorank: string;

    if (destinationTasks.length === 0) {
      newLexorank = LexoRank.middle().toString();
    } else if (destination.index === 0) {
      const firstTaskRank = LexoRank.parse(destinationTasks[0].lexorank);
      newLexorank = firstTaskRank.genPrev().toString();
    } else if (destination.index >= destinationTasks.length) {
      const lastTaskRank = LexoRank.parse(destinationTasks[destinationTasks.length - 1].lexorank);
      newLexorank = lastTaskRank.genNext().toString();
    } else {
      const prevTaskRank = LexoRank.parse(destinationTasks[destination.index - 1].lexorank);
      const nextTaskRank = LexoRank.parse(destinationTasks[destination.index].lexorank);
      newLexorank = prevTaskRank.between(nextTaskRank).toString();
    }

    moveTask(
      {
        taskId: draggableId,
        workspaceId,
        newStatus: destination.droppableId as Task['status'],
        newLexorank,
        assignedTo: destination.droppableId === 'todo' ? null : currentUserId,
      },
      {
        onSettled: () => {
          releaseLock();
        }
      }
    );
  };

  // Identificar si el usuario tiene una tarea activa basada en la ASIGNACIÓN, no en la creación
  const myActiveTask = tasks.find(t => t.status === 'in_progress' && t.assigned_to === currentUserId);

  // Helper para acortar emails largos o obtener la inicial
  const getAssigneeLabel = (userId: string) => {
    const email = userMap[userId];
    if (!email || email === 'Desconocido') return 'OCUPADA';
    const initial = email.charAt(0).toUpperCase();
    const namePart = email.split('@')[0];
    // Mostrar nombre corto, ej: "MIGUEL"
    return namePart.length > 8 ? namePart.substring(0, 8) + '...' : namePart;
  };

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="flex gap-4 md:gap-6 h-full items-start font-sans overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none hide-scrollbar">
          {(['todo', 'in_progress', 'done'] as const).map((status) => {
            const filteredTasks = tasks.filter((t) => t.status === status);
            return (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-none w-[85vw] md:min-w-[320px] md:max-w-[450px] md:flex-1 bg-[#FDFBF7] p-4 md:p-5 rounded-2xl min-h-[400px] border border-stone-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] snap-center md:snap-align-none flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4 md:mb-5">
                      <h3 className="font-serif font-bold capitalize text-base md:text-lg text-stone-700 tracking-tight">
                        {status === 'todo' ? 'Por hacer' : status === 'in_progress' ? 'En progreso' : 'Completado'}
                      </h3>
                      <span className="bg-stone-200/50 text-stone-500 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                        {filteredTasks.length}
                      </span>
                    </div>

                    {status === 'todo' && (
                      <form onSubmit={handleCreateTask} className="mb-4 md:mb-5 flex gap-2">
                        <label htmlFor="new-task-input" className="sr-only">Nueva tarea</label>
                        <Input
                          id="new-task-input"
                          aria-label="Título de la nueva tarea"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Escribe una nueva tarea..."
                          className="h-10 text-sm md:text-[15px] bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl placeholder:text-stone-400"
                        />
                        <VoiceButton workspaceId={workspaceId} />
                          <Button type="submit" size="sm" aria-label="Crear tarea" className="h-10 px-3 bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl" disabled={!newTaskTitle.trim()}>
                          <Plus className="h-5 w-5" />
                        </Button>
                      </form>
                    )}
                    
                    {isLoading ? (
                      <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-stone-100/50 animate-pulse h-24 rounded-xl border border-stone-200/50"></div>
                        ))}
                      </div>
                    ) : filteredTasks.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center mt-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 p-8 text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2">
                          <Plus className="h-5 w-5 text-stone-300" />
                        </div>
                        <p className="text-sm font-medium">No hay tareas</p>
                        <p className="text-xs">Arrastra tareas aquí o crea una nueva.</p>
                      </div>
                    ) : (
                      filteredTasks.map((task, index) => {
                        const lockedBy = lockedTasks[task.id];
                        const isLockedByOther = Boolean(lockedBy && lockedBy !== currentUserId);
                        
                        const isMyFocusTask = myActiveTask?.id === task.id;
                        const isDimmed = myActiveTask && !isMyFocusTask;
                        const isDragDisabled = isLockedByOther || (Boolean(myActiveTask) && !isMyFocusTask);

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={(e) => {
                                  // Solo abrir modal si no se estaba arrastrando ni bloqueado por otro
                                  if (!snapshot.isDragging && !isLockedByOther) {
                                    setSelectedTask(task);
                                  }
                                }}
                                className={`bg-white p-4 md:p-5 rounded-xl border mb-3 relative transition-all duration-300
                                  ${isLockedByOther ? 'opacity-50 ring-2 ring-red-500/40 cursor-not-allowed' : ''} 
                                  ${snapshot.isDragging ? 'ring-2 ring-teal-600/50 opacity-100 z-50 shadow-xl scale-[1.03] rotate-1 cursor-grabbing' : 'shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-stone-300 cursor-grab active:cursor-grabbing'}
                                  ${isMyFocusTask ? 'ring-2 ring-teal-600 shadow-lg scale-[1.02] bg-teal-50/40' : 'border-stone-200'}
                                  ${isDimmed && !snapshot.isDragging ? 'opacity-40 grayscale saturate-50 blur-[0.5px]' : ''}
                                `}
                              >
                                <div className="flex flex-col gap-2.5">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className={`text-sm md:text-[15px] leading-snug font-semibold ${isMyFocusTask ? 'text-teal-900' : 'text-stone-800'}`}>
                                      {task.title}
                                    </p>
                                    {isLockedByOther && <Lock className="h-4 w-4 text-red-400 shrink-0" />}
                                    {isMyFocusTask && (
                                      <span className="flex h-3 w-3 relative shrink-0 mt-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600"></span>
                                      </span>
                                    )}
                                  </div>

                                  {task.description && (
                                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  {task.assigned_to && (
                                    <div className="flex items-center gap-1.5 mt-1 border-t border-stone-100 pt-3">
                                      <User className={`h-3 w-3 md:h-3.5 md:w-3.5 ${isMyFocusTask ? 'text-teal-600' : 'text-stone-400'}`} />
                                      <span className={`text-[10px] md:text-[11px] font-bold tracking-wider ${isMyFocusTask ? 'text-teal-700 uppercase' : 'text-stone-500'}`}>
                                        {isMyFocusTask ? 'Tú' : getAssigneeLabel(task.assigned_to)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <EditTaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        workspaceId={workspaceId}
        userMap={userMap}
      />
    </>
  );
};


