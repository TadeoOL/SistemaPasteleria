import { create } from "zustand";
import { ICashRegisterDetails } from "../../../types/checkoutRegister/cashRegister";

interface State {
  cashRegister: ICashRegisterDetails | null;
}

const initialState: State = {
  cashRegister: null
};

interface Action {
  setCashRegister: (cashRegister: ICashRegisterDetails | null) => void;
  clearStates: () =>void
}

export const useCashRegisterStore = create<State & Action>()((set) => ({
  ...initialState,
  setCashRegister: (cashRegister) => set({ cashRegister }),
  clearStates: () => set(initialState)
}));

