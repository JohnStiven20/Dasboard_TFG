import {
  Button as MuiButton,
  Card,
  CardActions,
  CardContent,
  TextareaAutosize,
} from "@mui/material";
import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNotifications } from "../../../context/NotificationsContext";
import type { ProductItemDTO } from "../../../interface/subject/assigment";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import { useOutputProduct } from "../hooks/useOutPut";

interface Props {
  product: ProductItemDTO | undefined;
  onProductRemoved: () => void;
  onCancel?: () => void;
}

export const CardOut = ({ product, onProductRemoved, onCancel }: Props) => {
  const { notify } = useNotifications();
  const { fechmarkAsBroken, isPendingMarkAsBroken } = useOutputProduct();
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setRemarks("");
  }, [product?.id]);

  const handleMarkBroken = async () => {
    if (!product) return;

    try {
      await fechmarkAsBroken({
        id: product.id,
        remarks: remarks.trim(),
      });

      notify("Salida especifica registrada correctamente", "success");
      onProductRemoved();
    } catch {
      notify("No se pudo registrar la salida del producto", "error");
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        width: 330,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(202, 46, 19, 1)",
          color: "primary.contrastText",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
          Producto escaneado
        </Typography>

        <Typography variant="h6" fontWeight={700}>
          {product?.name ?? "No hay informacion"}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          <div>
            {/* <p>Prefijo: {product?.prefijo}</p>
             <p>Variente: {product?.variante}</p> */}
            <p>MAC: {product?.mac}</p>
          </div>
        </Typography>
      </Box>

      <CardContent sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Observaciones
        </Typography>

        <TextareaAutosize
          minRows={3}
          placeholder="Anade notas sobre este producto..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.12)",
            fontFamily: "inherit",
            fontSize: "0.9rem",
            resize: "vertical",
            outline: "none",
          }}
          value={remarks}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setRemarks(e.target.value);
          }}
        />
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2, gap: 1 }}>
        {onCancel ? (
          <MuiButton
            variant="outlined"
            onClick={onCancel}
            disabled={isPendingMarkAsBroken}
            fullWidth
          >
            Limpiar
          </MuiButton>
        ) : null}

        <MuiButton
          variant="contained"
          onClick={handleMarkBroken}
          disabled={!product || isPendingMarkAsBroken}
          type="reset"
          sx={appBlackButtonSx}
          disableElevation
          fullWidth
        >
          {isPendingMarkAsBroken ? "Registrando..." : "Registrar salida"}
        </MuiButton>
      </CardActions>
    </Card>
  );
};
