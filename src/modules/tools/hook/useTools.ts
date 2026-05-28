import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createTool,
    getAllTools,
    getToolById,
    updateTool,
    deleteTool,

} from "../service/tools.service";
import type { ToolCreateDTO, ToolUpdateDTO } from "../../../interface/tools/tools.interface";

const toolKeys = {
    list: () => ["tools", "list"] as const,
    detail: (id: number) => ["tools", "detail", id] as const
};

export const useTools = () => {

    const qc = useQueryClient();

    const listQuery = useQuery({
        queryKey: toolKeys.list(),
        queryFn: getAllTools
    });

    const createMut = useMutation({
        mutationFn: (data: ToolCreateDTO) => createTool(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: toolKeys.list() });
        }
    });

    const updateMut = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ToolUpdateDTO }) =>
            updateTool(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: toolKeys.list() });
        }
    });

    const deleteMut = useMutation({
        mutationFn: (id: number) => deleteTool(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: toolKeys.list() });
        }
    });

    const findById = (id: number) =>
        qc.fetchQuery({
            queryKey: toolKeys.detail(id),
            queryFn: () => getToolById(id),
            staleTime: 0
        });


    return {

        tools: listQuery.data ?? [],
        loading: listQuery.isLoading,
        error: listQuery.error,

        create: createMut.mutateAsync,
        creating: createMut.isPending,

        update: updateMut.mutateAsync,
        updating: updateMut.isPending,

        remove: deleteMut.mutateAsync,
        removing: deleteMut.isPending,

        refetch: listQuery.refetch,
        findById
    };
};