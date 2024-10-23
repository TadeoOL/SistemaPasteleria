import { create } from "zustand";

interface State {
  isDashboardDrawerOpened: boolean;
}

const initialState: State = {
  isDashboardDrawerOpened: false
};

interface Action {
  handlerDrawerOpen: () => void;
  clearStates: () => void;
}

export const menuMasterStore = create<State & Action>((set) => ({
  ...initialState,
  handlerDrawerOpen: () => {
    set((state) => ({ isDashboardDrawerOpened: !state.isDashboardDrawerOpened }));
  },
  clearStates: () => set(initialState)
}));
