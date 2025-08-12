'use client';
import { create } from 'zustand';

export type WellId = string; // e.g., 'A1', 'B3'

interface PlateState {
  selectedWells: WellId[];
  setSelectedWells: (w: WellId[] | ((prev: WellId[]) => WellId[])) => void;
  clearSelection: () => void;
}

export const useLimsStore = create<PlateState>((set) => ({
  selectedWells: [],
  setSelectedWells: (w) =>
    set((s) => ({
      selectedWells:
        typeof w === 'function' ? (w as (p: WellId[]) => WellId[])(s.selectedWells) : w,
    })),
  clearSelection: () => set({ selectedWells: [] }),
}));
