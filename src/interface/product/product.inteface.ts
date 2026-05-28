export interface Product {
     id: number,
     name: string,
     description: string
}
export interface ProductGenericBasic {
     id: number,
     name: string,
     
}
export interface RequestCreateProductGeneric {
     id: number,
     amount: number,
}


export interface ResponseCreateProductGeneric {
     id: number,
     amount: number,
     dateTime: string
}

