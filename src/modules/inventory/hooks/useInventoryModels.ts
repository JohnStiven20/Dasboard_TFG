import { useQuery } from "@tanstack/react-query";
import { getInventoryModels } from "../services/inventory.service";

const inventoryKeys = {
  models: () => ["inventory", "models"] as const,
};

export const useInventoryModels = () => {
  const query = useQuery({
    queryKey: inventoryKeys.models(),
    queryFn: getInventoryModels,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
