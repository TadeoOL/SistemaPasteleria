import { useQuery } from '@tanstack/react-query';
import { getCashRegister } from '../services/cashRegisterService';

export const useGetCashRegister = (id: string) => {
  return useQuery({ queryKey: ['cashRegister', id], queryFn: () => getCashRegister(id) });
};
