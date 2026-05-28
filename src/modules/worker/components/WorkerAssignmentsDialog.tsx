import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import { useAssignment } from "../../assignments/hook/useAssigment";
import type { WorkerStockDTO } from "../../../interface/subject/assigment";
import type { Worker } from "../../../interface/subject/subject";
import {
  AssignmentDataMatrixCard,
} from "./AssignmentDataMatrixCard";
import { AssignmentProductGenercCard } from "./AssignmentProductGenercCard";

export interface WorkerAssignment {
  id: number;
  projectName: string;
  consumablesCount: number;
  date: string;
  active: boolean;
}

export interface WorkerAssignmentsResponse {
  worker: {
    id: number;
    name: string;
    role: string;
    active: boolean;
  };
  toolsAssigned: string[];
  activeAssignment?: WorkerAssignment;
  history: WorkerAssignment[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  worker: Worker | null | undefined;
}

export default function WorkerAssignmentsDialog({
  open,
  onClose,
  worker,
}: Props) {
  
  const [assigments, setassigments] = useState<WorkerStockDTO>({
    tools: [],
    genericProducts: [],
    productItems: {},
  });

  useEffect(() => {
    console.log(assigments.productItems);
  }, [])

  const { fetchAssignmentsByWorkerAndDate } = useAssignment();

  const handleSearch = async () => {
    if (!worker?.id) return;
    const response = await fetchAssignmentsByWorkerAndDate({
      workerId: worker.id,
    });

    setassigments(response);
  };
  useEffect(() => {
    if (!worker?.id) return;
    handleSearch();
  }, [worker?.id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
              {worker?.name?.charAt(0).toUpperCase() ?? "?"}
            </Avatar>

            <Box>
              <Typography variant="h6">
                {worker?.name ?? "No hay nombre"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {worker?.employeeCode ?? "No hay codigo"}
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack spacing={1.5} mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Consumibles Genericos
          </Typography>

          {assigments && (
            <>
              {assigments.genericProducts?.length === 0 ? (
                 <div className="entries-no-product">
                <p>No hay productos genéricos asignados</p>
                  </div>
                
              ) : (
                assigments.genericProducts?.map((genericProduct) => (
                  <AssignmentProductGenercCard
                    key={genericProduct.id}
                    item={genericProduct}
                  />
                ))
              )}

              <Typography variant="subtitle1" fontWeight={600}>
                Consumibles especificos
              </Typography>

              {Object.values(assigments.productItems).flat().length > 0 ? (
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                  {Object.entries(assigments.productItems).map(
                    ([key, items]) => (
                      <>
                        <AssignmentDataMatrixCard
                          name={key}
                          item={items}
                          onclick={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                        />
                      </>
                    ),
                  )}
                </Stack>
              ) : (
                <>
                  <div className="entries-no-product">
                    <p>No hay Productos</p>
                  </div>
                </>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
