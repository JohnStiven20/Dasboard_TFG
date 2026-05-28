import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormGetValues,
  type UseFormSetValue,
  useFormContext,
} from "react-hook-form";
import type { FieldOnchange, SelectOption } from "../../../type/DinamFormField";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useEntytyOptions } from "../../../hooks/useEntityOptions";
import { useState } from "react";
import {
  compactTextFieldSx,
  dynamicFieldLabelCompactSx,
  textFieldVisualSx,
} from "../../shared/textFieldStyles";

export type SelectEntityRHFProps<
  TValues extends FieldValues,
  TValue = PathValue<TValues, Path<TValues>>,
> = {
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  control: Control<TValues>;
  rules: ControllerProps<TValues, FieldPath<TValues>>["rules"];
  onChangeField?: FieldOnchange<TValues, FieldPath<TValues>>;
  setValue?: UseFormSetValue<TValues>;
  getValues?: UseFormGetValues<TValues>;
  resetField?: (name: FieldPath<TValues>) => void;
  entity: string;
  search?: string;
  toOption: (option: TValue) => SelectOption<TValue>;
};

const getComparableKey = (value: unknown): string | number | boolean | undefined => {
  if (value === null || value === undefined) return undefined;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const id = obj.id;
    if (
      typeof id === "string" ||
      typeof id === "number" ||
      typeof id === "boolean"
    ) {
      return id;
    }
  }

  return undefined;
};

const isSameOptionValue = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true;
  const leftKey = getComparableKey(left);
  const rightKey = getComparableKey(right);
  return leftKey !== undefined && rightKey !== undefined && leftKey === rightKey;
};

export function SelectEntityRHF<
  TValues extends FieldValues,
  TValue = PathValue<TValues, Path<TValues>>,
>({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  control,
  rules,
  onChangeField,
  setValue,
  getValues,
  resetField,
  entity,
  toOption,
}: SelectEntityRHFProps<TValues, TValue>) {
  const [inputValue, setInputValue] = useState("");
  const inputId = `dynamic-entity-${String(name)}`;
  const {
    formState: { errors },
  } = useFormContext<TValues>();
  const fieldError = errors[name];

  const { options, loading } = useEntytyOptions<TValue>({
    entity,
    toOption,
    search: inputValue,
  });

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {
        const value = field.value;

        const matchedOption = options.find((o) => isSameOptionValue(o.value, value));
        const fallbackOption =
          value == null
            ? null
            : (() => {
                try {
                  return toOption(value as TValue);
                } catch {
                  return null;
                }
              })();
        const selectOption = matchedOption ?? fallbackOption;

        return (
          <Box>
            <Typography
              component="label"
              htmlFor={inputId}
              sx={dynamicFieldLabelCompactSx}
            >
              {label}
            </Typography>
            <Autocomplete<SelectOption<TValue>>
              id={inputId}
              fullWidth
              options={options}
              loading={loading}
              value={selectOption}
              disabled={disabled}
              isOptionEqualToValue={(option, value) =>
                isSameOptionValue(option.value, value.value)
              }
              getOptionLabel={(option) => option.label ?? ""}
              onChange={(_, newOption) => {
                const newValue = newOption?.value ?? null;
                field.onChange(newValue);

                if (onChangeField && setValue && getValues && resetField) {
                  onChangeField(newValue as PathValue<TValues, Path<TValues>>, {
                    setValue,
                    getValues,
                    resetField,
                  });
                }
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    size="small"
                    variant="outlined"
                    placeholder={placeholder}
                    error={!!fieldError}
                    helperText={(fieldError?.message as string) || helperText}
                    disabled={disabled}
                    sx={[textFieldVisualSx, compactTextFieldSx]}
                  />
                );
              }}
              onInputChange={(_, newInput, reason) => {
                if (reason === "input" || reason === "clear") {
                  setInputValue(newInput);
                }
              }}
            />
          </Box>
        );
      }}
    />
  );
}
