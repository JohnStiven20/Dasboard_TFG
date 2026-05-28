import type {  GenericReturnDTO } from "../../../interface/subject/assigment";

export interface ReturnAssignment {
  workerId: number;
  productItemIds: number[];
  productGenerics: GenericReturnDTO[];
  toolIds: number[];
}