import { ICakeInventory } from "../../../types/inventoryManagment/cakeInventory";
import { IProductInventory } from "../../../types/inventoryManagment/productInventory";
import axios from "../../../utils/axios";
const apiUrl = "/api/Inventario"

export const getProductsInventory = async (warehouseId: string): Promise<IProductInventory[]> => {
  const { data } = await axios.get(`${apiUrl}/obtener-inventario-productos/${warehouseId}`);
  return data;
};

export const insertProductInventory = async (data: IProductInventory): Promise<IProductInventory> => {
  const res = await axios.post(`${apiUrl}/modificar-inventario-productos`, data);
  return res.data;
};

export const deleteProductInventory = async (id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/eliminar-inventario-producto/${id}`);
};

export const getCakesInventory = async (warehouseId: string): Promise<ICakeInventory[]> => {
  const { data } = await axios.get(`${apiUrl}/obtener-inventario-pasteles/${warehouseId}`);
  return data;
};

export const insertCakeInventory = async (data: ICakeInventory): Promise<ICakeInventory> => {
  const res = await axios.post(`${apiUrl}/modificar-inventario-pasteles`, data);
  return res.data;
};
