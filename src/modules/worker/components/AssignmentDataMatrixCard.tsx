import { Box, Card, IconButton, Typography } from "@mui/material";
import type { ProductItemDTO } from "../../../interface/subject/assigment";
import { GridCloseIcon } from "@mui/x-data-grid";

interface Props {
  name: string;
  item: ProductItemDTO[];
  onclick: () => void;
}

interface PropsReturn {
  name: string;
  item: ProductItemDTO;
  removeProductItemFromReturn: (item: ProductItemDTO) => void;
}

export const AssignmentDataMatrixCard = ({ item, name, onclick }: Props) => {
  return (
    <>
      <Card
        onClick={onclick}
        variant="outlined"
        sx={{
          p: 2,

          transition: "0.2s ease",

          "&:hover": {
            boxShadow: 2,
          },
        }}
      >
        <Typography variant="body2">
          <strong>Consumibles: </strong>
          {name}
        </Typography>
        <Typography variant="body2">
          <strong>Cantidad: </strong>
          {item.length}
        </Typography>
      </Card>
    </>
  );
};

export const AssignmentDataMatrixCardReturn = ({
  item,
  name,
  removeProductItemFromReturn,
}: PropsReturn) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        borderRadius: 2,
        px: 1.5,
        py: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography fontSize={13} fontWeight={600}>
          {name}
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          MAC: {item.mac}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={() => removeProductItemFromReturn(item)}
        aria-label="Quitar consumible"
        className="cardGenericEntry-action"
      >
        <GridCloseIcon fontSize="small" />
      </IconButton>
    </Card>
  );
};
