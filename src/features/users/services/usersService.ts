import { IRoleDto } from "../../../types/users/rol";
import { IUserDto } from "../../../types/users/user";
import axios from "../../../utils/axios";
import { AddUserSchema } from "../schema/addUserSchema";

const apiUrl = '/api/Usuario';

export const getUsers = async (): Promise<IUserDto[]> => {
  const response = await axios.get(`${apiUrl}/obtener-usuarios`);
  return response.data;
};

export const getRoles = async (): Promise<IRoleDto[]> => {
  const response = await axios.get(`${apiUrl}/obtener-roles`);
  return response.data;
};

export const addUser = async (data: Omit<AddUserSchema, 'id'>): Promise<IUserDto> => {
  const response = await axios.post(`${apiUrl}/guardar-usuario`, data);
  return response.data;
};

export const updateUser = async (data: AddUserSchema): Promise<IUserDto> => {
  const response = await axios.put(`${apiUrl}/modificar-usuario`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await axios.delete(`${apiUrl}/eliminar-usuario/${id}`);
  return response.data;
};
