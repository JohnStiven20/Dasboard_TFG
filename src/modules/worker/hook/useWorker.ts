import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createWorker, deleteWorker, getAllWorkers, getWorkerById, updateWorker } from "../service/worker.service"
import type {
    WorkerCreatePayload,
    WorkerUpdatePayload,
} from "../../../interface/subject/subject";
import { useNotifications } from "../../../context/NotificationsContext";
import type { AxiosError } from "axios";


const WorkerKeys = {
    list: () => ["worker", "list"],
    worker: (workerid: number) => ["worker", "list", workerid],

}

export const useWorker = () => {

    const qc = useQueryClient();
    const notify = useNotifications()

    const createMut = useMutation({
        mutationFn: (worker: WorkerCreatePayload) => createWorker(worker),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: WorkerKeys.list() })
            notify.success("Trabajador creado exitosamente");
        },
        onError: (error: AxiosError) => {
            notify.error((error.response?.data as any)?.message || "Error al crear trabajador");
        }
    })

    const list = useQuery({
        queryFn: () => getAllWorkers(),
        queryKey: WorkerKeys.list()
    })

    const updateMut = useMutation({
        mutationFn: ({ workerid, worker }: { workerid: number, worker: WorkerUpdatePayload }) =>
            updateWorker(workerid, worker),
        onSuccess: () => { 
            qc.invalidateQueries({ queryKey: WorkerKeys.list() }) 
            notify.success("Trabajador actualizado exitosamente");
        },
        onError: () => {
            notify.error("Error al actualizar trabajador");
        }
    })

    const deleteMut = useMutation({
        mutationFn: (workerid: number) => deleteWorker(workerid),
        onSuccess: () => { 
            qc.invalidateQueries({ queryKey: WorkerKeys.list() }) 
            notify.success("Trabajador eliminado exitosamente");
        },
        onError: (error: AxiosError) => {
            notify.error((error.response?.data as any)?.message || "Error al eliminar trabajador");
        }
    })

    const useGetById = (workerId: number) =>
        useQuery({
            queryKey: WorkerKeys.worker(workerId),
            queryFn: () => getWorkerById(workerId),
            enabled: !!workerId
        });



    return {
        items: list.data ?? [],
        isloading: list.isLoading,
        error: list.error,
        create: createMut.mutateAsync,
        creating: createMut.isPending,
        update: updateMut.mutateAsync,
        updating: updateMut.isPending,
        remove: deleteMut.mutateAsync,
        deleteMut: deleteMut.isPending,
        useGetById
    }

}
