import { IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import type { Tool } from "../../../interface/tools/tools.interface";
import "./CardTool.css";

interface Props {
  item: Tool;
  setSelectedTools: React.Dispatch<React.SetStateAction<Tool[]>>;
}

export default function CardTool({
  item,
  setSelectedTools,
}: Props) {
  return (
    <div className="cardTool">
      <div className="cardTool-icon">
        <IconButton
          size="small"
          onClick={() =>
            setSelectedTools((prev) =>
              prev.filter((e) => e.id !== item.id)
            )
          }
        >
          <GridCloseIcon />
        </IconButton>
      </div>

      <div className="card-title">{item.name}</div>

      <div className="subCardTool">
        <div className="card-subtitle">
          {item.description || "Sin descripción"}
        </div>
      </div>
    </div>
  );
}