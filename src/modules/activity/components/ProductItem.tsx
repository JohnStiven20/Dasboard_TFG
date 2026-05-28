import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { HistoryItemProductGroup } from "../interfaces/HistoryEventGroupView";

interface Props {
  groups: HistoryItemProductGroup[];
}

export const ProductItem = memo(function ProductItem({ groups }: Props) {
  if (groups.length === 0) return null;

  return (
    <Stack gap={1.5}>
      <Typography
        variant="h6"
        sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#172019" }}
      >
        Items
      </Typography>

      {groups.map((group) => (
        <Accordion
          key={group.productName}
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            borderRadius: "0.4rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e3ece6",
            boxShadow: "none",
            overflow: "hidden",
            "&::before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon sx={{ color: "#667085" }} />}
            sx={{
              px: 1.5,
              py: 1.5,
              minHeight: "unset",
              "& .MuiAccordionSummary-content": {
                my: 0,
              },
              "& .MuiAccordionSummary-expandIconWrapper": {
                color: "#667085",
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              sx={{ width: "100%", minWidth: 0 }}
            >
              <Typography
                sx={{
                  minWidth: 0,
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "#172019",
                }}
              >
                {group.productName}
              </Typography>

              <Typography
                sx={{
                  flexShrink: 0,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#394150",
                  backgroundColor: "#f2f4f7",
                  border: "1px solid #d5d9e0",
                  borderRadius: "999px",
                  px: 1,
                  py: 0.25,
                  whiteSpace: "nowrap",
                }}
              >
                x{group.total}
              </Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
            <Stack gap={1}>
              {group.codes.map((codeGroup) => (
                <Stack key={codeGroup.code} gap={0.75}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    sx={{
                      px: 1,
                      py: 0.75,
                      borderRadius: "0.75rem",
                      backgroundColor: "#f7f8fa",
                      border: "1px solid #e2e6eb",
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <QrCode2RoundedIcon sx={{ fontSize: 18, color: "#667085" }} />
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#243128",
                        }}
                      >
                        {codeGroup.code}
                      </Typography>
                    </Stack>

                    {codeGroup.items.length > 1 && (
                      <Chip
                        label={`x${codeGroup.items.length}`}
                        size="small"
                        sx={{
                          backgroundColor: "#f2f4f7",
                          border: "1px solid #d5d9e0",
                          color: "#394150",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {codeGroup.items.map((item) => (
                      <Stack
                        key={`${codeGroup.code}-${item.mac}`}
                        direction="row"
                        alignItems="center"
                        gap={0.5}
                        sx={{
                          fontSize: "0.78rem",
                          color: "#475467",
                          backgroundColor: "#fbfbfc",
                          border: "1px dashed #d0d5dd",
                          borderRadius: "999px",
                          px: 1,
                          py: 0.25,
                        }}
                      >
                        <MemoryRoundedIcon sx={{ fontSize: 15, color: "#667085" }} />
                        <Typography sx={{ fontSize: "0.78rem", color: "#475467" }}>
                          {item.mac}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
});
