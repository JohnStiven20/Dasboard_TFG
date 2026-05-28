import type { Worker } from "../../../interface/subject/subject";
import { makeField, type FieldConfig } from "../../../type/DinamFormField";
import { formatDateTime } from "../../../utils/formatDateTime";

const field = makeField<Worker>();

const requiredNameValidation = (value: unknown) => {
  const name = String(value ?? "").trim();
  if (!name) return "El nombre es requerido";
  return undefined;
};

const requiredEmployeeCodeValidation = (value: unknown) => {
  const employeeCode = String(value ?? "").trim();
  if (!employeeCode) return "El codigo de empleado es requerido";
  return undefined;
};

const nameField: FieldConfig<Worker> = field({
  key: "name",
  type: "text",
  label: "Nombre",
  placeholder: "John Macas",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
});

const emailField: FieldConfig<Worker> = {
  key: "email",
  type: "text",
  label: "Email",
  placeholder: "correo@dominio.com",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const phoneField: FieldConfig<Worker> = {
  key: "phone",
  type: "text",
  label: "Telefono",
  placeholder: "600000000",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const employeeCodeField: FieldConfig<Worker> = {
  key: "employeeCode",
  type: "text",
  label: "Codigo Empleado",
  placeholder: "xxxxxxxxxx",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const positionField: FieldConfig<Worker> = {
  key: "position",
  type: "text",
  label: "Cargo",
  placeholder: "Jefe de area",
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const observationField: FieldConfig<Worker> = {
  key: "observation",
  type: "textarea",
  helpertText: "Agrega observaciones relevantes para el registro.",
  label: "Observaciones",
  placeholder: "Escribe observaciones del empleado",
  grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
};

const createdAtField: FieldConfig<Worker> = {
  key: "createdAt",
  type: "text",
  label: "Fecha de creacion",
  disabled: true,
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

const updatedAtField: FieldConfig<Worker> = {
  key: "updatedAt",
  type: "text",
  label: "Fecha de actualizacion",
  disabled: true,
  grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
};

export const workerCreateFormUI: FieldConfig<Worker>[] = [
  {
    ...nameField,
    validate: requiredNameValidation,
  },
  emailField,
  phoneField,
  {
    ...employeeCodeField,
    validate: requiredEmployeeCodeValidation,
  },
  positionField,
  observationField,
];

export const workerEditFormUI: FieldConfig<Worker>[] = [
  {
    ...nameField,
    validate: requiredNameValidation,
  },
  emailField,
  phoneField,
  {
    ...employeeCodeField,
    disabled: true,
  },
  {
    ...positionField,
    disabled: true,
  },
  observationField,
  createdAtField,
  updatedAtField,
];

export const workerViewFormUI: FieldConfig<Worker>[] = [
  {
    ...nameField,
    disabled: true,
  },
  {
    ...emailField,
    disabled: true,
  },
  {
    ...phoneField,
    disabled: true,
  },
  {
    ...employeeCodeField,
    disabled: true,
  },
  {
    ...positionField,
    disabled: true,
  },
  {
    ...observationField,
    disabled: true,
  },
  createdAtField,
  updatedAtField,
];

export const workerTableFormUI: FieldConfig<Worker>[] = [
  {
    ...nameField,
    table: {
      flex: 1,
      width: 220,
      renderCell: (e) => e.row.name ?? "-",
    },
  },
  {
    ...employeeCodeField,
    table: {
      flex: 1,
      width: 170,
      renderCell: (e) => e.row.employeeCode ?? "-",
    },
  },
  {
    ...positionField,
    table: {
      flex: 1,
      width: 150,
      renderCell: (e) => e.row.position ?? "-",
    },
  },
  {
    key: "active",
    type: "text",
    label: "Estado",
    table: {
      flex: 1,
      width: 120,
      renderCell: (e) => (e.row.active ? "Activo" : "Inactivo"),
    },
  },
  {
    key: "updatedAt",
    type: "text",
    label: "Actualizado",
    table: {
      flex: 1,
      width: 170,
      renderCell: (e) => formatDateTime(e.row.updatedAt ?? e.row.createdAt),
    },
  },
];
