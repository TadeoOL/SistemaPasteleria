import { useCashRegisterStore } from "../features/checkoutRegister/store/cashRegister";
import useWarehouseSelectedStore from "../features/inventoryManagment/store/warehouseSelected";
import { menuMasterStore } from "./layout/menuMasterStore";

export const restoreStores = () => {
  menuMasterStore.getState().clearStates();
  useWarehouseSelectedStore.getState().clearStates();
  useCashRegisterStore.getState().clearStates();
}
