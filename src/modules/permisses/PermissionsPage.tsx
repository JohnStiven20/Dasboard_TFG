import { Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import { type GlobalFormRef } from "../../type/DinamFormField";
import { useEffect, useRef, useState } from "react";
import "./style/PermissesPage.css";
import { DialogPermisses } from "./components/dialog/DialogPermisses";
import { usePermissionsQuery } from "./hooks/usePermissions";
import type { Permission } from "../../interface/permisssion/permission.interface";
import { ConfirmDeleteDialog } from "../../components/dialog/ConfirmDeleteDialog";
import HandleCheckboxSelectionDemo from "./components/tree/Tree";
import { useMenuQuery } from "../menu/hooks/useMenu";
import { menuFormUI, permissionform } from "./ui/menuForm.ui";
import type { MenuItem as MenuEntity } from "../../interface/menu/Menu.interface";
import { DialogMenu } from "../menu/components/dialog/DialogMenu";
import { useMenuItemsTreeByPermission } from "./hooks/useMenuItemPermission";
import { useNotifications } from "../../context/NotificationsContext";
import TableSystemGrid, {
  type MenuContext,
} from "../../components/table/TableSystem";
import Card from "../entries/components/Card";
import { appBlackButtonSx } from "../entries/components/muiButtonStyles";

export default function UserTableExample() {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [removePermission, setRemovePermission] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { items, isloading, create, update, remove } = usePermissionsQuery();
  const { notify } = useNotifications();
  const { tree, create: createMenu } = useMenuQuery();

  const permissionRef = useRef<GlobalFormRef<Permission> | null>(null);
  const menuRef = useRef<GlobalFormRef<MenuEntity> | null>(null);

  const [editPermission, seteditPermission] = useState<Permission | null>(null);
  const [selctedPermission, setSelctedPermission] = useState<Permission | null>(
    null,
  );

  const isInitializing = useRef(true);
  const { assignPermissionsToMenu, menus } = useMenuItemsTreeByPermission(
    selctedPermission?.id,
  );

  const [selectedMenus, setSelectedMenu] = useState<string[]>([]);

  useEffect(() => {
    if (!selctedPermission?.id) return;

    setSelectedMenu(menus);
  }, [selctedPermission?.id, menus]);

  const handleCreatePermission = async () => {
    const permission = permissionRef.current?.getValues();
    if (!permission) return;
    await create(permission);
    setAdd(false);
    notify("Permiso Creado Correctamente", "success");
  };

  const handleAssigMenPermission = async () => {
    if (selectedMenus.length === 0)
      return notify("No hay menus seleccionados", "warning");

    if (!selctedPermission?.id)
      return notify("No hay permiso selecionado", "warning");

    const converSelectPermission = selectedMenus.map((e) => Number(e));

    await assignPermissionsToMenu({
      permissionId: selctedPermission.id,
      menuitemsids: converSelectPermission,
    });

    notify("Asignacion de permisos correcta", "success");
  };

  const handleEditPermission = async () => {
    const permission = permissionRef.current?.getValues();
    if (!permission || !editPermission?.id) return;
    await update({ id: editPermission.id, permission: permission });
    setEdit(false);
    notify("Permiso actualizado correctamente", "success");
  };

  const handleDeletePermission = async () => {
    if (!editPermission?.id) return;
    await remove(editPermission.id);
    setRemovePermission(false);
    notify("Permiso borrado correctamente", "success");
  };

  const handleAddMenu = async () => {
    const menu = menuRef.current?.getValues();
    if (!menu) return;
    await createMenu(menu);
    setMenuOpen(false);
    notify("Menu creado correctamente", "success");
  };

  return (
    <Box className="permissions-container">
      <Box className="permissions-grid">
        <div className="permissions-header">
          <article className="permissions-title-article">
            <h1>Permisos</h1>
            <p>Gestiona permisos y su relacion con items del menu.</p>
          </article>

          <Button
            size="small"
            variant="contained"
            sx={{ ...appBlackButtonSx, minWidth: 170 }}
            type="button"
            onClick={() => {
              setAdd(true);
            }}
          >
            Agregar permiso
          </Button>
        </div>

        <Box className="permissions-table">
          <Card
            title="Listado de permisos"
            subtitle="Usa el menu contextual para editar, eliminar o seleccionar un permiso."
            className="permissions-card"
          >
            <TableSystemGrid<Permission>
              onMenu={(contextMenu: MenuContext<Permission> | null) => {
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
                          if (contextMenu?.row) seteditPermission(contextMenu.row);
                          contextMenu?.close();
                          setEdit(true);
                        }}
                      >
                        Editar
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!contextMenu?.row) return;
                          seteditPermission(contextMenu.row);
                          contextMenu?.close();
                          setRemovePermission(true);
                        }}
                      >
                        Eliminar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (!contextMenu?.row || !contextMenu.row.id) return;
                          contextMenu?.close();
                          setSelctedPermission(contextMenu.row);
                        }}
                      >
                        Ver permisos
                      </MenuItem>
                    </Menu>
                  </>
                );
              }}
              rows={items}
              formconfig={permissionform}
              loading={isloading}
            />
          </Card>

          <Card
            title="Relacion con menu"
            subtitle={
              selctedPermission?.name
                ? `Editando: ${selctedPermission.name}`
                : "Selecciona Ver permisos para asignar items de menu."
            }
            className="permissions-card"
          >
            <Stack direction={{ xs: "column", md: "row" }} gap={1}>
              <Button
                size="small"
                variant="outlined"
                type="button"
                onClick={() => {
                  setMenuOpen(true);
                }}
              >
                Anadir menu
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ ...appBlackButtonSx }}
                type="button"
                onClick={handleAssigMenPermission}
              >
                Asignar permisos
              </Button>
            </Stack>

            <HandleCheckboxSelectionDemo
              isInitializing={isInitializing}
              selectedItems={selectedMenus}
              setSelectedItems={setSelectedMenu}
              tree={tree}
            />
          </Card>
        </Box>
      </Box>

      <DialogPermisses
        ref={permissionRef}
        fields={permissionform}
        open={add}
        setOpen={setAdd}
        onclick={handleCreatePermission}
      />
      <DialogPermisses
        ref={permissionRef}
        fields={permissionform}
        open={edit}
        editPermission={editPermission ?? undefined}
        setOpen={setEdit}
        onclick={handleEditPermission}
      />

      <DialogMenu
        open={menuOpen}
        setOpen={setMenuOpen}
        ref={menuRef}
        onclick={handleAddMenu}
        fields={menuFormUI}
      />

      <ConfirmDeleteDialog
        open={removePermission}
        title="Eliminar permiso"
        subtitle="Seguro que quieres eliminar este permiso? No podras recuperarlo."
        onClose={() => setRemovePermission(false)}
        onDelete={handleDeletePermission}
      />
    </Box>
  );
}
