import { Alert, Box, Skeleton, Stack } from "@mui/material";
import { memo } from "react";
import type { InventoryModelSummary } from "../interfaces/inventoryModelSummary";
import { InventoryModelCard } from "./InventoryModelCard";

type Props = {
  items: InventoryModelSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onSelectModel?: (item: InventoryModelSummary) => void;
};

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

export const InventoryModelsTab = memo(function InventoryModelsTab({
  items,
  isLoading,
  isError,
  errorMessage,
  onSelectModel,
}: Props) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {skeletonCards.map((item) => (
          <Stack
            key={item}
            sx={{
              gap: 1,
              minHeight: 196,
              padding: "16px",
              borderRadius: "20px",
              border: "1px solid #e7ebf1",
              backgroundColor: "#ffffff",
            }}
          >
            <Skeleton variant="text" width="72%" height={28} />
            <Skeleton variant="text" width="24%" height={18} />
            <Skeleton variant="rounded" width="46%" height={50} />
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.8 }}>
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
            </Box>
          </Stack>
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ borderRadius: "16px" }}>
        {errorMessage ?? "No se pudieron cargar los modelos del inventario."}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: "16px" }}>
        No hay modelos registrados en el inventario.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(1, minmax(0, 1fr))",
          lg: "repeat(1, minmax(0, 1fr))",
        },
        gap: 1,
        width: "100%",
      }}
    >
      {items.map((item) => (
        <InventoryModelCard
          key={item.modelId}
          item={item}
          onClick={onSelectModel}
        />
      ))}
    </Box>
  );
});
