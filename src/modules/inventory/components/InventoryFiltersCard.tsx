import { Autocomplete, Box, FormControl, Stack, TextField } from "@mui/material";
import { memo } from "react";
import type { SelectOption } from "../../../type/DinamFormField";
import Card from "../../entries/components/Card";

type Props = {
  modelValue: SelectOption<string> | null;
  statusValue: SelectOption<string> | null;
  responsibleValue: SelectOption<string> | null;
  macValue: string;
  modelOptions: Array<SelectOption<string>>;
  statusOptions: Array<SelectOption<string>>;
  responsibleOptions: Array<SelectOption<string>>;
  onModelChange: (value: SelectOption<string> | null) => void;
  onStatusChange: (value: SelectOption<string> | null) => void;
  onResponsibleChange: (value: SelectOption<string> | null) => void;
  onMacChange: (value: string) => void;
};

export const InventoryFiltersCard = memo(function InventoryFiltersCard({
  modelValue,
  statusValue,
  responsibleValue,
  macValue,
  modelOptions,
  statusOptions,
  responsibleOptions,
  onModelChange,
  onStatusChange,
  onResponsibleChange,
  onMacChange,
}: Props) {
  return (
    <FormControl fullWidth>
      <Card className="history-filters-card">
        <Stack className="history-filters-wrap">
          <Stack
            flexDirection="row"
            className="history-filters-row"
            sx={{ width: "100%", minWidth: 0, alignItems: "stretch" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 0",
                minWidth: 0,
                gap: 1,
              }}
            >
              <Autocomplete<SelectOption<string>>
                sx={{ width: "100%" }}
                value={modelValue}
                renderInput={(params) => (
                  <TextField {...params} label="Modelo" size="small" fullWidth />
                )}
                onChange={(_, value) => onModelChange(value)}
                options={modelOptions}
              />

              <TextField
                label="MAC"
                size="small"
                fullWidth
                value={macValue}
                onChange={(event) => onMacChange(event.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 0",
                minWidth: 0,
                gap: 1,
              }}
            >
              <Autocomplete<SelectOption<string>>
                sx={{ width: "100%" }}
                value={statusValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado del producto"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={(_, value) => onStatusChange(value)}
                options={statusOptions}
              />

              <Autocomplete<SelectOption<string>>
                sx={{ width: "100%" }}
                value={responsibleValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Responsable"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={(_, value) => onResponsibleChange(value)}
                options={responsibleOptions}
              />
            </Box>
          </Stack>
        </Stack>
      </Card>
    </FormControl>
  );
});
