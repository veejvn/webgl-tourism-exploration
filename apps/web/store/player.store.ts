import { create } from 'zustand';

interface PlayerState {
  position: [number, number, number];
  activeDestinationId: string | null;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setActiveDestination: (id: string | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  position: [0, 0, 0],
  activeDestinationId: null,
  setPlayerPosition: (position) => set({ position }),
  setActiveDestination: (activeDestinationId) => set({ activeDestinationId }),
}));
