import { useQuery } from '@tanstack/react-query';
import { getCakes } from '../services/cakeService';

export const useGetCakes = () => {
  const { data=[], isLoading } = useQuery({
    queryKey: ['cakes'],
    queryFn: getCakes
  });

  return { data, isLoading };
};
