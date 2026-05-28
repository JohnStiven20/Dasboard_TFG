import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import type { InventoryModelProduct } from "../interfaces/inventoryModelProducts";

type Props = {
  item: InventoryModelProduct;
  onClick?: (item: InventoryModelProduct) => void;
};

const getStatusTone = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Activo",
        color: "#067647",
        background: "#ecfdf3",
        border: "#abefc6",
      };
    case "ASSIGNED":
      return {
        label: "Asignado",
        color: "#175cd3",
        background: "#eff8ff",
        border: "#b2ddff",
      };

    case "INSTALLED":
      return {
        label: "Instalado",
        color: "#115e59",
        background: "#ccfbf1",
        border: "#99f6e4",
      };
    case "BROKEN":
      return {
        label: "Descatalogado",
        color: "#b42318",
        background: "#fee4e2",
        border: "#fecdca",
      };
    default:
      return {
        label: status,
        color: "#b54708",
        background: "#fef0c7",
        border: "#fedf89",
      };
  }
};

export const InventoryModelProductCard = memo(function InventoryModelProductCard({
  item,
  onClick,
}: Props) {
  const statusTone = getStatusTone(item.status);

  return (
    <Box
      onClick={onClick ? () => onClick(item) : undefined}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: 150,
        padding: "14px 16px",
        borderRadius: "18px",
        border: "1px solid #e7ebf1",
        backgroundColor: "#ffffff",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.045)",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 3,
          backgroundColor: statusTone.border,
        },
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.06)",
        },
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
        <Box sx={{ display: "flex", gap: 0.9, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              backgroundColor: "#f8fafc",
              color: "#667085",
              border: "1px solid #e7ebf1",
              flexShrink: 0,
            }}
          >
            <RouterRoundedIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1, display: "flex", justifyItems: "center", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#667085",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Producto unico
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            px: 0.75,
            py: 0.2,
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
          {statusTone.label}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.55,
          minWidth: 0,
          mt: 0.15,
        }}
      >
        <SellOutlinedIcon sx={{ fontSize: 15, color: "#64748b", flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: 12,
            color: "#344054",
            fontFamily:
              'ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, monospace',
            lineHeight: 1.1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.productIdentifierCode ?? "Sin identificador"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.55,
          minWidth: 0,
          mt: "auto",
          pt: 0.7,
          borderTop: "1px solid rgba(231, 235, 241, 0.9)",
        }}
      >
        <MemoryRoundedIcon sx={{ fontSize: 15, color: "#64748b", flexShrink: 0 }} />
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 0.75,
          mt: "auto",
          pt: 0.35,
        }}
      >
       

        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "999px",
            display: "grid",
            placeItems: "center",
            backgroundColor: "#fbfcfd",
            color: "#475467",
            border: "1px solid #e7ebf1",
          }}
        >
          <ArrowOutwardRoundedIcon sx={{ fontSize: 15 }} />
        </Box>
      </Box>
    </Box>
  );
});
