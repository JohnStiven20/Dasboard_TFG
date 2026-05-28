import { useMutation, useQuery } from "@tanstack/react-query"

import type { RequestCreateProductGeneric } from "../../../interface/product/product.inteface";
import { createProductGeneric, getAllProductGeneric } from "../service/product.service";


const productKeys = {
    list: () => ["product", "list"],
    listGeneric: () => ["listGeneric", "list"]

}

export const useProduct = () => {

    // const list = useQuery({
    //     queryKey: productKeys.list(),
    //     queryFn: getAllProduct,
    // });

    const listGeneric = useQuery({
        queryKey: productKeys.listGeneric(),
        queryFn: getAllProductGeneric
    })

    // const productModels = useQuery({
    //     queryKey: productKeys.listGeneric(),
    //     queryFn: () => {
            
    //     }
    // })

    const saveGenericMut = useMutation({
        mutationFn: (request: RequestCreateProductGeneric) => createProductGeneric(request)
    })


    return {
        // items: list.data ?? [],
        // isLoading: list.isLoading,
        productGenerics: listGeneric.data ?? [],
        isLoadingGeneric: listGeneric.isLoading,
        saveGeneric: saveGenericMut.mutateAsync

    }
}