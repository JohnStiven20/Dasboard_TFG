import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useNotifications } from "../../../context/NotificationsContext";

interface Props {
  setGenericReturnQty: (id: number, qty: number) => void;
  open: boolean;
  selectGenericProductid: number | undefined;
  onClose: () => void;
}

export const WorkerReturnGenericItemsDialog = ({
  open = false,
  selectGenericProductid,
  onClose,
  setGenericReturnQty,
}: Props) => {
  const [amount, setAmount] = useState<number>(1);

  const { notify } = useNotifications();

  const handleReturnGeneric = async () => {
    if (amount <= 0) {
      notify("La cantidad debe ser mayor que cero", "warning");
      return;
    }

    if (!selectGenericProductid) {
      notify("Seleccion un producto", "warning");
      return;
    }


    setGenericReturnQty(selectGenericProductid, amount);
    setAmount(1);
    onClose();

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Devolver consumible genérico</DialogTitle>

      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField
            type="number"
            label="Cantidad"
            value={amount}
            onChange={(event) => {
              const numValue = event.target.value
                ? parseInt(event.target.value, 10)
                : 0;
              setAmount(numValue);
            }}
            inputProps={{ min: 1 }}
          />

          {amount <= 0 && (
            <Typography variant="caption" color="error">
              La cantidad debe ser mayor que cero
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="error"
          disabled={!selectGenericProductid || amount <= 0}
          onClick={handleReturnGeneric}
        >
          Devolver
        </Button>
      </DialogActions>
    </Dialog>
  );
};
