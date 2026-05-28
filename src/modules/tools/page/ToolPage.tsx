// import { Box, Button, Container, Menu, MenuItem } from "@mui/material";
// import type { GlobalFormRef } from "../../../type/DinamFormField";
// import { useRef, useState } from "react";
// import "../style/ToolPage.css";
// import TableSystemGrid, {
//   type MenuContext,
// } from "../../../components/table/TableSystem";
// import { useNotifications } from "../../../context/NotificationsContext";
// import type { Tool } from "../../../interface/tools/tools.interface";
// import { useTools } from "../hook/useTools";
// import { toolFormUI } from "../ui/toolFormUi";
// import { DialogTool } from "../components/DialogTools";
// import Card from "../../entries/components/Card";

export interface Account {
  id?: number;
  username: string;
  password: string;
  isactive: boolean;
  createdAt?: string;
  subject: {
    name: boolean;
  };
}

// function ToolPage() {

//   const [add, setAdd] = useState<boolean>(false);
//   const [edit, setEdit] = useState<boolean>(false);

//   const { notify } = useNotifications();
//   const toolRef = useRef<GlobalFormRef<Tool> | null>(null);
//   const { tools, create, update, loading } = useTools();
//   const [editTool, seteditTool] = useState<Tool | null>(null);

//   const handleAddTool = async () => {
//     const tool = toolRef.current?.getValues();
//     if (!tool) return;
//     await create(tool);
//     setAdd(false);
//     notify("Herramienta creada correctamente", "success");
//   };

//   const handleUpdateTool = async () => {
//     const tool = toolRef.current?.getValues();
//     const toolid = editTool?.id;
//     if (!tool || !toolid) return;
//     await update({
//       id: toolid,
//       data: { name: tool.name, description: tool.description },
//     });
//     setEdit(false);

//     notify("Herramienta Actualizada correctamente", "success");
//   };

//   return (
//     <Container className="tool-container" maxWidth={"lg"}>
//       <Box className="tool-grid">
//         <div className="tool-header">
//           <article className="tool-title-article">
//             <h1>Herramientas</h1>
//             <p>
//               Administra el catalogo interno y manten visible la informacion
//               clave de cada herramienta.
//             </p>
//           </article>
//         </div>

//         <Box sx={{
//           display: "flex",
//           flexDirection: "row",
//           gap: 2,
//           width: "100%",
//           height: "100%",
//         }}>
          
//         </Box>

//         <Box className="tool-table" sx={{
//           mt: 5
//         }}>
//           <Card title="Equipos" subtitle="Aqui puedes encontrar la informacion de los equipos">
//             <TableSystemGrid<Tool>
//               onMenu={(contextMenu: MenuContext<Tool> | null) => {
//                 return (
//                   <>
//                     <Menu
//                       open={Boolean(contextMenu)}
//                       onClose={contextMenu?.close}
//                       anchorReference="anchorPosition"
//                       anchorPosition={{
//                         top: contextMenu?.mouseY ?? 0,
//                         left: contextMenu?.mouseX ?? 0,
//                       }}
//                     >
//                       <MenuItem
//                         onClick={() => {
//                           const tool = contextMenu?.row;
//                           if (!tool) return;
//                           seteditTool(tool);
//                           setEdit(true);
//                         }}
//                       >
//                         Editar
//                       </MenuItem>
//                     </Menu>
//                   </>
//                 );
//               }}
//               rows={tools}
//               loading={loading}
//               formconfig={toolFormUI}
//             />

//           </Card>
//         </Box>

//         <DialogTool
//           ref={toolRef}
//           open={add}
//           setOpen={setAdd}
//           onclick={handleAddTool}
//           fields={toolFormUI}
//         />
//         <DialogTool
//           ref={toolRef}
//           open={edit}
//           editTool={editTool ?? undefined}
//           setOpen={setEdit}
//           onclick={handleUpdateTool}
//           fields={toolFormUI}
//         />
//       </Box>
//     </Container>
// //   );
// }
