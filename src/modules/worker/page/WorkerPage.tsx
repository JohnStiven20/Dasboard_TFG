import {
  Box,
  Button as MuiButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useRef, useState } from "react";

import type { GlobalFormRef } from "../../../type/DinamFormField";
import { ConfirmDeleteDialog } from "../../../components/dialog/ConfirmDeleteDialog";
import { useWorker } from "../hook/useWorker";
import { DialogWorker } from "../components/DailogWorker";
import TableSystemGrid, {
  type MenuContext,
} from "../../../components/table/TableSystem";
import type { Worker } from "../../../interface/subject/subject";
import {
  workerCreateFormUI,
  workerEditFormUI,
  workerTableFormUI,
  workerViewFormUI,
} from "../ui/workerform.ui";
import "../style/WorkerPage.css";
import Card from "../../entries/components/Card";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import { formatDateTime } from "../../../utils/formatDateTime";

export default function WorkerPage() {
  
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [removeWorker, setRemoveWorker] = useState(false);
  const { create, update, remove, items, isloading } = useWorker();
  const formRef = useRef<GlobalFormRef<Worker> | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | undefined>(
    undefined,
  );

  const workerDialogValues = selectedWorker
    ? {
        ...selectedWorker,
        createdAt: formatDateTime(selectedWorker.createdAt),
        updatedAt: formatDateTime(selectedWorker.updatedAt),
      }
    : undefined;

  const handleCreateWorker = async () => {
    if (!formRef.current) return;
    const worker = formRef.current.getValues();

    const normalizeOptionalText = (value: string | null | undefined) => {
      const normalized = String(value ?? "").trim();
      return normalized.length > 0 ? normalized : null;
    };

    await create({
      name: String(worker.name ?? "").trim(),
      email: normalizeOptionalText(worker.email),
      phone: normalizeOptionalText(worker.phone),
      employeeCode: normalizeOptionalText(worker.employeeCode),
      position: normalizeOptionalText(worker.position),
      observation: normalizeOptionalText(worker.observation),
    });
    setAdd(false);
  };

  const handleEditWorker = async () => {
    
    const worker = formRef.current?.getValues();
    if (!worker || !selectedWorker?.id) return;

    const normalizeOptionalText = (value: string | null | undefined) => {
      const normalized = String(value ?? "").trim();
      return normalized.length > 0 ? normalized : null;
    };

    await update({
      workerid: selectedWorker.id,
      worker: {
        name: String(worker.name ?? "").trim(),
        email: normalizeOptionalText(worker.email),
        phone: normalizeOptionalText(worker.phone),
        observation: normalizeOptionalText(worker.observation),
      },
    });
    setSelectedWorker((prev) =>
      prev?.id === selectedWorker.id ? { ...prev, ...worker } : prev,
    );
    setEdit(false);
  };

  const handleDeleteWorker = async () => {
    if (!selectedWorker?.id) return;
    await remove(selectedWorker.id);
    setSelectedWorker(undefined);
    setRemoveWorker(false);
  };

  return (
    <div className="worker-container">
      <Box className="worker-grid">
        <Box className="worker-header">
          <article className="worker-title-article">
            <h1>Trabajadores</h1>
            <p>
              Gestiona el equipo y revisa las asignaciones actuales de cada
              trabajador
            </p>
          </article>

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={1}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <MuiButton
              size="small"
              variant="contained"
              onClick={() => setAdd(true)}
              startIcon={<AddRoundedIcon />}
              sx={{ ...appBlackButtonSx, minWidth: 190 }}
              type="button"
              disableElevation
            >
              Agregar trabajador
            </MuiButton>
          </Stack>
        </Box>

        {/* <div className="worker-header">
          <Button
            width={130}
            label="Agregar Empleador"
            onClick={() => setAdd(true)}
            disabled={false}
            type="button"
            className=""
          />
        </div> */}

        <Box className="worker-table">
          <Card
            title="Vista tabular"
            subtitle="Consulta y gestiona trabajadores en formato de tabla"
          >
            <TableSystemGrid<Worker>
              onMenu={(contextMenu: MenuContext<Worker> | null) => {
                return (
                  <>
                    <Menu
                      open={Boolean(contextMenu)}
                      onClose={contextMenu?.close}
                      anchorReference="anchorPosition"
                      anchorPosition={{
                        top: contextMenu?.mouseY ?? 0,
                        left: contextMenu?.mouseX ?? 0,
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          const worker = contextMenu?.row;
                          if (!worker) return;
                          setSelectedWorker(worker);
                          setView(true);
                          contextMenu?.close();
                        }}
                      >
                        Ver detalle
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const worker = contextMenu?.row;
                          if (!worker) return;
                          setSelectedWorker(worker);
                          setEdit(true);
                          contextMenu?.close();
                        }}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          const account = contextMenu?.row;
                          if (!account) return;
                          setSelectedWorker(account);
                          setRemoveWorker(true);
                          contextMenu?.close();
                        }}
                      >
                        Eliminar
                      </MenuItem>
                    </Menu>
                  </>
                );
              }}
              rows={items}
              loading={isloading}
              formconfig={workerTableFormUI}
            />
          </Card>
        </Box>


        <DialogWorker
          refworker={formRef}
          mode="create"
          fields={workerCreateFormUI}
          open={add}
          setOpen={setAdd}
          onclick={handleCreateWorker}
        />

        <DialogWorker
          refworker={formRef}
          mode="edit"
          fields={workerEditFormUI}
          open={edit}
          worker={workerDialogValues}
          setOpen={setEdit}
          onclick={handleEditWorker}
        />

        <DialogWorker
          refworker={formRef}
          mode="view"
          fields={workerViewFormUI}
          open={view}
          worker={workerDialogValues}
          setOpen={setView}
          onclick={() => {
            setView(false);
          }}
        />

        <ConfirmDeleteDialog
          open={removeWorker}
          title="Eliminar trabajador"
          subtitle="Seguro que quieres eliminar este trabajador?"
          onClose={() => setRemoveWorker(false)}
          onDelete={handleDeleteWorker}
        />

      </Box>
    </div>
  );
}
