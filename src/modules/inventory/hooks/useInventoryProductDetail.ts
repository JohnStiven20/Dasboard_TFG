import { useQuery } from "@tanstack/react-query";
import { getInventoryProductDetail } from "../services/inventory.service";

export const useInventoryProductDetail = (productId?: number | null) => {
  const query = useQuery({
    queryKey: ["inventory", "product-detail", productId],
    queryFn: () => getInventoryProductDetail(productId as number),
    enabled: typeof productId === "number",
  });

  return {
    detail: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
