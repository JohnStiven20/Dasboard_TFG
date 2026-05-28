import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, AlertTitle, Box, Button, Stack } from "@mui/material";
import { memo } from "react";
import Card from "../../entries/components/Card";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";

type Props = {
  onBack: () => void;
};

export const InventoryGlobalResultsState = memo(function InventoryGlobalResultsState({
  onBack,
}: Props) {
  return (
    <Box component="section">
      <Stack gap={2}>
        <Box component="article">
          <Alert
            severity="info"
            icon={false}
            sx={{
              borderRadius: "0.65rem",
              backgroundColor: "#f5f7fb",
              border: "1px solid #dbe7ff",
              color: "#1e3a8a",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            slotProps={{
              action: {
                sx: {
                  alignSelf: "center",
                },
              },
            }}
            action={
              <Button
                size="small"
                startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ ...appBlackButtonSx, width: "100%" }}
                onClick={onBack}
              >
                Volver al Inventario
              </Button>
            }
          >
            <AlertTitle>Resultados Globales</AlertTitle>
            Buscando coincidencia para "CCD4A15DDD23"
          </Alert>
        </Box>

        <Box component="article">
          <Card />
        </Box>
      </Stack>
    </Box>
  );
});
