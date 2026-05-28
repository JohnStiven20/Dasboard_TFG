export interface ProductIdentifier {
  id: number;
  code: string;
  productModelId: number;
}

export interface ProductIdentifiersByModel {
  productModelId: number;
  productModelName: string;
  /** Códigos como strings simples (respuesta del endpoint by-model) */
  identifiers: string[];
}

export interface ProductIdentifierCreate {
  code: string;
  productModelId: number;
}

export interface ProductIdentifierUpdate {
  code: string;
  productModelId: number;
}
