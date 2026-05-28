import { Box, Typography } from "@mui/material";
import { memo } from "react";
import type { ConsumableInventoryItem } from "../data/inventoryMockItems";

type Props = {
  item: ConsumableInventoryItem;
};

export const InventoryConsumableCard = memo(function InventoryConsumableCard({
  item,
}: Props) {
  const stockStatus =
    item.availableStock <= 0
      ? {
          label: "Sin stock",
          color: "#b42318",
          background: "#fee4e2",
          border: "#fecdca",
        }
      : item.availableStock <= 3
        ? {
            label: "Stock bajo",
            color: "#b54708",
            background: "#fef0c7",
            border: "#fedf89",
          }
        : {
            label: "En stock",
            color: "#027a48",
            background: "#ecfdf3",
            border: "#abefc6",
          };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.55,
        minHeight: 112,
        padding: "12px 14px",
        borderRadius: "16px",
        border: "1px solid #e7ebf1",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.045)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
          borderColor: "#d9e1ea",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          gap: 0.75,
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: 14,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {item.name}
        </Typography>

        <Box
          sx={{
            flexShrink: 0,
            px: 0.72,
            py: 0.24,
            borderRadius: "999px",
            border: `1px solid ${stockStatus.border}`,
            backgroundColor: stockStatus.background,
            color: stockStatus.color,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {stockStatus.label}
        </Box>
      </Box>

      <Typography
        sx={{
        fontSize: 11,
          color: "#667085",
          fontFamily:
            'ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, monospace',
          lineHeight: 1.1,
        }}
      >
        {item.identifier}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 0.75,
          mt: 0.2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.08,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#667085" }}>
            Stock disponible
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              color: "#101828",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {item.availableStock}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.08,
            minWidth: 82,
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#98a2b3", lineHeight: 1.1 }}>
            Total: {item.stock}
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#98a2b3", lineHeight: 1.1 }}>
            Asignado: {item.assignedStock}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});
