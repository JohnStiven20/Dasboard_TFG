// src/components/dynamic/form/DynamicFormSection.tsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  type JSX,
} from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";
import { Grid } from "@mui/material";
import type { FieldConfig, GlobalFormRef } from "../../type/DinamFormField";
import { DynamicFormField } from "./DynamicForm";

interface Props<T extends FieldValues> {
  fields: FieldConfig<T>[];
  defaultValues?: DefaultValues<T>;
  onSubmit?: () => void;
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function withPresentationRules<T extends FieldValues>(fields: FieldConfig<T>[]) {

  const categorized = fields.map((field, index) => {

    const keyText = normalizeText(String(field.key));
    const labelText = normalizeText(field.label ?? "");
    const isCheckbox = field.type === "checkbox";

    const isObservation =
      keyText.includes("observation") ||
      keyText.includes("observacion") ||
      labelText.includes("observation") ||
      labelText.includes("observacion");

    const isDescription =
      keyText.includes("description") ||
      keyText.includes("descripcion") ||
      labelText.includes("description") ||
      labelText.includes("descripcion");

    const isLongText = isObservation || isDescription;

    if (!isLongText && !isCheckbox) {
      return { field, index, isObservation, isLongText, isCheckbox };
    }

    if (isCheckbox) {
      const normalizedField = {
        ...field,
        grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      } as FieldConfig<T>;

      return {
        field: normalizedField,
        index,
        isObservation,
        isLongText,
        isCheckbox,
      };
    }

    const label = isObservation ? "Observaciones" : "Descripcion";
    const helperText = field.helpertText;

    const placeholder = isObservation
      ? field.placeholder ?? "Escribe las observaciones"
      : field.placeholder ?? "Escribe la descripcion";

    const normalizedField = {
      ...field,
      label,
      type: "textarea",
      placeholder,
      helpertText: helperText,
      grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    } as FieldConfig<T>;

    return {
      field: normalizedField,
      index,
      isObservation,
      isLongText,
      isCheckbox,
    };
  });

  const regularFields = categorized
    .filter((item) => !item.isLongText && !item.isCheckbox)
    .sort((a, b) => a.index - b.index);

  const checkboxFields = categorized
    .filter((item) => item.isCheckbox)
    .sort((a, b) => a.index - b.index);

  const longTextFields = categorized
    .filter((item) => item.isLongText)
    .sort((a, b) => {
      const observationRank = Number(a.isObservation) - Number(b.isObservation);
      if (observationRank !== 0) return observationRank;
      return a.index - b.index;
    });

  return [...regularFields, ...checkboxFields, ...longTextFields].map(
    (item) => item.field
  );
}

function DynamicFormSectionInner<T extends FieldValues>(
  { fields, defaultValues, onSubmit }: Props<T>,
  ref: React.Ref<GlobalFormRef<T>>
) {
  const methods = useForm<T>({ defaultValues });
  const normalizedFields = useMemo(() => withPresentationRules(fields), [fields]);
  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useImperativeHandle(
    ref,
    () => ({
      getValues: methods.getValues,
      setValue: methods.setValue,
      reset: methods.reset,
      submit: async () => {
        let ok = false;

        await methods.handleSubmit(
          async (_) => {
            ok = true;
            await onSubmit?.();
          },
          () => {}
        )();

        return ok;
      },
    }),
    [methods, onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}
        style={{ width: "100%" }}
      >
        <Grid
          container
          columnSpacing={{ xs: 1.5, sm: 2 }}
          rowSpacing={{ xs: 2.25, sm: 2.75 }}
          sx={{
            alignItems: "flex-start",
            "& .MuiFormControl-root": {
              width: "100%",
            },
            "& .MuiFormHelperText-root": {
              minHeight: 18,
            },
          }}
        >
          {normalizedFields.map((e) => {
            const { grid } = e;
            const xs = grid?.xs ?? 12;
            const sm = grid?.sm ?? 6;
            const md = grid?.md ?? 4;
            const lg = grid?.lg ?? 4;
            const xl = grid?.xl ?? 4;

            return (
              <Grid key={String(e.key)} size={{ xs, sm, md, lg, xl }}>
                <DynamicFormField<T> field={e} />
              </Grid>
            );
          })}
        </Grid>
      </form>
    </FormProvider>
  );
}

export const DynamicFormSection = forwardRef(DynamicFormSectionInner) as <
  T extends FieldValues = FieldValues
>(
  props: Props<T> & { ref?: React.Ref<GlobalFormRef<T>> }
) => JSX.Element;
