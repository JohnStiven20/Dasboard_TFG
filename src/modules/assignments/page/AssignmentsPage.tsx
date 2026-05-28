import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import "./AssignmentsPage.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CardAssignments from "../components/CardAssignments";
import a11yProps, { CustomTabPanel } from "../components/Tabs";
import Card from "../../entries/components/Card";
import { useWorker } from "../../worker/hook/useWorker";
import type { Worker } from "../../../interface/subject/subject";
import type { SelectOption } from "../../../type/DinamFormField";
import { useNotifications } from "../../../context/NotificationsContext";
import { ScannerContext } from "../../../context/ScannerContext";
import { useAssignment } from "../hook/useAssigment";
import type {
  AssignmetResponse,
  GenericProductBasicDTO,
  ProductItemDTO,
} from "../../../interface/subject/assigment";
import { useUnitProductModels } from "../../../hooks/product/useUnitProductModels";
import type { UnitProductModel } from "../../../interface/productModel/interface/productmodel.interface";
import { useProductItemsByModel } from "../../../hooks/product/useProductItemsByModel";
import { useAvailableGenericProducts } from "../../../hooks/product/useAvailableGenericProducts";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import { scanProductItemByQrCode } from "../../../service/productItem.service";
import { Info } from "@mui/icons-material";

const assignmentPrepAccordionSx = {
  border: "1px solid rgba(191, 203, 224, 0.95)",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  "&:before": { display: "none" },
} as const;

type TabEmptyStateProps = {
  caption: string;
  icon: ReactNode;
  title: string;
  compact?: boolean;
};

const renderTabEmptyState = ({
  caption,
  icon,
  title,
  compact = false,
}: TabEmptyStateProps) => (
  <Box className={`assignments-tab-empty${compact ? " is-compact" : ""}`}>
    <Box className="assignments-tab-empty-icon">{icon}</Box>
    <Typography className="assignments-tab-empty-title">{title}</Typography>
    <Typography className="assignments-tab-empty-caption">{caption}</Typography>
  </Box>
);

