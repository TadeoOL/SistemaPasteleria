import IProduct from "../../../types/catalog/product";
import axios from "../../../utils/axios";

const apiUrl = '/api/Catalogo/Producto';

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await axios.get(`${apiUrl}/obtener-productos`);
  return response.data;
};

export const insertProduct = async (product: IProduct) => {
  const response = await axios.post(`${apiUrl}/guardar-producto`, product);
  return response.data;
};


export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/eliminar-producto/${id}`);
  return response.data;
};

