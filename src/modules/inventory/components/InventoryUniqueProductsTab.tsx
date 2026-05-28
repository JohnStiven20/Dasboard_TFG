import { Box } from "@mui/material";
import { memo } from "react";
import type { UniqueProductInventoryItem } from "../data/inventoryMockItems";
import { InventoryUniqueProductCard } from "./InventoryUniqueProductCard";

type Props = {
  items: UniqueProductInventoryItem[];
};

export const InventoryUniqueProductsTab = memo(function InventoryUniqueProductsTab({
  items,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, 220px)",
        gap: 0.75,
        justifyContent: "space-around",
      }}
    >
      {items.map((item) => (
        <InventoryUniqueProductCard key={item.id} item={item} />
      ))}
    </Box>
  );
});
