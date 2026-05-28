
import type { FieldConfig } from "../../../../type/DinamFormField";
import type { ToolType } from "../../interface/toolType";




export const toolTypeForm: FieldConfig<ToolType>[] = [
  {
    key: "name",
    type: "text",
     table:{
       width:300 , 
     },
    label: "Nombre",
    placeholder: "Amdin",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  },
  {
    key: "description",
    type: "text",
     table:{
       width:200 , 
     },
    label: "Description",
    grid: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
  }

];
