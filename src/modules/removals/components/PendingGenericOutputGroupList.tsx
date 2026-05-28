import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveIcon from "@mui/icons-material/Remove";
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

type PendingGenericOutput = {
  id: number;
  name: string;
  amount: number;
  reason: string;
};

type PendingGenericOutputGroup = {
  modelName: string;
  total: number;
  lines: Array<{ item: PendingGenericOutput; index: number }>;
};

type Props = {
  groups: PendingGenericOutputGroup[];
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onRemove: (index: number) => void;
};

const itemAccordionSx = {
  border: "1px solid rgba(203, 213, 225, 0.95)",
  overflow: "hidden",
  "&:before": { display: "none" },
} as const;

export const PendingGenericOutputGroupList = memo(function PendingGenericOutputGroupList({
  groups,
  onIncrement,
  onDecrement,
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
          sx={{
            ...itemAccordionSx,
            backgroundColor: "#fffdf8",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            sx={{
              px: 1.1,
              py: 0,
              minHeight: 40,
              background: "linear-gradient(180deg, #fff5df 0%, #fff0cf 100%)",
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
                <Inventory2OutlinedIcon sx={{ color: "#b7791f", fontSize: 18 }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#6f4308",
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
              {group.lines.map(({ item, index }) => (
                <Box
                  key={`${item.id}-${item.reason}-${index}`}
                  sx={{
                    p: 1,
                    borderRadius: "0.9rem",
                    border: "1px solid rgba(241, 224, 193, 0.95)",
                    backgroundColor: "#fffdfa",
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
                          color: "#7c4a03",
                        }}
                      >
                        x{item.amount}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 12,
                          color: "#8a5d14",
                        }}
                      >
                        {item.reason}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={() => onIncrement(index)}
                        aria-label={`Sumar una unidad de ${item.name}`}
                      >
                        <AddRoundedIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDecrement(index)}
                        aria-label={`Restar una unidad de ${item.name}`}
                      >
                        <RemoveIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(index)}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <CloseRoundedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
});

export type { PendingGenericOutput, PendingGenericOutputGroup };
