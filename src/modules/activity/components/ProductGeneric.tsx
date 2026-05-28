import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Chip, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { HistoryGenericProductGroup } from "../interfaces/HistoryEventGroupView";

interface Props {
  groups: HistoryGenericProductGroup[];
}

const resolveCodeLabel = (code: string): string => {
  return code.trim() || "Sin codigo";
};

export const ProductGeneric = memo(function ProductGeneric({ groups }: Props) {
  if (groups.length === 0) return null;

  return (
    <Stack gap={1.5}>
      <Typography
        variant="h6"
        sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#172019" }}
      >
        Genericos
      </Typography>

      {groups.map((group) => (
        <Stack
          key={group.productName}
          gap={1.25}
          sx={{
            p: 1.5,
            borderRadius: "0.9rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e3ece6",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Typography
              sx={{
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "#172019",
              }}
            >
              {group.productName}
            </Typography>

            <Chip
              label={`x${group.quantity}`}
              size="small"
              sx={{
                backgroundColor: "#f2f4f7",
                border: "1px solid #d5d9e0",
                color: "#394150",
                fontWeight: 700,
              }}
            />
          </Stack>

          <Stack gap={1}>
            {group.codes.map((codeGroup) => (
              <Stack
                key={`${group.productName}-${codeGroup.code}`}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
                sx={{
                  width: "100%",
                  minWidth: 0,
                  px: 1,
                  py: 0.75,
                  borderRadius: "0.75rem",
                  backgroundColor: "#f7f8fa",
                  border: "1px solid #e2e6eb",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.75}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <QrCode2RoundedIcon sx={{ fontSize: 18, color: "#667085" }} />
                  <Typography
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#243128",
                    }}
                  >
                    {resolveCodeLabel(codeGroup.code)}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.75}
                  sx={{ flexShrink: 0 }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: 18, color: "#667085" }} />
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#394150",
                    }}
                  >
                    x{codeGroup.quantity}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
});
