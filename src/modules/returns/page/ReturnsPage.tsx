import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Info } from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
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
import "../../assignments/page/AssignmentsPage.css";
import "./ReturnsPage.css";
import a11yProps, { CustomTabPanel } from "../../assignments/components/Tabs";
import Card from "../../entries/components/Card";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import { useAssignment } from "../../assignments/hook/useAssigment";
import { useWorker } from "../../worker/hook/useWorker";
import { useNotifications } from "../../../context/NotificationsContext";
import type {
  GenericProductBasicDTO,
  GenericReturnDTO,
  ProductItemDTO,
  WorkerStockDTO,
} from "../../../interface/subject/assigment";
import type { Worker } from "../../../interface/subject/subject";

import type { SelectOption } from "../../../type/DinamFormField";
import { useReturn } from "../hook/useReturn";
import type { ReturnAssignment } from "../interfaces/return.interface";

const emptyWorkerStock: WorkerStockDTO = {
  tools: [],
  genericProducts: [],
  productItems: {},
};

const returnPrepAccordionSx = {
  border: "1px solid rgba(191, 203, 224, 0.95)",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  "&:before": { display: "none" },
} as const;

const returnsMobileMediaQuery = "@media screen and (max-width: 760px)";

const responsiveTabShellSx = {
  backgroundColor: "#fff",
  height: 400,
  [returnsMobileMediaQuery]: {
    height: "auto",
  },
} as const;

const responsiveTabLayoutSx = {
  height: "100%",
  gap: 1.5,
  [returnsMobileMediaQuery]: {
    height: "auto",
    gap: 2,
    flexDirection: "column",
  },
} as const;

const responsivePanelModelsSx = {
  width: 0,
  [returnsMobileMediaQuery]: {
    width: "100%",
  },
} as const;

const responsivePanelListSx = {
  flex: 1,
  minHeight: 0,
  [returnsMobileMediaQuery]: {
    minHeight: 250,
  },
} as const;

type TabEmptyStateProps = {
  caption: string;
  icon: ReactNode;
  title: string;
  compact?: boolean;
};

type AssignedProductModel = {
  name: string;
  total: number;
};

