import { create } from 'zustand';

export type StylePreference = 'minimal' | 'gaming' | 'ergonomic' | 'productivity';
export type OwnedItem = 'laptop' | 'monitor' | 'keyboard' | 'mouse' | 'chair' | 'desk';

interface GoalState {
  goal: string;
  budget: number;
  maxWidth: number;
  style: StylePreference | null;
  ownedItems: OwnedItem[];
  setGoal: (goal: string) => void;
  setBudget: (budget: number) => void;
  setMaxWidth: (width: number) => void;
  setStyle: (style: StylePreference) => void;
  toggleOwnedItem: (item: OwnedItem) => void;
  reset: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goal: '',
  budget: 5000000, // Default 5M VND
  maxWidth: 120, // Default 120cm
  style: null,
  ownedItems: [],
  setGoal: (goal) => set({ goal }),
  setBudget: (budget) => set({ budget }),
  setMaxWidth: (maxWidth) => set({ maxWidth }),
  setStyle: (style) => set({ style }),
  toggleOwnedItem: (item) => set((state) => ({
    ownedItems: state.ownedItems.includes(item) 
      ? state.ownedItems.filter(i => i !== item)
      : [...state.ownedItems, item]
  })),
  reset: () => set({
    goal: '', budget: 5000000, maxWidth: 120, style: null, ownedItems: []
  })
}));
