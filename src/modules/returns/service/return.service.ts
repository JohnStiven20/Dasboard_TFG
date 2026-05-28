import { http } from "../../../api/http"

import type { ReturnAssignment } from "../interfaces/return.interface";

export const returnDatamatrixItems = async (
    workerId: number,
    productItemIds: number[]
): Promise<void> => {
    await http.post("/api/assignment/return/product", {
        workerId,
        productItemIds,
    });
};


export const returnGeneric = async (
    workerid: number,
    genericproductid: number,
    amount: number
): Promise<void> => {
    await http.post("/api/assignment/return/generic", {
        workerid,
        genericproductid,
        amount
    });
};


export const returnStockofWorker = async (
    request: ReturnAssignment

): Promise<void> => {
    await http.post("/api/assignment/return", {
        workerId: request.workerId,
        productItemIds: request.productItemIds,
        productGenerics: request.productGenerics,
        toolIds: request.toolIds,
    });
};