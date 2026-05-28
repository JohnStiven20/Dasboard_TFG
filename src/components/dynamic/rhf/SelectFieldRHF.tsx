/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type UseFormGetValues,
  type UseFormSetValue,
  useFormContext,
} from "react-hook-form";
import type {
  FieldOnchange,
  SelectOption,
} from "../../../type/DinamFormField";
import {
  compactTextFieldSx,
  dynamicFieldLabelCompactSx,
  textFieldVisualSx,
} from "../../shared/textFieldStyles";

export type SelectFieldRHFProps<TValues extends FieldValues> = {
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  disable?: boolean;
  control: Control<TValues>;
  rules: ControllerProps<TValues, FieldPath<TValues>>["rules"];
  onChangeField?: FieldOnchange<TValues, FieldPath<TValues>>;
  setValue?: UseFormSetValue<TValues>;
  getValues?: UseFormGetValues<TValues>;
  resetField?: (name: FieldPath<TValues>) => void;
  options:
    | SelectOption<any>[]
    | ((values: TValues) => SelectOption<any>[]);
};

export function SelectFieldRHF<TValues extends FieldValues>({
  name,
  label,
  helperText,
  disable,
  control,
  rules,
  onChangeField,
  setValue,
  getValues,
  resetField,
  options,
}: SelectFieldRHFProps<TValues>) {
  const inputId = `dynamic-select-${String(name)}`;
  const {
    formState: { errors },
  } = useFormContext<TValues>();
  const fieldError = errors[name];

  const resolveOptions = (): SelectOption<any>[] => {
    if (typeof options === "function" && getValues) {
      return options(getValues());
    }
    return Array.isArray(options) ? options : [];
  };

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {

        const selectOptions = resolveOptions();

        return (
          <Box>
            <Typography
              component="label"
              htmlFor={inputId}
              sx={dynamicFieldLabelCompactSx}
            >
              {label}
            </Typography>
            <TextField
              id={inputId}
              size="small"
              variant="outlined"
              select
              fullWidth
              disabled={disable}
              value={field.value ?? ""}
              error={!!fieldError}
              helperText={(fieldError?.message as string) || helperText}
              sx={[textFieldVisualSx, compactTextFieldSx]}
              onChange={(e) => {

                const rawValue = e.target.value as any;

                const matchedOption = selectOptions.find(
                  (option) => String(option.value) === String(rawValue)
                );

                const value = (matchedOption?.value ?? rawValue) as any;

                field.onChange(value);

                if (onChangeField && setValue && getValues && resetField) {
                 // onChangeField(value, { setValue, getValues, resetField });
                }
              }}
            >
              {selectOptions.map((option, index) => (
                <MenuItem
                  key={`${String(option.label)}-${index}`}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      }}
    />
  );
}
