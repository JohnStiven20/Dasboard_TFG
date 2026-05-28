/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useFormContext,
  useWatch,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import type { FieldConfig } from "../../type/DinamFormField";
import { TextFieldRHF } from "./rhf/TextFieldRHF";
import { useMemo } from "react";
import { SelectEntityRHF } from "./rhf/SelectEntityRHF";
import { SelectFieldRHF } from "./rhf/SelectFieldRHF";
import { CheckboxFieldRHF } from "./rhf/CheckboxFieldRHF";

function useValuesFor<T extends FieldValues>(
  dependsOn: FieldPath<T>[] | undefined,
) {
  const { control, getValues } = useFormContext();

  const watched = useWatch({ control, name: dependsOn || [] });

  const all = getValues();

  return { all, watched };
}

type DynamicFieldProps<TValues extends FieldValues> = {
  field: FieldConfig<TValues>;
};

export function DynamicFormField<T extends FieldValues>({
  field,
}: DynamicFieldProps<T>) {

  const { getValues, control, resetField, setValue } = useFormContext<T>();
  const { watched } = useValuesFor(field.dependsOn);

  const rules: ControllerProps<T, FieldPath<T>>["rules"] = field.validate
    ? {
        validate: (value) => field.validate?.(value, getValues()) ?? true,
      }
    : undefined;

  const evalBool = (
    value: boolean | ((values: T) => boolean) | undefined,
  ): boolean =>
    typeof value === "function"
      ? Boolean(value(getValues()))
      : value === undefined && value === null
        ? false
        : Boolean(value);

  const isDisabled = useMemo(
    () => evalBool(field.disabled),
    [field.disabled, JSON.stringify(watched)],
  );

  switch (field.type) {
    case "text":
    case "textarea":
    case "numeric":
    case "password":
    case "file": {
      const { label, key, placeholder, helpertText, onChange, visabled } =
        field;

      return (
        <TextFieldRHF<T>
          visabled={visabled}
          name={key as FieldPath<T>}
          label={label}
          placeholder={placeholder}
          helperText={helpertText}
          disable={isDisabled}
          control={control}
          onChangeField={onChange as any}
          fieldType={field.type}
          setValue={setValue}
          rules={rules}
          getValues={getValues}
          resetField={resetField}
        />
      );
    }

    case "entity": {
      const {
        label,
        key,
        placeholder,
        helpertText,
        onChange,
        fielName,
        entity,
        toOptions,
      } = field;

      return (
        <SelectEntityRHF<T>
          entity={entity}
          label={label}
          name={key}
          placeholder={placeholder}
          rules={rules}
          helperText={helpertText}
          disabled={isDisabled}
          onChangeField={onChange}
          toOption={toOptions}
          setValue={setValue}
          getValues={getValues}
          resetField={resetField}
          control={control}
          search={fielName}
        />
      );
    }

    case "select": {
      const { label, key, placeholder, helpertText, onChange, options } = field;

      return (
        <SelectFieldRHF<T>
          name={key as FieldPath<T>}
          label={label}
          placeholder={placeholder}
          helperText={helpertText}
          disable={isDisabled}
          control={control}
          options={options}
          rules={rules}
          onChangeField={onChange}
          setValue={setValue}
          getValues={getValues}
          resetField={resetField}
        />
      );
    }

    case "checkbox": {
      const {
        label,
        key,
        helpertText,
        onChange,
        labelPlacement,
        size,
        indeterminateWhen,
      } = field;

      return (
        <CheckboxFieldRHF<T>
          name={key as FieldPath<T>}
          label={label}
          helperText={helpertText}
          disable={isDisabled}
          control={control}
          rules={rules}
          onChangeField={onChange as any}
          setValue={setValue}
          getValues={getValues}
          resetField={resetField}
          labelPlacement={labelPlacement}
          size={size}
          indeterminateWhen={indeterminateWhen}
        />
      );
    }

    default:
      return null;
  }
}
