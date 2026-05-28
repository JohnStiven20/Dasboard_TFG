import { useMutation } from "@tanstack/react-query"
import { returnStockofWorker } from "../service/return.service";
import type { ReturnAssignment } from "../interfaces/return.interface";


export const useReturn = () => {

    const returnMut = useMutation({
        mutationFn: (request: ReturnAssignment) => returnStockofWorker(request),
    });


    return {
        returnStock: returnMut.mutateAsync,
        returning: returnMut.isPending,
    }

}