import { useMutation } from "@tanstack/react-query";
import {
    identifyProductByQr,
    createEntries as createEntriesRequest,
    type CreateEntriesPayload,
    getProductIdentifiersByProductModelName as getProductIdentifiersByProductModelNameRequest
} from "../service/entries.service";
import { useAppDispatch } from "../../../store/hooks";
import {
    clearPendingProductItems as clearPendingProductItemsAction,
    addPendingProductItem,
    removePendingProductItemAtIndex as removePendingProductItemAtIndexAction
} from "../../../store/entries/pendingProductItemsSlice";
import {
    clearPendingProductGenerics as clearPendingProductGenericsAction,
    addPendingProductGeneric,
    removePendingProductGenericAtIndex as removePendingProductGenericAtIndexAction,
    decrementPendingProductGeneric as decrementPendingProductGenericAction,
} from "../../../store/entries/pendingProductGenericsSlice";
import { syncEntriesCachedAt } from "../../../store/entries/actions";
import type { PendingProductGeneric } from "../interface/ProductGenericEntry";
import { useNotifications } from "../../../context/NotificationsContext";
import type { AxiosError } from "axios";



const useEntry = () => {

    const dispatch = useAppDispatch();
    const { notify } = useNotifications();

    const {
        mutateAsync: identifyProduct,
        isPending: isPendingIdentifyProduct,
    } = useMutation({
        mutationFn: async (qrCode: string) => {
            const identifiedProduct = await identifyProductByQr(qrCode);
            return identifiedProduct;
        }, onSuccess: (identifiedProduct) => {
            dispatch(addPendingProductItem(identifiedProduct));
            dispatch(syncEntriesCachedAt(Date.now()));
        }, onError: (event: AxiosError) => {
            const { response } = event;
            notify(`${response?.data}`, "error");
        }
    })

    const {
        mutateAsync: createEntries,
        isPending: isPendingCreateEntries,
        data: createEntriesResult,
        isSuccess: isSuccessCreateEntries,
        isError: isErrorCreateEntries,
        error: createEntriesError,
    } = useMutation({
        mutationFn: async (entries: CreateEntriesPayload) => {
            const wereEntriesCreated = await createEntriesRequest(entries);
            return wereEntriesCreated;
        }, onSuccess: () => {
            notify("Ingreado correctamente", "success");
        }, onError: (event) => {
            notify(event.message, "error");
        }
    })

    const {
        mutateAsync: getProductIdentifiersByProductModelName,
        isPending: isPendingGetProductIdentifiersByProductModelName,
    } = useMutation({
        mutationFn: async (name: string) => {
            const productIdentifiers = await getProductIdentifiersByProductModelNameRequest(name);
            return productIdentifiers;
        }, onError: (event) => {
            notify(event.message, "error");
        }
    })

    const addPendingGenericProduct = (pendingProductGeneric: PendingProductGeneric) => {
        dispatch(addPendingProductGeneric(pendingProductGeneric));
        dispatch(syncEntriesCachedAt(Date.now()));
    }

    const removePendingProductItemAtIndex = (id: number) => {
        dispatch(removePendingProductItemAtIndexAction(id));
        dispatch(syncEntriesCachedAt(Date.now()));
    }

    const removePendingProductGenericAtIndex = (id: number) => {
        dispatch(removePendingProductGenericAtIndexAction(id));
        dispatch(syncEntriesCachedAt(Date.now()));
    }

    const decrementPendingProductGeneric = (id: number) => {
        dispatch(decrementPendingProductGenericAction(id));
        dispatch(syncEntriesCachedAt(Date.now()));
    }

    const clearPendingEntries = () => {
        dispatch(clearPendingProductItemsAction());
        dispatch(clearPendingProductGenericsAction());
        dispatch(syncEntriesCachedAt(null));
    }

    return {
        isPendingIdentifyProduct,
        identifyProduct,
        createEntries,
        isPendingCreateEntries,
        createEntriesResult,
        isSuccessCreateEntries,
        isErrorCreateEntries,
        createEntriesError,
        addPendingGenericProduct,
        removePendingProductItemAtIndex,
        decrementPendingProductGeneric,
        removePendingProductGenericAtIndex,
        clearPendingEntries,
        getProductIdentifiersByProductModelName,
        isPendingGetProductIdentifiersByProductModelName,
    }

}

export default useEntry;
