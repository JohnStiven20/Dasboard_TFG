import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Card from "../../entries/components/Card";
import { useNotifications } from "../../../context/NotificationsContext";
import { useAppSelector } from "../../../store/hooks";
import { findByAccountid } from "../../account/service/account.service";
import { getAssignedProductItemsByWorker } from "../../worker/service/worker.service";
import type { AssignedProductItemsByModel } from "../interfaces/assignedProductItems";
import { installAssignedProductItem } from "../service/profileAssignedProducts.service";
import "../style/ProfilePage.css";
import { formatDateTime } from "../../../utils/formatDateTime";
import type { Account } from "../../account/interface/account";


const getInitials = (name?: string, username?: string) => {
  const source = (name || username || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const MetaItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box className="profile-meta-item">
    <Box className="profile-meta-icon">{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography className="profile-meta-label">{label}</Typography>
      <Typography className="profile-meta-value">{value}</Typography>
    </Box>
  </Box>
);

export default function ProfilePage() {

  const auth = useAppSelector((state) => state.auth);

  const [openModelId, setOpenModelId] = useState<number | null>(null);
  const [installingProductId, setInstallingProductId] = useState<number | null>(null);
  const qc = useQueryClient();
  const { notify } = useNotifications();

  const profileQuery = useQuery({
    queryKey: ["account", "profile", auth.id],
    queryFn: () => findByAccountid(auth.id) as Promise<Account>,
    enabled: auth.id > 0,
  });

  const account = profileQuery.data;
  const subject = account?.subject;
  const workerId = subject?.id;

  const assignedProductsQuery = useQuery({
    queryKey: ["worker", workerId, "assigned-product-items"],
    queryFn: () => getAssignedProductItemsByWorker(workerId as number),
    enabled: Boolean(workerId),
  });

  const roleLabel = useMemo(() => auth.typeAccount || "Cuenta web", [auth.typeAccount]);
  const assignedModels = useMemo<AssignedProductItemsByModel[]>(
    () => (assignedProductsQuery.data ?? []).filter((model) => model.products.length > 0),
    [assignedProductsQuery.data]
  );
  
  const installProductMutation = useMutation({
    mutationFn: (productItemId: number) =>
      installAssignedProductItem(productItemId, { remarks: null }),
    onSuccess: async () => {
      notify("Producto instalado correctamente", "success");
      await qc.invalidateQueries({
        queryKey: ["worker", workerId, "assigned-product-items"],
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo registrar la instalacion del producto.";
      notify(message, "error");
    },
    onSettled: () => {
      setInstallingProductId(null);
    },
  });

  useEffect(() => {
    if (assignedModels.length === 0) {
      setOpenModelId(null);
      return;
    }

    setOpenModelId((currentOpenModelId) => {
      if (currentOpenModelId == null) {
        return assignedModels[0].modelId;
      }

      const stillExists = assignedModels.some(
        (model) => model.modelId === currentOpenModelId
      );

      return stillExists ? currentOpenModelId : assignedModels[0].modelId;
    });
  }, [assignedModels]);

  const handleInstallProduct = async (productId: number) => {
    setInstallingProductId(productId);
    try {
      await installProductMutation.mutateAsync(productId);
    } catch {
      // El mensaje ya se gestiona en onError de la mutacion.
    }
  };

  return (
    <div className="profile-container">
      <Box className="profile-grid">
        <Box className="profile-header">
          <article className="profile-title-article">
            <h1>Perfil</h1>
            <p>Informacion personal y de cuenta.</p>
          </article>
        </Box>

        {profileQuery.isLoading ? (
          <Stack gap={1}>
            <Skeleton variant="rounded" height={320} />
          </Stack>
        ) : profileQuery.isError ? (
          <Alert severity="error" sx={{ borderRadius: "16px" }}>
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "No se pudo cargar el perfil del usuario."}
          </Alert>
        ) : !account ? (
          <Alert severity="info" sx={{ borderRadius: "16px" }}>
            No hay informacion de perfil disponible para esta cuenta.
          </Alert>
        ) : (
          <Box className="profile-content-stack">
            <Card className="profile-card profile-card-main profile-summary-card">
              <Box className="profile-compact-hero">
                <Avatar className="profile-avatar">
                  {getInitials(subject?.name, account.username)}
                </Avatar>

                <Box className="profile-copy">
                  <Typography className="profile-name">
                    {subject?.name || account.username}
                  </Typography>
                  <Typography className="profile-role">
                    {roleLabel}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    flexWrap="wrap"
                    className="profile-contact-list"
                  >
                    <Box className="profile-contact-row">
                      <MailOutlineRoundedIcon sx={{ fontSize: 18, color: "#667085" }} />
                      <Typography className="profile-contact-value">
                        {subject?.email || "Sin correo"}
                      </Typography>
                    </Box>
                    <Box className="profile-contact-row">
                      <PhoneRoundedIcon sx={{ fontSize: 18, color: "#667085" }} />
                      <Typography className="profile-contact-value">
                        {subject?.phone || "Sin telefono"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box className="profile-summary-divider" />

              <Box className="profile-meta-grid compact">
                <MetaItem
                  icon={<ShieldRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Tipo de cuenta"
                  value={roleLabel}
                />
                <MetaItem
                  icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Fecha de alta"
                  value={formatDateTime(subject?.createdAt ?? account.createdAt)}
                />
                <MetaItem
                  icon={<MailOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Usuario"
                  value={`${account.username}`}
                />
              </Box>
            </Card>

            <Card className="profile-card profile-assigned-card">

              <Box className="profile-assigned-header">
                <Box>
                  <Typography className="profile-assigned-title">
                    Productos asignados
                  </Typography>
                </Box>
              </Box>

              {assignedProductsQuery.isLoading ? (
                <Box className="profile-assigned-loading">
                  <CircularProgress size={22} thickness={4} />
                  <Typography className="profile-assigned-loading-copy">
                    Cargando productos asignados...
                  </Typography>
                </Box>
              ) : assignedProductsQuery.isError ? (
                <Alert severity="error" sx={{ borderRadius: "14px" }}>
                  {assignedProductsQuery.error instanceof Error
                    ? assignedProductsQuery.error.message
                    : "No se pudieron cargar los productos asignados del trabajador."}
                </Alert>
              ) : assignedModels.length > 0 ? (
                <Box className="profile-assigned-models" sx={{mb: 2}}>
                  {assignedModels.map((model) => {
                    const isOpen = openModelId === model.modelId;

                    return (
                      <Box key={model.modelId} className="profile-assigned-model-block">
                        <Box
                          component="button"
                          type="button"
                          className={`profile-assigned-model-button ${
                            isOpen ? "is-open" : ""
                          }`}
                          onClick={() =>
                            setOpenModelId((current) =>
                              current === model.modelId ? null : model.modelId
                            )
                          }
                        >
                          <Box className="profile-assigned-model-copy">
                            <Box className="profile-assigned-model-icon">
                              <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                            </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography className="profile-assigned-model-name">
                              {model.modelName}
                            </Typography>

                          </Box>
                        </Box>

                        <Box className="profile-assigned-model-action">
                          <Chip
                            size="small"
                            label={model.totalProducts}
                            className="profile-assigned-count-chip"
                          />
                          <ChevronRightRoundedIcon
                            className={`profile-assigned-chevron ${
                              isOpen ? "is-open" : ""
                              }`}
                            />
                          </Box>
                        </Box>

                        {isOpen ? (
                          <Box className="profile-assigned-items">
                            {model.products.map((item) => (
                              <Box
                                key={item.productItemId}
                                className="profile-assigned-item-row"
                              >
                                <Box>
                                  <Typography className="profile-assigned-item-meta">
                                    {item.productIdentifierCode || "Sin identificador"}
                                  </Typography>
                                  <Typography className="profile-assigned-item-meta">
                                    MAC: {item.mac}
                                  </Typography>
                                </Box>

                                <Box>
                                  <button
                                    type="button"
                                    className="profile-install-button"
                                    disabled={installingProductId === item.productItemId}
                                    onClick={() => void handleInstallProduct(item.productItemId)}
                                  >
                                    {installingProductId === item.productItemId
                                      ? "Instalando..."
                                      : "Instalar"}
                                  </button>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : null}
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box className="profile-assigned-empty">
                  <Typography className="profile-assigned-empty-title">
                    No hay productos pendientes de instalacion
                  </Typography>
                  <Typography className="profile-assigned-empty-copy">
                    Solo se muestran equipos en estado asignado para este trabajador.
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        )}
      </Box>
    </div>
  );
}
