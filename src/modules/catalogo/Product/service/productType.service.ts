import { http } from "../../../../api/http"
import type { ProductType } from "../../interface/productType"


export const getProductTypes = async (): Promise<ProductType[]> => {
  const { data } = await http.get<ProductType[]>("/api/product-types")
  return data
}