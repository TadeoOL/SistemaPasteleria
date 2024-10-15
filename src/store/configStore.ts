import { create } from "zustand";
import { MenuOrientation, ThemeMode } from "../config";
import { I18n } from "../types/config";

interface State {
  mode: ThemeMode;
  menuOrientation: MenuOrientation;
  i18n: I18n;
}

interface Action {
    setMode: (mode: ThemeMode) => void;
    setMenuOrientation: (menuOrientation: MenuOrientation) => void;
}

const initialState: State = {
  mode: ThemeMode.LIGHT,
  menuOrientation: MenuOrientation.VERTICAL,
  i18n: "es"
};

export const useConfigStore = create<State & Action>((set) =>  ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setMenuOrientation: (menuOrientation) => set({ menuOrientation }),
}));

