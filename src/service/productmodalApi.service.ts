import { http } from "../api/http"
import type { UnitProductModel } from "../interface/productModel/interface/productmodel.interface";

export const getUnitProductModels = async () => {
  const { data } = await http.get<UnitProductModel[]>("/api/product-models/units");
  return data;
};