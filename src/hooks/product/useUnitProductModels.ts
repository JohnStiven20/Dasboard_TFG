import { useQuery } from "@tanstack/react-query"
import { getUnitProductModels } from "../../service/productmodalApi.service";


export const useUnitProductModels = () => {
    const unitProductModelsQuery = useQuery({
        queryKey: ["unit-product-models"],
        queryFn: getUnitProductModels,
    });

    return {
        items: unitProductModelsQuery.data ?? [],
    };
};