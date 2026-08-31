'use client';

import { Task, useMoveTaskMutation } from '@/features/tasks/useMoveTaskMutation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LexoRank } from 'lexorank';
import { useQueryClient } from '@tanstack/react-query';

export function ZenMode({ task, workspaceId }: { task: Task, workspaceId: string }) {
  const { mutate: moveTask, isPending } = useMoveTaskMutation();
  const queryClient = useQueryClient();
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    // Para marcar como completado, lo enviamos al final de la columna "done"
    const queryKey = ['tasks', workspaceId];
    const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || [];
    
    const doneTasks = previousTasks
      .filter((t) => t.status === 'done')
      .sort((a, b) => a.lexorank.localeCompare(b.lexorank));
      
    let newLexorank: string;
    
    if (doneTasks.length === 0) {
      newLexorank = LexoRank.middle().toString();
    } else {
      const lastTaskRank = LexoRank.parse(doneTasks[doneTasks.length - 1].lexorank);
      newLexorank = lastTaskRank.genNext().toString();
    }

    moveTask({
      taskId: task.id,
      workspaceId,
      newStatus: 'done',
      newLexorank,
      assignedTo: null,
    });
  };

  const handlePause = () => {
    // Para pausar, la devolvemos a "todo" (Por Hacer)
    const queryKey = ['tasks', workspaceId];
    const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || [];
    
    const todoTasks = previousTasks
      .filter((t) => t.status === 'todo')
      .sort((a, b) => a.lexorank.localeCompare(b.lexorank));
      
    let newLexorank: string;
    
    if (todoTasks.length === 0) {
      newLexorank = LexoRank.middle().toString();
    } else {
      const firstTaskRank = LexoRank.parse(todoTasks[0].lexorank);
      newLexorank = firstTaskRank.genPrev().toString();
    }

    moveTask({
      taskId: task.id,
      workspaceId,
      newStatus: 'todo',
      newLexorank,
      assignedTo: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Modo Foco Activo
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {task.title}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            No puedes hacer nada más hasta que termines esta tarea.
          </p>
        </div>

        <div className="flex items-center gap-3 text-3xl font-mono text-gray-700 bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100">
          <Clock className="w-8 h-8 text-blue-500" />
          {formatTime(secondsElapsed)}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button 
            onClick={handleComplete} 
            disabled={isPending}
            size="lg" 
            className="w-full h-16 text-xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-6 h-6 mr-3" />
            {isPending ? 'Procesando...' : 'Completar Tarea'}
          </Button>

          <Button 
            onClick={handlePause} 
            disabled={isPending}
            variant="outline"
            size="lg" 
            className="w-full h-12 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
          >
            Pausar y regresar al tablero
          </Button>
        </div>
      </div>
    </div>
  );
}
