import { create } from "zustand";
import { persist } from "zustand/middleware";
import { restoreStores } from "../../../store/restoreStores";
import { IUserDto } from "../../../types/users/user";

interface Action {
    login: (profile: IUserDto) => void;
    logout: () => void;
}

interface State {
    isAuthenticated: boolean;
    token: string;
    profile: IUserDto | null;
}

const initialState: State = {
    isAuthenticated: false,
    token: '',
    profile: null,
};

export const useAuthStore = create(persist<State & Action>((set) => ({
    ...initialState,
    login: (profile: IUserDto) => set(() => ({ isAuthenticated: true, profile, token: profile.token })),
    logout: () => {
        set(initialState);
        restoreStores();
    },
  }),
  {
    name: 'auth',
}))

