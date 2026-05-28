import { type RefObject } from "react";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import type { FieldConfig, GlobalFormRef } from "../../../type/DinamFormField";
import type { Tool } from "../../../interface/tools/tools.interface";
import { DialogForm } from "../../../components/dialog/DialogForm";

interface DialogToolProps {
  fields: FieldConfig<Tool>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  editTool?: Tool;
  ref: RefObject<GlobalFormRef<Tool> | null>;
  open: boolean;
}

export function DialogTool({
  fields,
  setOpen,
  open = false,
  onclick,
  editTool,
  ref,
}: DialogToolProps) {
  return (
    <DialogForm<Tool>
      fields={fields}
      setOpen={setOpen}
      open={open}
      onclick={onclick}
      defaultValues={editTool ?? undefined}
      ref={ref}
      title={editTool ? "Editar herramienta" : "Nueva herramienta"}
      subtitle="Completa la informacion de la herramienta para registrarla en el sistema."
      icon={<BuildCircleOutlinedIcon />}
      adviceTitle="Consejo"
      adviceMessage="Podras editar la informacion de la herramienta posteriormente."
      confirmText={editTool ? "Guardar herramienta" : "Crear herramienta"}
    />
  );
}
