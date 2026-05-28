import { useQuery } from "@tanstack/react-query"
import { getProductGenericAvailable } from "../../service/productgeneric.service"

export const useAvailableGenericProducts = () => {

    const productGenericAvailableMut = useQuery({
        queryKey: ["availables", "generic"],
        queryFn: () => getProductGenericAvailable()
    })


    return {
        items: productGenericAvailableMut.data ?? [],
        isLoading: productGenericAvailableMut.isLoading,
        isPeding: productGenericAvailableMut.isPending
    }

}