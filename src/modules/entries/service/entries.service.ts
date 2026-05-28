import { http } from "../../../api/http";
import type IdentifiedProduct from "../../../interface/entries/entries";
import type { PendingProductGeneric } from "../interface/ProductGenericEntry";



// ESTE QUE MIRARLO BIEN YA ESTO NO ESTA MUY BIEN HECHO
// HAGO ESPECIE DE DTO. YA QUE EL CAMPO NAME, ME LO TOMA SIEMPRE
// CON EL NOMBRE PRODUCTNAME
interface IdentifiedProductApiResponse {
  name?: string;
  productName?: string;
  identifier?: string | null;
  mac: string;
}

export interface CreateEntriesPayload {
  genericProducts: PendingProductGeneric[];
  productItems: IdentifiedProduct[];
}

const normalizeIdentifiedProduct = (product: IdentifiedProductApiResponse): IdentifiedProduct => {
  return {
    name: product.name ?? product.productName ?? "",
    productIdentifierCode:
    product.identifier ?? "",
    mac: product.mac,
  };
};

export const identifyProductByQr = async (qrCode: string): Promise<IdentifiedProduct> => {
  const response = await http.post<IdentifiedProductApiResponse>("/api/v1/scanner", { qrCode });
  console.log(response);
  return normalizeIdentifiedProduct(response.data);
}

export const getProductIdentifiersByProductModelName = async (name: string): Promise<string[]> => {
  const response = await http.post<string[]>(`/api/product-models/identifiers`, { name });
  return response.data;
}

export const createEntries = async (entries: CreateEntriesPayload): Promise<boolean> => {

  const normalizedEntries: CreateEntriesPayload = {
    genericProducts: entries.genericProducts.map((generic) => {
      return {
        id: generic.id,
        name: generic.name,
        quantity: generic.quantity,
        productIdentifierCode: generic.identifier,
      };
    }),
    productItems: entries.productItems,
  };

  const response = await http.post<boolean>("/api/product/create", normalizedEntries);
  return response.status == 200;

}


