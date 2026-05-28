import { http } from "../../../api/http";

export type InstallProductItemRequest = {
  remarks: string | null;
};

export async function installAssignedProductItem(
  productItemId: number,
  request: InstallProductItemRequest = { remarks: null }
): Promise<void> {
  await http.post(`api/product/items/${productItemId}/install`, request);
}
