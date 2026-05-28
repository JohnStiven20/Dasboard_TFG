import { type RefObject } from "react";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import type { FieldConfig, GlobalFormRef } from "../../../type/DinamFormField";
import type { Worker } from "../../../interface/subject/subject";
import { DialogForm } from "../../../components/dialog/DialogForm";

interface DialogWorkerProps {
  fields: FieldConfig<Worker>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  worker?: Worker;
  mode: "create" | "edit" | "view";
  refworker: RefObject<GlobalFormRef<Worker> | null>;
  open: boolean;
}

export function DialogWorker({
  fields,
  setOpen,
  open = false,
  onclick,
  worker,
  mode,
  refworker,
}: DialogWorkerProps) {
  
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  return (
    <DialogForm<Worker>
      fields={fields}
      setOpen={setOpen}
      open={open}
      onclick={onclick}
      defaultValues={worker ?? undefined}
      ref={refworker}
      title={
        isCreate
          ? "Nuevo trabajador"
          : isEdit
          ? "Editar trabajador"
          : "Detalle del trabajador"
      }
      subtitle={
        isCreate
          ? "Completa la informacion del trabajador para registrarlo en el sistema."
          : isEdit
          ? "Actualiza solo los datos permitidos del trabajador."
          : "Vista completa en modo solo lectura."
      }
      icon={<PersonAddAlt1OutlinedIcon />}
      adviceTitle="Consejo"
      adviceMessage={
        isView
          ? ""
          : "Podras editar sus datos y asignaciones posteriormente."
      }
      confirmText={
        isCreate
          ? "Crear trabajador"
          : isEdit
          ? "Guardar trabajador"
          : "Cerrar"
      }
      vista={isView}
    />
  );
}
