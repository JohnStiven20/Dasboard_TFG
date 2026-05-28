import "./CardToolExtend.css";
import BuildIcon from '@mui/icons-material/Build';

export default function CardToolExtend({ lista }: { lista: any }) {
    return (
        <div className="cardToolExtend">
            <div style={{alignSelf: "center" }}>
                <BuildIcon color="primary" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h4>{lista.title}</h4>
                <p>{lista.codigo}</p>
                <p>Fecha de entrega: {lista.fecha}</p>
            </div>
            <div>
                <input className="checkbox" type="checkbox" onChange={() => { }} />
            </div>
        </div>
    );
}