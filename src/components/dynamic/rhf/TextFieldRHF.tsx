/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  type FieldValues,
  type Control,
  type FieldPath,
  Controller,
  type UseFormSetValue,
  type UseFormGetValues,
  useFormContext,
  type ControllerProps,
} from "react-hook-form";
import type { FieldOnchange } from "../../../type/DinamFormField";
import {
  compactTextFieldSx,
  dynamicFieldLabelCompactSx,
  textFieldVisualSx,
} from "../../shared/textFieldStyles";
import { useState } from "react";
import type { TextFieldConfig } from "../../../type/DinamFormField";

export type TextFieldRHFProps<TValues extends FieldValues> = {
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  disable?: boolean;
  visabled?: boolean;
  control: Control<TValues>;
  rules: ControllerProps<TValues, FieldPath<TValues>>["rules"];
  onChangeField?: FieldOnchange<TValues, FieldPath<TValues>>;
  setValue?: UseFormSetValue<TValues>;
  getValues?: UseFormGetValues<TValues>;
  resetField?: (name: FieldPath<TValues>) => void;
  fieldType?: TextFieldConfig<TValues, FieldPath<TValues>>["type"];
};

export function TextFieldRHF<T extends FieldValues>({
  name,
  label,
  placeholder,
  helperText,
  disable,
  visabled,
  control,
  onChangeField,
  setValue,
  getValues,
  resetField,
  rules,
  fieldType = "text",
}: TextFieldRHFProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = `dynamic-field-${String(name)}`;
  const {
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name];
  const isTextarea = fieldType === "textarea";
  const isPassword = fieldType === "password";
  const inputType =
    isTextarea
      ? "text"
      : fieldType === "numeric"
      ? "number"
      : isPassword
        ? showPassword
          ? "text"
          : "password"
        : "text";

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {
        return (
          <Box sx={visabled ? { display: "none" } : undefined}>
            <Typography
              component="label"
              htmlFor={inputId}
              sx={dynamicFieldLabelCompactSx}
            >
              {label}
            </Typography>
            <TextField
              id={inputId}
              size="medium"
              variant="outlined"
              {...field}
              value={field.value ?? ""}
              type={isTextarea ? undefined : inputType}
              multiline={isTextarea}
              minRows={isTextarea ? 6 : undefined}
              maxRows={isTextarea ? 6 : undefined}
              placeholder={placeholder}
              disabled={disable}
              inputProps={{
                inputMode: fieldType === "numeric" ? "numeric" : undefined,
              }}
              InputProps={{
                endAdornment: isPassword ? (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      aria-label={
                        showPassword
                          ? "Ocultar contrasena"
                          : "Mostrar contrasena"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              }}
              sx={[
                textFieldVisualSx,
                compactTextFieldSx,
                isTextarea
                  ? {
                      "& .MuiOutlinedInput-root": {
                        height: "auto",
                        minHeight: 169,
                        alignItems: "flex-start",
                      },
                      "& .MuiOutlinedInput-inputMultiline": {
                        lineHeight: 1.45,
                        maxHeight: 169,
                        overflowY: "auto",
                        resize: "none",
                        paddingTop: 10,
                        paddingBottom: 10,
                      },
                    }
                  : {},
              ]}
              onChange={(e) => {
                const value = e.target.value as any;
                field.onChange(value);

                if (onChangeField && setValue && getValues && resetField) {
                  onChangeField(value, {
                    setValue,
                    getValues,
                    resetField,
                  });
                }
              }}
              error={!!fieldError}
              helperText={(fieldError?.message as string) || helperText}
              fullWidth
            />
          </Box>
        );
      }}
    />
  );
}
