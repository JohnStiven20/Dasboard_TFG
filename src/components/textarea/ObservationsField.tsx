import { TextField, Box, Typography } from "@mui/material";
import { textFieldVisualSx } from "../shared/textFieldStyles";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export const ObservationsField = ({
  value,
  onChange,
  label = "Observaciones",
  placeholder = "Indica el motivo (roto, perdido, defectuoso, etc.)",
  maxLength = 255,
  required = false,
}: Props) => {
  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        multiline
        minRows={3}
        maxRows={6}
        label={label}
        placeholder={placeholder}
        value={value}
        required={required}
        inputProps={{ maxLength }}
        onChange={(e) => onChange(e.target.value)}
        sx={[
          textFieldVisualSx,
          {
            "& .MuiOutlinedInput-root": {
              height: "auto",
              minHeight: 44,
              alignItems: "flex-start",
            },
            "& .MuiOutlinedInput-inputMultiline": {
              lineHeight: 1.5,
              paddingTop: 10,
              paddingBottom: 10,
            },
          },
        ]}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="right"
        mt={0.5}
      >
        {value.length}/{maxLength}
      </Typography>
    </Box>
  );
};
