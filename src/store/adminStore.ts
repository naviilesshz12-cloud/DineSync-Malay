import { create } from 'zustand';

interface AdminStore {
  isAdmin: boolean;
  setAdmin: (status: boolean) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isAdmin: false,
  setAdmin: (status) => set({ isAdmin: status }),
  logout: () => set({ isAdmin: false }),
}));
