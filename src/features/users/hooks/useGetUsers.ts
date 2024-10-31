import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/usersService';

export const useGetUsers = () => {
  const { data = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  return { data, isLoading };
};
