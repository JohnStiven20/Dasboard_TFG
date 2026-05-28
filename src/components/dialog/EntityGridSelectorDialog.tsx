import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GridSelector from "../modal/ItemGridSelector";
import {
  compactTextFieldSx,
  textFieldVisualSx,
} from "../shared/textFieldStyles";

interface EntityGridSelectorDialogProps<T> {
  open: boolean;
  title: string;
  items: T[];
  columns?: number;

  search?: string;
  onSearchChange?: (value: string) => void;

  keyExtractor: (item: T) => string | number;

  renderItem: (item: T) => React.ReactNode;

  onSelect: (item: T) => void;

  onClose: () => void;
}

export default function EntityGridSelectorDialog<T>({
  open,
  title,
  items,
  columns = 4,
  search,
  onSearchChange,
  keyExtractor,
  renderItem,
  onSelect,
  onClose,
}: EntityGridSelectorDialogProps<T>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          pb: 1,
        }}
      >
        {title} ({items.length})

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

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

        <Box sx={{ overflowY: "auto" }}>
          <GridSelector<T>
            items={items}
            columns={columns}
            keyExtractor={keyExtractor}
            onSelect={onSelect}
            renderItem={renderItem}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
