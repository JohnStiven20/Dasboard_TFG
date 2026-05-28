import { http } from "../../../api/http"
import type { ProductGenericBasic, RequestCreateProductGeneric, ResponseCreateProductGeneric } from "../../../interface/product/product.inteface";




export const getAllProductGeneric = async (): Promise<ProductGenericBasic[]> => {
    const { data } = await http.get<ProductGenericBasic[]>("/api/product/generic");
    return data;
}


export const createProductGeneric = async (request: RequestCreateProductGeneric): Promise<ResponseCreateProductGeneric> => {
    const { data } = await http.post<ResponseCreateProductGeneric>("/api/product/generic", request);
    return data;
}
