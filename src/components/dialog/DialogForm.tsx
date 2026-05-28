import { type ReactNode, type RefObject } from "react";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { FieldConfig, GlobalFormRef } from "../../type/DinamFormField";
import type { DefaultValues, FieldValues } from "react-hook-form";
import { DynamicFormSection } from "../dynamic/DynamicFormSection";
import { appBlackButtonSx } from "../../modules/entries/components/muiButtonStyles";

interface DialogFormProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  defaultValues?: DefaultValues<T>;
  ref: RefObject<GlobalFormRef<T> | null>;
  open: boolean;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  adviceTitle?: string;
  adviceMessage?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  vista?: boolean;
  confirmIcon?: ReactNode;
}

export function DialogForm<T extends FieldValues>({
  fields,
  setOpen,
  open = false,
  onclick,
  defaultValues,
  ref,
  title = "Formulario",
  subtitle = "Completa la informacion para continuar.",
  icon,
  adviceTitle = "Consejo",
  adviceMessage = "Podras editar estos datos posteriormente.",
  confirmText = "Guardar",
  cancelText = "Cancelar",
  isPending = false,
  vista = false,
}: DialogFormProps<T>) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen?.(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 16px 45px rgba(15, 23, 42, 0.26)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: "1px solid #e6ebf2",
          backgroundColor: "#f8fafc",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            {icon ?? <DescriptionOutlinedIcon />}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
              {title}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 15, mt: 0.4 }}>
              {subtitle}
            </Typography>
          </Box>

          <IconButton onClick={() => setOpen?.(false)} size="small" sx={{ mt: 0.2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2.75,
          backgroundColor: "#ffffff",
          "& .MuiFormControl-root": { width: "100%" },
          ...(vista
            ? {
                "& .MuiFormHelperText-root": {
                  display: "none",
                  margin: 0,
                  minHeight: 0,
                },
              }
            : {}),
        }}
      >
        <DynamicFormSection<T>
          fields={fields}
          onSubmit={onclick}
          ref={ref}
          defaultValues={defaultValues}
        />

        {adviceMessage ? (
          <Box
            sx={{
              mt: 2.25,
              px: 1.4,
              py: 1.25,
              borderRadius: 1.3,
              border: "1px solid #9cc4ff",
              backgroundColor: "#eaf3ff",
              color: "#1d4ed8",
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 20, mt: 0.08 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {adviceTitle}
              </Typography>
              <Typography sx={{ mt: 0.15 }}>{adviceMessage}</Typography>
            </Box>
          </Box>
        ) : null}
      </DialogContent>


      {!vista ? (
        <DialogActions
          sx={{
            px: 3,
            py: 1.75,
            gap: 2,
            justifyContent: "flex-end",
            bgcolor: "background.paper",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            size="medium"
            variant="contained"
            color="primary"
            type="button"
            sx={{
              ...appBlackButtonSx,
            }}
            onClick={() => setOpen?.(false)}
            disabled={isPending}
          >
            {cancelText}
          </Button>

          <Button
            size="medium"
            variant="contained"
            color="primary"
            type="button"
            sx={{
              ...appBlackButtonSx,
            }}
            onClick={() => {
              if (!ref.current) return;
              ref.current.submit();
            }}
            disabled={isPending}
          >
            {confirmText}
          </Button>
        </DialogActions>
      ) : null}


    </Dialog>
  );
}
