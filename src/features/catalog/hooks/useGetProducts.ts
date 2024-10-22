import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export const useGetProducts = () => {
  const { data=[], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  return { data, isLoading };
};
