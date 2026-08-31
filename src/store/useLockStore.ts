import { create } from 'zustand'

interface LockState {
  lockedTasks: Record<string, string> // taskId -> userId
  lockTask: (taskId: string, userId: string) => void
  unlockTask: (taskId: string) => void
  purgeZombieLocks: (activeUserIds: string[]) => void
}

export const useLockStore = create<LockState>((set) => ({
  lockedTasks: {},
  lockTask: (taskId, userId) => set((state) => ({
    lockedTasks: { ...state.lockedTasks, [taskId]: userId }
  })),
  unlockTask: (taskId) => set((state) => {
    const newLocks = { ...state.lockedTasks }
    delete newLocks[taskId]
    return { lockedTasks: newLocks }
  }),
  purgeZombieLocks: (activeUserIds) => set((state) => {
    const newLocks = { ...state.lockedTasks }
    let changed = false;
    
    // Si un candado pertenece a un usuario que ya no está activo, lo purgamos
    for (const [taskId, userId] of Object.entries(newLocks)) {
      if (!activeUserIds.includes(userId)) {
        delete newLocks[taskId]
        changed = true;
      }
    }
    
    return changed ? { lockedTasks: newLocks } : state;
  })
}))
