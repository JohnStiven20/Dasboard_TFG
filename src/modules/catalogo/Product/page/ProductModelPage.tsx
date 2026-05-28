import { Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import type { ProductModel } from "../type/inteface.productmodel";
import { useRef, useState } from "react";
import "./ProductModelPage.css";
import { useProducts } from "../hook/useProducts";
import type { GlobalFormRef } from "../../../../type/DinamFormField";
import { DialogForm } from "../../../../components/dialog/DialogForm";
import {
  productModelTableForm,
  productModelEditForm,
  productModelForm,
  productModelViewForm,
} from "../ui/productModelForm.ui";
import { useNotifications } from "../../../../context/NotificationsContext";
import { ConfirmDeleteDialog } from "../../../../components/dialog/ConfirmDeleteDialog";
import TableSystemGrid, {
  type MenuContext,
} from "../../../../components/table/TableSystem";
import { ProductIdentifiersDialog } from "../../../catalogo/ProductIndetifier/components/ProductIdentifiersDialog";
import Card from "../../../entries/components/Card";
import { appBlackButtonSx } from "../../../entries/components/muiButtonStyles";
import { formatDateTime } from "../../../../utils/formatDateTime";


export default function ProductModelpage() {
  
  const normalizeTypeName = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const resolveUniqueKindId = (
  ): number | undefined => {

    return 1;
  };

  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [removePorductModel, setRemoveProductModel] = useState<boolean>(false);
  const [productModel, setProductModel] = useState<ProductModel | undefined>(
    undefined,
  );
  const [manageIdentifiers, setManageIdentifiers] = useState<boolean>(false);
  const [identifierModel, setIdentifierModel] = useState<ProductModel | undefined>(
    undefined,
  );
  const { notify } = useNotifications();
  const { items, isLoading: loading, create, updateObservation, remove } = useProducts();

  
  const menuRef = useRef<GlobalFormRef<ProductModel> | null>(null);
  const productModelDialogValues = productModel
    ? {
        ...productModel,
        createdAt: formatDateTime(productModel.createdAt),
        updatedAt: formatDateTime(productModel.updatedAt),
      }
    : undefined;

  const uniqueKindId = resolveUniqueKindId();

  const handleCreate = async () => {

    const productModel = menuRef.current?.getValues();

    if (!productModel) return;


    if (!productModel.name || productModel.name.trim() === "") {
      notify("El nombre es requerido", "warning");
      return;
    }
    
    if (!uniqueKindId) {
      notify(
        "No se pudo resolver la configuracion del modelo para crear el producto",
        "warning",
      );
      return;
    }

    await create({
      name: productModel.name,
      description: productModel.description,
      kindId: uniqueKindId,
    });
    menuRef.current?.reset();
    setAdd(false);
    notify("Creado correctamente", "success");
  };

  const handleEdit = async () => {
    const productmodeledit = menuRef.current?.getValues();
    const productModelId = productModel?.id ?? productmodeledit?.id;

    if (!productModelId) {
      notify("No se pudo identificar el modelo a editar", "warning");
      return;
    }

    await updateObservation({
      id: productModelId,
      data: {
        observation: productmodeledit?.description,
      },
    });
    setEdit(false);
    menuRef.current?.reset();
    notify("Actualizado correctamente", "success");
  };

  const handleDelete = async () => {
    if (!productModel?.id) return;
    await remove(productModel?.id);
    setRemoveProductModel(false);
  };

  return (
    <Box className="product-model-container">
      <Box className="product-model-grid">
        <Box className="product-model-header">
          <article className="product-model-title-article">
            <h1>Modelos de producto</h1>
            <p>Administra modelos e identificadores en un solo lugar.</p>
          </article>

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={1}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Button
              size="small"
              variant="contained"
              sx={{ ...appBlackButtonSx, minWidth: 170 }}
              onClick={() => {
                setAdd(true);
              }}
              type="button"
              disableElevation
            >
              Crear producto
            </Button>
          </Stack>
        </Box>

        <Box className="product-model-table">
          <Card
            title="Listado de modelos"
            subtitle="Usa el menu contextual para editar, eliminar o gestionar identificadores."
          >
            <TableSystemGrid<ProductModel>
              rows={items.filter((item) => {
                const typeName = normalizeTypeName(item.kindType?.name ?? "");
                return (
                  !typeName.includes("generic") && !typeName.includes("generico")
                );
              })}
              loading={loading}
              onMenu={(contextMenu: MenuContext<ProductModel> | null) => {
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
                          setProductModel(contextMenu.row);
                          contextMenu?.close();
                          setView(true);
                        }}
                      >
                        Ver detalle
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!contextMenu?.row) return;

                          setProductModel(contextMenu.row);
                          contextMenu?.close();
                          setEdit(true);
                        }}
                      >
                        Editar
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!contextMenu?.row) return;
                          setProductModel(contextMenu.row);

                          contextMenu?.close();
                          setRemoveProductModel(true);
                        }}
                      >
                        Eliminar
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!contextMenu?.row) return;
                          setIdentifierModel(contextMenu.row);
                          contextMenu?.close();
                          setManageIdentifiers(true);
                        }}
                      >
                        Gestionar identificadores
                      </MenuItem>
                    </Menu>
                  </>
                );
              }}
              formconfig={productModelTableForm}
            />
          </Card>
        </Box>
      </Box>
      <DialogForm<ProductModel>
        fields={productModelForm}
        open={add}
        setOpen={setAdd}
        onclick={handleCreate}
        ref={menuRef}
        defaultValues={undefined}
        title="Crear Producto"
        subtitle="Registra el modelo con nombre y observaciones."
        icon={<Inventory2OutlinedIcon />}
        adviceTitle="Consejo"
        adviceMessage="Puedes actualizar las observaciones posteriormente."
        confirmText="Crear producto"
      />
      <DialogForm<ProductModel>
        fields={productModelEditForm}
        open={edit}
        setOpen={setEdit}
        onclick={handleEdit}
        ref={menuRef}
        defaultValues={productModelDialogValues}
        title="Editar Producto"
        subtitle="Solo puedes actualizar observaciones de este modelo."
        icon={<Inventory2OutlinedIcon />}
        adviceTitle="Consejo"
        adviceMessage="El nombre del modelo es solo lectura para proteger datos ya utilizados."
        confirmText="Guardar"
      />
      <DialogForm<ProductModel>
        fields={productModelViewForm}
        open={view}
        setOpen={setView}
        onclick={() => {
          setView(false);
        }}
        ref={menuRef}
        defaultValues={productModelDialogValues}
        title="Detalle del producto"
        subtitle="Visualiza la informacion completa del modelo en modo solo lectura."
        icon={<Inventory2OutlinedIcon />}
        adviceTitle="Consejo"
        adviceMessage=""
        confirmText="Cerrar"
        vista
      />
      <ConfirmDeleteDialog
        open={removePorductModel}
        title="Eliminar Producto"
        subtitle="¿Seguro que quieres eliminar este producto? No podrás recuperarlo."
        onClose={() => setRemoveProductModel(false)}
        onDelete={handleDelete}
      />
      <ProductIdentifiersDialog
        open={manageIdentifiers}
        onClose={() => {
          setManageIdentifiers(false);
          setIdentifierModel(undefined);
        }}
        productModel={identifierModel}
      />
    </Box>
  );
}
