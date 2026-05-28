import type { ProductItemDTO } from "../subject/assigment"

export interface DatamatrixProductItem {
    id: number,
    name: string,
    code: string
    date:string
}


export interface ProductItemComplex {
  items: ProductItemDTO[];
  productNames: string[];
}