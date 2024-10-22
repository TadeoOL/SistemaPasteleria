import { IInventoryManagment } from "./inventoryManagment";


interface IProductInventory extends IInventoryManagment {  
  id_Producto: string;
}

export type { IProductInventory };
