import { http } from "../../../api/http"
import type { ProductItemComplex } from "../../../interface/product/DatamatrixProductItem.interface";

import type { ProductItemDTO } from "../../../interface/subject/assigment";
import { scanProductItemByQrCode } from "../../../service/productItem.service";
import type { ProductExitDTO } from "../interface/ProductExitDTO";


export const scanOutputProduct = async (scanner: string): Promise<ProductItemDTO> => {
    return scanProductItemByQrCode(scanner);
};

export const markAsBroken = async (id: number, remarks: string) => {
    const response = await http.post<ProductItemDTO>(`/api/v1/scanner/output/${id}`, {
        id: id,
        remarks: remarks,
    });

    return response.data;
}

export const exitGenericProduct = async (genericProductId: number, amount: number, reason: string): Promise<void> => {
    await http.post("/api/product/generic/exit", { genericProductId, amount, reason });
};

export const findDataMatrixItemByProduct = async (id: number): Promise<ProductItemDTO[]> => {
    const { data } = await http.get<ProductItemDTO[]>(`/api/v1/scanner/product/${id}`);
    return data;
}

export const findByDataMatrixItemByDate = async (): Promise<ProductItemComplex> => {
    const { data } = await http.get<ProductItemComplex>("/api/v1/scanner/availables");
    return data;
};

export const exitProduct = async (productExitDTO: ProductExitDTO): Promise<void> => {
    await http.post("/api/product/exit", productExitDTO);
};
