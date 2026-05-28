import { useState } from "react";
import {
  alpha,
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useProductIdentifiers } from "../hook/useProductIdentifiers";
import { ConfirmDeleteDialog } from "../../../../components/dialog/ConfirmDeleteDialog";
import type { ProductModel } from "../../Product/type/inteface.productmodel";
import { useNotifications } from "../../../../context/NotificationsContext";
import type { ProductIdentifier } from "../type/productIdentifier.interface";

// ── Helpers de tipo ──────────────────────────────────────────────────────────

/**
 * Determina si el modelo es de tipo "genérico" basándose en el nombre del kindType.
 * Los modelos genéricos tienen identificadores de 32 caracteres y solo pueden tener UNO.
 * Los modelos únicos (seriados) tienen identificadores de exactamente 12 caracteres y pueden tener múltiples.
 */
const isGenericModel = (productModel: ProductModel | undefined): boolean => {
  if (!productModel?.kindType?.name) return false;
  const name = productModel.kindType.name.toLowerCase();
  return name.includes("genérico") || name.includes("generico") || name.includes("generic");
};

const UNIQUE_EXACT_LENGTH = 12;
const GENERIC_EXACT_LENGTH = 32;

interface ProductIdentifiersDialogProps {
  open: boolean;
  onClose: () => void;
  productModel: ProductModel | undefined;
}

