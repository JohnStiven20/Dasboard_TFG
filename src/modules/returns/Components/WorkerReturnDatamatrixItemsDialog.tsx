import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { DatamatrixCard } from "./DatamatrixCard";
import { useState } from "react";
import { useNotifications } from "../../../context/NotificationsContext";
import type { ProductItemDTO } from "../../../interface/subject/assigment";

interface Props {
  moveProductItemsToReturn: (items: ProductItemDTO[]) => void;
  items: ProductItemDTO[];
  open: boolean;
  onClose: () => void;
  // setSelectedItems: React.Dispatch<React.SetStateAction<ProductItemDTO[]>>;
}

export function WorkerReturnDatamatrixItemsDialog({
  items,
  open,
  onClose,
  moveProductItemsToReturn,
  // setSelectedItems,
}: Props) {
  const [selectItemsObject, setselectItemsObject] = useState<ProductItemDTO[]>(
    [],
  );

  const { notify } = useNotifications();

  const toggleSelect = (id: number) => {
    setselectItemsObject((prev) => {
      const item = items.find((x) => x.id === id);
      if (!item) return prev;
      if (prev.some((x) => x.id === id)) {
        return prev.filter((x) => x.id !== id);
      } else {
        return [...prev, item];
      }
    });

  };

  const handleConfirm = async () => {
    
    moveProductItemsToReturn(selectItemsObject);

    notify("Producto retirado", "success");
    setselectItemsObject([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Consumibles asignados</DialogTitle>

      <DialogContent>
        {items.length === 0 ? (
          <Typography color="text.secondary">
            No hay consumibles asignados
          </Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{ width: { xs: "100%", sm: "48%", md: "32%" } }}
              >
                <DatamatrixCard
                  item={item}
                  selected={selectItemsObject.some((x) => x.id === item.id)}
                  onToggle={() => toggleSelect(item.id)}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          color="error"
          disabled={selectItemsObject.length === 0}
          onClick={handleConfirm}
        >
          Devolver seleccionados ({selectItemsObject.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
