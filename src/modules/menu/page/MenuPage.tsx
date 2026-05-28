import type { GridColDef } from "@mui/x-data-grid";

import { Box } from "@mui/material";

import { useMenuQuery } from "../hooks/useMenu";
import type { MenuItem } from "../../../interface/menu/Menu.interface";
import { useRef, useState } from "react";
import type { GlobalFormRef } from "../../../type/DinamFormField";
import Button from "../../entries/components/Button";
import { DialogMenu } from "../components/dialog/DialogMenu";
import TableSystem from "../../../components/table/TableSistem";
import { ConfirmDeleteDialog } from "../../../components/dialog/ConfirmDeleteDialog";

const userColumns: GridColDef<MenuItem>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 90,
  },
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1.2,
    minWidth: 180,
  },
];

export default function Menupage() {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [removeMenu, setRemoveMenu] = useState<boolean>(false);

  const { items, loading, create, update, remove } = useMenuQuery();
  const menuRef = useRef<GlobalFormRef<MenuItem> | null>(null);
  const [editMenu] = useState<MenuItem | null>(null);

  const handleCreatePermission = async () => {
    const menu = menuRef.current?.getValues();
    if (!menu) return;
    await create(menu);
  };

  const handleEditPermission = async () => {
    const permission = menuRef.current?.getValues();
    if (!permission || !editMenu?.id) return;
    await update({ id: editMenu.id, menu: editMenu });
    setEdit(false);
  };

  const handleDeletePermission = async () => {
    if (!editMenu?.id) return;
    await remove(editMenu.id);
    setRemoveMenu(false);
  };

  return (
    <Box className="container-grid-permisses">
      <div className="sectionHeaderPermissionPage">
        <Button
          width={130}
          label={"Filtrar"}
          onClick={function (): void {
            setAdd(true);
          }}
          disabled={false}
          type={"button"}
          className={""}
        />
        <Button
          width={130}
          label={"Agregar Permiso"}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          disabled={false}
          type={"button"}
          className={""}
        />
      </div>
      <Box className="sectionTable">
        <TableSystem<MenuItem>
          rows={items}
          columns={userColumns}
          loading={loading}
        // onEditRow={(row: MenuItem) => {
        //   seteditMenu(row);
        //   setEdit(true);
        // }}
        // onDeleteRow={(row: MenuItem) => {
        //   seteditMenu(row);
        //   setRemoveMenu(true);
        // }}
        />
      </Box>
      <DialogMenu
        ref={menuRef}
        fields={[]}
        open={add}
        setOpen={setAdd}
        onclick={handleCreatePermission}
      />
      <DialogMenu
        ref={menuRef}
        fields={[]}
        open={edit}
        // editPermission={editMenu ?? undefined}
        setOpen={setEdit}
        onclick={handleEditPermission}
      />

      <ConfirmDeleteDialog
        open={removeMenu}
        title="Eliminar permiso"
        subtitle="¿Seguro que quieres eliminar este permiso? No podrás recuperarlo."
        onClose={() => setRemoveMenu(false)}
        onDelete={handleDeletePermission}
      />
    </Box>
  );
}
