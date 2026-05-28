import type { ResourceType } from "./HistoryEventType";

export interface HistoryEventDTO {
    id: number;
    resourceType: ResourceType;
    productModelId: number;
    productItemId: number | null;
    productGenericId: number | null;
    productName: string;
    productIdentifierCode: string | null;
    observations: string | null;
}