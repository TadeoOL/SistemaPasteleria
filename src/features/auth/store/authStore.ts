import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Action {
    login: () => void;
    logout: () => void;
}

interface State {
    isAuthenticated: boolean;
    token: string;
}

const initialState: State = {
    isAuthenticated: false,
    token: '',
};

export const useAuthStore = create(persist<State & Action>((set) => ({
    ...initialState,
    login: () => set(() => ({ isAuthenticated: true })),
    logout: () => set(() => ({ isAuthenticated: false, token: '' })),
  }),
  {
    name: 'auth',
}))

