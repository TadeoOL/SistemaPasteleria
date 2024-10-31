import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../services/usersService';

export const useGetRoles = () => {
  const { data=[], isLoading } = useQuery({ queryKey: ['roles'], queryFn: getRoles });
  return { data, isLoading };
};
