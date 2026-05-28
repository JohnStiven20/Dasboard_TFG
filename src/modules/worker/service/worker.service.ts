import { http } from "../../../api/http";
import type {
    Worker,
    WorkerCreatePayload,
    WorkerUpdatePayload,
} from "../../../interface/subject/subject";
import type { AssignedProductItemsByModel } from "../../profile/interfaces/assignedProductItems";



export async function createWorker(worker: WorkerCreatePayload): Promise<Worker> {
    const { data } = await http.post("api/worker", worker);
    return data;
}


export async function getAllWorkers(): Promise<Worker[]> {
    const { data } = await http.get("api/worker/all");
    return data;
}


export async function getWorkerById(id: number): Promise<Worker> {
    const { data } = await http.get(`api/worker/${id}`);
    return data;
}


export async function updateWorker(
    id: number,
    worker: WorkerUpdatePayload
): Promise<Worker> {
    const { data } = await http.put(`api/worker/${id}`, worker);
    return data;
}


export async function deleteWorker(id: number): Promise<boolean> {
    await http.delete(`api/worker/${id}`);
    return true;
}

export async function getAssignedProductItemsByWorker(
    id: number
): Promise<AssignedProductItemsByModel[]> {
    const { data } = await http.get<AssignedProductItemsByModel[]>(
        `api/worker/${id}/assigned-product-items`
    );

    return data ?? [];
}
