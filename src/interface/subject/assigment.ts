import type { DatamatrixProductItem } from "../product/DatamatrixProductItem.interface";
import type { Tool } from "../tools/tools.interface";
import type { Worker } from "./subject";


export interface ItemsByProduct {
  [productName: string]: DatamatrixProductItem[];
}

export interface AssignmetResponse {
  itemsByProduct: ItemsByProduct;
  worker: Worker,
}


export interface AssignmentByWorkerAndDateRequest {
  workerId: number;
}




export interface AssignmentDataMatrixItemByWorkerDTO {
  date: string,
  datamatrix: DatamatrixProductItem
}

export interface AssignmentProductGenericByWorkerDTO {
  id: number
  name: string,
  date: string,
  amount: number
}



export interface AssignmentByWorker {
  productGenericItems: AssignmentProductGenericByWorkerDTO[];
  dataMatrixItems: AssignmentDataMatrixItemByWorkerDTO[];
}

export interface AssignmentByWorkerRequest {
  workerId: number;
  specificProductItemIds: number[];
  genericProductIds: {
    id: number;
    quantity: number;
  }[],
  toolsIds: number[];
}



export type DatamatrixItemsByProduct =
  Record<string, DatamatrixProductItem[]>;


export type GenericStockByProduct =
  Record<string, AssignmentProductGenericByWorkerDTO[]>;


export interface GenericProductBasicDTO {
  id: number;
  name: string;
  quantity: number;
}




export interface GenericReturnDTO {
    genericProductId:number;
    quantity:number;
}

export interface ProductItemDTO {
  id: number;
  name: string;
  mac: string;
  date:string
}
export interface WorkerStockDTO {
  tools: Tool[];
  productItems: Record<string, ProductItemDTO[]>;
  genericProducts: GenericProductBasicDTO[];
}

export interface WorkerStockDTOUI {
  tools: Tool[];
  productItems:  ProductItemDTO[];
  genericProducts: GenericProductBasicDTO[];
}



export type TimelineType = "ASSIGNMENT_DATAMATRIX" | "ASSIGNMENT_GENERIC";

export interface TimelineItemWorker {
  type: TimelineType;
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}