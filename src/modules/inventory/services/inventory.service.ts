import { http } from "../../../api/http";
import type {
  InventoryModelProduct,
  InventoryModelProductsResponse,
} from "../interfaces/inventoryModelProducts";
import type { InventoryProductDetail } from "../interfaces/inventoryProductDetail";
import type { InventoryProductHistoryEvent } from "../interfaces/inventoryProductHistory";
import type { InventoryScannedProduct } from "../interfaces/inventoryScannedProduct";
import type { InventoryModelSummary } from "../interfaces/inventoryModelSummary";

export const getInventoryModels = async (): Promise<InventoryModelSummary[]> => {
  const { data } = await http.get<InventoryModelSummary[]>("/api/models");
  return data;
};

type GetInventoryModelProductsParams = {
  modelId: number;
  search?: string;
  page?: number;
  limit?: number;
};

type InventoryModelProductsApiResponse =
  | InventoryModelProductsResponse
  | InventoryModelProduct[]
  | {
      content?: InventoryModelProduct[] | null;
      page?: number;
      limit?: number;
      totalElements?: number;
      totalPages?: number;
    };

export const getInventoryModelProducts = async ({
  modelId,
  search = "",
  page = 0,
  limit = 20,
}: GetInventoryModelProductsParams): Promise<InventoryModelProductsResponse> => {
  const { data } = await http.get<InventoryModelProductsApiResponse>(
    `/api/models/${modelId}/products`,
    {
      params: {
        search,
        page,
        limit,
      },
    },
  );

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page,
      limit,
      totalPages: data.length === 0 ? 0 : 1,
    };
  }

  const paginatedItems =
    "items" in data && Array.isArray(data.items) ? data.items : undefined;
  const contentItems =
    "content" in data && Array.isArray(data.content) ? data.content : undefined;
  const normalizedItems = paginatedItems ?? contentItems ?? [];

  const normalizedTotal =
    "total" in data && typeof data.total === "number"
      ? data.total
      : "totalElements" in data && typeof data.totalElements === "number"
        ? data.totalElements
        : normalizedItems.length;

  return {
    items: normalizedItems,
    total: normalizedTotal,
    page: "page" in data && typeof data.page === "number" ? data.page : page,
    limit: "limit" in data && typeof data.limit === "number" ? data.limit : limit,
    totalPages:
      "totalPages" in data && typeof data.totalPages === "number" ? data.totalPages : 0,
  };
};

export const getInventoryProductDetail = async (
  productId: number,
): Promise<InventoryProductDetail> => {
  const { data } = await http.get<InventoryProductDetail>(`/api/products/${productId}`);
  return data;
};

export const getInventoryProductHistory = async (
  productId: number,
): Promise<InventoryProductHistoryEvent[]> => {
  const { data } = await http.get<InventoryProductHistoryEvent[]>(
    `/api/products/${productId}/history`,
  );

  return Array.isArray(data) ? data : [];
};

export const scanInventoryProduct = async (
  qrCode: string,
): Promise<InventoryScannedProduct> => {
  const { data } = await http.post<InventoryScannedProduct>("/api/products/scan", {
    qrCode,
  });

  return {
    ...data,
    history: Array.isArray(data?.history) ? data.history : [],
  };
};
