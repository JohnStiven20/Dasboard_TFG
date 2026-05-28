import {
  alpha,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
// import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

const dialogStyle: SxProps<Theme> = {
  borderRadius: 3,
  boxShadow: 8,
};

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onDelete: () => Promise<void> | void;
  loading?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  title,
  subtitle,
  onClose,
  onDelete,
  loading: loadingProp,
}: ConfirmDeleteDialogProps) {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const loading = loadingProp ?? loadingLocal;

  const handleDelete = async () => {
    try {
      setLoadingLocal(true);
      await onDelete();
      onClose();
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{ paper: { sx: dialogStyle } }}
      maxWidth="xs"
      fullWidth
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: (t) => alpha(t.palette.error.main, 0.06),
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: (t) => alpha(t.palette.error.main, 0.12),
              color: "error.main",
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>

          <Stack spacing={0.3}>
            <Typography fontWeight={900} fontSize={16}>
              {title}
            </Typography>

            {subtitle && (
              <Typography fontSize={13} color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />


      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px dashed",
            borderColor: (t) => alpha(t.palette.error.main, 0.4),
            bgcolor: (t) => alpha(t.palette.error.main, 0.04),
          }}
        >
          <Typography fontSize={13} color="text.secondary">
            Esta acción es <b>irreversible</b>. Si continúas, el registro se
            eliminará permanentemente.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleDelete}
          loading={loading}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 800,
            px: 2.5,
            transition: "transform 0.15s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
