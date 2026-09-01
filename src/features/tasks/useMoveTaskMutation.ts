import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moveTaskAction } from '@/app/actions/tasks'; 
import { toast } from 'sonner';

export type Task = {
  id: string;
  workspace_id: string;
  created_by: string;
  assigned_to: string | null;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  status: 'todo' | 'in_progress' | 'done';
  lexorank: string;
  last_updated: string;
};

type MoveTaskParams = {
  taskId: string;
  workspaceId: string;
  newStatus: Task['status'];
  newLexorank: string;
  assignedTo: string | null;
};

export const useMoveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, workspaceId, newStatus, newLexorank, assignedTo }: MoveTaskParams) => {
      const res = await moveTaskAction(taskId, workspaceId, newStatus, newLexorank, assignedTo);
      if (res.error) {
        throw new Error(res.error);
      }
      return res.task;
    },
    // 1. Optimistic Update 
    onMutate: async (variables) => {
      const queryKey = ['tasks', variables.workspaceId];
      
      // Cancelar queries en vuelo 
      await queryClient.cancelQueries({ queryKey });

      // Obtener snapshot
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      // Mutar caché local
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, (old) => {
          if (!old) return [];
          
          return old.map((task) => {
            if (task.id === variables.taskId) {
              return {
                ...task,
                status: variables.newStatus,
                lexorank: variables.newLexorank,
                assigned_to: variables.assignedTo,
              };
            }
            return task;
          }).sort((a, b) => a.lexorank.localeCompare(b.lexorank));
        });
      }

      return { previousTasks, queryKey };
    },
    // 2. Rollback
    onError: (err, variables, context) => {
      toast.error(err.message || 'Error al mover la tarea');
      if (context?.previousTasks) {
        queryClient.setQueryData(context.queryKey, context.previousTasks);
      }
    },
    // 3. (ARC-02 FIX) Eliminado invalidateQueries para confiar 100% en Optimistic UI + Realtime Broadcast
  });
};
