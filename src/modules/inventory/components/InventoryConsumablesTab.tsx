import { Box } from "@mui/material";
import { memo } from "react";
import type { ConsumableInventoryItem } from "../data/inventoryMockItems";
import { InventoryConsumableCard } from "./InventoryConsumableCard";

type Props = {
  items: ConsumableInventoryItem[];
};

export const InventoryConsumablesTab = memo(function InventoryConsumablesTab({
  items,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, 200px)",
        gap: 0.75,
        width: "100%",
        justifyContent: "space-around",
      }}
    >
      {items.map((item) => (
        <InventoryConsumableCard key={item.id} item={item} />
      ))}
    </Box>
  );
});
