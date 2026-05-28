import { IconButton } from "@mui/material";
import type { DatamatrixProductItem } from "../../../interface/product/DatamatrixProductItem.interface";
import "./CardConsumable.css";
import { GridCloseIcon } from "@mui/x-data-grid";

export default function CardConsumable({
  lista,
  setSelectDataMatrixItem,
}: {
  lista: DatamatrixProductItem;
  setSelectDataMatrixItem: React.Dispatch<
    React.SetStateAction<DatamatrixProductItem[]>
  >;
}) {
  return (
    <div className="cardConsumable">
      <div className="cardConsumable-icon">
        <IconButton
          onClick={() => {
            setSelectDataMatrixItem((e) => {
              const selected = e.filter((e) => {
                return !(e.id === lista.id);
              });
              return selected;
            });
          }}
        >
          <GridCloseIcon />
        </IconButton>
      </div>

      <div className="card-title">{lista.name}</div>

      <div className="subCardConsumable">
        <div className="card-subtitle">{lista.code}</div>
      </div>
    </div>
  );
}
