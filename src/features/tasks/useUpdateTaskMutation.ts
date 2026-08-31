import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskAction } from '@/app/actions/tasks';
import { Task } from './useMoveTaskMutation';
import { toast } from 'sonner';

export function useUpdateTaskMutation(workspaceId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', workspaceId];

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: { title?: string; description?: string } }) => {
      const res = await updateTaskAction(taskId, workspaceId, updates);
      if (res.error) throw new Error(res.error);
      return res.task as Task;
    },
    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map(t => t.id === taskId ? { ...t, ...updates } : t);
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      toast.error(err.message || 'Error al actualizar tarea');
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    }
  });
}
