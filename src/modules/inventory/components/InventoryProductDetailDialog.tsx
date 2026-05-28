import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { memo } from "react";
import { useInventoryProductDetail } from "../hooks/useInventoryProductDetail";
import { useInventoryProductHistory } from "../hooks/useInventoryProductHistory";
import type { InventoryModelProduct } from "../interfaces/inventoryModelProducts";
import type { InventoryProductDetail } from "../interfaces/inventoryProductDetail";
import type { InventoryProductHistoryEvent } from "../interfaces/inventoryProductHistory";
import { formatDateTime } from "../../../utils/formatDateTime";

type Props = {
  open: boolean;
  product: InventoryModelProduct | null;
  prefetchedDetail?: InventoryProductDetail | null;
  prefetchedHistory?: InventoryProductHistoryEvent[] | null;
  onClose: () => void;
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  ENTRY: "Entrada",
  ASSIGNMENT: "Asignacion",
  ASSIGN: "Asignacion",
  EXIT: "Salida",
  RETURN: "Devolucion",
  USE: "Uso",
  INSTALLED: "Instalado",
  INSTALL: "Instalado"
};

const EVENT_TYPE_STYLES: Record<
  string,
  { chipBackground: string; chipColor: string; borderColor: string }
> = {
  ENTRY: {
    chipBackground: "#cfead8",
    chipColor: "#0b6b35",
    borderColor: "rgba(11, 107, 53, 0.2)",
  },
  ASSIGN: {
    chipBackground: "#dbeafe",
    chipColor: "#1d4ed8",
    borderColor: "rgba(29, 78, 216, 0.2)",
  },
  ASSIGNMENT: {
    chipBackground: "#dbeafe",
    chipColor: "#1d4ed8",
    borderColor: "rgba(29, 78, 216, 0.2)",
  },
  RETURN: {
    chipBackground: "#fef3c7",
    chipColor: "#b45309",
    borderColor: "rgba(180, 83, 9, 0.2)",
  },
  EXIT: {
    chipBackground: "#fee2e2",
    chipColor: "#b91c1c",
    borderColor: "rgba(185, 28, 28, 0.2)",
  },
  INSTALL: {
    chipBackground: "#ccfbf1",
    chipColor: "#115e59",
    borderColor: "rgba(17, 94, 89, 0.2)",
  },
  INSTALLED: {
    chipBackground: "#ccfbf1",
    chipColor: "#115e59",
    borderColor: "rgba(17, 94, 89, 0.2)",
  },
  TRANSFER: {
    chipBackground: "#ede9fe",
    chipColor: "#6d28d9",
    borderColor: "rgba(109, 40, 217, 0.2)",
  },
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  ASSIGNED: "Asignado",
  INSTALLED: "Instalado",
  BROKEN: "Descatalogado",
};

const getStatusTone = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Activo",
        color: "#067647",
        background: "#ecfdf3",
        border: "#abefc6",
      };
    case "ASSIGNED":
      return {
        label: "Asignado",
        color: "#175cd3",
        background: "#eff8ff",
        border: "#b2ddff",
      };
    case "INSTALLED":
      return {
        label: "Instalado",
        color: "#115e59",
        background: "#ccfbf1",
        border: "#99f6e4",
      };
    case "BROKEN":
      return {
        label: "Descatalogado",
        color: "#b42318",
        background: "#fee4e2",
        border: "#fecdca",
      };
    case "INSTALL":
       return {
        label: "Descatalogado",
        color: "#b42318",
        background: "#fee4e2",
        border: "#fecdca",
      };
    default:
      return {
        label: status,
        color: "#6941c6",
        background: "#f4f3ff",
        border: "#d9d6fe",
      };
  }
};

const ValueRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "baseline",
      gap: 1.2,
    }}
  >
    <Typography
      sx={{
        width: 96,
        flexShrink: 0,
        fontSize: 12,
        fontWeight: 700,
        color: "#344054",
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        minWidth: 0,
        fontSize: 13,
        fontWeight: 700,
        color: "#101828",
        lineHeight: 1.3,
        wordBreak: "break-word",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const DetailSkeleton = () => (
  <Stack gap={1.1}>
    <Skeleton variant="rounded" height={180} />
  </Stack>
);

const HistorySkeleton = () => (
  <Stack gap={1}>
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={index} variant="rounded" height={110} />
    ))}
  </Stack>
);

