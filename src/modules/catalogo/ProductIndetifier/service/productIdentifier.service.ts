import { http } from "../../../../api/http";
import type {
  ProductIdentifier,
  ProductIdentifierCreate,
  ProductIdentifiersByModel,
  ProductIdentifierUpdate,
} from "../type/productIdentifier.interface";

export const getIdentifiersByModel = async (
  productModelId: number,
): Promise<ProductIdentifiersByModel> => {
  const { data } = await http.get<ProductIdentifiersByModel>(
    `/api/product-identifiers/by-model/${productModelId}`,
  );
  return data;
};

export const getAllIdentifiers = async (): Promise<ProductIdentifier[]> => {
  const { data } = await http.get<ProductIdentifier[]>(
    "/api/product-identifiers",
  );
  return data;
};

export const createIdentifier = async (
  payload: ProductIdentifierCreate,
): Promise<ProductIdentifier> => {
  const { data } = await http.post<ProductIdentifier>(
    "/api/product-identifiers",
    payload,
  );
  return data;
};

export const updateIdentifier = async (
  id: number,
  payload: ProductIdentifierUpdate,
): Promise<ProductIdentifier> => {
  const { data } = await http.put<ProductIdentifier>(
    `/api/product-identifiers/${id}`,
    payload,
  );
  return data;
};

export const deleteIdentifier = async (id: number): Promise<void> => {
  await http.delete(`/api/product-identifiers/${id}`);
};
