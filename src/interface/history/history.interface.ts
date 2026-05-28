import type { DatamatrixProductItem } from "../product/DatamatrixProductItem.interface";
import type { ProductGenericBasic } from "../product/product.inteface";
import type { Worker } from "../subject/subject";


export interface AssignmentHistory {
  worker: Worker;
  datamatrixProductItemDTO: DatamatrixProductItem;
  date: string;
}

export interface AssignmentProductGeneric {
  worker: Worker;
  productbasic: ProductGenericBasic;
  amount: number;
  date: string;
}

export interface ProductMovementHistory {
  id: number;
  amount: number;
  dateTime: string;
  name: string;
}

export type ProductMoventHistory = ProductMovementHistory;

export interface History {
  datamatrixProductItem: DatamatrixProductItem[];
  assignment: AssignmentHistory[];
  assignmentProductGeneric: AssignmentProductGeneric[];
  productMovement: ProductMovementHistory[];
  date: string;
}

export type TimelineEventType = "ASSIGNMENT" | "ENTRY" | "ASSIGNMENT_GENERIC" | "ENTRY_GENERIC";
export type TimelineType = TimelineEventType | "ALL";

export type TimelineItem =
  | { type: "ASSIGNMENT"; date: string; payload: AssignmentHistory }
  | { type: "ENTRY"; date: string; payload: DatamatrixProductItem }
  | { type: "ASSIGNMENT_GENERIC"; date: string; payload: AssignmentProductGeneric }
  | { type: "ENTRY_GENERIC"; date: string; payload: ProductMovementHistory }

