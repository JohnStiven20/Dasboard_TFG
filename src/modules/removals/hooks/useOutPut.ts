import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  exitGenericProduct,
  exitProduct,
  findByDataMatrixItemByDate,
  findDataMatrixItemByProduct,
  markAsBroken,
  scanOutputProduct,
} from "../service/outputService";
import type { ProductExitDTO } from "../interface/ProductExitDTO";
import { useNotifications } from "../../../context/NotificationsContext";

export interface remarks {
  id: number;
  remarks: string;
}

const getAxiosErrorMessage = (
  error: AxiosError,
  fallback: string,
): string => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim().length > 0) {
    return responseData;
  }

  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "message" in responseData
  ) {
    const message = (responseData as { message?: unknown }).message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallback;
};

export const useOutputProduct = () => {

  const { notify} = useNotifications();
  
  const {mutateAsync: exitProductMut, isPending: isPendingExitProduct} = useMutation({
    mutationFn: (productExitDTO: ProductExitDTO) => exitProduct(productExitDTO),
    onSuccess: () => {
      notify("Salida registrada correctamente", "success");
    },
    onError: (error: AxiosError) => {
      notify(getAxiosErrorMessage(error, "Error al registrar la salida"), "error");
    }
  });

  const fetchOutputProductMut = useMutation({
    mutationFn: (scanner: string) => scanOutputProduct(scanner),
    onError: (error: AxiosError) => {
      notify(getAxiosErrorMessage(error, "Error al registrar la salida"), "error");
    }
  });

  const markAsBrokenMut = useMutation({
    mutationFn: ({ id, remarks }: remarks) => markAsBroken(id, remarks),
  });

  const listDatamatrixitemByProductMut = useMutation({
    mutationFn: (productid: number) => findDataMatrixItemByProduct(productid),
  });

  const listDatamatrixItemByDateMut = useMutation({
    mutationFn: () => findByDataMatrixItemByDate(),
  });

  const listQuery = useQuery({
    queryKey: ["itemsProduct"],
    queryFn: () => findByDataMatrixItemByDate(),
  });

  const exitGenericProductMut = useMutation({
    mutationFn: ({
      genericProductId,
      amount,
      reason,
    }: {
      genericProductId: number;
      amount: number;
      reason: string;
    }) => exitGenericProduct(genericProductId, amount, reason),
  });

  return {
    exitProduct: exitProductMut,
    isPendingExitProduct: isPendingExitProduct,
    fetchOutputProduct: fetchOutputProductMut.mutateAsync,
    isPendingFetchOutputProduct: fetchOutputProductMut.isPending,
    fechmarkAsBroken: markAsBrokenMut.mutateAsync,
    isPendingMarkAsBroken: markAsBrokenMut.isPending,
    listDatamatrixitemByProduct: listDatamatrixitemByProductMut.data ?? [],
    findDataMatrixItemByProduct: listDatamatrixitemByProductMut.mutateAsync,
    isPendingFindDataMatrixItemByProduct:listDatamatrixitemByProductMut.isPending,
    listDatamatrixItemByDate: listQuery.data ?? { items: [], productNames: [] },
    isLoadingDatamatrixItemByDate: listQuery.isLoading,
    findDatamatrixItemByDate: listDatamatrixItemByDateMut.mutateAsync,
    isPendingFindDatamatrixItemByDate: listDatamatrixItemByDateMut.isPending,
    exitGenericProduct: exitGenericProductMut.mutateAsync,
    isPendingExitGenericProduct: exitGenericProductMut.isPending,
  };
};
