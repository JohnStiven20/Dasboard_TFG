export type InventoryProductDetail = {
  productId: number;
  modelId: number;
  modelName: string;
  productIdentifierId: number | null;
  mac: string;
  productIdentifierCode: string | null;
  status: string;
  remarks: string | null;
  workerId: number | null;
  workerName: string | null;
  createdAt: string;
  updatedAt: string;
};
