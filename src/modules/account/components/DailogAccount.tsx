import { type RefObject } from "react";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { DialogForm } from "../../../components/dialog/DialogForm";
import type { FieldConfig, GlobalFormRef } from "../../../type/DinamFormField";
import type { Account } from "../interface/account";

interface DialogAccountProps {
  fields: FieldConfig<Account>[];
  setOpen?: (open: boolean) => void;
  onclick: () => void;
  isPedding?: boolean;
  editAccount?: Account;
  mode: "create" | "edit" | "view";
  ref: RefObject<GlobalFormRef<Account> | null>;
  open: boolean;
}

export function DialogAccount({
  fields,
  setOpen,
  open = false,
  isPedding = false,
  onclick,
  editAccount,
  mode,
  ref,
}: DialogAccountProps) {

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const createDefaults = {
    isactive: true,
    typeAccount: " ",
  } satisfies Partial<Account>;

  return (
    <DialogForm<Account>
      fields={fields}
      setOpen={setOpen}
      open={open}
      onclick={onclick}
      defaultValues={
        isCreate ? createDefaults : (editAccount ?? undefined)
      }
      ref={ref}
      isPending={isPedding}
      title={isCreate ? "Nueva cuenta" : isEdit ? "Editar cuenta" : "Detalle de cuenta"}
      subtitle={
        isCreate
          ? "Completa la informacion para crear una nueva cuenta."
          : isEdit
          ? "Solo puedes modificar estado y tipo de cuenta."
          : "Visualiza los datos de la cuenta en modo solo lectura."
      }
      icon={<GroupAddOutlinedIcon />}
      adviceTitle="Consejo"
      adviceMessage={
        isView
          ? ""
          : "Podras gestionar permisos especificos despues de crear la cuenta."
      }
      confirmText={
        isCreate
          ? "Crear cuenta"
          : isEdit
          ? "Guardar cambios"
          : "Cerrar"
      }
      vista={isView}
    />
  );
}
