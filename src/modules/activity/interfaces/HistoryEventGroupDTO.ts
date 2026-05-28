import type { EventGroupType } from "./EventGroupType";
import type { SubjectSummaryDTO } from "./SubjectSummaryDTO";
import type { ProductItemHistoryEventDTO } from "./ProductItemHistoryEventDTO";
import type { ProductGenericHistoryEventDTO } from "./ProductGenericHistoryEventDTO";

export interface HistoryEventGroupDTO {
    groupId: number;
    groupType: EventGroupType;
    performedBySubject: SubjectSummaryDTO;
    fromSubject: SubjectSummaryDTO | null;
    toSubject: SubjectSummaryDTO | null;
    events: (ProductItemHistoryEventDTO | ProductGenericHistoryEventDTO)[];
    eventDate: Date;
}
