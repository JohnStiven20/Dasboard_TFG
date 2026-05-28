import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { PendingProductGeneric } from "../interface/ProductGenericEntry";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/Remove";

type PendingProductGenericGroup = {
  modelName: string;
  total: number;
  identifiers: Array<{
    displayIdentifier: string;
    item: PendingProductGeneric;
    index: number;
  }>;
};

type Props = {
  groups: PendingProductGenericGroup[];
  onIncrement: (item: PendingProductGeneric) => void;
  onDecrement: (index: number) => void;
  onRemove: (index: number) => void;
};

const cardSx = {
  border: "1px solid #c7d2e2",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(249, 238, 209, 0.98) 0%, rgba(247, 233, 196, 0.98) 100%)",
  borderRadius: "12px",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.75)",
  position: "relative",
} as const;

const actionButtonSx = {
  width: 24,
  height: 24,
  minWidth: 24,
  minHeight: 24,
  borderRadius: "999px",
  transition: "background-color 0.18s ease, color 0.18s ease",
} as const;

const actionBarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.1,
  height: 28,
  px: 0.18,
  py: 0.08,
  border: "1px solid #cfd8e6",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
} as const;

const codeSx = {
  minWidth: 0,
  maxWidth: "100%",
  flex: "1 1 auto",
  px: 0.85,
  py: 0.38,
  borderRadius: "999px",
  border: "1px solid #cfd8e6",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
} as const;

export const PendingProductGenericGroupList = memo(function PendingProductGenericGroupList({
  groups,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  if (groups.length === 0) return null;

  return (
    <Stack gap={0.55}>
      {groups.map((group) => {
        const firstIdentifier = group.identifiers[0];
        const displayCode =
          firstIdentifier?.displayIdentifier?.trim() || "Sin codigo";

        return (
          <Box
            key={group.modelName}
            sx={{
              ...cardSx,
              width: "100%",
              minWidth: 0,
              px: 1.15,
              py: 0.85,
            }}
          >
            <Box
              className="entries-prep-summary"
              sx={{ gap: 1, alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Inventory2OutlinedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                <Typography
                  sx={{
                    minWidth: 0,
                    maxWidth: { xs: "38%", sm: "42%" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  {group.modelName}
                </Typography>

                <Box sx={codeSx}>
                  <Box
                    sx={{
                      fontSize: 11,
                      lineHeight: 1,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayCode}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.35,
                }}
              >
              <Box className="pending-generic-actions" sx={actionBarSx}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (firstIdentifier) onIncrement(firstIdentifier.item);
                  }}
                  aria-label={`Incrementar ${group.modelName}`}
                  sx={{
                    ...actionButtonSx,
                    color: "#9a6a1a",
                    "&:hover": {
                      backgroundColor: "rgba(217, 168, 73, 0.14)",
                    },
                  }}
                >
                  <AddRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => {
                    if (firstIdentifier) onRemove(firstIdentifier.index);
                  }}
                  aria-label={`Eliminar ${group.modelName}`}
                  sx={{
                    ...actionButtonSx,
                    color: "#a13030",
                    "&:hover": {
                      backgroundColor: "rgba(239, 197, 197, 0.34)",
                    },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => {
                    if (firstIdentifier) onDecrement(firstIdentifier.index);
                  }}
                  aria-label={`Decrementar ${group.modelName}`}
                  sx={{
                    ...actionButtonSx,
                    color: "#9a6a1a",
                    "&:hover": {
                      backgroundColor: "rgba(217, 168, 73, 0.14)",
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              <Box
                className="entries-prep-pill entries-prep-pill-warm"
                sx={{
                  minWidth: 42,
                  height: 28,
                  px: 0.8,
                  borderRadius: "999px",
                  border: "1px solid rgba(226, 194, 128, 0.9)",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  color: "#7b4c0d",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                x{group.total}
              </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
});

export type { PendingProductGenericGroup };
