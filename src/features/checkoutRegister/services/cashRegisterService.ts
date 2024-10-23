import { ICashRegisterDetails } from "../../../types/checkoutRegister/cashRegister";
import { PaymentType } from "../../../types/checkoutRegister/paymentTypes";
import axios from "../../../utils/axios";

const apiUrl = '/api/Caja';

export const getCashRegister = async (id: string): Promise<ICashRegisterDetails> => {
  const response = await axios.get(`${apiUrl}/obtener-caja/${id}`);
  return response.data;
};

export const createCashRegister = async (initialFund: number): Promise<ICashRegisterDetails> => {
  const response = await axios.post(`${apiUrl}/registrar-caja`, { fondoInicial: initialFund });
  return response.data;
};

export const getCashRegisterByUser = async (id: string): Promise<ICashRegisterDetails> => {
  const response = await axios.get(`${apiUrl}/obtener-caja-usuario/${id}`);
  return response.data;
};

export const deleteProductSold = async (id: string): Promise<void> => {
  const response = await axios.delete(`${apiUrl}/cancelar-venta/${id}`);
  return response.data;
};

export const createSale = async (data: {
  paymentType: PaymentType;
  cashAmount: number;
  notes?: string;
}): Promise<void> => {
  const response = await axios.post(`${apiUrl}/registrar-venta`, data);
  return response.data;
};

