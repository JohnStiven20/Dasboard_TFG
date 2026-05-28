import Box from "@mui/material/Box";

import {
  RichTreeView,
  TreeItem,
  useRichTreeViewApiRef,
  type TreeItemProps,
  type TreeItemSlotProps,
} from "@mui/x-tree-view";
import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useMenuQuery } from "../../../menu/hooks/useMenu";
import { Menu, MenuItem } from "@mui/material";
import { DialogMenu } from "../../../menu/components/dialog/DialogMenu";
import { menuFormUI } from "../../ui/menuForm.ui";
import type { GlobalFormRef } from "../../../../type/DinamFormField";
import type {
  MenuItem as MenuEntity,
  MenuItemDTO,
} from "../../../../interface/menu/Menu.interface";
import { ConfirmDeleteDialog } from "../../../../components/dialog/ConfirmDeleteDialog";
import { useNotifications } from "../../../../context/NotificationsContext";

export type MenuNode = {
  id: string;
  name: string;
  description: string;
  label: string;
};

interface Props {
  tree: MenuItemDTO[];
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  isInitializing: React.MutableRefObject<boolean>;
}

export default function MyTree({
  tree,
  setSelectedItems,
  selectedItems,
}: Props) {
  const apiRef = useRichTreeViewApiRef();

  const [editMenu, seteditMenu] = useState<boolean>(false);
  const [removeMenu, seteRemoveMenu] = useState<boolean>(false);
  const menuRef = useRef<GlobalFormRef<MenuEntity> | null>(null);
  const [menu, setmenu] = useState<MenuEntity | undefined>(undefined);
  const [menuAddOpen, setmenuAddOpen] = useState<boolean>(false);
  const contextIdRef = useRef<string | null>(null);

  const { remove, update, findById, create } = useMenuQuery();

  const { notify } = useNotifications();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  const handleCloseMenu = () => setContextMenu(null);

  const handleFindByMenu = async () => {
    if (!contextMenu?.id) return;
    const menu = await findById(Number(contextMenu.id));
    setmenu(menu);
    seteditMenu(true);
  };

  const handleUpdateMenu = async () => {
    const menuUpdate = menuRef.current?.getValues();
    const menuId = menu?.id;
    if (!menuUpdate || !menuId) return;
    update({ id: menuId, menu: menuUpdate });
    seteditMenu(false);
    notify("Menu actualizado", "success");
  };

  const handleDeleteMenu = async () => {
    const menuid = contextIdRef.current;
    if (!menuid) return;
    await remove(Number(menuid));
    seteRemoveMenu(false);
    notify("Menu elimando correctmanete", "success");
  };

  const handleAddMenuWithParent = async () => {
    const id = contextIdRef.current;

    if (!id) return;
    menuRef.current?.setValue("parentId", Number(id));

    const menu = menuRef.current?.getValues();
    if (!menu) return;
    await create(menu);
  };

  const CustomTreeItem = useMemo(() => {
    return forwardRef<HTMLLIElement, TreeItemProps>(function CustomTreeItem(
      props,
      ref
    ) {
      const { itemId } = props;

      const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        contextIdRef.current = itemId;
        console.log(itemId);
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          id: itemId,
        });

        // apiRef.current?.setItemSelection({
        //   itemId,
        //   keepExistingSelection: true,
        //   shouldBeSelected: true,
        // });
      };

      return (
        <TreeItem
          {...props}
          ref={ref}
          slotProps={
            {
              content: {
                onContextMenu: handleContextMenu,
              },
            } as TreeItemSlotProps
          }
        />
      );
    });
  }, [apiRef]);

  console.log(selectedItems);
  return (
    <Box sx={{ minHeight: 250, minWidth: 350 }}>
      <RichTreeView
        apiRef={apiRef}
        items={tree}
        checkboxSelection
        multiSelect
        selectionPropagation={{ descendants: true, parents: true }}
        getItemId={(item) => String(item.id)}
        selectedItems={selectedItems}
        onSelectedItemsChange={(_e, items) => {
          setSelectedItems(items);
        }}
        slots={{ item: CustomTreeItem }}
      />

      <Menu
        open={Boolean(contextMenu)}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu ? { top: contextMenu.y, left: contextMenu.x } : undefined
        }
      >
        <MenuItem disabled>ID: {contextMenu?.id}</MenuItem>

        <MenuItem onClick={handleFindByMenu}>Editar</MenuItem>

        <MenuItem
          onClick={() => {
            seteRemoveMenu(true);
            handleCloseMenu();
          }}
        >
          Eliminar
        </MenuItem>

        <MenuItem
          onClick={() => {
            setmenuAddOpen(true);
            handleCloseMenu();
          }}
        >
          Añadir hijos
        </MenuItem>
      </Menu>

      <DialogMenu
        open={editMenu}
        editMenu={menu}
        setOpen={seteditMenu}
        onclick={handleUpdateMenu}
        fields={menuFormUI}
        ref={menuRef}
      />

      <DialogMenu
        open={menuAddOpen}
        setOpen={setmenuAddOpen}
        onclick={handleAddMenuWithParent}
        fields={menuFormUI}
        ref={menuRef}
      />
      <ConfirmDeleteDialog
        open={removeMenu}
        onClose={() => {
          seteRemoveMenu(false);
        }}
        onDelete={handleDeleteMenu}
        title="Eliminar Menu"
        subtitle="¿Seguro que quieres eliminar este Menu? No podrás recuperarlo."
      />
    </Box>
  );
}
