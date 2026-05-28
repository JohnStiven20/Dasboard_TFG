import type { ProductGenericExitDTO } from "./ProductGenericExitDTO";
import type { ProductItemExitDTO } from "./ProductItemExitDTO";


export interface ProductExitDTO {

    productItemExitDTOs: ProductItemExitDTO[];
    productGenericExitDTOs: ProductGenericExitDTO[];
    
}