const getWorkerLabel = (worker: Worker) => {
  const fullName = `${worker.name}`;
  return fullName || worker.employeeCode || "Trabajador sin nombre";
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

export function ReturnsPage() {

  const { items } = useWorker();
  const { notify } = useNotifications();
  const { fetchAssignmentsByWorkerAndDate } = useAssignment();
  const { returnStock, returning } = useReturn();

  const [selectedWorker, setSelectedWorker] = useState<Worker>();
  const [assignedStock, setAssignedStock] =useState<WorkerStockDTO>(emptyWorkerStock);
  const [value, setValue] = useState(0);
  const [selectedOption, setSelectedOption] = useState<SelectOption<Worker> | null>(null);




  const [productSearch, setProductSearch] = useState("");
  const [selectedProductModelName, setSelectedProductModelName] = useState<
  string | null
  >(null);
  const [productSearchMac, setProductSearchMac] = useState("");
  const [selectedProductItemIds, setSelectedProductItemIds] = useState<
    number[]
  >([]);
  const [selectedProductItems, setSelectedProductItems] = useState<
    ProductItemDTO[]
  >([]);

  const [productGenericSearchName, setProductGenericSearchName] = useState("");
  const [selectedGenericProduct, setSelectedGenericProduct] =
    useState<GenericProductBasicDTO | null>(null);
  const [amountGeneric, setAmountGeneric] = useState(0);
  const [selectedGenericsBasic, setSelectedGenericsBasic] = useState<
    GenericProductBasicDTO[]
  >([]);

  const [isWorkerSelected, setIsWorkerSelected] = useState(false);
  const hasItemsToReturn =
    selectedProductItems.length > 0 ||
    selectedGenericsBasic.length > 0;

  const workerOptions = useMemo(
    () =>
      items
        .map<SelectOption<Worker>>((worker) => ({
          label: getWorkerLabel(worker),
          value: worker,
        }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [items],
  );


  const visibleProductItems = useMemo(() => {
    const selectedIds = new Set(selectedProductItems.map((item) => item.id));

    return Object.fromEntries(
      Object.entries(assignedStock.productItems)
        .map(([modelName, modelItems]) => [
          modelName,
          modelItems.filter((item) => !selectedIds.has(item.id)),
        ])
        .filter(([, modelItems]) => modelItems.length > 0),
    ) as Record<string, ProductItemDTO[]>;
  }, [assignedStock.productItems, selectedProductItems]);

  const availableProductModels = useMemo<AssignedProductModel[]>(() => {
    return Object.entries(visibleProductItems)
      .map(([name, modelItems]) => ({
        name,
        total: modelItems.length,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [visibleProductItems]);

  const filteredProductModels = useMemo(() => {
    return availableProductModels.filter((model) =>
      model.name.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [availableProductModels, productSearch]);

  const availableProductItemsForSelectedModel = useMemo(() => {
    if (!selectedProductModelName) {
      return [];
    }

    return visibleProductItems[selectedProductModelName] ?? [];
  }, [selectedProductModelName, visibleProductItems]);

  const filteredAvailableProductItems = useMemo(() => {
    return [...availableProductItemsForSelectedModel]
      .filter((item) =>
        item.mac.toLowerCase().includes(productSearchMac.toLowerCase()),
      )
      .sort((left, right) => left.mac.localeCompare(right.mac));
  }, [availableProductItemsForSelectedModel, productSearchMac]);

  const availableGenericProductsAdjusted = useMemo(() => {
    const selectedMap = new Map(
      selectedGenericsBasic.map((product) => [product.id, product.quantity]),
    );

    return assignedStock.genericProducts
      .map((product) => {
        const selectedQuantity = selectedMap.get(product.id) ?? 0;

        return {
          ...product,
          quantity: product.quantity - selectedQuantity,
        };
      })
      .filter((product) => product.quantity > 0)
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [assignedStock.genericProducts, selectedGenericsBasic]);

  const filteredAvailableGenericProducts = useMemo(() => {
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

    const baseProduct = assignedStock.genericProducts.find(
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
    assignedStock.genericProducts,
    selectedGenericProduct,
    selectedGenericsBasic,
  ]);

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



  const sortedSelectedGenerics = useMemo(() => {
    return [...selectedGenericsBasic].sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [selectedGenericsBasic]);

  const totalSelectedGenericQuantity = useMemo(() => {
    return selectedGenericsBasic.reduce(
      (total, generic) => total + generic.quantity,
      0,
    );
  }, [selectedGenericsBasic]);

  const canAddGenericProduct =
    Boolean(selectedGenericRemainingProduct) &&
    amountGeneric > 0 &&
    amountGeneric <= (selectedGenericRemainingProduct?.quantity ?? 0);

  const resetReturnWorkspace = () => {
    setValue(0);
    setProductSearch("");
    setSelectedProductModelName(null);
    setProductSearchMac("");
    setSelectedProductItemIds([]);
    setSelectedProductItems([]);
    setProductGenericSearchName("");
    setSelectedGenericProduct(null);
    setAmountGeneric(0);
    setSelectedGenericsBasic([]);
  };

  const loadWorkerAssignments = async (worker: Worker) => {
    const response = await fetchAssignmentsByWorkerAndDate({
      workerId: worker.id,
    });

    setAssignedStock(response);
    return response;
  };



  const toggleSelectProductItem = (item: ProductItemDTO) => {
    setSelectedProductItemIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      }

      return [...prev, item.id];
    });
  };

  const handleAddSelectedProductItems = () => {
    if (!selectedProductItemIds.length) {
      return;
    }

    const idSet = new Set(selectedProductItemIds);

    setSelectedProductItems((prev) => {
      const nextItems = new Map(prev.map((item) => [item.id, item]));

      availableProductItemsForSelectedModel
        .filter((item) => idSet.has(item.id))
        .forEach((item) => nextItems.set(item.id, item));

      return [...nextItems.values()];
    });

    setSelectedProductItemIds([]);
  };

  const removeProductItem = (item: ProductItemDTO) => {
    setSelectedProductItems((prev) =>
      prev.filter((product) => product.id !== item.id),
    );
    setSelectedProductItemIds((prev) => prev.filter((id) => id !== item.id));
  };

  const handleSelectGenericProduct = (product: GenericProductBasicDTO) => {
    setSelectedGenericProduct(product);
    setAmountGeneric(product.quantity > 0 ? 1 : 0);
  };

  const handleGenericAmountChange = (nextValue: number) => {
    const parsedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    const maxQuantity = selectedGenericRemainingProduct?.quantity ?? 0;

    setAmountGeneric(Math.max(0, Math.min(parsedValue, maxQuantity)));
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
      notify("Selecciona un consumible asignado", "warning");
      return;
    }

    if (amountGeneric <= 0) {
      notify("Ingresa una cantidad valida", "warning");
      return;
    }

    if (amountGeneric > selectedGenericRemainingProduct.quantity) {
      notify("La cantidad supera lo asignado al trabajador", "warning");
      return;
    }

    setSelectedGenericsBasic((prev) => {
      const exists = prev.find(
        (generic) => generic.id === selectedGenericRemainingProduct.id,
      );

      if (exists) {
        return prev.map((generic) =>
          generic.id === selectedGenericRemainingProduct.id
            ? {
              ...generic,
              quantity: generic.quantity + amountGeneric,
            }
            : generic,
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

  const removeGeneric = (id: number) => {
    setSelectedGenericsBasic((prev) =>
      prev.filter((generic) => generic.id !== id),
    );
  };

  const incGeneric = (id: number) => {
    const maxQuantity = assignedStock.genericProducts.find(
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

  const handleTabsChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleWorkerChange = async (option: SelectOption<Worker> | null) => {
    const nextWorker = option?.value;

    if (!nextWorker && !selectedWorker) {
      return;
    }

    if (selectedWorker?.id === nextWorker?.id) {
      return;
    }

    if (hasItemsToReturn) {
      const shouldContinue = window.confirm(
        "Tienes elementos en el area de retorno. Si cambias de trabajador se perderan. Continuar?",
      );

      if (!shouldContinue) {
        return;
      }
    }

    resetReturnWorkspace();
    setAssignedStock(emptyWorkerStock);

    if (!nextWorker) {
      setSelectedWorker(undefined);
      return;
    }

    try {
      setSelectedWorker(nextWorker);
      await loadWorkerAssignments(nextWorker);
    } catch {
      setSelectedWorker(undefined);
      setAssignedStock(emptyWorkerStock);
      notify("No se pudo cargar el stock asignado del trabajador", "error");
    }
  };

  const handleReturn = async () => {

    if (!selectedWorker) {
      notify("Selecciona un trabajador", "warning");
      return;
    }

    if (!hasItemsToReturn) {
      notify(
        "Selecciona al menos un producto o consumible",
        "warning",
      );
      return;
    }

    const genericProductIds: GenericReturnDTO[] = selectedGenericsBasic.map(
      (generic) => ({
        genericProductId: generic.id,
        quantity: generic.quantity,
      }),
    );

    const body: ReturnAssignment = {
      workerId: selectedWorker.id,
      productItemIds: selectedProductItems.map((item) => item.id),
      productGenerics: genericProductIds,
      toolIds: [],
    };

    await returnStock(body);
    await loadWorkerAssignments(selectedWorker);

    resetReturnWorkspace();
    setIsWorkerSelected(false);
    setSelectedOption(null);

    notify("Retorno registrado correctamente", "success");
  };

  useEffect(() => {
    if (
      selectedProductModelName &&
      !visibleProductItems[selectedProductModelName]?.length
    ) {
      setSelectedProductModelName(null);
      setSelectedProductItemIds([]);
      setProductSearchMac("");
    }
  }, [selectedProductModelName, visibleProductItems]);



  const productsTabContent = (
    <Stack sx={responsiveTabShellSx} gap={2}>
      <Stack
        direction="row"
        sx={responsiveTabLayoutSx}
        alignItems="stretch"
      >
        <Stack
          sx={responsivePanelModelsSx}
          className="assignments-product-panel assignments-product-panel-models"
        >
          <TextField
            label="Buscar modelo..."
            size="small"
            value={productSearch}
            onChange={(event) => setProductSearch(event.target.value)}
            disabled={!isWorkerSelected}
            fullWidth
          />

          <Stack
            gap={0.2}
            sx={{
              ...responsivePanelListSx,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            className="assignments-product-list"
          >
            {filteredProductModels.length > 0 ? (
              filteredProductModels.map((model) => {
                const isActive = selectedProductModelName === model.name;

                return (
                  <ButtonBase
                    key={model.name}
                    className={`assignments-product-model-row${isActive ? " is-active" : ""}`}
                    onClick={() => {
                      setSelectedProductModelName(model.name);
                      setSelectedProductItemIds([]);
                      setProductSearchMac("");
                    }}
                  >
                    <Box className="assignments-product-model-icon">
                      <Inventory2OutlinedIcon fontSize="small" />
                    </Box>

                    <Box className="assignments-product-model-copy">
                      <Typography className="assignments-product-model-name">
                        {model.name}
                      </Typography>
                      <Typography className="assignments-product-model-caption">
                        {model.total} MAC asignadas disponibles
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
                title:
                  availableProductModels.length === 0
                    ? "No hay productos seriados para retornar"
                    : "Sin resultados en productos",
                caption:
                  availableProductModels.length === 0
                    ? "Este trabajador no tiene productos asignados pendientes."
                    : "Ajusta la busqueda para encontrar el modelo asignado.",
              })
            )}
          </Stack>
        </Stack>

        <Stack className="assignments-product-panel assignments-product-panel-items">
          <Stack gap={1}>
            <Box className="assignments-product-panel-header">
              <Typography className="assignments-product-panel-title">
                {selectedProductModelName || "Selecciona un modelo"}
              </Typography>
              <Typography className="assignments-product-panel-caption">
                {selectedProductModelName
                  ? `${filteredAvailableProductItems.length} MAC asignadas disponibles`
                  : "Las unidades asignadas apareceran aqui"}
              </Typography>
            </Box>

            <TextField
              label="Buscar MAC..."
              size="small"
              value={productSearchMac}
              onChange={(event) => setProductSearchMac(event.target.value)}
              disabled={!selectedProductModelName}
              fullWidth
            />
          </Stack>

          <Stack sx={responsivePanelListSx} className="assignments-product-list">
            {!selectedProductModelName ? (
              renderTabEmptyState({
                compact: true,
                icon: (
                  <Inventory2OutlinedIcon
                    sx={{ color: "#1976d2", fontSize: 22 }}
                  />
                ),
                title: "Selecciona un modelo",
                caption:
                  "Escoge un modelo del panel izquierdo para ver las MAC asignadas al trabajador.",
              })
            ) : filteredAvailableProductItems.length > 0 ? (
              filteredAvailableProductItems.map((item) => {
                const isSelected = selectedProductItemIds.includes(item.id);

                return (
                  <ButtonBase
                    key={item.id}
                    className={`assignments-product-mac-row${isSelected ? " is-selected" : ""}`}
                    onClick={() => toggleSelectProductItem(item)}
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
                        Asignado al trabajador
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
                  availableProductItemsForSelectedModel.length === 0
                    ? "Todas las unidades de este modelo ya estan en el area de retorno."
                    : "La busqueda actual no coincide con ninguna MAC asignada.",
              })
            )}
          </Stack>

          <Button
            size="small"
            sx={{ ...appBlackButtonSx, width: "100%" }}
            variant="contained"
            color="primary"
            disabled={
              !selectedProductModelName || selectedProductItemIds.length === 0
            }
            onClick={handleAddSelectedProductItems}
            startIcon={<AddRoundedIcon />}
            type="button"
          >
            Agregar productos ({selectedProductItemIds.length})
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );

  const consumablesTabContent = (
    <Stack sx={responsiveTabShellSx} gap={2}>
      <Stack
        direction="row"
        sx={responsiveTabLayoutSx}
        alignItems="stretch"
      >
        <Stack
          sx={responsivePanelModelsSx}
          className="assignments-product-panel assignments-product-panel-models"
        >
          <TextField
            label="Buscar consumible..."
            size="small"
            placeholder="Buscar consumible..."
            value={productGenericSearchName}
            onChange={(event) => setProductGenericSearchName(event.target.value)}
            disabled={!isWorkerSelected}
            fullWidth
          />

          <Stack
            gap={0.2}
            sx={{
              ...responsivePanelListSx,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            className="assignments-product-list"
          >
            {filteredAvailableGenericProducts.length > 0 ? (
              filteredAvailableGenericProducts.map((product) => {
                const isActive = selectedGenericProduct?.id === product.id;

                return (
                  <ButtonBase
                    key={product.id}
                    className={`assignments-generic-row${isActive ? " is-active" : ""}`}
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
                        Consumible asignado al trabajador
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
                    sx={{ color: "#197c88", fontSize: 22 }}
                  />
                ),
                title:
                  availableGenericProductsAdjusted.length === 0
                    ? "No hay consumibles para retornar"
                    : "Sin resultados en consumibles",
                caption:
                  availableGenericProductsAdjusted.length === 0
                    ? "Este trabajador no tiene consumibles asignados pendientes."
                    : "Ajusta la busqueda para encontrar el consumible asignado.",
              })
            )}
          </Stack>
        </Stack>

        <Stack className="assignments-product-panel assignments-product-panel-items">
          <Stack sx={{ flex: 1, minHeight: 0 }} gap={1}>
            <Box className="assignments-product-panel-header">
              <Typography className="assignments-product-panel-title">
                {selectedGenericRemainingProduct
                  ? selectedGenericRemainingProduct.name
                  : "Selecciona un consumible"}
              </Typography>
              <Typography className="assignments-product-panel-caption">
                {selectedGenericRemainingProduct
                  ? `${selectedGenericRemainingProduct.quantity} unidades asignadas disponibles para retornar`
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
                      Asignado: {selectedGenericRemainingProduct.quantity}
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
                      label="Cantidad a retornar"
                      value={amountGeneric}
                      onChange={(event) =>
                        handleGenericAmountChange(Number(event.target.value))
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
                          amountGeneric >= selectedGenericRemainingProduct.quantity
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
                    "Escoge un consumible asignado para indicar cuanta cantidad va a retornar.",
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
  );

  const returnSummaryContent = !hasItemsToReturn ? (
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
      <Typography sx={{ color: "#38445d", fontWeight: 600, fontSize: 15 }}>
        Ningun item en el area de retorno
      </Typography>
      <Typography sx={{ color: "#60708c", fontSize: 12 }}>
        Selecciona productos asignados para preparar el retorno
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
            sx={returnPrepAccordionSx}
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
                            <CloseRoundedIcon sx={{ fontSize: 14 }} />
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
            sx={returnPrepAccordionSx}
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
  );

  return (
    <div className="returns-container">
      <div className="returns-grid">
        <div className="returns-header">
          <article className="returns-title-article">
            <h1>Retornos</h1>
            <p>Registra los elementos asignados que regresan al almacen</p>
          </article>
        </div>

        <div className="returns-section">
          <Card className="returns-card">
            <div className="returns-select-container">
              <Stack spacing={2}>
                <Autocomplete<SelectOption<Worker>>
                  size="small"
                  disablePortal
                  value={selectedOption}
                  isOptionEqualToValue={(worker, currentValue) =>
                    worker.value.id === currentValue.value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Selecciona un trabajador"
                    />
                  )}
                  options={workerOptions}
                  onChange={(_, worker) => {
                    setSelectedOption(worker);
                    setIsWorkerSelected(true);
                    handleWorkerChange(worker);
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
                      Selecciona un trabajador para cargar consumibles y productos.
                    </Alert>
                  </Box>
                )}

                <div className="tabs-container">
                  <Tabs
                    value={value}
                    onChange={handleTabsChange}
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
                      sx={{ padding: "0px", minHeight: "30px" }}
                      disabled={!isWorkerSelected}
                      {...a11yProps(0)}
                    />
                    {/* <Tab
                      label="Consumibles"
                      className="tab-pill"
                      sx={{ padding: "0px", minHeight: "30px" }}
                      disabled={!isWorkerSelected}
                      {...a11yProps(1)}
                    /> */}
                  </Tabs>
                </div>

                <CustomTabPanel value={value} index={0}>
                  {productsTabContent}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {consumablesTabContent}
                </CustomTabPanel>
              </Box>
            </div>
          </Card>
        </div>

        <div className="returns-footer">
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
              {returnSummaryContent}
            </Stack>

            <Button
              sx={{ ...appBlackButtonSx, width: "100%" }}
              variant="contained"
              color="primary"
              loading={returning}
              startIcon={returning ? undefined : <SaveOutlinedIcon />}
              onClick={handleReturn}
              disabled={returning || !isWorkerSelected || !hasItemsToReturn}
              type="button"
            >
              {returning ? "Guardando..." : "Guardar retorno"}
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
