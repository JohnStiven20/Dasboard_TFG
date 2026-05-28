import type { MenuItem } from "../../../interface/menu/Menu.interface";
import type { Permission } from "../../../interface/permisssion/permission.interface";
import type { FieldConfig } from "../../../type/DinamFormField";

export const menuFormUI: FieldConfig<MenuItem>[] = [
  {
    key: "label",
    type: "text",
    label: "Menu",
    placeholder: "Amdin",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
  {
    key: "route",
    type: "text",
    label: "ruta",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
  {
    key: "icon",
    type: "text",
    label: "icon",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
  {
    key: "sortOrder",
    type: "text",
    label: "orden",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },

  {
    key: "parentId",
    type: "text",
    label: "Padre",
    visabled: true,
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
];

export const permissionform: FieldConfig<Permission>[] = [
  {
    key: "name",
    type: "text",
    label: "Nombre",
    placeholder: "Amdin",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    table: {
      width: 150
    }
  },
  {
    key: "description",
    type: "text",
    label: "Description",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
    table: {
      width: 150
    }
  },
];