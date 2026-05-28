import dayjs from "dayjs";
import type { TimelineItem } from "../../../interface/history/history.interface";
import { ResourceType } from "../interfaces/HistoryEventType";
import type { ProductGenericHistoryEventDTO } from "../interfaces/ProductGenericHistoryEventDTO";
import type { ProductItemHistoryEventDTO } from "../interfaces/ProductItemHistoryEventDTO";
import type { HistoryEventGroupDTO } from "../interfaces/HistoryEventGroupDTO";

const resolveEventDate = (
  event: Record<string, unknown>,
  fallbackDate: string,
): string => {
  if (typeof event["occurredAt"] === "string") return event["occurredAt"];
  if (typeof event["date"] === "string") return event["date"];
  if (typeof event["dateTime"] === "string") return event["dateTime"];
  return fallbackDate;
};

const resolveGroupDate = (value: Date | string): string => {
  return value instanceof Date ? value.toISOString() : value;
};

export const buildHistoryTimeline = (groups: HistoryEventGroupDTO[]): TimelineItem[] => {
  const timeline: TimelineItem[] = [];

  groups.forEach((group) => {
    group.events.forEach((event) => {
      const rawEvent = event as unknown as Record<string, unknown>;
      const eventDate = resolveEventDate(rawEvent, resolveGroupDate(group.eventDate));

      if (event.resourceType === ResourceType.ITEM) {
        const entryItem = event as ProductItemHistoryEventDTO;
        timeline.push({
          type: "ENTRY",
          date: eventDate,
          payload: {
            id: event.id,
            name: entryItem.productName,
            code: entryItem.productIdentifierCode ?? "Sin codigo",
            date: eventDate,
          },
        });
        return;
      }

      if (event.resourceType === ResourceType.GENERIC) {
        const entryGeneric = event as ProductGenericHistoryEventDTO;
        timeline.push({
          type: "ENTRY_GENERIC",
          date: eventDate,
          payload: {
            id: event.id,
            amount: entryGeneric.quantity,
            dateTime: eventDate,
            name: entryGeneric.productName,
          },
        });
      }
    });
  });

  return timeline.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};
