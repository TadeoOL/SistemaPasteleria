import { create } from "zustand";
import { IWarehouse } from "../../../types/catalog/warehouse";

interface Action {
  setWarehouse: (warehouse: IWarehouse | null) => void;
}

interface State {
  warehouse: IWarehouse | null;
}

const initialState: State = {
  warehouse: null
};

const useWarehouseSelectedStore = create<State & Action>()((set) => ({
  ...initialState,
  setWarehouse: (warehouse) => set({ warehouse })
}));

export default useWarehouseSelectedStore;
