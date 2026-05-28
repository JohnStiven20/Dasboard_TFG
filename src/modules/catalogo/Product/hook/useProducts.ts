
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProductModels,
  createProductModel,
  updateProductModel,
  updateProductModelObservation,
  deleteProductModel,
} from '../service/productmodel.service';
import type {
  ProductModelCreate,
  ProductModelObservationUpdate,
  ProductModelUpdate,
} from '../type/inteface.productmodel';




export const useProducts = () => {

  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProductModels
  })

  const createMutation = useMutation({
    mutationFn: (data: ProductModelCreate) => createProductModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductModelUpdate }) =>
      updateProductModel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateObservationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductModelObservationUpdate }) =>
      updateProductModelObservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProductModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })


  return {
    items: productsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,

    create: createMutation.mutate,
    update: updateMutation.mutate,
    updateObservation: updateObservationMutation.mutate,
    remove: deleteMutation.mutate
  }

}
