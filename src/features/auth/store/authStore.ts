import { create } from "zustand";
import { persist } from "zustand/middleware";
import { restoreStores } from "../../../store/restoreStores";

interface Action {
    login: (profile: IUser) => void;
    logout: () => void;
}

interface State {
    isAuthenticated: boolean;
    token: string;
    profile: IUser | null;
}

const initialState: State = {
    isAuthenticated: false,
    token: '',
    profile: null,
};

export const useAuthStore = create(persist<State & Action>((set) => ({
    ...initialState,
    login: (profile: IUser) => set(() => ({ isAuthenticated: true,profile, token: profile.token })),
    logout: () => {
        set(initialState);
        restoreStores();
    },
  }),
  {
    name: 'auth',
}))

