import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import type { InventoryModelSummary } from "../interfaces/inventoryModelSummary";

type Props = {
  item: InventoryModelSummary;
  onClick?: (item: InventoryModelSummary) => void;
};

const statCards = [
  {
    key: "activeProducts",
    label: "Activos",
    icon: VerifiedRoundedIcon,
    color: "#067647",
    background: "#ecfdf3",
  },
  {
    key: "assignedProducts",
    label: "Asignados",
    icon: WorkOutlineRoundedIcon,
    color: "#175cd3",
    background: "#eff8ff",
  },
  {
    key: "brokenProducts",
    label: "Rotos",
    icon: TrendingDownRoundedIcon,
    color: "#b42318",
    background: "#fee4e2",
  },
  {
    key: "installedProducts",
    label: "Instalados",
    icon: TrendingDownRoundedIcon,
    color: "#115e59",
    background: "#ccfbf1",
  },

] as const;

export const InventoryModelCard = memo(function InventoryModelCard({
  item,
  onClick,
}: Props) {
  return (
    <Box
      onClick={onClick ? () => onClick(item) : undefined}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        minHeight: 196,
        padding: "16px",
        borderRadius: "20px",
        border: "1px solid #e7ebf1",
        borderColor: "#cfd8e3",
        background:"linear-gradient(180deg, #ffffff 0%, #fbfcff 48%, #f6f8fb 100%)",
        boxShadow: "0 16px 28px rgba(15, 23, 42, 0.08)",
        cursor: onClick ? "pointer" : "default",
        }
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              color: "#101828",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.modelName}
          </Typography>
          
        </Box>

        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "14px",
            display: "grid",
            placeItems: "center",
            backgroundColor: "#eef2ff",
            color: "#3645a7",
            flexShrink: 0,
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 0.8,
          pb: 1,
          borderBottom: "1px solid rgba(231, 235, 241, 0.95)",
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {item.totalProducts}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#667085" }}>
          productos registrados
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0.8,
        }}
      >
        {statCards.map(({ key, label, icon: Icon, color, background }) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.45,
              minWidth: 0,
              padding: "10px 9px",
              borderRadius: "14px",
              border: `1px solid ${color}33`,
              backgroundColor: background,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.45 }}>
              <Icon sx={{ fontSize: 15, color }} />
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                  lineHeight: 1.1,
                }}
              >
                {label}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: "#101828",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {item[key]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
});
