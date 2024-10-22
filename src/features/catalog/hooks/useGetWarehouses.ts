import { useQuery } from '@tanstack/react-query';
import { getWarehouses } from '../services/warehouseService';

export const useGetWarehouses = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => getWarehouses()
  });

  return { data, isLoading };
};
