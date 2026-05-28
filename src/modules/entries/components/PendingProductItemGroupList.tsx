import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
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
import type IdentifiedProduct from "../../../interface/entries/entries";

type PendingProductItemGroup = {
  modelName: string;
  total: number;
  codes: Array<{
    code: string;
    items: Array<{ item: IdentifiedProduct; index: number }>;
  }>;
};

type Props = {
  groups: PendingProductItemGroup[];
  onRemove: (index: number) => void;
};

const itemAccordionSx = {
  border: "1px solid rgba(203, 213, 225, 0.95)",
  overflow: "hidden",
  "&:before": { display: "none" },
} as const;

export const PendingProductItemGroupList = memo(function PendingProductItemGroupList({
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
            <Box className="entries-prep-summary">
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
              <Box className="entries-prep-pill">x{group.total}</Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0.75 }}>
            <Stack gap={0.45}>
              {group.codes.map((codeGroup) => (
                <Box
                  key={`${group.modelName}-${codeGroup.code}`}
                  className="entries-prep-block"
                >
                  <Box className="entries-prep-block-header">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography className="entries-prep-block-title">
                        {codeGroup.code}
                      </Typography>
                    </Box>
                    <Box className="entries-prep-pill entries-prep-pill-muted">
                      x{codeGroup.items.length}
                    </Box>
                  </Box>

                  <Box className="entries-prep-chip-wrap">
                    {codeGroup.items.map(({ item, index }) => (
                      <Box
                        key={`${item.mac}-${index}`}
                        className="entries-prep-chip"
                        title={`${item.mac} - ${item.productIdentifierCode}`}
                      >
                        <MemoryRoundedIcon
                          sx={{
                            fontSize: 15,
                            color: "#667085",
                            mr: 0.375,
                          }}
                        />

                        <Typography className="entries-prep-chip-label">
                          {item.mac}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() => onRemove(index)}
                          className="entries-prep-chip-action"
                          aria-label={`Eliminar ${item.mac}`}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    ))}
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

export type { PendingProductItemGroup };
