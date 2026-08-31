import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskAction } from '@/app/actions/tasks'
import { Task } from './useMoveTaskMutation'
import { LexoRank } from 'lexorank'
import { toast } from 'sonner'

export function useCreateTaskMutation(workspaceId: string, userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['tasks', workspaceId]

  return useMutation({
    mutationFn: async (title: string) => {
      const res = await createTaskAction(workspaceId, title)
      if (res.error) {
        console.error("Error del servidor Supabase:", res.error);
        throw new Error(res.error)
      }
      return res.task
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || []

      const todoTasks = previousTasks
        .filter(t => t.status === 'todo')
        .sort((a, b) => a.lexorank.localeCompare(b.lexorank))

      const newLexorank = todoTasks.length > 0
        ? LexoRank.parse(todoTasks[todoTasks.length - 1].lexorank).genNext().toString()
        : LexoRank.middle().toString()

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title,
        status: 'todo',
        lexorank: newLexorank,
        workspace_id: workspaceId,
        created_by: userId,
        assigned_to: null,
        last_updated: new Date().toISOString()
      }

      queryClient.setQueryData<Task[]>(queryKey, (old = []) => [...old, optimisticTask])
      return { previousTasks }
    },
    onSuccess: () => {
      toast.success('Tarea creada correctamente');
    },
    onError: (err, variables, context) => {
      toast.error(err.message || 'Error al crear la tarea');
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks)
      }
    },
    // Eliminado invalidateQueries para evitar race condition con Realtime
  })
}
