import {
  DataGrid,
  type GridColDef,
  type GridRowId,
  GridToolbar,
  type GridValidRowModel,

} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { Box,  useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { FieldConfig } from "../../type/DinamFormField";
import type { FieldValues } from "react-hook-form";
import { TextFieldTable } from "./fields/TextFieldTable";
import { SwitchEditCell } from "./fields/SwitchFieldTable";

export type MenuContext<T> = {
  row: T;
  mouseX: number;
  mouseY: number;
  close: () => void;
};

type TableSystemProps<T extends GridValidRowModel> = {
  rows: T[];
  loading?: boolean;
  formconfig: FieldConfig<T>[];
  height?: number;
  getRowId?: (row: T) => GridRowId;
  onMenu?: (ctx: MenuContext<T> | null) => ReactNode;
  onUpdateRow?: (udpate: T) => void;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
};

function builColumForm<T extends FieldValues>(formconfig: FieldConfig<T>[]) {
  const cols: GridColDef<T>[] = [];

  formconfig.forEach((e) => {
    const table = e.table;
    if (table?.show === false) return;

    const minWidth = table?.minWidth ?? table?.minwidth;
    const maxWidth = table?.maxWidth ?? table?.maxwidth;
    const flex = table?.flex;

    switch (e.type) {
      case "text": {
        cols.push({
          field: e.key,
          headerName: table?.label ?? e.label ?? String(e.key),
          width: table?.width,
          minWidth,
          maxWidth,
          flex,
          renderCell: table?.renderCell,
          editable: table?.editable ?? false,
          renderEditCell(params) {
            return <TextFieldTable fieldKey={e.key} props={params} />;
          },
        });
        break;
      }
      case "switch":
        cols.push({
          field: e.key,
          headerName: table?.label ?? e.label ?? String(e.key),
          width: table?.width,
          minWidth,
          maxWidth,
          flex,
          renderCell: (params) => {
            return (
              <>
                <SwitchEditCell disable fieldKey={e.key} params={params} />
              </>
            );
          },
          editable: table?.editable ?? false,
          renderEditCell(params) {
            return <SwitchEditCell fieldKey={e.key} params={params} />;
          },
        });
        break;
      case "entity":
        cols.push({
          field: e.key,
          headerName: table?.label ?? e.label ?? String(e.key),
          width: table?.width,
          minWidth,
          maxWidth,
          flex,
          renderCell: table?.renderCell,
          // renderCell: (params) => {
          //   return (
          //     <>
          //       <TextFieldTable fieldKey={e.key} props={params} />
          //     </>
          //   );
          // },
          editable: table?.editable ?? false,
          // renderEditCell(params) {
          //   return <SwitchEditCell fieldKey={e.key} params={params} />;
          // },
        });
        break;

      default:
        break;
    }
  });

  return cols;
}

export default function TableSystemGrid<T extends GridValidRowModel>({
  rows,
  loading = false,
  getRowId: getRowIdProp,
  formconfig,
  onUpdateRow,
  onMenu,
  onRowClick,
  onRowDoubleClick,
}: TableSystemProps<T>) {
  const theme = useTheme();
  const isCompactScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [contextMenu, setContextMenu] = useState<MenuContext<T> | null>(null);

  const handleCloseContextMenu = () => setContextMenu(null);

  const colums = useMemo(() => {

    return builColumForm<T>(formconfig).map((column) => ({
      ...column,
      width: isCompactScreen ? undefined : column.width,
      flex:
        typeof column.flex === "number"
          ? column.flex
          : typeof column.width === "number"
            ? undefined
            : 1,
      minWidth:
        column.minWidth ??
        (isCompactScreen
          ? 120
          : (typeof column.width === "number" ? 120 : 140)),
      maxWidth: column.maxWidth,
    }));
  }, [formconfig, isCompactScreen]);

  const getRowId = useCallback(
    (row: T): GridRowId => {
      if (getRowIdProp) return getRowIdProp(row);
      return row.id as GridRowId;
    },
    [getRowIdProp],
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
        width: "100%",
        minWidth: 0,
        border: "solid 1px #e0e0e0",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <DataGrid
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{ 
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          rows={rows}
          columns={colums}
          getRowId={getRowId}
          autoHeight
          editMode="cell"
          density={isCompactScreen ? "standard" : "compact"}
          disableDensitySelector
          disableRowSelectionOnClick
          onRowClick={(params) => {
            onRowClick?.(params.row as T);
          }}
          onRowDoubleClick={(params) => {
            onRowDoubleClick?.(params.row as T);
          }}
          pagination
          loading={loading}
          columnHeaderHeight={isCompactScreen ? 48 : 56}
          rowHeight={isCompactScreen ? 56 : 65}
          processRowUpdate={(newRow: T) => {
            if (onUpdateRow) onUpdateRow(newRow);

            return newRow;
          }}
          showToolbar
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: {
                debounceMs: 1000,
              },
              csvOptions: {
                disableToolbarButton: true,
              },
              printOptions: {
                disableToolbarButton: true,
              },
            },
            row: {
              onContextMenu: (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>,
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
                cursor:
                  onMenu
                    ? "context-menu"
                    : onRowClick || onRowDoubleClick
                      ? "pointer"
                      : "default",
              },
            },
          }}
          showCellVerticalBorder
          showColumnVerticalBorder
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : ""
          }
          sx={{
            border: 0,
            minWidth: 0,
            "& .MuiDataGrid-toolbarContainer": {
              flexWrap: isCompactScreen ? "wrap" : "nowrap",
            },
            "& .MuiDataGrid-toolbarQuickFilter": {
              width: isCompactScreen ? "100%" : "auto",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
              color: "var(--mui-palette-primary-main)",
            },
          }}
        />
      </Box>

      {onMenu && onMenu(contextMenu)}
    </Box>
  );
}
