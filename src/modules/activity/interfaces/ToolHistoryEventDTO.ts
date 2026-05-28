import type { HistoryEventDTO } from "./HistoryEventDTO";

export interface ToolHistoryEventDTO extends HistoryEventDTO {
    toolName: string;
}