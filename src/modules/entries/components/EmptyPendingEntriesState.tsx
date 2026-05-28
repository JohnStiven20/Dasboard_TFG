import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Typography } from "@mui/material";
import { memo } from "react";

export const EmptyPendingEntriesState = memo(function EmptyPendingEntriesState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        margin: "auto",
        px: 2,
        textAlign: "center",
      }}
    >
      <Inventory2OutlinedIcon
        sx={{ fontSize: 32, color: "rgba(125, 135, 156, 0.35)" }}
      />
      <Typography sx={{ color: "#495266", fontWeight: 600, fontSize: 15 }}>
        Ningun producto en el area de preparacion
      </Typography>
      <Typography sx={{ color: "#6b7280", fontSize: 12 }}>
        Escanea o ingresa un codigo para anadir un producto
      </Typography>
    </Box>
  );
});
