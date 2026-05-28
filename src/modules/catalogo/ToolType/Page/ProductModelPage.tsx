import { Box, Menu, MenuItem } from "@mui/material";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import { useRef, useState } from "react";
import type { GlobalFormRef } from "../../../../type/DinamFormField";
import Button from "../../../entries/components/Button";
import { DialogForm } from "../../../../components/dialog/DialogForm";
import { useNotifications } from "../../../../context/NotificationsContext";
import { ConfirmDeleteDialog } from "../../../../components/dialog/ConfirmDeleteDialog";
import TableSystemGrid, {
  type MenuContext,
} from "../../../../components/table/TableSystem";
import type { ToolType } from "../../interface/toolType";
import { toolTypeForm } from "../ui/tooltypeModelForm.ui";
import { useToolTypes } from "../hook/useToolTypes";

export default function ToolTypepage() {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [removePorductModel, setRemoveProductModel] = useState<boolean>(false);
  const [tooltypeselected, setTooltypeselected] = useState<ToolType | undefined>(
    undefined,
  );
  const { notify } = useNotifications();
  const { items, isLoading: loading, create, update, remove } = useToolTypes();
  const tooltypeRef = useRef<GlobalFormRef<ToolType> | null>(null);

  const handleCreate = async () => {
    const toolTypeModel = tooltypeRef.current?.getValues();

    if (!toolTypeModel) return;

    if (!toolTypeModel.name || toolTypeModel?.name === "") {
      notify("El nombre es requeriod", "warning");
      return;
    }


    await create({
      name: toolTypeModel.name,
      description:toolTypeModel.description
    });
    tooltypeRef.current?.reset();
    setAdd(false);
    notify("Creado correctamente", "success");
  };

  const handleEdit = async () => {
    const toolTypeModeledit = tooltypeRef.current?.getValues();

    if (!toolTypeModeledit) {
      return;
    }

    if (!toolTypeModeledit) return;

    if (!toolTypeModeledit.name || toolTypeModeledit.name.trim() === "") {
      notify("El nombre es requeriod", "warning");
      return;
    }

    await update({
      id: toolTypeModeledit.id,
      data: {
        name: toolTypeModeledit.name,
        description: toolTypeModeledit.description,
      },
    });
    setEdit(false);
    tooltypeRef.current?.reset();
    notify("Actulizado correctamente", "success");
  };

  const handleDelete = async () => {
    if (!tooltypeselected?.id) return;
    await remove(tooltypeselected?.id);
    setRemoveProductModel(false);
  };

  return (
    <Box className="container-grid-permisses">
      <div className="sectionHeaderPermissionPage">
        <Button
          width={130}
          label={"Crear Producto"}
          onClick={() => {
            setAdd(true);
          }}
          disabled={false}
          type={"button"}
          className={""}
        />
      </div>
      <Box className="sectionTable">
        <TableSystemGrid<ToolType>
          rows={items}
          loading={loading}
          onMenu={(contextMenu: MenuContext<ToolType> | null) => {
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
                      if (!contextMenu?.row) return;

                      setTooltypeselected(contextMenu.row);
                      console.log(contextMenu.row)
                      contextMenu?.close();
                      setEdit(true);
                    }}
                  >
                    Editar
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      if (!contextMenu?.row) return;
                      setTooltypeselected(contextMenu.row);

                      contextMenu?.close();
                      setRemoveProductModel(true);
                    }}
                  >
                    Eliminar
                  </MenuItem>
                </Menu>
              </>
            );
          }}
          formconfig={toolTypeForm}
        />
      </Box>
      <DialogForm<ToolType>
        fields={toolTypeForm}
        open={add}
        setOpen={setAdd}
        onclick={handleCreate}
        ref={tooltypeRef}
        defaultValues={undefined}
        title="Crear Tipo de Herramienta"
        subtitle="Completa la informacion para registrar un nuevo tipo de herramienta."
        icon={<BuildOutlinedIcon />}
        adviceTitle="Consejo"
        adviceMessage="Podras editar esta configuracion cuando lo necesites."
        confirmText="Crear tipo"
      />
      <DialogForm<ToolType>
        fields={toolTypeForm}
        open={edit}
        setOpen={setEdit}
        onclick={handleEdit}
        ref={tooltypeRef}
        defaultValues={tooltypeselected}
        title="Editar Producto Herramienta"
        subtitle="Actualiza la informacion del tipo de herramienta seleccionado."
        icon={<BuildOutlinedIcon />}
        adviceTitle="Consejo"
        adviceMessage="Revisa el nombre y la descripcion antes de guardar."
        confirmText="Guardar cambios"
      />
      <ConfirmDeleteDialog
        open={removePorductModel}
        title="Eliminar Producto"
        subtitle="¿Seguro que quieres eliminar este producto? No podrás recuperarlo."
        onClose={() => setRemoveProductModel(false)}
        onDelete={handleDelete}
      />
    </Box>
  );
}
