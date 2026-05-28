export type AssignedProductItemStatus = "ASSIGNED" | "INSTALLED" | "ACTIVE" | "BROKEN";

export interface AssignedProductItem {
  productItemId: number;
  mac: string;
  productIdentifierCode: string | null;
  status: AssignedProductItemStatus;
}

export interface AssignedProductItemsByModel {
  modelId: number;
  modelName: string;
  totalProducts: number;
  products: AssignedProductItem[];
}
