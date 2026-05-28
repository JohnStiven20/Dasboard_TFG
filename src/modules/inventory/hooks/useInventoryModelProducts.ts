import { useQuery } from "@tanstack/react-query";
import type { InventoryModelProductsResponse } from "../interfaces/inventoryModelProducts";
import { getInventoryModelProducts } from "../services/inventory.service";

const emptyResponse: InventoryModelProductsResponse = {
  items: [],
  total: 0,
  page: 0,
  limit: 20,
  totalPages: 0,
};

type Params = {
  modelId?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export const useInventoryModelProducts = ({
  modelId,
  search = "",
  page = 0,
  limit = 20,
}: Params) => {
  const query = useQuery({
    queryKey: ["inventory", "model-products", modelId, search, page, limit],
    queryFn: () =>
      getInventoryModelProducts({
        modelId: modelId as number,
        search,
        page,
        limit,
      }),
    enabled: !!modelId,
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data ?? emptyResponse,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
