import { Card, CardActionArea, IconButton, Typography } from "@mui/material";
import type { GenericProductBasicDTO } from "../../../interface/subject/assigment";
import RemoveIcon from "@mui/icons-material/Remove";
import { GridCloseIcon } from "@mui/x-data-grid";

interface Props {
  item: GenericProductBasicDTO;
  selected?: boolean;
  onClick?: () => void;
}

interface PropsReturn {
  item: GenericProductBasicDTO;
  decGenericReturn: (id: number) => void;
  selected?: boolean;
  onClick: (id:number) => void;
}

export const AssignmentProductGenercCard = ({
  item,
  selected = false,
  onClick,
}: Props) => {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: "1 1 40px",
        maxWidth: 200,
        borderRadius: 2,
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected ? "primary.50" : "background.paper",
        transition: "0.2s ease",
        // "&:hover": {
        //   boxShadow: 2,
        // },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={14} fontWeight={600}>
          {item.name}
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          x{item.quantity}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export const AssignmentProductGenercCardReturn = ({
  item,
  selected = false,
  onClick,
  decGenericReturn,

}: PropsReturn) => {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: "1 1 140px",
        maxWidth: 200,
        borderRadius: 2,
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected ? "primary.50" : "background.paper",
        transition: "0.2s ease",
      }}
    >
      <CardActionArea
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={14} fontWeight={600}>
          {item.name}
        </Typography>

        <IconButton
          size="small"
          onClick={() => {
            decGenericReturn(item.id);
          }}
          aria-label="Quitar una unidad"
          className="cardGenericEntry-action"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography fontSize={13} color="text.secondary">
          x{item.quantity}
        </Typography>

        <IconButton
          size="small"
          onClick={() => {
              onClick(item.id)
          }}
          aria-label="Quitar consumible"
          className="cardGenericEntry-action"
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </CardActionArea>
    </Card>
  );
};
