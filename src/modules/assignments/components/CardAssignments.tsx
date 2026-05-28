import type { AssignmetResponse } from "../../../interface/subject/assigment";
import "./CardAssignments.css";

interface CardAssignmentsProps {
  data?: AssignmetResponse;
}

export default function CardAssignments({ data }: CardAssignmentsProps) {
  if (!data) return null;

  return (
    <div className="cardAssignments">
      <h4>Resumen de asignación</h4>

      <p className="responsable">
        <strong>Responsable:</strong> {data.worker.name ?? "-"}
      </p>

      {Object.entries(data.itemsByProduct).map(([productName, items]) => (
        <div className="productBlock" key={productName}>
          <h5 className="productTitle">{productName}</h5>

          <ul className="itemsList">
            {items.map((item) => (
              <li key={item.id} className="itemRow">
                <span className="itemCode">{item.code}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
