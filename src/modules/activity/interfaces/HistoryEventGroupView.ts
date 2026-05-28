import type { EventGroupType } from "./EventGroupType";
import type { ProductGenericHistoryEventDTO } from "./ProductGenericHistoryEventDTO";
import type { ProductItemHistoryEventDTO } from "./ProductItemHistoryEventDTO";
import type { SubjectSummaryDTO } from "./SubjectSummaryDTO";

export interface HistoryItemCodeGroup {
  code: string;
  items: ProductItemHistoryEventDTO[];
}

export interface HistoryItemProductGroup {
  productName: string;
  total: number;
  codes: HistoryItemCodeGroup[];
}

export interface HistoryGenericCodeGroup {
  code: string;
  quantity: number;
  items: ProductGenericHistoryEventDTO[];
}

export interface HistoryGenericProductGroup {
  productName: string;
  quantity: number;
  codes: HistoryGenericCodeGroup[];
}

export interface HistoryEventGroupView {
  groupId: number;
  groupType: EventGroupType;
  performedBySubject: SubjectSummaryDTO;
  fromSubject: SubjectSummaryDTO | null;
  toSubject: SubjectSummaryDTO | null;
  eventDate: Date;
  itemCount: number;
  itemGroups: HistoryItemProductGroup[];
  genericGroups: HistoryGenericProductGroup[];
}
