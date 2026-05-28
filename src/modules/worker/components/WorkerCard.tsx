"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import type { Worker } from "../../../interface/subject/subject";
import { formatDateTime } from "../../../utils/formatDateTime";

interface Props {
  worker: Worker;
  onClickWoker: (worker: Worker) => void;
}

export default function WorkerCard({ worker, onClickWoker }: Props) {
  return (
    <Card
      onClick={() => {
        onClickWoker(worker);
      }}
      sx={{
        flex: 1,
        width: "100%",
        borderRadius: 3,
        boxShadow: 3,
        position:"relative" , 
        transition: "0.2s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box sx={{flexWrap: "wrap" , display: "flex" , alignItems: "center" , gap: 2 }}>
          <Box>
            <Typography fontWeight="bold">
              {worker.name ?? "Sin nombre"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {worker.email ?? "Sin email"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <BadgeOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2">
              Código: {worker.employeeCode ?? "-"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <PhoneOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {worker.phone ?? "Sin teléfono"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="start" gap={1}>
            <EmailOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {worker.email ?? "Sin email"}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={2}
        >
          Creado el{" "}
          {formatDateTime(worker.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
}
