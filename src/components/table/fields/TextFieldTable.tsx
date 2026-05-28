import { TextField } from "@mui/material";
import type { GridRenderEditCellParams } from "@mui/x-data-grid";
import type { FieldValues } from "react-hook-form";
import {
  compactTextFieldSx,
  textFieldVisualSx,
} from "../../shared/textFieldStyles";

interface Props<T extends FieldValues> {
  props: GridRenderEditCellParams<T, unknown>;
  fieldKey: string;
}

export function TextFieldTable<T extends FieldValues>({
  props,
  fieldKey,
}: Props<T>) {
  const { api, field, id, row } = props;
  const value = (row as Record<string, unknown>)[fieldKey] ?? "";

  return (
    <TextField
      size="small"
      variant="outlined"
      value={String(value)}
      fullWidth
      sx={[textFieldVisualSx, compactTextFieldSx]}
      onChange={(event) => {
        api.setEditCellValue({
          id,
          field,
          value: event.target.value,
          debounceMs: 0,
        });
      }}
    />
  );
}
