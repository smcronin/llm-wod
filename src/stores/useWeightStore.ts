import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry } from '@/types/workout';

interface WeightState {
  entries: WeightEntry[];
  addEntry: (entry: WeightEntry) => void;
  updateEntry: (id: string, updates: Partial<WeightEntry>) => void;
  removeEntry: (id: string) => void;
  getEntriesInRange: (startDate: string, endDate: string) => WeightEntry[];
  getLatestEntry: () => WeightEntry | undefined;
  clearEntries: () => void;
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [entry, ...state.entries].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      getEntriesInRange: (startDate, endDate) => {
        const { entries } = get();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return entries.filter((e) => {
          const date = new Date(e.date).getTime();
          return date >= start && date <= end;
        });
      },

      getLatestEntry: () => {
        const { entries } = get();
        return entries[0];
      },

      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: 'weight-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
