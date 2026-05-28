import { Box, Tab, Tabs } from "@mui/material";
import { memo, type SyntheticEvent } from "react";
import a11yProps from "../../assignments/components/Tabs";

type Props = {
  tab: number;
  onChange: (_: SyntheticEvent, newValue: number) => void;
};

export const InventoryTabsNavigation = memo(function InventoryTabsNavigation({
  tab,
  onChange,
}: Props) {
  return (
    <Box component="section">
      <Tabs
        value={tab}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          width: "100%",
          padding: "4px",
          backgroundColor: "#ebeaf0",
          borderRadius: "12px",
          minHeight: "30px",
          mt: 2,
        }}
        slotProps={{
          indicator: { className: "tabs-indicator" },
        }}
      >
        <Tab
          label="Productos"
          className="tab-pill"
          sx={{
            padding: "0px",
            minHeight: "30px",
          }}
          {...a11yProps(0)}
        />
        
      </Tabs>
    </Box>
  );
});
