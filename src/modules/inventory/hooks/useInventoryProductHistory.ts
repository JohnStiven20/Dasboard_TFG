import { useQuery } from "@tanstack/react-query";
import { getInventoryProductHistory } from "../services/inventory.service";

export const useInventoryProductHistory = (productId?: number | null) => {
  const query = useQuery({
    queryKey: ["inventory", "product-history", productId],
    queryFn: () => getInventoryProductHistory(productId as number),
    enabled: typeof productId === "number",
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
