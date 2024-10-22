import { useQuery } from "@tanstack/react-query";
import { getProductsInventory } from "../services/inventoryService";
import useWarehouseSelectedStore from "../store/warehouseSelected";

export const useGetProductsInvetory = () => {
  const warehouse = useWarehouseSelectedStore((state) => state.warehouse);
  
  const { data = [], isLoading } = useQuery({
    queryKey: ["productsInventory", warehouse?.id],
    queryFn: () => getProductsInventory(warehouse?.id || '')
  });

  return { data, isLoading };
};
