const apiUrl = "/api/Catalogo/Pastel"
import { ICake } from "../../../types/catalog/cake";
import axios from "../../../utils/axios"

export const getCakes = async (): Promise<ICake[]> => {
  const response = await axios.get(`${apiUrl}/obtener-pasteles`);
  return response.data;
};

export const insertCake = async (cake: ICake): Promise<ICake> => {
  const response = await axios.post(`${apiUrl}/guardar-pastel`, cake);
  return response.data;
};

export const deleteCake = async (id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/eliminar-pastel/${id}`);
};

