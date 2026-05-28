import { Box, Container, Stack } from "@mui/material";
import { useCallback, useContext, useDeferredValue, useEffect, useState, type SyntheticEvent } from "react";
import { CustomTabPanel } from "../../assignments/components/Tabs";
import { ScannerContext } from "../../../context/ScannerContext";
import { useNotifications } from "../../../context/NotificationsContext";
import { InventoryHeader } from "../components/InventoryHeader";
import { InventoryModelsTab } from "../components/InventoryModelsTab";
import { InventoryModelProductsView } from "../components/InventoryModelProductsView";
import { InventoryProductDetailDialog } from "../components/InventoryProductDetailDialog";
import { InventoryTabsNavigation } from "../components/InventoryTabsNavigation";
import { useInventoryModelProducts } from "../hooks/useInventoryModelProducts";
import { useInventoryModels } from "../hooks/useInventoryModels";
import type { InventoryModelProduct } from "../interfaces/inventoryModelProducts";
import type { InventoryScannedProduct } from "../interfaces/inventoryScannedProduct";
import type { InventoryModelSummary } from "../interfaces/inventoryModelSummary";
import { scanInventoryProduct } from "../services/inventory.service";

const InventoryPage = () => {
  const { lastScan, clearScan } = useContext(ScannerContext);
  const { notify } = useNotifications();
  const [tab, setTab] = useState(0);
  const [selectedModel, setSelectedModel] = useState<InventoryModelSummary | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<InventoryModelProduct | null>(
    null,
  );
  const [prefetchedProductData, setPrefetchedProductData] =
    useState<InventoryScannedProduct | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productPage, setProductPage] = useState(0);
  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const deferredProductSearch = useDeferredValue(productSearch.trim());

  const { items, isLoading, isError, error } = useInventoryModels();
  const {
    data: modelProductsResponse,
    isLoading: isLoadingModelProducts,
    isFetching: isFetchingModelProducts,
    isError: isErrorModelProducts,
    error: modelProductsError,
  } = useInventoryModelProducts({
    modelId: selectedModel?.modelId,
    search: deferredProductSearch,
    page: productPage,
    limit: 20,
  });

  const handleSelectModel = (model: InventoryModelSummary) => {
    setSelectedModel(model);
    setProductSearch("");
    setProductPage(0);
  };

  const handleSelectProduct = (product: InventoryModelProduct) => {
    setPrefetchedProductData(null);
    setSelectedProduct(product);
  };

  const handleBackToModels = () => {
    setSelectedModel(null);
    setSelectedProduct(null);
    setPrefetchedProductData(null);
    setProductSearch("");
    setProductPage(0);
  };

  const handleInventoryScan = useCallback(

    async (scan: string) => {
      
      const trimmedCode = scan.trim();

      if (trimmedCode.length !== 32) {
        return;
      }

      const scannedProduct = await scanInventoryProduct(trimmedCode);

      setPrefetchedProductData(scannedProduct);
      setSelectedProduct({
        productId: scannedProduct.productId,
        mac: scannedProduct.mac,
        productIdentifierCode: scannedProduct.detail.productIdentifierCode,
        status: scannedProduct.detail.status,
      });
      
      notify(`Producto ${scannedProduct.mac} encontrado`, "success");
    },
    [notify],
  );

  useEffect(() => {

    if (!lastScan) {
      return;
    }

    void (async () => {
      try {
        await handleInventoryScan(lastScan);
      } catch {
        notify("No se encontro un producto valido para ese codigo", "error");
      } finally {
        clearScan();
      }
    })();
  }, [clearScan, handleInventoryScan, lastScan, notify]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "0.75rem",
        width: "min(700px, 100%)",
        minWidth: 0,
      }}
      component="main"
    >
      <InventoryHeader />

      <Box component="section">
        <InventoryTabsNavigation tab={tab} onChange={handleTabChange} />

        <Stack component="article">
          <CustomTabPanel value={tab} index={0}>
            {selectedModel ? (
              <InventoryModelProductsView
                model={selectedModel}
                searchValue={productSearch}
                onSearchChange={(value) => {
                  setProductSearch(value);
                  setProductPage(0);
                }}
                onBack={handleBackToModels}
                onPageChange={setProductPage}
                onSelectProduct={handleSelectProduct}
                response={modelProductsResponse}
                isLoading={isLoadingModelProducts}
                isFetching={isFetchingModelProducts}
                isError={isErrorModelProducts}
                errorMessage={
                  modelProductsError instanceof Error
                    ? modelProductsError.message
                    : undefined
                }
              />
            ) : (
              <Stack>
                <InventoryModelsTab
                  items={items}
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage={error instanceof Error ? error.message : undefined}
                  onSelectModel={handleSelectModel}
                />
              </Stack>
            )}
          </CustomTabPanel>
        </Stack>
      </Box>

      <InventoryProductDetailDialog
        open={selectedProduct !== null}
        product={selectedProduct}
        prefetchedDetail={prefetchedProductData?.detail ?? null}
        prefetchedHistory={prefetchedProductData?.history ?? null}
        onClose={() => {
          setSelectedProduct(null);
          setPrefetchedProductData(null);
        }}
      />
    </Container>
  );
};

export default InventoryPage;
