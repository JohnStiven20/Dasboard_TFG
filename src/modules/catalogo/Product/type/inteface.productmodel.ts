import type { ProductType } from "../../interface/productType"

export interface ProductModel {
  id: number
  name: string
  description?: string
  kindId: number
  kindType: ProductType
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export interface ProductModelCreate{
  name: string
  description?: string
  kindId: number
}


export interface ProductModelUpdate {
  name?: string
  description?: string
  kindId?: number
}

export interface ProductModelObservationUpdate {
  observation?: string
}
