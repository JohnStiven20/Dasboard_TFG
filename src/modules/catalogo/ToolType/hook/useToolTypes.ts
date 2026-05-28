import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createToolType, deleteToolType, getToolTypes, updateToolType } from '../service/tooltype.service'
import type { ToolTypeCreate, ToolTypeUpdate } from '../type/interface.tooltype'



export const useToolTypes = () => {

  const queryClient = useQueryClient()

  const toolTypesQuery = useQuery({
    queryKey: ['tool-types'],
    queryFn: getToolTypes
  })

  const createMutation = useMutation({
    mutationFn: (data: ToolTypeCreate) => createToolType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-types'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ToolTypeUpdate }) =>
      updateToolType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-types'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteToolType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-types'] })
    }
  })

  return {
    items: toolTypesQuery.data ?? [],
    isLoading: toolTypesQuery.isLoading,
    error: toolTypesQuery.error,

    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate
  }
}