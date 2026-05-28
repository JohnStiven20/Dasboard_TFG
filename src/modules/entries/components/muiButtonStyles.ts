export const appBlackButtonSx = {
  minWidth: 200,
  textTransform: "none",
  backgroundColor: "#000000",
  "&:hover": {
    backgroundColor: "#000000",
    opacity: 0.75,
  },
  "&:active": {
    opacity: 2,
  },
  "&.Mui-disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    color: "rgba(255, 255, 255, 0.78)",
  },
} as const;
