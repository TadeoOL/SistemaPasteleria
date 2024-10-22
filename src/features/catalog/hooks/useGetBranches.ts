import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../services/branchService";

export const useGetBranches = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches
  });

  return { data, isLoading };
};

