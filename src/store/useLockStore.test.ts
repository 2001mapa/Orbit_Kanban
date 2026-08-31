import { describe, it, expect, beforeEach } from 'vitest';
import { useLockStore } from './useLockStore';

describe('useLockStore (Zombie Lock Anti-Pattern)', () => {
  beforeEach(() => {
    // Reset store before each test
    useLockStore.setState({ lockedTasks: {} });
  });

  it('should lock a task for a user', () => {
    const store = useLockStore.getState();
    store.lockTask('task-1', 'user-1');
    
    expect(useLockStore.getState().lockedTasks['task-1']).toBe('user-1');
  });

  it('should unlock a task', () => {
    const store = useLockStore.getState();
    store.lockTask('task-1', 'user-1');
    store.unlockTask('task-1');
    
    expect(useLockStore.getState().lockedTasks['task-1']).toBeUndefined();
  });

  it('should purge zombie locks when a user disconnects', () => {
    const store = useLockStore.getState();
    store.lockTask('task-1', 'user-1');
    store.lockTask('task-2', 'user-2'); // Active user
    store.lockTask('task-3', 'user-3'); // Disconnected user

    // simulate only user-2 is active in presence
    store.purgeZombieLocks(['user-2']);

    const currentLocks = useLockStore.getState().lockedTasks;
    expect(currentLocks['task-1']).toBeUndefined(); // user-1 purged
    expect(currentLocks['task-3']).toBeUndefined(); // user-3 purged
    expect(currentLocks['task-2']).toBe('user-2'); // user-2 kept
  });
});
