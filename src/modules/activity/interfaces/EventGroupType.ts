export type EventGroupType =
  | "ENTRY"
  | "ASSIGN"
  | "RETURN"
  | "TRANSFER"
  | "EXIT"
  | "INSTALL"
  | "INSTALLED";

export const EventGroupType = {
    ENTRY: "ENTRY",
    ASSIGN: "ASSIGN",
    RETURN: "RETURN",
    TRANSFER: "TRANSFER",
    EXIT: "EXIT",
    INSTALL: "INSTALL",
    INSTALLED: "INSTALLED"
} as const;


