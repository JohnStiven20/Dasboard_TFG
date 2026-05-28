import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import type { UniqueProductInventoryItem } from "../data/inventoryMockItems";

type Props = {
  item: UniqueProductInventoryItem;
};

export const InventoryUniqueProductCard = memo(function InventoryUniqueProductCard({
  item,
}: Props) {
  const statusTone =
    item.status === "En stock"
      ? { color: "#027a48", background: "#ecfdf3", border: "#abefc6" }
      : item.status === "Asignado"
        ? { color: "#175cd3", background: "#eff8ff", border: "#b2ddff" }
        : item.status === "Averiado"
          ? { color: "#b42318", background: "#fee4e2", border: "#fecdca" }
          : { color: "#b54708", background: "#fef0c7", border: "#fedf89" };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.65,
        minHeight: 134,
        padding: "14px 16px",
        borderRadius: "16px",
        border: "1px solid #e7ebf1",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.045)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 0.75,
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: 15,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {item.modelName}
        </Typography>

        <Box
          sx={{
            flexShrink: 0,
            px: 0.8,
            py: 0.24,
            borderRadius: "999px",
            border: `1px solid ${statusTone.border}`,
            backgroundColor: statusTone.background,
            color: statusTone.color,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {item.status}
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: 12,
          color: "#667085",
          fontFamily:
            'ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, monospace',
          lineHeight: 1.1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.code}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 0.75,
          mt: 0.25,
          pt: 0.6,
          borderTop: "1px solid rgba(231, 235, 241, 0.9)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.18,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#667085" }}>MAC</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.45, minWidth: 0 }}>
              <MemoryRoundedIcon sx={{ fontSize: 13, color: "#64748b", flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#101828",
                  fontFamily:
                    'ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, monospace',
                  lineHeight: 1.1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
              {item.mac}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.18,
            minWidth: 88,
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#98a2b3", lineHeight: 1.1 }}>
            Responsable
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#344054",
              textAlign: "right",
              lineHeight: 1.15,
            }}
          >
            {item.responsible}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});
