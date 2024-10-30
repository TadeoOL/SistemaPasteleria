import { CashRegisterWithdrawa, ICashRegisterDetails, ICashRegisterSales, ISaleDetails } from "../../../types/checkoutRegister/cashRegister";
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

export const deleteSale = async (id: string): Promise<void> => {
  const response = await axios.delete(`${apiUrl}/cancelar-venta/${id}`,{
    params: {
      motivoCancelacion: 'Venta cancelada'
    }
  });
  return response.data;
};

export const createSale = async (data: {
  paymentType: PaymentType;
  cashAmount: number;
  notes?: string;
  totalAmount: number;
  cashRegisterId: string;
  saleDetails: ISaleDetails[];
  isAdvancePayment: boolean;
}): Promise<ICashRegisterSales> => {
  const response = await axios.post(`${apiUrl}/registrar-venta`, {
    tipoPago: data.paymentType,
    montoPago: data.cashAmount,
    totalVenta: data.totalAmount,
    notas: data.notes,
    id_Caja: data.cashRegisterId,
    detalleVentas: data.saleDetails,
    esAnticipo: data.isAdvancePayment
  });
  return response.data;
};

export const closeCashRegister = async (cashAmount: string, cashRegisterId: string): Promise<void> => {
  const response = await axios.post(`${apiUrl}/cerrar-caja/${cashRegisterId}`, { dineroCorte: cashAmount });
  return response.data;
};

export const withdrawMoney = async (cashAmount: string, cashRegisterId: string): Promise<CashRegisterWithdrawa> => {
  const response = await axios.post(`${apiUrl}/registrar-retiro`, { totalRetiro: cashAmount, id_Caja: cashRegisterId });
  return response.data;
};

export const finishAdvance = async (data: {
  cashRegisterId: string;
  saleId: string;
  cashAmount: number;
  paymentType: PaymentType;
}): Promise<ICashRegisterSales> => {
  const response = await axios.post(`${apiUrl}/liquidar-anticipo`, { id_Caja: data.cashRegisterId, id_CajaVenta: data.saleId, montoPago: data.cashAmount, tipoPago: data.paymentType });
  return response.data;
};

