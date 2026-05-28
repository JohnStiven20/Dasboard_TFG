import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { memo } from "react";
import type {
  InventoryModelProduct,
  InventoryModelProductsResponse,
} from "../interfaces/inventoryModelProducts";
import type { InventoryModelSummary } from "../interfaces/inventoryModelSummary";
import { InventoryModelProductCard } from "./InventoryModelProductCard";

type Props = {
  model: InventoryModelSummary;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onSelectProduct: (item: InventoryModelProduct) => void;
  response: InventoryModelProductsResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
};

const loadingCards = Array.from({ length: 6 }, (_, index) => index);

export const InventoryModelProductsView = memo(function InventoryModelProductsView({
  model,
  searchValue,
  onSearchChange,
  onBack,
  onPageChange,
  onSelectProduct,
  response,
  isLoading,
  isFetching,
  isError,
  errorMessage,
}: Props) {
  const items = Array.isArray(response?.items) ? response.items : [];
  const page = typeof response?.page === "number" ? response.page : 0;
  const totalPages = typeof response?.totalPages === "number" ? response.totalPages : 0;

  return (
    <Stack gap={2}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          padding: "16px",
          borderRadius: "10px",
          border: "1px solid #e7ebf1",
          backgroundColor: "#fcfcfd",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          gap={1.25}
        >
          <Stack direction="row" gap={1} alignItems="flex-start">
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                borderRadius: "14px",
                borderColor: "#d0d5dd",
                color: "#344054",
                padding: 0,
              }}
            >
              <ArrowBackRoundedIcon fontSize="small" />
            </Button>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#667085",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Productos del modelo
              </Typography>
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#101828",
                  lineHeight: 1.15,
                }}
              >
                {model.modelName}
              </Typography>
            </Box>
          </Stack>

          <TextField
            size="small"
            placeholder="Buscar por MAC o identificador"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            sx={{ width: { xs: "100%", sm: 300 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 18, color: "#667085" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Box>

      {isError ? (
        <Alert severity="error" sx={{ borderRadius: "16px" }}>
          {errorMessage ?? "No se pudieron cargar los productos de este modelo."}
        </Alert>
      ) : isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
          }}
        >
          {loadingCards.map((item) => (
            <Stack
              key={item}
              sx={{
                gap: 1,
                minHeight: 142,
                padding: "14px 16px",
                borderRadius: "18px",
                border: "1px solid #e7ebf1",
                backgroundColor: "#fcfcfd",
              }}
            >
              <Skeleton variant="text" width="35%" height={18} />
              <Skeleton variant="text" width="24%" height={28} />
              <Skeleton variant="text" width="62%" height={20} />
              <Skeleton variant="text" width="72%" height={20} />
            </Stack>
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "16px" }}>
          No hay productos unicos para este modelo con la busqueda actual.
        </Alert>
      ) : (
        <Stack gap={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              opacity: isFetching ? 0.72 : 1,
              transition: "opacity 0.18s ease",
            }}
          >
            {items.map((item) => (
              <InventoryModelProductCard
                key={item.productId}
                item={item}
                onClick={onSelectProduct}
              />
            ))}
          </Box>

          {totalPages > 1 ? (
            <Stack direction="row" justifyContent="center">
              <Pagination
                page={page + 1}
                count={totalPages}
                color="primary"
                shape="rounded"
                onChange={(_, pageValue) => onPageChange(pageValue - 1)}
              />
            </Stack>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
});
