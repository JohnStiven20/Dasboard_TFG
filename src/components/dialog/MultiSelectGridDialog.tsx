import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import GridSelector from "../modal/ItemGridSelector";
import {
  compactTextFieldSx,
  textFieldVisualSx,
} from "../shared/textFieldStyles";

interface MultiSelectGridDialogProps<T> {
  open: boolean;
  title: string;

  items: T[];
  selectedIds: number[];

  columns?: number;

  keyExtractor: (item: T) => number;

  renderItem: (item: T, selected: boolean) => React.ReactNode;

  onToggle: (item: T) => void;

  onConfirm: (ids: number[]) => void;

  onClose: () => void;

  confirmText?: string;
  wrapItems?: boolean;

  search?: string;
  onSearchChange?: (value: string) => void;
}

export default function MultiSelectGridDialog<T>({
  open,
  title,
  items,
  selectedIds,
  columns = 4,
  keyExtractor,
  renderItem,
  onToggle,
  onConfirm,
  onClose,
  confirmText = "Confirmar",
  wrapItems = true,
  search,
  onSearchChange,
}: MultiSelectGridDialogProps<T>) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "70vh",
        }}
      >
        {onSearchChange && (
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            sx={[textFieldVisualSx, compactTextFieldSx]}
          />
        )}

        <Box
          sx={{
            overflowY: "auto",
            px: wrapItems ? 0 : 1,
            py: wrapItems ? 0 : 1,
          }}
        >
          <GridSelector<T>
            items={items}
            columns={columns}
            wrapItems={wrapItems}
            keyExtractor={keyExtractor}
            onSelect={onToggle}
            renderItem={(item) =>
              renderItem(item, selectedIds.includes(keyExtractor(item)))
            }
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => onConfirm(selectedIds)}
          disabled={!selectedIds.length}
        >
          {confirmText} ({selectedIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
