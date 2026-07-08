import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activePopupId: string | null;
  isLoading: boolean;
  toggleSidebar: () => void;
  setActivePopupId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  activePopupId: null,
  isLoading: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActivePopupId: (activePopupId) => set({ activePopupId }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
