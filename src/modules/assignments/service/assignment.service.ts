import { http } from "../../../api/http"
import type { AssignmentByWorkerRequest, AssignmetResponse, WorkerStockDTO } from "../../../interface/subject/assigment";




export const createAssigemntWorkToConsumible = async (workerid: number, dataMatrixItemid: number[]): Promise<AssignmetResponse> => {
       const { data } = await http.post<AssignmetResponse>("/api/assignment", {
              workerid: workerid,
              dataMatrixItemid: dataMatrixItemid
       });

       return data
}


export const getAssignmentsByWorker = async (
       workerId: number,
): Promise<WorkerStockDTO> => {
       const { data } = await http.post<WorkerStockDTO>(`/api/assignment/worker`, {
              workerid: workerId,
       });
       return data;
};


export const assignmentProductGenericToWorker = async (workerId: number, genericProductid: number, amount: number) => {
       await http.post<void>("/api/assignment/generic", {
              workerid: workerId,
              genericproductid: genericProductid,
              amount: amount
       });
}



export const assignmentsToWorker = async (assignment: AssignmentByWorkerRequest) => {
       await http.post<void>("/api/assignment", {
              workerId: assignment.workerId,
              specificProductItemIds: assignment.specificProductItemIds,
              genericProductIds: assignment.genericProductIds.map((e) => {
                     return {
                            genericProductId: e.id,
                            quantity: e.quantity
                     }
              }),
              toolsIds: assignment.toolsIds,
       });
}


export const returnStockToWherouse = async (assignment: AssignmentByWorkerRequest) => {
       await http.post<void>("/api/assignment/return ", {
              workerId: assignment.workerId,
              specificProductItemIds: assignment.specificProductItemIds,
              genericProductIds: assignment.genericProductIds.map((e) => {
                     return {
                            genericProductId: e.id,
                            quantity: e.quantity
                     }
              }),
              toolsIds: assignment.toolsIds,
       });
}