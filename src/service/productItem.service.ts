
import { http } from "../api/http";
import type { ProductItemDTO } from "../interface/subject/assigment";

export const getProductItemsByProductModel = async (productModelId: number) => {
  const { data } = await http.get<ProductItemDTO[]>(
    `/api/product/product-models/${productModelId}/items`
  );
  return data;
};

export const scanProductItemByQrCode = async (qrCode: string) => {
  const { data } = await http.post<ProductItemDTO>("/api/v1/scanner/output", {
    qrCode,
  });

  return data;
};
