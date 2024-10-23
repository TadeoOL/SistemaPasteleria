import { create } from "zustand";
import { IWarehouse } from "../../../types/catalog/warehouse";

interface Action {
  setWarehouse: (warehouse: IWarehouse | null) => void;
  clearStates: () => void;
}

interface State {
  warehouse: IWarehouse | null;
}

const initialState: State = {
  warehouse: null
};

const useWarehouseSelectedStore = create<State & Action>()((set) => ({
  ...initialState,
  setWarehouse: (warehouse) => set({ warehouse }),
  clearStates: () => set(initialState)
}));

export default useWarehouseSelectedStore;
