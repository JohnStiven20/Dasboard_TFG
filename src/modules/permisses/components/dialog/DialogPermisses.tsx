import { type RefObject } from "react";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import { DialogForm } from "../../../../components/dialog/DialogForm";
import type {
  FieldConfig,
  GlobalFormRef,
} from "../../../../type/DinamFormField";
import type { Permission } from "../../../../interface/permisssion/permission.interface";

interface DialogPermissesProps {
  fields: FieldConfig<Permission>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  editPermission?: Permission;
  ref: RefObject<GlobalFormRef<Permission> | null>;
  open: boolean;
}

export function DialogPermisses({
  fields,
  setOpen,
  open = false,
  onclick,
  editPermission,
  ref,
}: DialogPermissesProps) {
  return (
    <DialogForm<Permission>
      fields={fields}
      setOpen={setOpen}
      open={open}
      onclick={onclick}
      defaultValues={editPermission ?? undefined}
      ref={ref}
      title={editPermission ? "Editar permiso" : "Nuevo permiso"}
      subtitle="Completa la informacion del permiso para registrarlo en el sistema."
      icon={<PolicyOutlinedIcon />}
      adviceTitle="Consejo"
      adviceMessage="Podras ajustar este permiso o su descripcion posteriormente."
      confirmText={editPermission ? "Guardar permiso" : "Crear permiso"}
    />
  );
}
