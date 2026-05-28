import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import type { AccountPermsion } from "../ui/accountForm.ui";

interface AccountPermissionItemProps {
  permission: AccountPermsion;
  checked: boolean;
  disabled?: boolean;
  formatLabel: (permission: string) => string;
  onChange: (checked: boolean) => void;
}

export function AccountPermissionItem({
  permission,
  checked,
  disabled = false,
  formatLabel,
  onChange,
}: AccountPermissionItemProps) {
  return (
    <Box className="account-permission-item">
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2">
          {formatLabel(permission.permission)}
        </Typography>
      </Box>
      <FormControlLabel
        label={checked ? "Activo" : "Inactivo"}
        labelPlacement="start"
        control={
          <Switch
            size="medium"
            checked={checked}
            disabled={disabled}
            onChange={(event) => {
              onChange(event.target.checked);
            }}
          />
        }
      />
    </Box>
  );
}
