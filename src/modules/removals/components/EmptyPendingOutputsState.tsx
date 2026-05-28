import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Typography } from "@mui/material";
import { memo } from "react";

export const EmptyPendingOutputsState = memo(function EmptyPendingOutputsState() {
  return (
    <Box className="output-empty-state">
      <Inventory2OutlinedIcon
        sx={{ fontSize: 32, color: "rgba(125, 135, 156, 0.35)" }}
      />
      <Typography className="output-empty-title">
        Ningun producto en el area de preparacion
      </Typography>
      <Typography className="output-empty-caption">
        Agrega productos genericos o especificos y registra la salida en un solo
        envio.
      </Typography>
    </Box>
  );
});
