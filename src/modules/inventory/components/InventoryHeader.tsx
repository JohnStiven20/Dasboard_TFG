import { Box, Typography } from "@mui/material";
import { memo } from "react";

export const InventoryHeader = memo(function InventoryHeader() {
  return (
    <Box component="section">
      <Typography
        sx={{
          fontFamily: "var(--font-family)",
          fontSize: "2.25rem",
          fontWeight: "700",
          lineHeight: "1.1",
        }}
      >
        Inventario
      </Typography>
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: "500",
          color: "#4a5565",
        }}
      >
        Aqui puedes consultar los articulos de tu inventario
      </Typography>
    </Box>
  );
});
