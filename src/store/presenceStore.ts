import { create } from 'zustand';

export type PresenceUser = {
  id: string;
  email?: string;
  avatar_url?: string;
  online_at?: string;
};

type PresenceState = {
  activeUsers: PresenceUser[];
  setActiveUsers: (users: PresenceUser[]) => void;
};

export const usePresenceStore = create<PresenceState>((set) => ({
  activeUsers: [],
  setActiveUsers: (users) => set({ activeUsers: users }),
}));
