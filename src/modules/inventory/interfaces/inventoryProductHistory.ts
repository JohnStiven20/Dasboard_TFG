export type InventoryProductHistoryEvent = {
  eventId: number;
  groupId: number | null;
  eventType: string;
  eventDate: string;
  fromSubjectName: string | null;
  toSubjectName: string | null;
  performedByName: string | null;
  observations: string | null;
};
