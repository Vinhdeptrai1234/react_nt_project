import { create } from 'zustand';
import { getAllHikes, insertHike, deleteHike } from '../db/sqlite';
import { Hike } from '../models/Hike';

type State = {
  hikes: Hike[];
  load: () => Promise<void>;
  add: (h: Hike) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const useHikes = create<State>((set) => ({
  hikes: [],
  load: async () => {
    const rows = await getAllHikes();
    set({ hikes: rows });
  },
  add: async (hike) => {
    await insertHike(hike);
    const rows = await getAllHikes();
    set({ hikes: rows });
  },
  remove: async (id) => {
    await deleteHike(id);
    const rows = await getAllHikes();
    set({ hikes: rows });
  },
}));
