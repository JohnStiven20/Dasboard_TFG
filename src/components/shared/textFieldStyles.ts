export const textFieldVisualSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
  },
  "& .Mui-disabled": {
    backgroundColor: "#e9eef7",
  },
  "& .MuiFormHelperText-root": {
    backgroundColor: "#ffffff",
    marginLeft: 0.25,
    marginTop: 0.75,
    fontWeight: 500,
    fontSize: 13,
    color: "#64748b",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#c2410c",
  },
} as const;

export const compactTextFieldSx = {
  "& .MuiOutlinedInput-input": {
    fontSize: 15,
    fontWeight: 500,
    color: "#0f172a",
    paddingTop: 0,
    paddingBottom: 0,
    height: "100%",
    boxSizing: "border-box",
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: "#6b7280",
  },
  "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
    fontSize: 20,
  },
} as const;

export const dynamicFieldLabelSx = {
  display: "block",
  marginBottom: 0.55,
  color: "#0f172a",
  fontWeight: 700,
  fontSize: 17,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
} as const;

export const dynamicFieldLabelCompactSx = {
  ...dynamicFieldLabelSx,
  fontSize: 16,
  marginBottom: 0.5,
} as const;
