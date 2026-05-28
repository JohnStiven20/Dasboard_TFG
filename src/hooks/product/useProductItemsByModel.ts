

import { useQuery } from "@tanstack/react-query";
import { getProductItemsByProductModel } from "../../service/productItem.service";


export const useProductItemsByModel = (productModelId?: number) => {

  const query = useQuery({
    queryKey: ["product-items-by-model", productModelId],
    queryFn: () => getProductItemsByProductModel(productModelId as number),
    enabled: !!productModelId
  });

  return {
    items: query.data ?? [],
    refetchProductItems: query.refetch,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
};