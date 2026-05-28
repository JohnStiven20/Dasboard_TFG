import type { Worker } from "../../../interface/subject/subject";
import { makeField, type FieldConfig } from "../../../type/DinamFormField";
import type { Account } from "../interface/account";

export const field = makeField<Account>();

const getSubjectLabel = (subject?: Worker | null): string => {
  const name = subject?.name?.trim();
  if (!name) return "Sin empleado";
  return subject?.employeeCode?.trim()? `${name} (${subject.employeeCode})` : name;
};

const asText = (value: string | null | undefined): string => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : "--";
};

const asActive = (value: boolean | null | undefined): string => {
  if (value === true) return "Activo";
  if (value === false) return "Inactivo";
  return "--";
};

const asTypeAccount = (value: string | null | undefined): string => {

  const normalized = value?.trim().toUpperCase();

  if (!normalized) return "--";
  if (normalized === " ") return "Seleccionar tipo";
  if (normalized === "WEB") return "Web";
  if (normalized === "BOTH") return "Web + App";
  if (normalized === "MOBILE") return "App";

  return normalized;
};

const usernameField: FieldConfig<Account> = {
  key: "username",
  type: "text",
  label: "Nombre usuario",
  placeholder: "Ingresa un nombre de usuario",
  helpertText: "El nombre de usuario debe ser unico para cada cuenta.",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const subjectField: FieldConfig<Account> = field({
  key: "subject",
  type: "entity",
  entity: "worker",
  label: "Empleado",
  placeholder: "Seleccionar empleado",
  helpertText: "Una cuenta queda asociada a un trabajador.",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  toOptions: (row: Worker) => {
    return {
      value: row,
      label: getSubjectLabel(row),
    };
  },
});

const typeAccountField: FieldConfig<Account> = field({
  key: "typeAccount",
  type: "select",
  label: "Tipo de cuenta",
  placeholder: "Seleccionar tipo",
  helpertText: "El tipo de cuenta define el acceso a la plataforma.",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  options: [
    { label: "Seleccionar tipo", value: " " },
    { label: "Web", value: "WEB" },
    { label: "Web + App", value: "BOTH" },
    { label: "App", value: "MOBILE" },
  ],
});

const activeField: FieldConfig<Account> = field({
  key: "isactive",
  type: "checkbox",
  label: "Estado",
  size: "small",
  labelPlacement: "end",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
});

const createdAtField: FieldConfig<Account> = {
  key: "createdAt",
  type: "text",
  label: "Fecha de creacion",
  disabled: true,
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};


const passwordField: FieldConfig<Account> = field({
  key: "password",
  type: "password",
  label: "Contraseña",
  placeholder: "Ingresa una contraseña",
  helpertText: "La contraseña debe tener al menos 6 caracteres.",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
});

export const accountCreateFormUI: FieldConfig<Account>[] = [
  usernameField,
  passwordField,
  subjectField,
  typeAccountField,
  activeField,
];

export const accountEditFormUI: FieldConfig<Account>[] = [
  {
    ...usernameField,
    disabled: true,
  },
  {
    ...subjectField,
    disabled: true,
  },
  typeAccountField,
  activeField,
  createdAtField,
];

export const accountViewFormUI: FieldConfig<Account>[] = [
  {
    ...usernameField,
    disabled: true,
  },
  {
    ...subjectField,
    disabled: true,
  },
  {
    ...typeAccountField,
    disabled: true,
  },
  {
    ...activeField,
    disabled: true,
  },
  createdAtField,
];

export const accountTableUI: FieldConfig<Account>[] = [
  {
    key: "username",
    type: "text",
    label: "Usuario",
    table: {
      label: "Usuario",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => asText(params.row.username),
    },
  },
  {
    key: "subjectName",
    type: "text",
    label: "Empleado",
    table: {
      label: "Empleado",
      minWidth: 260,
      flex: 1,
      renderCell: (params) => {
        const name = asText(params.row.subjectName);
        const code = asText(params.row.subjectEmployeeCode);
        if (name === "--" && code === "--") return "--";
        if (code === "--") return name;
        if (name === "--") return code;
        return `${name} (${code})`;
      },
    },
  },
  {
    key: "typeAccount",
    type: "text",
    label: "Tipo cuenta",
    table: {
      label: "Tipo cuenta",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => asTypeAccount(params.row.typeAccount),
    },
  },
  {
    key: "isactive",
    type: "text",
    label: "Estado",
    table: {
      label: "Estado",
      minWidth: 110,
      flex: 1,
      renderCell: (params) => asActive(params.row.isactive),
    },
  },
];

export interface AccountPermsion {
  id: number;
  permission: string;
  isActive: boolean;
}

export const accountFormUITable: FieldConfig<AccountPermsion>[] = [
  {
    key: "id",
    type: "text",
    label: "Codigo",
    table: {
      label: "Codigo",
      width: 120,
      renderCell: (params) => {
        return String(params.row.id);
      },
      editable: false,
    },
  },
  {
    key: "permission",
    type: "text",
    label: "Permiso",
    table: {
      label: "Permiso",
      width: 120,
      renderCell: (params) => {
        return params.row.permission;
      },
      editable: false,
    },
  },
  {
    key: "isActive",
    type: "switch",
    label: "Activo",
    table: {
      label: "Activo",
      width: 120,
      editable: true,
    },
    grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
  },
];
