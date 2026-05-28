import { type RefObject } from "react";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import type {
  FieldConfig,
  GlobalFormRef,
} from "../../../../type/DinamFormField";
import type { MenuItem } from "../../../../interface/menu/Menu.interface";
import { DialogForm } from "../../../../components/dialog/DialogForm";

interface DialogMenuProps {
  fields: FieldConfig<MenuItem>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  editMenu?: MenuItem;
  ref: RefObject<GlobalFormRef<MenuItem> | null>;
  open: boolean;
}

export function DialogMenu({
  fields,
  setOpen,
  open = false,
  onclick,
  editMenu,
  ref,
}: DialogMenuProps) {
  return (
    <DialogForm<MenuItem>
      fields={fields}
      setOpen={setOpen}
      open={open}
      onclick={onclick}
      defaultValues={editMenu ?? undefined}
      ref={ref}
      title={editMenu ? "Editar menu" : "Nuevo menu"}
      subtitle="Completa la informacion del menu para registrarlo en el sistema."
      icon={<MenuOpenOutlinedIcon />}
      adviceTitle="Consejo"
      adviceMessage="Podras ajustar rutas e iconos del menu posteriormente."
      confirmText={editMenu ? "Guardar menu" : "Crear menu"}
    />
  );
}
