/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
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
import type { FieldOnchange } from "../../../type/DinamFormField";

export type CheckboxFieldRHFProps<TValues extends FieldValues> = {
  name: FieldPath<TValues>;
  label: string;
  helperText?: string;
  disable?: boolean;
  control: Control<TValues>;
  rules: ControllerProps<TValues, FieldPath<TValues>>["rules"];
  onChangeField?: FieldOnchange<TValues, FieldPath<TValues>>;
  setValue?: UseFormSetValue<TValues>;
  getValues?: UseFormGetValues<TValues>;
  resetField?: (name: FieldPath<TValues>) => void;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  size?: "small" | "medium";
  indeterminateWhen?: (values: TValues) => boolean;
};

export function CheckboxFieldRHF<TValues extends FieldValues>({
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
  labelPlacement = "end",
  size = "small",
  indeterminateWhen,
}: CheckboxFieldRHFProps<TValues>) {
  const {
    formState: { errors },
  } = useFormContext<TValues>();

  const fieldError = errors[name];

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {
        const checked = Boolean(field.value);
        const indeterminate =
          indeterminateWhen && getValues
            ? Boolean(indeterminateWhen(getValues()))
            : false;
        const checkedState = indeterminate ? true : checked;

        return (
          <FormControl error={!!fieldError} component="fieldset" sx={{ width: "100%" }}>
            <Box
              sx={{
                minHeight: 44,
                px: 0.25,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                sx={{
                  m: 0,
                  "& .MuiFormControlLabel-label": {
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1f2937",
                  },
                }}
                label={label}
                labelPlacement={labelPlacement}
                control={
                  <Switch
                    size={size}
                    checked={checkedState}
                    disabled={disable}
                    onChange={(event) => {
                      const value = event.target.checked as any;
                      field.onChange(value);

                      if (onChangeField && setValue && getValues && resetField) {
                        onChangeField(value, {
                          setValue,
                          getValues,
                          resetField,
                        });
                      }
                    }}
                  />
                }
              />
            </Box>
            {(fieldError?.message as string) || helperText ? (
              <FormHelperText>
                {(fieldError?.message as string) || helperText}
              </FormHelperText>
            ) : null}
          </FormControl>
        );
      }}
    />
  );
}
