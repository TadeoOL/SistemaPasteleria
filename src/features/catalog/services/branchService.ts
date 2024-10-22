import { IBranch } from "../../../types/catalog/branch";
import axios from "../../../utils/axios";

const apiURL = '/api/Catalogo/Sucursal';

export const getBranches = async (): Promise<IBranch[]> => {
  const response = await axios.get(`${apiURL}/obtener-sucursales`);
  return response.data;
};

export const deleteBranch = async (id: string): Promise<void> => {
  await axios.delete(`${apiURL}/eliminar-sucursal/${id}`);
};

export const insertBranch = async (data: IBranch): Promise<IBranch> => {
  const response = await axios.post(`${apiURL}/guardar-sucursal`, data);
  return response.data;
};