export function ProductIdentifiersDialog({
  open,
  onClose,
  productModel,
}: ProductIdentifiersDialogProps) {
  const { notify } = useNotifications();
  const isGeneric = isGenericModel(productModel);

  const {
    identifiers,
    isLoading,
    create,
    isCreating,
    update,
    isUpdating,
    remove,
  } = useProductIdentifiers(productModel?.id);

  const [newCode, setNewCode] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCode, setEditingCode] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProductIdentifier | null>(null);

  // Genérico: solo 1 identificador → bloquear agregar si ya existe uno
  const canAddMore = isGeneric ? identifiers.length === 0 : true;

  // ── Validaciones ──────────────────────────────────────────────────────────

  const validateCode = (code: string): string | null => {
    if (!code) return "El código no puede estar vacío";
    if (isGeneric) {
      if (code.length !== GENERIC_EXACT_LENGTH)
        return `El código debe tener exactamente ${GENERIC_EXACT_LENGTH} caracteres (actualmente: ${code.length})`;
    } else {
      if (code.length !== UNIQUE_EXACT_LENGTH)
        return `El código debe tener exactamente ${UNIQUE_EXACT_LENGTH} caracteres (actualmente: ${code.length})`;
    }
    return null;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = () => {
    const code = newCode.trim().toUpperCase();
    const error = validateCode(code);
    if (error) {
      notify(error, "warning");
      return;
    }
    if (!productModel) return;

    create(
      { code, productModelId: productModel.id },
      {
        onSuccess: () => {
          setNewCode("");
          notify("Identificador creado", "success");
        },
        onError: () => notify("Error al crear el identificador", "error"),
      },
    );
  };

  const startEdit = (item: ProductIdentifier) => {
    setEditingId(item.id);
    setEditingCode(item.code);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingCode("");
  };

  const confirmEdit = (item: ProductIdentifier) => {
    const code = editingCode.trim().toUpperCase();
    const error = validateCode(code);
    if (error) {
      notify(error, "warning");
      return;
    }
    if (!productModel) return;

    // Si el id es negativo (fallback sin id real), no podemos hacer PUT
    if (item.id < 0) {
      notify("No se puede editar: el identificador no tiene ID asignado", "error");
      return;
    }

    update(
      { id: item.id, data: { code, productModelId: productModel.id } },
      {
        onSuccess: () => {
          cancelEdit();
          notify("Identificador actualizado", "success");
        },
        onError: () => notify("Error al actualizar el identificador", "error"),
      },
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.id < 0) {
      notify("No se puede eliminar: el identificador no tiene ID asignado", "error");
      setDeleteTarget(null);
      return;
    }

    remove(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        notify("Identificador eliminado", "success");
      },
      onError: () => notify("Error al eliminar el identificador", "error"),
    });
  };

  const handleClose = () => {
    setNewCode("");
    cancelEdit();
    setDeleteTarget(null);
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const newCodeLength = newCode.trim().length;
  const newCodeHelperText = isGeneric
    ? `${newCodeLength}/${GENERIC_EXACT_LENGTH} caracteres requeridos`
    : `${newCodeLength}/${UNIQUE_EXACT_LENGTH} caracteres requeridos`;

  const newCodeColor =
    isGeneric
      ? newCodeLength === GENERIC_EXACT_LENGTH
        ? "success"
        : "error"
      : newCodeLength !== UNIQUE_EXACT_LENGTH
        ? "error"
        : "primary";

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden", boxShadow: 10 },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            px: 3,
            py: 2,
            fontWeight: 800,
            fontSize: 18,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                color: "primary.main",
              }}
            >
              <TagRoundedIcon fontSize="small" />
            </Box>
            <Stack spacing={0.3}>
              <Typography fontWeight={800} fontSize={16}>
                Identificadores
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {productModel?.name ?? "—"}
              </Typography>
            </Stack>
          </Stack>
        </DialogTitle>

        {/* BODY */}
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>

          {/* Alerta informativa según tipo */}
          {isGeneric ? (
            <Alert
              severity={identifiers.length >= 1 ? "warning" : "info"}
              icon={identifiers.length >= 1 ? <WarningAmberRoundedIcon fontSize="small" /> : <InfoOutlinedIcon fontSize="small" />}
              sx={{ mb: 2.5, borderRadius: 2, fontSize: 13 }}
            >
              {identifiers.length >= 1 ? (
                <>
                  <strong>Límite alcanzado.</strong> Los modelos genéricos solo pueden tener{" "}
                  <strong>un identificador</strong>. Elimina el actual para agregar uno nuevo.
                </>
              ) : (
                <>
                  Los modelos genéricos solo admiten <strong>un identificador</strong> de{" "}
                  <strong>exactamente {GENERIC_EXACT_LENGTH} caracteres</strong>.
                </>
              )}
            </Alert>
          ) : (
            <Alert
              severity="info"
              icon={<InfoOutlinedIcon fontSize="small" />}
              sx={{ mb: 2.5, borderRadius: 2, fontSize: 13 }}
            >
              Los modelos únicos (seriados) pueden tener <strong>múltiples identificadores</strong>{" "}
              de <strong>exactamente {UNIQUE_EXACT_LENGTH} caracteres</strong> cada uno.
            </Alert>
          )}

          {/* Añadir nuevo */}
          <Typography
            fontSize={12}
            fontWeight={700}
            color="text.secondary"
            mb={1}
            textTransform="uppercase"
            letterSpacing={0.6}
          >
            Nuevo identificador
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder={
              isGeneric
                ? `Código de ${GENERIC_EXACT_LENGTH} caracteres`
                : `Código de ${UNIQUE_EXACT_LENGTH} caracteres`
            }
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAddMore) handleAdd();
            }}
            disabled={isCreating || !canAddMore}
            helperText={canAddMore ? newCodeHelperText : undefined}
            color={newCodeColor as "primary" | "error" | "success"}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={
                        !canAddMore
                          ? "Este modelo ya tiene el máximo de identificadores permitidos"
                          : "Agregar identificador"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleAdd}
                          disabled={isCreating || !newCode.trim() || !canAddMore}
                          color="primary"
                        >
                          {isCreating ? (
                            <CircularProgress size={16} />
                          ) : (
                            <AddRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
          />

          {/* Lista de identificadores */}
          <Typography
            fontSize={12}
            fontWeight={700}
            color="text.secondary"
            mb={1}
            textTransform="uppercase"
            letterSpacing={0.6}
          >
            Identificadores actuales
            {identifiers.length > 0 && (
              <Chip
                label={identifiers.length}
                size="small"
                sx={{ ml: 1, height: 18, fontSize: 11, fontWeight: 700 }}
              />
            )}
          </Typography>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : identifiers.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <TagRoundedIcon
                sx={{ fontSize: 32, color: "text.disabled", mb: 0.5 }}
              />
              <Typography fontSize={13} color="text.secondary">
                Este modelo aún no tiene identificadores
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0.8}>
              {identifiers.map((item) =>
                editingId === item.id ? (
                  /* Fila en modo edición */
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <TextField
                      fullWidth
                      size="small"
                      autoFocus
                      value={editingCode}
                      onChange={(e) =>
                        setEditingCode(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit(item);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      disabled={isUpdating}
                      helperText={
                        isGeneric
                          ? `${editingCode.length}/${GENERIC_EXACT_LENGTH} chars`
                          : `${editingCode.length}/${UNIQUE_EXACT_LENGTH} chars`
                      }
                    />
                    <Tooltip title="Confirmar (Enter)">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => confirmEdit(item)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <CircularProgress size={16} />
                        ) : (
                          <CheckRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar (Esc)">
                      <IconButton
                        size="small"
                        onClick={cancelEdit}
                        disabled={isUpdating}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ) : (
                  /* Fila normal */
                  <Stack
                    key={item.id}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      "&:hover": {
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        borderColor: (t) =>
                          alpha(t.palette.primary.main, 0.3),
                      },
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Chip
                      label={item.code}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontFamily: "monospace",
                        fontSize: 12,
                        bgcolor: (t) =>
                          isGeneric
                            ? alpha(t.palette.warning.main, 0.1)
                            : alpha(t.palette.primary.main, 0.1),
                        color: isGeneric ? "warning.dark" : "primary.dark",
                        flex: 1,
                        justifyContent: "flex-start",
                        maxWidth: "100%",
                      }}
                    />
                    {/* Editar solo si tiene ID real */}
                    <Tooltip
                      title={
                        item.id < 0
                          ? "El backend no devolvió ID, no se puede editar"
                          : "Editar"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => startEdit(item)}
                          disabled={editingId !== null || item.id < 0}
                        >
                          <EditRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={
                        item.id < 0
                          ? "El backend no devolvió ID, no se puede eliminar"
                          : "Eliminar"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(item)}
                          disabled={editingId !== null || item.id < 0}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                ),
              )}
            </Stack>
          )}
        </DialogContent>

        <Divider />

        {/* FOOTER */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete */}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Eliminar identificador"
        subtitle={`¿Eliminar el identificador "${deleteTarget?.code}"? Esta acción no se puede deshacer.`}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDelete}
      />
    </>
  );
}
