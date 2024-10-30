import { useQuery } from '@tanstack/react-query';
import { getRequests } from '../services/requestService';

export const useGetRequests = (branchId: string) => {
  const { data = [], isLoading } = useQuery({ queryKey: ['requests', branchId], queryFn: () => getRequests(branchId) });
  return { data, isLoading };
};
