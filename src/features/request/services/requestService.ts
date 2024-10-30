import { ICreateRequest, IRequest } from '../../../types/request/request';
import axios from '../../../utils/axios';

const apiUrl = '/api/SolicitudEntrega';

export const getRequests = async (branchId: string): Promise<IRequest[]> => {
  const response = await axios.get(`${apiUrl}/obtener-solicitudes/${branchId}`);
  return response.data;
};

export const createRequest = async (request: ICreateRequest): Promise<IRequest> => {
  const response = await axios.post(`${apiUrl}/registrar-solicitud`, request);
  return response.data;
};

export const changeRequestStatus = async (requestId: string, status: number, warehouseId: string): Promise<IRequest> => {
  const response = await axios.put(`${apiUrl}/estatus-solicitud/${requestId}`, { estatus: status, id_Almacen: warehouseId });
  return response.data;
};
