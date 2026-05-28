import {
  Card,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from "@mui/material";
import type { Tool } from "../../../interface/tools/tools.interface";

interface Props {
  item: Tool;
  selected?: boolean;
  onToggle?: () => void;
}

export const ToolReturnCard = ({ item, selected = false, onToggle }: Props) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        cursor: "pointer",
        px: 1.5,
        py: 0.8,
        minWidth: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "0.2s ease",
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected ? "primary.50" : "background.paper",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardActionArea disabled={!onToggle} onClick={onToggle}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize={14} fontWeight={600} noWrap>
            {item.name}
          </Typography>

          {item.description && (
            <Typography fontSize={12} color="text.secondary" noWrap>
              • {item.description}
            </Typography>
          )}
        </Box>

        <Chip
          label={selected ? "Seleccionada" : "Disponible"}
          size="small"
          color={selected ? "primary" : "success"}
          variant={selected ? "filled" : "outlined"}
          sx={{ height: 22 }}
        />
      </CardActionArea>
    </Card>
  );
};
