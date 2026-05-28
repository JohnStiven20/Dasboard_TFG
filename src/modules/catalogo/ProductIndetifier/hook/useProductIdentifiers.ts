import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIdentifier,
  deleteIdentifier,
  getAllIdentifiers,
  getIdentifiersByModel,
  updateIdentifier,
} from "../service/productIdentifier.service";
import type {
  ProductIdentifier,
  ProductIdentifierCreate,
  ProductIdentifierUpdate,
} from "../type/productIdentifier.interface";

export const useProductIdentifiers = (productModelId: number | undefined) => {
  const queryClient = useQueryClient();
  const byModelKey = ["product-identifiers", "by-model", productModelId];
  const allKey = ["product-identifiers", "all"];

  // Query by-model: devuelve { productModelId, productModelName, identifiers: string[] }
  const byModelQuery = useQuery({
    queryKey: byModelKey,
    queryFn: () => getIdentifiersByModel(productModelId!),
    enabled: productModelId !== undefined,
    staleTime: 0,
  });

  // Query lista completa con IDs: para poder hacer PUT/DELETE por id
  const allQuery = useQuery({
    queryKey: allKey,
    queryFn: getAllIdentifiers,
    enabled: productModelId !== undefined,
    staleTime: 0,
  });

  // Cruzar: identificadores con id del modelo actual
  const identifiers: ProductIdentifier[] = (() => {
    const allData = allQuery.data ?? [];
    const byModelCodes = new Set(byModelQuery.data?.identifiers ?? []);

    const fromAll = allData.filter((i) => i.productModelId === productModelId);

    // Si el endpoint /all devuelve datos, usarlos
    if (fromAll.length > 0) return fromAll;

    // Fallback: construir objetos "parciales" sin id real (id=-1)
    // útil mientras el endpoint /all no esté disponible
    return [...byModelCodes].map((code, idx) => ({
      id: -(idx + 1),
      code,
      productModelId: productModelId ?? 0,
    }));
  })();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: byModelKey });
    void queryClient.invalidateQueries({ queryKey: allKey });
  };

  const createMutation = useMutation({
    mutationFn: (data: ProductIdentifierCreate) => createIdentifier(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductIdentifierUpdate }) =>
      updateIdentifier(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIdentifier(id),
    onSuccess: invalidate,
  });

  return {
    byModel: byModelQuery.data,
    identifiers,
    isLoading: byModelQuery.isLoading,
    error: byModelQuery.error,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    remove: deleteMutation.mutate,
    isRemoving: deleteMutation.isPending,
  };
};
