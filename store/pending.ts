import { create } from 'zustand';
import { Hike } from '../types/hike';

type PendingStore = {
  pending?: Hike;
  setPending: (h: Hike) => void;
  clear: () => void;
};

export const usePending = create<PendingStore>((set: (arg0: { pending: any; }) => any) => ({
  pending: undefined,
  setPending: (h) => set({ pending: h }),
  clear: () => set({ pending: undefined }),
}));
