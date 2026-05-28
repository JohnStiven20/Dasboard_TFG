import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import type { ProductItemDTO } from "../../../interface/subject/assigment";

type PendingSpecificOutput = ProductItemDTO & {
  reason: string;
};

type PendingSpecificOutputGroup = {
  modelName: string;
  total: number;
  items: Array<{ item: PendingSpecificOutput; index: number }>;
};

type Props = {
  groups: PendingSpecificOutputGroup[];
  onRemove: (index: number) => void;
};

const itemAccordionSx = {
  border: "1px solid rgba(203, 213, 225, 0.95)",
  overflow: "hidden",
  "&:before": { display: "none" },
} as const;

export const PendingSpecificOutputGroupList = memo(function PendingSpecificOutputGroupList({
  groups,
  onRemove,
}: Props) {
  if (groups.length === 0) return null;

  return (
    <Stack gap={0.55}>
      {groups.map((group) => (
        <Accordion
          key={group.modelName}
          defaultExpanded
          disableGutters
          elevation={0}
          sx={itemAccordionSx}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            sx={{
              px: 1.1,
              py: 0,
              minHeight: 40,
              background: "linear-gradient(180deg, #eff8f5 0%, #e8f4f1 100%)",
              "& .MuiAccordionSummary-content": { my: 0 },
              "& .MuiAccordionSummary-expandIconWrapper": {
                mr: -0.25,
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                <Inventory2OutlinedIcon sx={{ color: "#0b1110ff", fontSize: 18 }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#123c35",
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.modelName}
                </Typography>
              </Stack>
              <Box className="output-chip">x{group.total}</Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0.85 }}>
            <Stack gap={0.65}>
              {group.items.map(({ item, index }) => (
                <Box
                  key={`${item.id}-${index}`}
                  sx={{
                    p: 1,
                    borderRadius: "0.9rem",
                    border: "1px solid rgba(226, 232, 240, 0.95)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0f172a",
                        }}
                      >
                        {item.mac}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => onRemove(index)}
                      aria-label={`Eliminar ${item.mac}`}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    {item.reason}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
});

export type { PendingSpecificOutput, PendingSpecificOutputGroup };
