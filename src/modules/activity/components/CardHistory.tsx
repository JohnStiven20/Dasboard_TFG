import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { memo, type ReactNode } from "react";
import type { EventGroupType } from "../interfaces/EventGroupType";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import type { SubjectSummaryDTO } from "../interfaces/SubjectSummaryDTO";
import { formatDateTime } from "../../../utils/formatDateTime";




type Props = {
  onClick?: () => void;
  children?: ReactNode;
  variant?: CardHistoryVariant;
  itemCount?: number;
  performedBy?: string;
  date?: Date | string;
  fromSubject?: SubjectSummaryDTO | null;
  toSubject?: SubjectSummaryDTO | null;
};

export type CardHistoryVariant = EventGroupType;

type CardHistoryVariantConfig = {
  title: string;
  tag: string;
  icon: SvgIconComponent;
  accentColor: string;
  chipBackground: string;
  chipColor: string;
};

const CARD_HISTORY_VARIANTS: Record<EventGroupType, CardHistoryVariantConfig> = {
  ENTRY: {
    title: "Entrada",
    tag: "Entrada",
    icon: SouthRoundedIcon,
    accentColor: "#0a9d45",
    chipBackground: "#cfead8",
    chipColor: "#0b6b35",
  },
  ASSIGN: {
    title: "Asignación",
    tag: "Asignación",
    icon: AssignmentTurnedInOutlinedIcon,
    accentColor: "#2563eb",
    chipBackground: "#dbeafe",
    chipColor: "#1d4ed8",
  },
  RETURN: {
    title: "Devolución",
    tag: "Devolución",
    icon: KeyboardReturnOutlinedIcon,
    accentColor: "#d97706",
    chipBackground: "#fef3c7",
    chipColor: "#b45309",
  },
  EXIT: {
    title: "Salida",
    tag: "Salida",
    icon: LogoutRoundedIcon,
    accentColor: "#dc2626",
    chipBackground: "#fee2e2",
    chipColor: "#b91c1c",
  },

  INSTALL: {
    title: "Instalación",
    tag: "instalación",
    icon: CheckCircleOutlineRoundedIcon,
    accentColor: "#0f766e",
    chipBackground: "#ccfbf1",
    chipColor: "#115e59",
  },
  INSTALLED: {
    title: "Instalado",
    tag: "Instalado",
    icon: CheckCircleOutlineRoundedIcon,
    accentColor: "#0f766e",
    chipBackground: "#ccfbf1",
    chipColor: "#115e59",
  },
  TRANSFER: {
    title: "Transferencia",
    tag: "Transferencia",
    icon: SwapHorizRoundedIcon,
    accentColor: "#7c3aed",
    chipBackground: "#ede9fe",
    chipColor: "#6d28d9",
  },


};

const formatItemCount = (itemCount?: number): string => {
  const total = itemCount ?? 0;
  return `${total} ${total === 1 ? "item" : "items"} ${total === 1 ? "registrado" : "registrados"
    }`;
};

const formatEventDate = (date?: Date | string): string => {
  return formatDateTime(date);
};

const formatSubjectName = (subject?: SubjectSummaryDTO | null): string => {
  if (!subject) return "-";

  return subject.name.trim();
};

const CardHistory = memo(function CardHistory({
  children,
  onClick,
  variant,
  itemCount,
  performedBy,
  date,
  fromSubject,
  toSubject
}: Props) {
  const header = variant ? CARD_HISTORY_VARIANTS[variant] : null;
  const relatedSubject =
    variant === "ASSIGN"
      ? { label: "Asignado a:", value: formatSubjectName(toSubject) }
      : variant === "INSTALL" || variant === "INSTALLED"
        ? {
            label: "Instalado en:",
            value: formatSubjectName(toSubject ?? fromSubject),
          }
        : variant === "RETURN"
          ? { label: "Retirado de:", value: formatSubjectName(fromSubject) }
          : null;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
    
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: 760,
        minWidth: 0,
        alignSelf: "center",
        flexDirection: "column",
        gap: { xs: "0.55rem", sm: "0.65rem" },
        p: { xs: "0.75rem", sm: "0.9rem" },
        borderRadius: "1rem",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(185, 185, 185, 0.7)",
        fontFamily: "var(--font-family)",
        cursor: onClick ? "pointer" : "default",
      }}
    >


      {header && (
        <Stack direction="row" minWidth={0} alignItems="flex-start" gap={1.5}>

          <header.icon
            sx={{
              fontSize: { xs: 30, sm: 34 },
              color: header.accentColor,
              mt: 0.25,
            }}
          />

          <Stack gap={0.75}>
            <Stack direction="row" alignItems="center" gap={1.25} flexWrap="wrap">
              {/* <Typography
                variant="h6"
                sx={{ fontSize: "1.05rem", fontWeight: 500, color: "#0f1720" }}
              >
                {header.title}
              </Typography> */}
              <Chip
                label={header.tag}
                size="small"
                sx={{
                  backgroundColor: header.chipBackground,
                  color: header.chipColor,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              />
            </Stack>

            <Stack>
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  color: "#4b5563",
                  fontWeight: 500,
                }}
              >
                {formatEventDate(date)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.75}>
              <Inventory2OutlinedIcon sx={{ fontSize: 18, color: "#6d7285" }} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#67748a",
                  fontWeight: 500,
                }}
              >
                {formatItemCount(itemCount)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      <Stack
        key={performedBy}
        spacing={0.75}
        sx={{
          width: "100%",
          pb: 1,
          borderBottom: "1px solid rgba(208, 213, 221, 0.8)",
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.5}>
          <PersonOutlineRoundedIcon
            sx={{
              fontSize: 20,
              color: "#667085",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#111827",
              lineHeight: 1.2,
            }}

          >
            <Typography
              component="span"
              sx={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#111827",

              }}
            >
              Responsable:
            </Typography>{" "} {`${performedBy}`}
          </Typography>
        </Stack>
        {relatedSubject && relatedSubject.value !== "-" && (
          <Stack direction="row" alignItems="center" gap={0.5}>
            <PersonOutlineRoundedIcon
              sx={{
                fontSize: 20,
                color: "#667085",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {relatedSubject.label}
              </Typography>{" "} {relatedSubject.value}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack spacing="0.65rem">{children}</Stack>
    </Paper>
  );
});

export default CardHistory;