export const InventoryProductDetailDialog = memo(function InventoryProductDetailDialog({
  open,
  product,
  prefetchedDetail,
  prefetchedHistory,
  onClose,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const shouldFetchDetail =
    typeof product?.productId === "number" && prefetchedDetail == null;
  const shouldFetchHistory =
    typeof product?.productId === "number" && prefetchedHistory == null;
  const {
    detail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
  } = useInventoryProductDetail(shouldFetchDetail ? product?.productId : null);
  const {
    history,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError,
  } = useInventoryProductHistory(shouldFetchHistory ? product?.productId : null);

  const resolvedDetail = prefetchedDetail ?? detail;
  const resolvedHistory = prefetchedHistory ?? history;

  const statusTone = getStatusTone(resolvedDetail?.status ?? product?.status ?? "");



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      sx={{ zIndex: 2400 }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : "18px",
            overflow: "hidden",
            maxWidth: 720,
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 0, py: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 3,
            py: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#101828" }}>
            Detalle del Producto
          </Typography>

          <IconButton onClick={onClose} size="small" sx={{ color: "#344054" }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Stack gap={2}>
          {isLoadingDetail ? (
            <DetailSkeleton />
          ) : isErrorDetail ? (
            <Alert severity="error" sx={{ borderRadius: "16px" }}>
              {detailError instanceof Error
                ? detailError.message
                : "No se pudo cargar el detalle del producto."}
            </Alert>
          ) : resolvedDetail ? (
            <Box
              sx={{
                border: "1px solid #e7ebf1",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "120px 1fr" },
                  gap: 2,
                  px: 2.25,
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 112,
                  }}
                >
                  <Box
                    sx={{
                      width: 76,
                      height: 76,
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e7ebf1",
                      color: "#344054",
                    }}
                  >
                    <RouterRoundedIcon sx={{ fontSize: 42 }} />
                  </Box>
                </Box>

                <Stack gap={1.15} justifyContent="center">
                  <ValueRow label="Modelo" value={resolvedDetail.modelName} />
                  <ValueRow label="MAC" value={resolvedDetail.mac} />
                  <ValueRow
                    label="Identificador"
                    value={resolvedDetail.productIdentifierCode ?? "Sin identificador"}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <Typography
                      sx={{
                        width: 96,
                        flexShrink: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#344054",
                      }}
                    >
                      Estado
                    </Typography>
                    <Chip
                      label={STATUS_LABELS[resolvedDetail.status] ?? resolvedDetail.status}
                      size="small"
                      sx={{
                        color: statusTone.color,
                        backgroundColor: statusTone.background,
                        border: `1px solid ${statusTone.border}`,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Box
                sx={{
                  px: 2.25,
                  py: 1.6,
                  backgroundColor: "#fcfcfd",
                }}
              >
                    <Stack gap={0.85}>
                      <ValueRow
                        label="Responsable"
                        value={resolvedDetail.workerName ?? "Sin responsable"}
                      />
                      <ValueRow label="Creado" value={formatDateTime(resolvedDetail.createdAt)} />
                      <ValueRow label="Actualizado" value={formatDateTime(resolvedDetail.updatedAt)} />
                      {resolvedDetail.status === "BROKEN" ?
                        <ValueRow label="Obs" value={resolvedDetail.remarks ?? "Sin observaciones"} />
                        : null}
                    </Stack>
              </Box>
            </Box>
          ) : (
            <Alert severity="info" sx={{ borderRadius: "16px" }}>
              No hay detalle disponible para este producto.
            </Alert>
          )}

          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#101828" }}>
              Historial
            </Typography>
          </Box>

          {isLoadingHistory ? (
            <HistorySkeleton />
          ) : isErrorHistory ? (
            <Alert severity="error" sx={{ borderRadius: "16px" }}>
              {historyError instanceof Error
                ? historyError.message
                : "No se pudo cargar el historial del producto."}
            </Alert>
          ) : resolvedHistory.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: "16px" }}>
              Este producto no tiene eventos registrados todavia.
            </Alert>
          ) : (
            <Stack gap={1}>
              {resolvedHistory.map((event) => {
                const eventStyle = EVENT_TYPE_STYLES[event.eventType] ?? {
                  chipBackground: "#f4f3ff",
                  chipColor: "#6941c6",
                  borderColor: "rgba(105, 65, 198, 0.2)",
                };

                return (
                <Box
                  key={event.eventId}
                  sx={{
                    padding: "14px 16px",
                    borderRadius: "16px",
                    border: "1px solid rgba(185, 185, 185, 0.7)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                  >
                    <Chip
                      label={EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
                      size="small"
                      sx={{
                        height: 24,
                        backgroundColor: eventStyle.chipBackground,
                        color: eventStyle.chipColor,
                        border: `1px solid ${eventStyle.borderColor}`,
                        fontWeight: 700,
                        textTransform: "lowercase",
                      }}
                    />

                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#475467" }}>
                      {formatDateTime(event.eventDate)}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      mt: 1.35,
                      display: "grid",
                      gridTemplateColumns: "70px 1fr",
                      rowGap: 0.65,
                      columnGap: 1,
                    }}
                  >
                    {event.fromSubjectName ?
                      <>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#344054" }}>
                          De:
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#101828" }}>
                          {event.fromSubjectName ?? "Sin origen"}
                        </Typography>
                      </>
                    : null}

                    {event.toSubjectName ? (
                      <>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#344054" }}>
                          A:
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#101828" }}>
                          {event.toSubjectName}
                        </Typography>
                      </>
                    ) : null}

                    {event.performedByName ? (
                      <>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#344054" }}>
                          Por:
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#101828" }}>
                          {event.performedByName}
                        </Typography>
                      </>
                    ) : null}

                    {event.observations ? (
                      <>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#344054" }}>
                          Obs:
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#101828" }}>
                          {event.observations}
                        </Typography>
                      </>
                    ) : null}
                  </Box>
                </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
});
