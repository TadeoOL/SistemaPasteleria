import { IWarehouse } from '../../../types/catalog/warehouse';
import axios from '../../../utils/axios';

const apiUrl = '/api/Catalogo/Almacen';

export const getWarehouses = async () => {
  const response = await axios.get(`${apiUrl}/obtener-almacenes`);
  return response.data;
};

export const insertWarehouse = async (data: IWarehouse) => {
  const response = await axios.post(`${apiUrl}/guardar-almacen`, data);
  return response.data;
};

export const updateWarehouse = async (data: IWarehouse) => {
  const response = await axios.put(`${apiUrl}/editar-almacen`, data);
  return response.data;
};

export const deleteWarehouse = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/eliminar-almacen/${id}`);
  return response.data;
};

export const getWarehousesByBranch = async (branchId: string): Promise<IWarehouse[]> => {
  const response = await axios.get(`${apiUrl}/obtener-almacenes-por-sucursal/${branchId}`);
  return response.data;
};
