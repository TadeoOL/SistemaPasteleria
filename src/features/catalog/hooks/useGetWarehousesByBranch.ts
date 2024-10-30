import { useQuery } from '@tanstack/react-query';
import { getWarehousesByBranch } from '../services/warehouseService';

export const useGetWarehousesByBranch = (branchId: string) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['warehousesByBranch', branchId],
    queryFn: () => getWarehousesByBranch(branchId)
  });
  return { data, isLoading };
};
