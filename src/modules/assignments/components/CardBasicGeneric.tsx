import { Card, Typography, IconButton, Box, Stack } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

export interface ProductBasicGenericUI {
  id: number;
  name: string;
  amount: number;
}

export default function CardBasicGeneric({
  item,
  setSelectedGenerics,
}: {
  item: ProductBasicGenericUI;
  setSelectedGenerics: React.Dispatch<
    React.SetStateAction<ProductBasicGenericUI[]>
  >;
}) {
  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        mt: 2,
        borderRadius: 3,
        backgroundColor: "#f3eaff",
        border: "1px solid #c6f0d0",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
        onClick={() =>
          setSelectedGenerics((prev) => prev.filter((e) => e.id !== item.id))
        }
      >
        <GridCloseIcon />
      </IconButton>

      <Typography
        sx={{
          width: "100%",
          fontSize: "18px",
          fontWeight: 600,
          mb: 2,
        }}
      >
        {item.name}
      </Typography>

      <Box
        sx={{
          backgroundColor: "#f2f2f2",
          borderRadius: 3,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction={"row"}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Cantidad:
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 400,
            }}
          >
            {item.amount}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
