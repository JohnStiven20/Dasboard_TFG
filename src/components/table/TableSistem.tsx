import {
  DataGrid,
  type GridColDef,
  type GridRowId,
  GridToolbar,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ReactNode } from "react";

type MenuContext<T> = {
  row: T;
  mouseX: number;
  mouseY: number;
  close: () => void;
};

type TableSystemProps<T extends GridValidRowModel> = {
  rows: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  height?: number;
  getRowId?: (row: T) => GridRowId;

  onMenu?: (ctx: MenuContext<T> | null) => ReactNode;
};

export default function TableSystem<T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  getRowId: getRowIdProp,
  height = 500,
  onMenu,
}: TableSystemProps<T>) {
  const [contextMenu, setContextMenu] = useState<MenuContext<T> | null>(null);

  const handleCloseContextMenu = () => setContextMenu(null);

  const getRowId = useCallback(
    (row: T): GridRowId => {
      if (getRowIdProp) return getRowIdProp(row);
      return row.id as GridRowId;
    },
    [getRowIdProp]
  );

  const rowMap = useMemo(() => {
    const map = new Map<string, T>();
    rows.forEach((r) => {
      const id = getRowId(r);
      if (id !== undefined && id !== null) {
        map.set(String(id), r);
      }
    });
    return map;
  }, [rows, getRowId]);

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: height,
        minHeight: 0,
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: 1.5,
        boxShadow: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          // zIndex: 999,
          // top: 0,
          // left: 0,
          // right: 0,

          // bottom: 0,
          minHeight: 0,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          editMode="cell"
          density="compact"
          disableRowSelectionOnClick
          pagination
          loading={loading}
          columnHeaderHeight={56}
          rowHeight={65}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
            row: {
              onContextMenu: (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>
              ) => {
                if (!onMenu) return;

                event.preventDefault();
                const rowIdAttr = event.currentTarget.getAttribute("data-id");
                if (!rowIdAttr) return;

                const row = rowMap.get(rowIdAttr);
                if (!row) return;

                setContextMenu({
                  mouseX: event.clientX + 2,
                  mouseY: event.clientY - 4,
                  row,
                  close: handleCloseContextMenu,
                });
              },
              style: {
                cursor: onMenu ? "context-menu" : "default",
              },
            },
          }}
          showCellVerticalBorder
          showColumnVerticalBorder
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : ""
          }
          sx={{
            width: "100%",
            border: 0,
            "& .MuiButtonBase-root.MuiButton-root": {
              color: "#667eea",
            },
            "& .MuiDataGrid-toolbarContainer": {
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              padding: "10px 10px 0 10px",
            },
            // El quick filter (input) lo mandamos a la derecha
            "& .MuiDataGrid-toolbarContainer .MuiFormControl-root": {
              marginLeft: "auto",
              minWidth: "50px",
            },

            "& .MuiDataGrid-toolbarQuickFilter   .MuiIconButton-root": {
              width: "auto",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: (t) =>
                `linear-gradient(135deg, ${alpha(
                  t.palette.primary.light,
                  0.18
                )}, ${alpha(t.palette.primary.main, 0.12)})`,
              color: "text.primary",
              borderBottom: "1px solid",
              borderColor: "divider",
              // backdropFilter: "blur(2px)",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              letterSpacing: 0.2,
            },
            "& .MuiDataGrid-iconSeparator": { display: "none" },
            "& .MuiDataGrid-row.even": {
              backgroundColor: (t) => alpha(t.palette.primary.light, 0.035),
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: (t) => alpha(t.palette.primary.light, 0.1),
              transition: "background-color 0.2s ease-in-out",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
          }}
        />
      </Box>

      {onMenu && onMenu(contextMenu)}
    </Box>
  );
}
