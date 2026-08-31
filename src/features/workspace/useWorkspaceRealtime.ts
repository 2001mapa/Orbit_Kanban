import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { usePresenceStore, PresenceUser } from '@/store/presenceStore';
import { useLockStore } from '@/store/useLockStore';
import { Task } from '@/features/tasks/useMoveTaskMutation';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useWorkspaceRealtime = (workspaceId: string, currentUserId: string) => {
  const queryClient = useQueryClient();
  const setActiveUsers = usePresenceStore((state) => state.setActiveUsers);
  const [channelRef, setChannelRef] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!workspaceId || !currentUserId) return;

    let isMounted = true;
    let channel: RealtimeChannel | null = null;
    const supabase = createClient();

    const setupSubscription = async () => {
      // 1. Check if it already exists to avoid throwing "already subscribed" during strict mode or re-renders
      const existingChannel = supabase.getChannels().find(c => c.topic === `workspace_${workspaceId}`);
      if (existingChannel) {
        setChannelRef(existingChannel);
        channel = existingChannel;
        return; // Already configured and subscribed by a previous effect run
      }

      // CRÍTICO: Esperar a que la sesión esté lista antes de abrir el WebSocket.
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si el componente se desmontó mientras esperábamos, abortar.
      if (!isMounted || !session) return;
      
      // Forzar explícitamente el token en el cliente de Realtime para asegurar que 
      // Supabase no lo conecte como 'anon' por culpa de latencia en la hidratación de cookies.
      supabase.realtime.setAuth(session.access_token);

      channel = supabase.channel(`workspace_${workspaceId}`);
      
      // Actualizamos el ref solo si seguimos montados
      if (!isMounted) {
        supabase.removeChannel(channel);
        return;
      }
      
      setChannelRef(channel);

      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `workspace_id=eq.${workspaceId}`,
          },
          (payload) => {
            const queryKey = ['tasks', workspaceId];

            queryClient.setQueryData<Task[]>(queryKey, (oldTasks) => {
              if (!oldTasks) return [];

              switch (payload.eventType) {
                case 'INSERT':
                  if (oldTasks.some(t => t.id === payload.new.id)) return oldTasks;
                  return [...oldTasks.filter(t => !t.id.startsWith('temp-')), payload.new as Task]
                    .sort((a, b) => a.lexorank.localeCompare(b.lexorank));
                
                case 'UPDATE':
                  return oldTasks
                    .map((task) => (task.id === payload.new.id ? (payload.new as Task) : task))
                    .sort((a, b) => a.lexorank.localeCompare(b.lexorank));
                
                case 'DELETE':
                  return oldTasks.filter((task) => task.id !== payload.old.id);
                  
                default:
                  return oldTasks;
              }
            });
          }
        )
        .on('presence', { event: 'sync' }, () => {
          const newState = channel!.presenceState();
          
          // 1. Sincronizar Usuarios Activos (Globales)
          const users = Object.values(newState)
            .flat()
            .map((presence: any) => presence as PresenceUser);
          
          const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
          setActiveUsers(uniqueUsers);

          // 2. Anti-Zombie Locks: Si alguien se desconectó, purgamos sus candados
          const activeUserIds = uniqueUsers.map(u => u.id);
          useLockStore.getState().purgeZombieLocks(activeUserIds);
        })
        .on('broadcast', { event: 'task_lock' }, (payload) => {
          useLockStore.getState().lockTask(payload.payload.taskId, payload.payload.userId);
        })
        .on('broadcast', { event: 'task_unlock' }, (payload) => {
          useLockStore.getState().unlockTask(payload.payload.taskId);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && isMounted) {
            // Inicializar presencia básica para anunciar que estamos en línea
            await channel!.track({
              id: currentUserId,
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [workspaceId, currentUserId, queryClient, setActiveUsers]);

  return channelRef;
};
