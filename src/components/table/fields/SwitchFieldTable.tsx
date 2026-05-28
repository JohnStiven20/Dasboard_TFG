import * as React from "react";
import { Switch } from "@mui/material";
import type { GridRenderEditCellParams } from "@mui/x-data-grid";

/* -------------------- helpers tipados -------------------- */
type Indexable = Record<string, unknown>;
const isIndexable = (x: unknown): x is Indexable =>
  typeof x === "object" && x !== null;

/** Soporta "a.b.c" y notación con índices: "items[0].flag" */
const splitPath = (path: string) =>
  path
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

export function getByPath<T extends Indexable, R = unknown>(
  obj: T,
  path: string
): R | undefined {
  let acc: unknown = obj;
  for (const k of splitPath(path)) {
    if (!isIndexable(acc)) return undefined;
    acc = acc[k];
  }
  return acc as R | undefined;
}

export function setByPath<T extends Indexable, V = unknown>(
  obj: T,
  path: string,
  val: V
): T {
  const keys = splitPath(path);
  const out: Indexable = { ...obj };
  let cur: Indexable = out;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cur[k];
    // clona contenedores para mantener inmutabilidad
    cur[k] = Array.isArray(next)
      ? [...next]
      : isIndexable(next)
      ? { ...next }
      : {};
    cur = cur[k] as Indexable;
  }

  cur[keys[keys.length - 1]] = val as unknown;
  return out as T;
}

const toBool = (v: unknown) =>
  typeof v === "string" ? v === "true" : Boolean(v);

interface Props<R extends Indexable> {
  params: GridRenderEditCellParams<R, boolean>;
  fieldKey: string;
  disable?: boolean;
}

export function SwitchEditCell<R extends Indexable>({
  disable = false,
  params,
  fieldKey,
}: Props<R>) {
  const { api, id, field, row, value } = params;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;

    if (checked == false) {
      console.log("cambio");
    }

    setChecked(next);
    commit(next);
    api.stopCellEditMode({ id, field });
  };
  const initial =
    value ??
    (typeof field === "string"
      ? (getByPath(row, fieldKey) as boolean | undefined)
      : undefined) ??
    false;

  const [checked, setChecked] = React.useState<boolean>(toBool(initial));

  React.useEffect(() => {
    setChecked(toBool(initial));
  }, [initial, id, fieldKey]);

  const commit = (next: boolean) => {
    const nextRow = setByPath(row, String(fieldKey), next);
    api.updateRows([{ id, ...nextRow }]);
    api.setEditCellValue({ id, field, value: next, debounceMs: 0 });
  };

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      commit(!checked);
      api.stopCellEditMode({ id, field });
    }
    if (e.key === "Escape") {
      api.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Switch
      size="small"
      disabled={disable}
      checked={checked}
      onChange={handleChange}
      onClick={stop}
      onMouseDown={stop}
      onKeyDown={onKeyDown}
      inputProps={{ "aria-label": "toggle" }}
    />
  );
}
