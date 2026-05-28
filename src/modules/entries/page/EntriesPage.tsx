import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import "./EntriesPage.css";
import { ScannerContext } from "../../../context/ScannerContext";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Card from "../components/Card";
import { EmptyPendingEntriesState } from "../components/EmptyPendingEntriesState";
import { PendingProductItemGroupList } from "../components/PendingProductItemGroupList";
import {
  Box,
  Button,
  FormControl,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import a11yProps, { CustomTabPanel } from "../../assignments/components/Tabs";
import { appBlackButtonSx } from "../components/muiButtonStyles";
import { useAppSelector } from "../../../store/hooks";
import useEntry from "../hooks/useEntry";
import { useNotifications } from "../../../context/NotificationsContext";
import type IdentifiedProduct from "../../../interface/entries/entries";

export function EntriesPage() {

  const { notify } = useNotifications();

  const pendingProductItems = useAppSelector(
    (state) => state.pendingProductItems.items
  );
  
  const pendingProductGenerics = useAppSelector(
    (state) => state.pendingProductGenerics.items
  );

  const {lastScan, clearScan } = useContext(ScannerContext);

  const {
    identifyProduct,
    removePendingProductItemAtIndex,
    clearPendingEntries,
    createEntries,
    isPendingCreateEntries,
  } = useEntry();


  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [code, setCode] = useState<string>("");
  const hasPendingEntries = pendingProductItems.length > 0 || pendingProductGenerics.length > 0;
  const canAddProduct = code.trim().length === 32;

  const groupedPendingProductItems = useMemo(() => {

    const groups = new Map<string,
      {
        modelName: string;
        total: number;
        codes: Map<
          string,
          {
            code: string;
            items: Array<{ item: IdentifiedProduct; index: number }>;
          }
        >;
      }
    >();

    pendingProductItems.forEach((item, index) => {

      const modelName = item.name;
      const code = item.productIdentifierCode?.substring(4, 10) || item.productIdentifierCode || "Sin codigo";

      if (!groups.has(modelName)) {
        groups.set(modelName, {
          modelName,
          total: 0,
          codes: new Map(),
        });
      }

      const modelGroup = groups.get(modelName)!;
      modelGroup.total += 1;

      if (!modelGroup.codes.has(code)) {
        modelGroup.codes.set(code, {
          code,
          items: [],
        });
      }

      modelGroup.codes.get(code)!.items.push({ item, index });
    });

    return Array.from(groups.values()).map((group) => ({
      modelName: group.modelName,
      total: group.total,
      codes: Array.from(group.codes.values()),
    }));
    
  }, [pendingProductItems]);

  const handleScan = useCallback(async (scan: string) => {
    
      const trimmedCode = scan.trim();
      
      if (!trimmedCode) {
        notify("El codigo no puede estar vacio", "error");
        return;
      }

      if (trimmedCode.length !== 32) {
        notify("El codigo debe tener exactamente 32 caracteres", "error");
        return;
      }

      const mac = trimmedCode.substring(20, trimmedCode.length);
      
      const isProductAlreadyAdded = pendingProductItems.some(
        (item) => item.mac === mac
      );

      if (isProductAlreadyAdded) {
        notify("El producto ya se encuentra agregado", "error");
        return;
      }

      await identifyProduct(trimmedCode);

    }, [identifyProduct, notify, pendingProductItems]
  );

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleAddProduct = async () => {
    try {
      await handleScan(code);
    } catch (error) {
      setCode("");
    }
  };

  const handleSaveEntries = async () => {
    await createEntries({
      genericProducts: pendingProductGenerics,
      productItems: pendingProductItems,
    });

    clearPendingEntries();
    setCode("");
  };

  useEffect(() => {
    
    if (!lastScan) return;

    void handleScan(lastScan);
    clearScan();

  }, [clearScan, handleScan, lastScan]);

  return (
    <div className="entries-container">
      <div className="entries-grid">
        <div className="entries-header">
          <article className="entries-title-article">
            <h1>Entrada</h1>
            <p>Registra los productos</p>
          </article>
        </div>

        <div className="entries-section">
          <Card>
            <div className="tabs-container" style={{ width: "100%" }}>
              <Tabs
                value={activeTabIndex}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  width: "100%",
                  padding: "4px",
                  backgroundColor: "#ebeaf0",
                  borderRadius: "12px",
                  minHeight: "30px",
                }}
                slotProps={{
                  indicator: { className: "tabs-indicator" },
                }}
              >
                <Tab
                  label="Productos"
                  className="tab-pill"
                  sx={{
                    padding: "0px",
                    minHeight: "30px",
                  }}
                  {...a11yProps(0)}
                />
                
              </Tabs>
            </div>

            <CustomTabPanel value={activeTabIndex} index={0}>
              <FormControl fullWidth>
                <Stack gap={2.25}>
                  <TextField
                    error={false}
                    value={code}
                    type="text"
                    label="Codigo QR o datamatrix"
                    size="small"
                    placeholder="Ingresa el codigo"
                    onChange={(event) => {
                      setCode(event.target.value);
                    }}
                  />

                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddProduct}
                    startIcon={<AddBoxOutlinedIcon />}
                    disabled={!canAddProduct}
                    sx={{ ...appBlackButtonSx }}
                    type="button"
                    className="right-flex"
                    disableElevation
                  >
                    Agregar producto
                  </Button>
                </Stack>
              </FormControl>
            </CustomTabPanel>

          </Card>

          <Stack gap={1.5}>
            <Stack
              sx={{
                minHeight: 360,
                minWidth: 0,
                width: "100%",
                overflowX: "hidden",
                backgroundColor: "#fff",
                padding: "0.75rem",
                borderRadius: "1rem",
                gap: "0.5rem",
                border: "1px solid rgba(205, 213, 225, 0.9)",
              }}
            >
              {!hasPendingEntries ? (
                <EmptyPendingEntriesState />
              ) : (
                <Box
                  sx={{
                    maxHeight: 520,
                    overflowY: "auto",
                    overflowX: "hidden",
                    minWidth: 0,
                    p: 0.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                    {groupedPendingProductItems.length > 0 ? (
                      <PendingProductItemGroupList
                        groups={groupedPendingProductItems}
                        onRemove={removePendingProductItemAtIndex}
                      />
                    ) : null}                    
                </Box>
              )}
            </Stack>

            <Button
              variant="contained"
              loading={isPendingCreateEntries}
              onClick={handleSaveEntries}
              startIcon={
                isPendingCreateEntries ? undefined : <SaveOutlinedIcon />
              }
              disabled={isPendingCreateEntries || !hasPendingEntries}
              type="button"
              sx={{ ...appBlackButtonSx, width: "100%" }}
              disableElevation
            >
              {isPendingCreateEntries ? "Registrando..." : "Registrar entrada"}
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
