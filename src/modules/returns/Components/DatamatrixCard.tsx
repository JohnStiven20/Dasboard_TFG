import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from "@mui/material";
import type { ProductItemDTO } from "../../../interface/subject/assigment";
import { formatDateTime } from "../../../utils/formatDateTime";

interface Props {
  item: ProductItemDTO;
  selected?: boolean;
  onToggle?: () => void;
}

export const DatamatrixCard = ({ item, selected = false, onToggle }: Props) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        cursor: onToggle ? "pointer" : "default",
        borderColor: selected ? "primary.main" : undefined,
        backgroundColor: selected ? "primary.50" : undefined,
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: onToggle ? 4 : undefined,
        },
      }}
    >
      <CardActionArea disabled={!onToggle} onClick={onToggle}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {item.name}
            </Typography>

            {selected ? (
              <Chip label="Seleccionado" size="small" color="primary" />
            ) : (
              <Chip
                label="Asignado"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Código
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              backgroundColor: "#f5f5f5",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: "inline-block",
              mt: 0.5,
            }}
          >
            {item.mac}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={2}
          >
            Asignado el {formatDateTime(item.date)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
