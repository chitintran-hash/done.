import { create } from 'zustand';

export interface GoalState {
  goal: string;
  budget: number;
  maxWidth: number;
  style: 'minimal' | 'gaming' | 'ergonomic' | 'productivity' | null;
  ownedItems: string[];
  deadlineDays: number;
  
  setGoal: (goal: string) => void;
  setBudget: (budget: number) => void;
  setMaxWidth: (width: number) => void;
  setStyle: (style: 'minimal' | 'gaming' | 'ergonomic' | 'productivity') => void;
  toggleOwnedItem: (item: string) => void;
  setDeadlineDays: (days: number) => void;
  reset: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goal: '',
  budget: 5000000,
  maxWidth: 120,
  style: null,
  ownedItems: [],
  deadlineDays: 7,

  setGoal: (goal) => set({ goal }),
  setBudget: (budget) => set({ budget }),
  setMaxWidth: (maxWidth) => set({ maxWidth }),
  setStyle: (style) => set({ style }),
  toggleOwnedItem: (item) => set((state) => ({
    ownedItems: state.ownedItems.includes(item) 
      ? state.ownedItems.filter(i => i !== item)
      : [...state.ownedItems, item]
  })),
  setDeadlineDays: (deadlineDays) => set({ deadlineDays }),
  reset: () => set({ goal: '', budget: 5000000, maxWidth: 120, style: null, ownedItems: [], deadlineDays: 7 })
}));
