import { makeField, type FieldConfig } from "../../../../type/DinamFormField";
import type { ProductModel } from "../type/inteface.productmodel";
import { formatDateTime } from "../../../../utils/formatDateTime";

export const field = makeField<ProductModel>();

const nameField: FieldConfig<ProductModel> = {
  key: "name",
  type: "text",
  table: {
    flex: 1,
    width: 300,
  },
  label: "Nombre",
  placeholder: "HGU WIFI 5",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const observationsField: FieldConfig<ProductModel> = {
  key: "description",
  type: "textarea",
  label: "Observaciones",
  placeholder: "Escribe una observacion del modelo",
  grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
};

const createdAtField: FieldConfig<ProductModel> = field({
  key: "createdAt",
  type: "text",
  label: "Fecha de creacion",
  disabled: true,
  table: {
    flex: 1,
    renderCell: (params) => formatDateTime(params.row.createdAt),
    width: 150,
  },
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
});

const updatedAtField: FieldConfig<ProductModel> = field({
  key: "updatedAt",
  type: "text",
  label: "Ultima actualizacion",
  disabled: true,
  table: {
    flex: 1,
    renderCell: (params) =>
      formatDateTime(params.row.updatedAt ?? params.row.createdAt),
    width: 170,
  },
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
});


export const productModelForm: FieldConfig<ProductModel>[] = [
  nameField,
  observationsField,
];

export const productModelEditForm: FieldConfig<ProductModel>[] = [
  {
    ...nameField,
    disabled: true,
  },
  observationsField,
];

export const productModelViewForm: FieldConfig<ProductModel>[] = [
  {
    ...nameField,
    disabled: true,
  },
  {
    ...observationsField,
    disabled: true,
  },
  createdAtField,
  updatedAtField,
];

export const productModelTableForm: FieldConfig<ProductModel>[] = [
  nameField,
  updatedAtField,
];

// Backward compatibility
export const productModelForm2: FieldConfig<ProductModel>[] = productModelTableForm;
