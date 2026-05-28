import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import "./OutPutPage.css";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { ScannerContext } from "../../../context/ScannerContext";
import { useNotifications } from "../../../context/NotificationsContext";
import type { ProductGenericBasic } from "../../../interface/product/product.inteface";
import type { ProductItemDTO } from "../../../interface/subject/assigment";
import type { SelectOption } from "../../../type/DinamFormField";
import { PendingGenericOutputGroupList } from "../components/PendingGenericOutputGroupList";
import { PendingSpecificOutputGroupList } from "../components/PendingSpecificOutputGroupList";
import { useProduct } from "../../assignments/hook/useProduct";
import a11yProps, { CustomTabPanel } from "../../assignments/components/Tabs";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import { useOutputProduct } from "../hooks/useOutPut";
import Card from "../../entries/components/Card";
import { EmptyPendingEntriesState } from "../../entries/components/EmptyPendingEntriesState";

type PendingGenericOutput = {
  id: number;
  name: string;
  amount: number;
  reason: string;
};

type PendingSpecificOutput = ProductItemDTO & {
  reason: string;
};


export function OutPutPage() {

  const [genericReason, setGenericReason] = useState("");
  const [specificReason, setSpecificReason] = useState("");
  const [specificCode, setSpecificCode] = useState("");
  const [selectedSpecificProduct, setSelectedSpecificProduct] = useState<ProductItemDTO>();
  const [amount, setAmount] = useState<number>(1);
  const [selectGeneric, setSelectGeneric] = useState<SelectOption<ProductGenericBasic> | null>(null);
  const [tab, setTab] = useState(0);
  const [pendingGenericOutputs, setPendingGenericOutputs] = useState<PendingGenericOutput[]>([]);
  const [pendingSpecificOutputs, setPendingSpecificOutputs] = useState<PendingSpecificOutput[]>([]);

  const { lastScan, clearScan } = useContext(ScannerContext);
  const { notify } = useNotifications();
  const { productGenerics, isLoadingGeneric } = useProduct();

  const {
    exitProduct,
    fetchOutputProduct,
    isPendingExitProduct,
    isPendingFetchOutputProduct,
  } = useOutputProduct();

  const hasPendingOutputs = pendingGenericOutputs.length > 0 || pendingSpecificOutputs.length > 0;

  const genericOptions = useMemo(
    () =>
      [...productGenerics]
        .sort((left, right) => left.name.localeCompare(right.name))
        .map<SelectOption<ProductGenericBasic>>((productGeneric) => ({
          value: productGeneric,
          label: productGeneric.name,
        })),
    [productGenerics],
  );

  const groupedPendingSpecificOutputs = useMemo(() => {
    const groups = new Map<
      string,
      {
        modelName: string;
        total: number;
        items: Array<{ item: PendingSpecificOutput; index: number }>;
      }
    >();

    pendingSpecificOutputs.forEach((item, index) => {
      if (!groups.has(item.name)) {
        groups.set(item.name, {
          modelName: item.name,
          total: 0,
          items: [],
        });
      }

      const currentGroup = groups.get(item.name)!;
      currentGroup.total += 1;
      currentGroup.items.push({ item, index });
    });

    return Array.from(groups.values());
  }, [pendingSpecificOutputs]);

  const groupedPendingGenericOutputs = useMemo(() => {
    const groups = new Map<
      string,
      {
        modelName: string;
        total: number;
        lines: Array<{ item: PendingGenericOutput; index: number }>;
      }
    >();

    pendingGenericOutputs.forEach((item, index) => {
      if (!groups.has(item.name)) {
        groups.set(item.name, {
          modelName: item.name,
          total: 0,
          lines: [],
        });
      }

      const currentGroup = groups.get(item.name)!;
      currentGroup.total += item.amount;
      currentGroup.lines.push({ item, index });
    });

    return Array.from(groups.values());
  }, [pendingGenericOutputs]);

  const handleAddGenericOutput = () => {
    const trimmedReason = genericReason.trim();

    if (amount <= 0) {
      notify("La cantidad debe ser mayor que 0", "warning");
      return;
    }

    if (!selectGeneric) {
      notify("Selecciona un producto generico", "warning");
      return;
    }

    if (!trimmedReason) {
      notify("Introduce un motivo de salida", "warning");
      return;
    }

    setPendingGenericOutputs((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.id === selectGeneric.value.id && item.reason === trimmedReason,
      );

      if (existingIndex === -1) {
        return [
          ...current,
          {
            id: selectGeneric.value.id,
            name: selectGeneric.value.name,
            amount,
            reason: trimmedReason,
          },
        ];
      }

      return current.map((item, index) =>
        index === existingIndex
          ? { ...item, amount: item.amount + amount }
          : item,
      );
    });

    notify("Producto generico agregado al area de preparacion", "success");
    setAmount(1);
    setSelectGeneric(null);
    setGenericReason("");
  };

  const handleScanSpecificProduct = useCallback(
    async (scan: string) => {
      const trimmedCode = scan.trim();

      if (!trimmedCode) {
        notify("Introduce o escanea un codigo valido", "warning");
        return;
      }

        const product = await fetchOutputProduct(trimmedCode);

        if (pendingSpecificOutputs.some((item) => item.id === product.id)) {
          notify("El producto ya esta agregado al area de preparacion", "warning");
          return;
        }

        setSpecificCode(trimmedCode);
        setSelectedSpecificProduct(product);
        setSpecificReason("");
        notify("Producto especifico cargado", "success");
      
    },
    [fetchOutputProduct, notify, pendingSpecificOutputs],
  );

  const handleManualSpecificSearch = async () => {
    await handleScanSpecificProduct(specificCode);
  };

  const handleAddSpecificOutput = () => {
    const trimmedReason = specificReason.trim();

    if (!selectedSpecificProduct) {
      notify("Busca primero un producto especifico", "warning");
      return;
    }

    if (!trimmedReason) {
      notify("Introduce un motivo de salida", "warning");
      return;
    }

    setPendingSpecificOutputs((current) => [
      ...current,
      {
        ...selectedSpecificProduct,
        reason: trimmedReason,
      },
    ]);

    notify("Producto especifico agregado al area de preparacion", "success");
    setSelectedSpecificProduct(undefined);
    setSpecificCode("");
    setSpecificReason("");
  };

  const handleSaveOutputs = async () => {
    if (!hasPendingOutputs) {
      notify("No hay productos pendientes para registrar", "warning");
      return;
    }

    await exitProduct({
      productItemExitDTOs: pendingSpecificOutputs.map((item) => ({
        id: item.id,
        reason: item.reason,
      })),
      productGenericExitDTOs: pendingGenericOutputs.map((item) => ({
        id: item.id,
        amount: item.amount,
        reason: item.reason,
      })),
    });

    setPendingSpecificOutputs([]);
    setPendingGenericOutputs([]);
    setSelectedSpecificProduct(undefined);
    setSpecificCode("");
    setSpecificReason("");
    setAmount(1);
    setSelectGeneric(null);
    setGenericReason("");
  };

  useEffect(() => {
    if (!lastScan) {
      return;
    }

    if (tab !== 1) {
      clearScan();
      return;
    }

    void (async () => {
      try {
        await handleScanSpecificProduct(lastScan);
      } finally {
        clearScan();
      }
    })();
  }, [clearScan, handleScanSpecificProduct, lastScan, tab]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="output-container">
      <div className="output-grid">
        <div className="output-header">
          <article className="article">
            <div className="output-title-article">
              <h1>Salida</h1>
              <p>Prepara salidas genericas y especificas en un solo registro.</p>
            </div>
          </article>
        </div>

        <div className="output-section">
          <Card>
            <div className="tabs-container">
              <Tabs
                value={tab}
                variant="fullWidth"
                sx={{
                  width: "100%",
                  backgroundColor: "#ebeaf0",
                  padding: "4px",
                  borderRadius: "12px",
                  minHeight: "30px",
                }}
                slotProps={{
                  indicator: { className: "tabs-indicator" },
                }}
                onChange={handleTabChange}
              >
                {/* <Tab
                className="tab-pill"
                sx={{
                  padding: "0px",
                  minHeight: "30px",
                }}
                value={0}
                label="Producto generico"
                {...a11yProps(1)}
              /> */}
                <Tab
                  className="tab-pill"
                  sx={{
                    padding: "0px",
                    minHeight: "30px",
                  }}
                  value={0}
                  label="Productos"
                  {...a11yProps(0)}
                />
              </Tabs>


            </div>
            <CustomTabPanel value={tab} index={1}>
              <FormControl fullWidth>
                <Stack gap={2.25}>
                  <Autocomplete<SelectOption<ProductGenericBasic>>
                    size="small"
                    loading={isLoadingGeneric}
                    options={genericOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectGeneric}
                    onChange={(_event, newValue) => {
                      setSelectGeneric(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Producto generico"
                        variant="outlined"
                      />
                    )}
                  />

                  <TextField
                    label="Cantidad"
                    type="number"
                    size="small"
                    fullWidth
                    value={amount || ""}
                    onChange={(event) => {
                      const nextAmount = Number.parseInt(event.target.value, 10);
                      setAmount(Number.isNaN(nextAmount) ? 0 : nextAmount);
                    }}
                    inputProps={{ min: 1 }}
                  />

                  <TextField
                    label="Motivo de salida"
                    placeholder="Describe por que sale este producto"
                    multiline
                    minRows={3}
                    value={genericReason}
                    onChange={(event) => {
                      setGenericReason(event.target.value);
                    }}
                    fullWidth
                  />

                  <Button
                    startIcon={<AddRoundedIcon />}
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={appBlackButtonSx}
                    onClick={handleAddGenericOutput}
                  >
                    Agregar a salida
                  </Button>
                </Stack>
              </FormControl>
            </CustomTabPanel>

            <CustomTabPanel value={tab} index={0}>
              <FormControl fullWidth>
              <Stack gap={2.25}>
                <Stack direction={{ xs: "column", sm: "column" }} gap={2.25}>
                  <TextField
                    size="small"
                    label="Codigo QR o datamatrix"
                    placeholder="Escanea o pega aqui el codigo"
                    value={specificCode}
                    onChange={(event) => setSpecificCode(event.target.value)}
                    fullWidth
                  />

                  <Button
                    size="small"
                    startIcon={<SearchRoundedIcon />}
                    variant="contained"
                    className="right-flex"
                    sx={appBlackButtonSx}
                    onClick={handleManualSpecificSearch}
                    disabled={!specificCode.trim() || isPendingFetchOutputProduct}
                  >
                    {isPendingFetchOutputProduct ? "Buscando..." : "Buscar"}
                  </Button>
                </Stack>

                {selectedSpecificProduct ? (
                  <Stack
                    spacing={2}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: "1rem",
                      border: "1px solid rgba(203, 213, 225, 0.95)",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, color: "#1f2937", fontSize: 16 }}
                      >
                        {selectedSpecificProduct.name}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                        MAC: {selectedSpecificProduct.mac}
                      </Typography>
                    </Box>

                    <TextField
                      label="Motivo de salida"
                      placeholder="Describe por que sale este producto"
                      multiline
                      minRows={3}
                      value={specificReason}
                      onChange={(event) => setSpecificReason(event.target.value)}
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} gap={1.25}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          setSelectedSpecificProduct(undefined);
                          setSpecificCode("");
                          setSpecificReason("");
                        }}
                      >
                        Limpiar
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={appBlackButtonSx}
                        startIcon={<AddBoxOutlinedIcon />}
                        onClick={handleAddSpecificOutput}
                      >
                        Agregar a salida
                      </Button>
                    </Stack>
                  </Stack>
                ) : null}
              </Stack>
              </FormControl>
            </CustomTabPanel>
          </Card>

          <Stack gap={1.5}>
            <Stack sx={{
                minHeight: 360,
                minWidth: 0,
                width: "100%",
                overflowX: "hidden",
                backgroundColor: "#fff",
                padding: "0.75rem",
                borderRadius: "1rem",
                gap: "0.5rem",
                border: "1px solid rgba(205, 213, 225, 0.9)",
              }}>
              {!hasPendingOutputs ? (
                <EmptyPendingEntriesState />
              ) : (
                <Box
                  sx={{
                    maxHeight: 520,
                    overflowY: "auto",
                    p: 0.5,
                  }}
                >
                  <Stack gap={0.65}>
                    {groupedPendingSpecificOutputs.length > 0 ? (
                      <PendingSpecificOutputGroupList
                        groups={groupedPendingSpecificOutputs}
                        onRemove={(index) =>
                          setPendingSpecificOutputs((current) =>
                            current.filter(
                              (_, currentIndex) => currentIndex !== index,
                            ),
                          )
                        }
                      />
                    ) : null}

                    {groupedPendingGenericOutputs.length > 0 ? (
                      <PendingGenericOutputGroupList
                        groups={groupedPendingGenericOutputs}
                        onIncrement={(index) =>
                          setPendingGenericOutputs((current) =>
                            current.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentItem,
                                    amount: currentItem.amount + 1,
                                  }
                                : currentItem,
                            ),
                          )
                        }
                        onDecrement={(index) =>
                          setPendingGenericOutputs((current) =>
                            current.flatMap((currentItem, currentIndex) => {
                              if (currentIndex !== index) {
                                return currentItem;
                              }

                              if (currentItem.amount <= 1) {
                                return [];
                              }

                              return {
                                ...currentItem,
                                amount: currentItem.amount - 1,
                              };
                            }),
                          )
                        }
                        onRemove={(index) =>
                          setPendingGenericOutputs((current) =>
                            current.filter(
                              (_, currentIndex) => currentIndex !== index,
                            ),
                          )
                        }
                      />
                    ) : null}
                  </Stack>
                </Box>
              )}
            </Stack>

            <Button
              variant="contained"
              onClick={handleSaveOutputs}
              startIcon={isPendingExitProduct ? undefined : <SaveOutlinedIcon />}
              disabled={isPendingExitProduct || !hasPendingOutputs}
              type="button"
              sx={{ ...appBlackButtonSx, width: "100%" }}
            >
              {isPendingExitProduct ? "Registrando..." : "Registrar salida"}
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
