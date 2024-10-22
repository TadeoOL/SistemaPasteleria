import { useQuery } from "@tanstack/react-query";
import { getCakesInventory } from "../services/inventoryService";
import useWarehouseSelectedStore from "../store/warehouseSelected";

export const useGetCakesInventory = () => {
  const warehouse = useWarehouseSelectedStore((state) => state.warehouse);
  const { data=[], isLoading } = useQuery({
    queryKey: ["cakesInventory", warehouse?.id],
    queryFn: () => getCakesInventory(warehouse?.id || '')
  });
  return { data, isLoading };
};
