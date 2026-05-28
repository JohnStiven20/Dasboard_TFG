export type InventoryModelProduct = {
  productId: number;
  productIdentifierCode: string | null;
  mac: string;
  status: string;
};

export type InventoryModelProductsResponse = {
  items: InventoryModelProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
