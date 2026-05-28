import type { InventoryProductDetail } from "./inventoryProductDetail";
import type { InventoryProductHistoryEvent } from "./inventoryProductHistory";

export type InventoryScannedProduct = {
  productId: number;
  mac: string;
  detail: InventoryProductDetail;
  history: InventoryProductHistoryEvent[];
};
