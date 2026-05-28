import { Box } from "@mui/material";
import { createElement } from "react";
import type { Tool } from "../../../interface/tools/tools.interface";
import type { FieldConfig } from "../../../type/DinamFormField";

const TOOL_IMAGE_URL =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6e0.svg";

export const toolFormUI: FieldConfig<Tool>[] = [
  {
    key: "id",
    type: "text",
    label: "Imagen",
    table: {
      label: "",
      width: 86,
      renderCell: () =>
        createElement(
          Box,
          {
            sx: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
          createElement("img", {
            src: TOOL_IMAGE_URL,
            alt: "Herramienta",
            style: {
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: "10px",
              border: "1px solid rgba(205, 213, 225, 0.92)",
              background: "linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)",
              padding: "4px",
            },
          }),
        ),
    },
    visabled: false,
    grid: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
  },
  {
    key: "name",
    type: "text",
    label: "Nombre",
    table: {
      width: 200,
    },
    placeholder: "Amdin",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
  {
    key: "description",
    table: {
      width: 200,
    },
    type: "text",
    label: "Description",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
];