export function AssignmentsPage() {

  const { notify } = useNotifications();
  const { lastScan, clearScan } = useContext(ScannerContext);
  const { items } = useWorker();
  const { fetchAssignmentsByWorker, isPendingAssignment } = useAssignment();
  const { items: productItemUnits } = useUnitProductModels();
  const [selectedOption, setSelectedOption] = useState<SelectOption<Worker> | null>(null);
  const { items: availableGenericProducts } = useAvailableGenericProducts();

  const [selectedWorker, setselectedWorker] = useState<Worker>();
  const isWorkerSelected = Boolean(selectedWorker);
  const [value, setValue] = useState(0);
  const [assigmentResponse, setAssigmentResponse] =
    useState<AssignmetResponse>();

  const [selectedUnitProductModel, setSelectedUnitProductModel] =
    useState<UnitProductModel | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductItems, setSelectedProductItems] = useState<
    ProductItemDTO[]
  >([]);
  const [selectedProductItemids, setSelectedProductItemids] = useState<
    number[]
  >([]);
  const [productSearchMac, setProductSearchMac] = useState("");



  const [selectedGenericProduct, setSelectedGenericProduct] =
    useState<GenericProductBasicDTO | null>(null);
  const [amountGeneric, setAmountGeneric] = useState(0);
  const [selectedGenericsBasic, setSelectedGenericsBasic] = useState<
    GenericProductBasicDTO[]
  >([]);
  const [productGenericSearchName, setProductGenericSearchName] =
    useState("");

  const filteredProductItemUnits = useMemo(() => {
    if (!productSearch) return productItemUnits;
    return productItemUnits.filter((product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [productItemUnits, productSearch]);

  const { items: productItemsByModel } = useProductItemsByModel(
    selectedUnitProductModel?.id,
  );

  const availableProductItems = useMemo(() => {
    const selectedMap = new Map(
      selectedProductItems.map((item) => [item.id, item]),
    );
    return productItemsByModel.filter((item) => !selectedMap.has(item.id));
  }, [productItemsByModel, selectedProductItems]);

  const filteravailableProductItems = useMemo(() => {
    return availableProductItems.filter((product) =>
      product.mac.toLowerCase().includes(productSearchMac.toLowerCase()),
    );
  }, [availableProductItems, productSearchMac]);



  const availableGenericProductsAdjusted = useMemo(() => {
    const selectedMap = new Map(
      selectedGenericsBasic.map((product) => [product.id, product.quantity]),
    );

    return availableGenericProducts
      .map((product) => {
        const used = selectedMap.get(product.id) ?? 0;

        return {
          ...product,
          quantity: product.quantity - used,
        };
      })
      .filter((product) => product.quantity > 0);
  }, [availableGenericProducts, selectedGenericsBasic]);

  const filteravailableGenericProducts = useMemo(() => {
    return availableGenericProductsAdjusted.filter((product) =>
      product.name
        .toLowerCase()
        .includes(productGenericSearchName.toLowerCase()),
    );
  }, [availableGenericProductsAdjusted, productGenericSearchName]);

  const selectedGenericRemainingProduct = useMemo(() => {
    if (!selectedGenericProduct) {
      return null;
    }

    const baseProduct = availableGenericProducts.find(
      (product) => product.id === selectedGenericProduct.id,
    );

    if (!baseProduct) {
      return null;
    }

    const usedQuantity =
      selectedGenericsBasic.find(
        (genericProduct) => genericProduct.id === selectedGenericProduct.id,
      )?.quantity ?? 0;

    return {
      ...baseProduct,
      quantity: Math.max(baseProduct.quantity - usedQuantity, 0),
    };
  }, [
    availableGenericProducts,
    selectedGenericProduct,
    selectedGenericsBasic,
  ]);



  const sortedSelectedGenerics = useMemo(() => {
    return [...selectedGenericsBasic].sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [selectedGenericsBasic]);

  const groupedSelectedProductItems = useMemo(() => {
    const groups = new Map<
      string,
      {
        modelName: string;
        total: number;
        items: ProductItemDTO[];
      }
    >();

    selectedProductItems.forEach((item) => {
      if (!groups.has(item.name)) {
        groups.set(item.name, {
          modelName: item.name,
          total: 0,
          items: [],
        });
      }

      const group = groups.get(item.name)!;
      group.total += 1;
      group.items.push(item);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        items: [...group.items].sort((left, right) =>
          left.mac.localeCompare(right.mac),
        ),
      }))
      .sort((left, right) => left.modelName.localeCompare(right.modelName));
  }, [selectedProductItems]);

  const totalSelectedGenericQuantity = useMemo(() => {
    return selectedGenericsBasic.reduce(
      (total, generic) => total + generic.quantity,
      0,
    );
  }, [selectedGenericsBasic]);

  const hasItemsToAssign =
    selectedGenericsBasic.length > 0 ||
    selectedProductItems.length > 0;

  const canAddGenericProduct =
    Boolean(selectedGenericRemainingProduct) &&
    amountGeneric > 0 &&
    amountGeneric <= (selectedGenericRemainingProduct?.quantity ?? 0);



  const handleOnChangeSelectProductItems = (ids: number[]) => {
    const idSet = new Set(ids);

    setSelectedProductItems((prev) => {
      const newItems = availableProductItems.filter(({ id }) => idSet.has(id));
      const map = new Map(prev.map((product) => [product.id, product]));

      newItems.forEach((item) => map.set(item.id, item));

      return [...map.values()];
    });

    setSelectedProductItemids([]);
  };

  const handleScannedProduct = useCallback(
    async (scan: string) => {
      const trimmedCode = scan.trim();

      if (trimmedCode.length !== 32) {
        return;
      }

      if (!selectedWorker) {
        notify("Selecciona un trabajador antes de escanear productos", "warning");
        return;
      }

      const scannedProduct = await scanProductItemByQrCode(trimmedCode);

      const isAlreadyAdded = selectedProductItems.some(
        (item) =>
          item.id === scannedProduct.id || item.mac === scannedProduct.mac,
      );

      if (isAlreadyAdded) {
        notify("El producto ya esta en el area de preparacion", "warning");
        return;
      }

      setSelectedProductItems((prev) => [...prev, scannedProduct]);
      setSelectedProductItemids((prev) =>
        prev.filter((id) => id !== scannedProduct.id),
      );
      setSelectedUnitProductModel((prev) => {
        if (prev?.name === scannedProduct.name) {
          return prev;
        }

        return (
          productItemUnits.find((model) => model.name === scannedProduct.name) ??
          prev
        );
      });
      setProductSearch("");
      setProductSearchMac("");
      setValue(1);

      notify(
        `Producto ${scannedProduct.mac} agregado al area de preparacion`,
        "success",
      );
    },
    [notify, productItemUnits, selectedProductItems, selectedWorker],
  );

  const toggleSelect = (item: ProductItemDTO) => {
    setSelectedProductItemids((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      }

      return [...prev, item.id];
    });
  };



  const removeGeneric = (id: number) => {
    setSelectedGenericsBasic((prev) =>
      prev.filter((generic) => generic.id !== id),
    );
  };

  const decGeneric = (id: number) => {
    setSelectedGenericsBasic((prev) =>
      prev
        .map((generic) =>
          generic.id === id
            ? { ...generic, quantity: generic.quantity - 1 }
            : generic,
        )
        .filter((generic) => generic.quantity > 0),
    );
  };

  const incGeneric = (id: number) => {
    const maxQuantity = availableGenericProducts.find(
      (generic) => generic.id === id,
    )?.quantity;

    if (!maxQuantity) {
      return;
    }

    setSelectedGenericsBasic((prev) =>
      prev.map((generic) => {
        if (generic.id !== id) {
          return generic;
        }

        return {
          ...generic,
          quantity: Math.min(generic.quantity + 1, maxQuantity),
        };
      }),
    );
  };

  const handleSelectGenericProduct = (product: GenericProductBasicDTO) => {
    setSelectedGenericProduct(product);
    setAmountGeneric(product.quantity > 0 ? 1 : 0);
  };

  const handleGenericAmountChange = (value: number) => {
    const nextValue = Number.isNaN(value) ? 0 : value;
    const maxQuantity = selectedGenericRemainingProduct?.quantity ?? 0;

    setAmountGeneric(Math.max(0, Math.min(nextValue, maxQuantity)));
  };

  const adjustGenericAmount = (delta: number) => {
    if (!selectedGenericRemainingProduct) {
      return;
    }

    setAmountGeneric((prev) =>
      Math.max(
        0,
        Math.min(prev + delta, selectedGenericRemainingProduct.quantity),
      ),
    );
  };

  const addGenericProduct = () => {
    if (!selectedGenericRemainingProduct) {
      notify("Seleccione un consumible generico", "warning");
      return;
    }

    if (amountGeneric <= 0) {
      notify("Ingrese una cantidad valida", "warning");
      return;
    }

    if (amountGeneric > selectedGenericRemainingProduct.quantity) {
      notify("Cantidad mayor al stock disponible", "warning");
      return;
    }

    setSelectedGenericsBasic((prev) => {
      const exists = prev.find(
        (item) => item.id === selectedGenericRemainingProduct.id,
      );

      if (exists) {
        return prev.map((item) =>
          item.id === selectedGenericRemainingProduct.id
            ? {
              ...item,
              quantity: item.quantity + amountGeneric,
            }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: selectedGenericRemainingProduct.id,
          name: selectedGenericRemainingProduct.name,
          quantity: amountGeneric,
        },
      ];
    });

    setAmountGeneric(0);
  };

  const removeProductItem = (item: ProductItemDTO) => {
    setSelectedProductItems((prev) =>
      prev.filter((product) => product.id !== item.id),
    );
  };

  const handleAssignment = async () => {

    if (!selectedWorker) {
      notify("Seleccione un trabajador", "warning");
      return;
    }

    if (!hasItemsToAssign) {
      notify("Seleccione consumibles o productos", "warning");
      return;
    }

    await fetchAssignmentsByWorker({
      genericProductIds: selectedGenericsBasic.map((generic) => ({
        id: generic.id,
        quantity: generic.quantity,
      })),
      specificProductItemIds: selectedProductItems.map((product) => product.id),
      toolsIds: [],
      workerId: selectedWorker.id,
    });

    notify("Asignacion registrada correctamente", "success");

    setAssigmentResponse(undefined);
    setSelectedProductItems([]);
    setSelectedProductItemids([]);
    setSelectedGenericsBasic([]);
    setSelectedGenericProduct(null);
    setAmountGeneric(0);
    setSelectedUnitProductModel(null);
    setselectedWorker(undefined);
    setProductSearchMac("");
    setSelectedOption(null);
  };

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!lastScan) {
      return;
    }

    const processScan = async () => {
      try {
        await handleScannedProduct(lastScan);
      } catch {
        notify("No se pudo identificar el producto escaneado", "error");
      } finally {
        clearScan();
      }
    };

    void processScan();
  }, [clearScan, handleScannedProduct, lastScan, notify]);

  return (
    <div className="assignments-container">
      <div className="assignments-grid">
        <div className="assignments-header">
          <article className="assignments-title-article">
            <h1>Asignaciones</h1>
            <p>Registra las asignaciones de productos</p>
          </article>
        </div>
        <div className="assignments-section">
          <Card className="assignments-card">
            <div className="assignments-select-container">
              <Stack spacing={2}>
                <Autocomplete<SelectOption<Worker>>
                  size="small"
                  value={selectedOption}
                  renderInput={(params) => (
                    <TextField {...params} label="Selecciona un trabajador" />
                  )}
                  options={items.map<SelectOption<Worker>>((worker) => ({
                    label: worker.name,
                    value: worker,
                  }))}
                  onChange={(_, worker) => {
                    setSelectedOption(worker);
                    setselectedWorker(worker?.value);
                  }}
                />
              </Stack>

              <Box
                id="tabs-container"
                className={!isWorkerSelected ? "is-blocked" : undefined}
                sx={{ mt: 2 }}
              >
                {!isWorkerSelected && (
                  <Box className="assignments-worker-overlay">
                    <Alert
                      className="assignments-worker-alert"
                      severity="info"
                      variant="outlined"
                      icon={<Info />}
                    >
                      Selecciona un trabajador para habilitar consumibles y productos.
                    </Alert>
                  </Box>
                )}

                <div className="tabs-container">
                  <Tabs
                    value={value}
                    onChange={handleChange}
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
                      disabled={!isWorkerSelected}
                      {...a11yProps(0)}
                    />
                    {/* <Tab
                      label="Consumibles"
                      className="tab-pill"
                      sx={{
                        padding: "0px",
                        minHeight: "30px",
                      }}
                      disabled={!isWorkerSelected}
                      {...a11yProps(1)}
                    /> */}
                  </Tabs>
                </div>

                <CustomTabPanel value={value} index={0}>
                  <Stack className="assignments-tab-shell" gap={2}>
                    <Stack
                      direction="row"
                      className="assignments-tab-layout"
                      alignItems="stretch"
                      gap={2}
                    >
                      <Stack className="assignments-product-panel assignments-product-panel-models">
                        <TextField
                          label="Buscar modelo..."
                          size="small"
                          value={productSearch}
                          onChange={(event) => setProductSearch(event.target.value)}
                          disabled={!isWorkerSelected}
                          fullWidth
                        />

                        <Stack gap={0.2} className="assignments-product-list assignments-product-list-clip-x">
                          {filteredProductItemUnits.length > 0 ? (
                            filteredProductItemUnits.map((item) => {
                              const isActive = selectedUnitProductModel?.id === item.id;

                              return (
                                <ButtonBase
                                  key={item.id}
                                  className={`assignments-product-model-row${isActive ? " is-active" : ""
                                    }`}
                                  onClick={() => {
                                    setSelectedUnitProductModel(item);
                                    setSelectedProductItemids([]);
                                    setProductSearchMac("");
                                  }}
                                >
                                  <Box className="assignments-product-model-icon">
                                    <Inventory2OutlinedIcon fontSize="small" />
                                  </Box>

                                  <Box className="assignments-product-model-copy">
                                    <Typography className="assignments-product-model-name">
                                      {item.name}
                                    </Typography>
                                    <Typography className="assignments-product-model-caption">
                                      Modelo disponible
                                    </Typography>
                                  </Box>

                                </ButtonBase>
                              );
                            })
                          ) : (
                            renderTabEmptyState({
                              compact: true,
                              icon: (
                                <Inventory2OutlinedIcon
                                  sx={{ color: "#1976d2", fontSize: 22 }}
                                />
                              ),
                              title: "No hay productos",
                              caption:
                                "No se encontraron modelos disponibles para asignar.",
                            })
                          )}
                        </Stack>
                      </Stack>

                      <Stack className="assignments-product-panel assignments-product-panel-items">
                        <Stack gap={1}>
                          <Box className="assignments-product-panel-header">
                            <Typography className="assignments-product-panel-title">
                              {selectedUnitProductModel
                                ? selectedUnitProductModel.name
                                : "Selecciona un modelo"}
                            </Typography>
                            <Typography className="assignments-product-panel-caption">
                              {selectedUnitProductModel
                                ? `${filteravailableProductItems.length} MAC disponibles`
                                : "Las unidades apareceran aqui"}
                            </Typography>
                          </Box>

                          <TextField
                            label="Buscar MAC..."
                            size="small"
                            value={productSearchMac}
                            onChange={(event) =>
                              setProductSearchMac(event.target.value)
                            }
                            disabled={!selectedUnitProductModel}
                            fullWidth
                          />
                        </Stack>

                        <Stack className="assignments-product-list">
                          {!selectedUnitProductModel ? (
                            renderTabEmptyState({
                              compact: true,
                              icon: (
                                <Inventory2OutlinedIcon
                                  sx={{ color: "#1976d2", fontSize: 22 }}
                                />
                              ),
                              title: "Selecciona un modelo",
                              caption:
                                "Escoge un modelo del panel izquierdo para ver las MAC disponibles.",
                            })
                          ) : filteravailableProductItems.length > 0 ? (
                            filteravailableProductItems.map((item) => {
                              const isSelected = selectedProductItemids.includes(
                                item.id,
                              );

                              return (
                                <ButtonBase
                                  key={item.id}
                                  className={`assignments-product-mac-row${isSelected ? " is-selected" : ""
                                    }`}
                                  onClick={() => toggleSelect(item)}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    tabIndex={-1}
                                    disableRipple
                                    size="small"
                                  />

                                  <Box className="assignments-product-mac-copy">
                                    <Typography className="assignments-product-mac-label">
                                      MAC {item.mac}
                                    </Typography>
                                    <Typography className="assignments-product-mac-caption">
                                      Disponible para asignar
                                    </Typography>
                                  </Box>


                                </ButtonBase>
                              );
                            })
                          ) : (
                            renderTabEmptyState({
                              compact: true,
                              icon: (
                                <Inventory2OutlinedIcon
                                  sx={{ color: "#1976d2", fontSize: 22 }}
                                />
                              ),
                              title: "No hay MAC disponibles",
                              caption:
                                "No hay unidades disponibles para asignar en este modelo.",
                            })
                          )}
                        </Stack>

                        <Button
                          size="small"
                          sx={{ ...appBlackButtonSx, width: "100%" }}
                          variant="contained"
                          color="primary"
                          disabled={
                            !selectedUnitProductModel ||
                            selectedProductItemids.length === 0
                          }
                          onClick={() =>
                            handleOnChangeSelectProductItems(
                              selectedProductItemids,
                            )
                          }
                          startIcon={<AddRoundedIcon />}
                          type="button"
                        >
                          Agregar productos ({selectedProductItemids.length})
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  <Stack className="assignments-tab-shell" gap={2}>
                    <Stack
                      direction="row"
                      className="assignments-tab-layout"
                      alignItems="stretch"
                      gap={2}
                    >
                      <Stack
                        className="assignments-product-panel assignments-product-panel-models"
                      >
                        <TextField
                          label="Buscar consumible..."
                          size="small"
                          placeholder="Buscar consumible..."
                          value={productGenericSearchName}
                          onChange={(event) =>
                            setProductGenericSearchName(event.target.value)
                          }
                          disabled={!isWorkerSelected}
                          fullWidth
                        />

                        <Stack
                          gap={0.2}
                          className="assignments-product-list assignments-product-list-clip-x"
                        >
                          {filteravailableGenericProducts.length > 0 ? (
                            filteravailableGenericProducts.map((product) => {
                              const isActive =
                                selectedGenericProduct?.id === product.id;

                              return (
                                <ButtonBase
                                  key={product.id}
                                  className={`assignments-generic-row${isActive ? " is-active" : ""
                                    }`}
                                  onClick={() => handleSelectGenericProduct(product)}
                                >
                                  <Box className="assignments-product-model-icon assignments-product-model-icon-generic">
                                    <Inventory2OutlinedIcon fontSize="small" />
                                  </Box>

                                  <Box className="assignments-product-model-copy">
                                    <Typography className="assignments-product-model-name">
                                      {product.name}
                                    </Typography>
                                    <Typography className="assignments-product-model-caption">
                                      Disponible para asignar
                                    </Typography>
                                  </Box>

                                  <Box className="assignments-generic-row-stock">
                                    {product.quantity}
                                  </Box>
                                </ButtonBase>
                              );
                            })
                          ) : (
                            renderTabEmptyState({
                              compact: true,
                              icon: (
                                <Inventory2OutlinedIcon
                                  sx={{ color: "#fbffffff", fontSize: 22 }}
                                />
                              ),
                              title: "No hay consumibles",
                              caption:
                                "No se encontraron consumibles disponibles para asignar.",
                            })
                          )}
                        </Stack>
                      </Stack>

                      <Stack className="assignments-product-panel assignments-product-panel-items">
                        <Stack className="assignments-panel-fill" gap={1}>
                          <Box className="assignments-product-panel-header">
                            <Typography className="assignments-product-panel-title">
                              {selectedGenericRemainingProduct
                                ? selectedGenericRemainingProduct.name
                                : "Selecciona un consumible"}
                            </Typography>
                            <Typography className="assignments-product-panel-caption">
                              {selectedGenericRemainingProduct
                                ? `${selectedGenericRemainingProduct.quantity} unidades disponibles para preparar`
                                : "El detalle y la cantidad apareceran aqui"}
                            </Typography>
                          </Box>

                          <Box className="assignments-generic-detail">
                            {selectedGenericRemainingProduct ? (
                              <Stack gap={1.2}>
                                <Box className="assignments-generic-detail-header">
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography className="assignments-generic-detail-title">
                                      {selectedGenericRemainingProduct.name}
                                    </Typography>
                                  </Box>
                                  <Box className="assignments-generic-detail-stock">
                                    Stock:{" "}
                                    {selectedGenericRemainingProduct.quantity}
                                  </Box>
                                </Box>

                                <Stack
                                  direction={{ xs: "column", sm: "row" }}
                                  gap={1}
                                  alignItems="stretch"
                                >
                                  <TextField
                                    type="number"
                                    size="small"
                                    label="Cantidad a agregar"
                                    value={amountGeneric}
                                    onChange={(event) =>
                                      handleGenericAmountChange(
                                        Number(event.target.value),
                                      )
                                    }
                                    disabled={!selectedGenericRemainingProduct}
                                    inputProps={{
                                      min: 0,
                                      max: selectedGenericRemainingProduct.quantity,
                                    }}
                                    helperText={`Disponible: ${selectedGenericRemainingProduct.quantity}`}
                                    fullWidth
                                  />

                                  <Box className="assignments-generic-qty-controls">
                                    <IconButton
                                      className="assignments-generic-stepper-button"
                                      onClick={() => adjustGenericAmount(-1)}
                                      disabled={amountGeneric <= 0}
                                      aria-label="Restar cantidad"
                                    >
                                      <RemoveIcon sx={{ fontSize: 18 }} />
                                    </IconButton>

                                    <Box className="assignments-generic-stepper-value">
                                      {amountGeneric}
                                    </Box>

                                    <IconButton
                                      className="assignments-generic-stepper-button"
                                      onClick={() => adjustGenericAmount(1)}
                                      disabled={
                                        amountGeneric >=
                                        selectedGenericRemainingProduct.quantity
                                      }
                                      aria-label="Sumar cantidad"
                                    >
                                      <AddRoundedIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Box>
                                </Stack>
                              </Stack>
                            ) : (
                              renderTabEmptyState({
                                compact: true,
                                icon: (
                                  <Inventory2OutlinedIcon
                                    sx={{ color: "#197c88", fontSize: 22 }}
                                  />
                                ),
                                title: "Selecciona un consumible",
                                caption:
                                  "Escoge un consumible del panel izquierdo para indicar la cantidad.",
                              })
                            )}
                          </Box>
                        </Stack>


                        <Button
                          size="small"
                          sx={{ ...appBlackButtonSx, width: "100%" }}
                          variant="contained"
                          color="primary"
                          disabled={!canAddGenericProduct}
                          onClick={addGenericProduct}
                          startIcon={<AddRoundedIcon />}
                          type="button"
                        >
                          Agregar consumible
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </CustomTabPanel>
              </Box>
            </div>
          </Card>

          {assigmentResponse && <CardAssignments data={assigmentResponse} />}
        </div>

        <div className="assignments-footer">
          <Stack gap={1.5}>
            <Stack
              sx={{
                minHeight: 360,
                backgroundColor: "#fff",
                padding: "0.75rem",
                borderRadius: "1rem",
                gap: "0.5rem",
                border: "1px solid rgba(191, 203, 224, 0.9)",
              }}
            >
              {!hasItemsToAssign ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.75,
                    margin: "auto",
                    px: 2,
                    textAlign: "center",
                  }}
                >
                  <Inventory2OutlinedIcon
                    sx={{ fontSize: 32, color: "rgba(89, 112, 154, 0.28)" }}
                  />
                  <Typography
                    sx={{ color: "#38445d", fontWeight: 600, fontSize: 15 }}
                  >
                    Ningun item en el area de preparacion
                  </Typography>
                  <Typography sx={{ color: "#60708c", fontSize: 12 }}>
                     Agrega o  escanea productos para preparar la asignacion
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: 520,
                    overflowY: "auto",
                    p: 0.5,
                  }}
                >
                  <Stack gap={0.65}>
                    {groupedSelectedProductItems.length > 0 ? (
                      <Accordion
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={assignmentPrepAccordionSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon />}
                          sx={{
                            px: 1.1,
                            py: 0,
                            minHeight: 40,
                            background:
                              "linear-gradient(180deg, #eff7ff 0%, #e3f1ff 100%)",
                            "& .MuiAccordionSummary-content": { my: 0 },
                            "& .MuiAccordionSummary-expandIconWrapper": {
                              mr: -0.25,
                            },
                          }}
                        >
                          <Box className="assignments-prep-summary">
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              minWidth={0}
                            >
                              <Inventory2OutlinedIcon
                                sx={{ color: "#18658f", fontSize: 18 }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#0f4f71",
                                  fontSize: 14,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Productos
                              </Typography>
                            </Stack>
                            <Box className="assignments-prep-pill assignments-prep-pill-product">
                              x{selectedProductItems.length}
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0.75 }}>
                          <Stack gap={0.45}>
                            {groupedSelectedProductItems.map((group) => (
                              <Box
                                key={group.modelName}
                                className="assignments-prep-block"
                              >
                                <Box className="assignments-prep-block-header">
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography className="assignments-prep-block-title">
                                      {group.modelName}
                                    </Typography>
                                  </Box>
                                  <Box className="assignments-prep-pill assignments-prep-pill-product-muted">
                                    x{group.total}
                                  </Box>
                                </Box>

                                <Box className="assignments-prep-chip-wrap">
                                  {group.items.map((item) => (
                                    <Box
                                      key={item.id}
                                      className="assignments-prep-chip"
                                      title={`${item.name} - ${item.mac}`}
                                    >
                                      <Typography className="assignments-prep-chip-label">
                                        {item.mac}
                                      </Typography>

                                      <IconButton
                                        size="small"
                                        onClick={() => removeProductItem(item)}
                                        className="assignments-prep-chip-action"
                                        aria-label={`Eliminar ${item.mac}`}
                                      >
                                        <CloseRoundedIcon
                                          sx={{ fontSize: 14 }}
                                        />
                                      </IconButton>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ) : null}

                    {sortedSelectedGenerics.length > 0 ? (
                      <Accordion
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={assignmentPrepAccordionSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon />}
                          sx={{
                            px: 1.1,
                            py: 0,
                            minHeight: 40,
                            background:
                              "linear-gradient(180deg, #edf7ff 0%, #e3f0ff 100%)",
                            "& .MuiAccordionSummary-content": { my: 0 },
                            "& .MuiAccordionSummary-expandIconWrapper": {
                              mr: -0.25,
                            },
                          }}
                        >
                          <Box className="assignments-prep-summary">
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              minWidth={0}
                            >
                              <Inventory2OutlinedIcon
                                sx={{ color: "#1b6c78", fontSize: 18 }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#12515a",
                                  fontSize: 14,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Consumibles
                              </Typography>
                            </Stack>
                            <Box className="assignments-prep-pill assignments-prep-pill-generic">
                              x{totalSelectedGenericQuantity}
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0.85 }}>
                          <Box className="assignments-prep-chip-wrap">
                            {sortedSelectedGenerics.map((generic) => (
                              <Box
                                key={generic.id}
                                className="assignments-prep-generic-chip"
                                title={generic.name}
                              >
                                <Typography className="assignments-prep-generic-chip-label">
                                  {generic.name}
                                </Typography>

                                <Box className="assignments-prep-generic-chip-count">
                                  x{generic.quantity}
                                </Box>

                                <Box className="assignments-prep-generic-chip-actions">
                                  <IconButton
                                    size="small"
                                    onClick={() => incGeneric(generic.id)}
                                    className="assignments-prep-inline-action"
                                    aria-label={`Sumar una unidad de ${generic.name}`}
                                  >
                                    <AddRoundedIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => decGeneric(generic.id)}
                                    className="assignments-prep-inline-action"
                                    aria-label={`Restar una unidad de ${generic.name}`}
                                  >
                                    <RemoveIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => removeGeneric(generic.id)}
                                    className="assignments-prep-inline-action assignments-prep-inline-action-danger"
                                    aria-label={`Eliminar ${generic.name}`}
                                  >
                                    <CloseRoundedIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ) : null}
                  </Stack>
                </Box>
              )}
            </Stack>

            <Button
              sx={{
                ...appBlackButtonSx,
                width: "100%",
              }}
              variant="contained"
              color="primary"
              loading={isPendingAssignment}
              startIcon={isPendingAssignment ? undefined : <SaveOutlinedIcon />}
              onClick={handleAssignment}
              disabled={
                isPendingAssignment || !isWorkerSelected || !hasItemsToAssign
              }
              type="button"
            >
              {isPendingAssignment ? "Guardando..." : "Guardar asignacion"}
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
