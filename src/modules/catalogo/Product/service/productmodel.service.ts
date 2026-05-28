import { http } from "../../../../api/http"
import type {
  ProductModel,
  ProductModelCreate,
  ProductModelObservationUpdate,
  ProductModelUpdate,
} from "../type/inteface.productmodel"


export const getProductModels = async (): Promise<ProductModel[]> => {
  const { data } = await http.get<ProductModel[]>("/api/product-models")
  return data
}

export const getProductModelById = async (id: number): Promise<ProductModel> => {
  const { data } = await http.get<ProductModel>(`/api/product-models/${id}`)
  return data
}

export const getUnitProductModels = async (): Promise<ProductModel[]> => {
  const { data } = await http.get<ProductModel[]>("/api/product-models/units")
  return data
}


export const createProductModel = async (
  productModel: ProductModelCreate
): Promise<ProductModel> => {


   console.log(productModel)

  const { data } = await http.post<ProductModel>(
    "/api/product-models",
    productModel
  )
  return data
}

export const updateProductModel = async (
  id: number,
  productModel: ProductModelUpdate
): Promise<ProductModel> => {

  const { data } = await http.put<ProductModel>(
    `/api/product-models/${id}`,
    productModel
  )
  return data
}

export const updateProductModelObservation = async (
  id: number,
  payload: ProductModelObservationUpdate
): Promise<ProductModel> => {
  const { data } = await http.put<ProductModel>(
    `/api/product-models/${id}/observations`,
    {
      observation: payload.observation ?? "",
    }
  )
  return data
}

export const deleteProductModel = async (id: number): Promise<void> => {
  await http.delete(`/api/product-models/${id}`)
}
