
import { http } from "../api/http";



export async function SearchEntityService<T>(search: string, entity: string): Promise<T[]> {
    const response = await http.post<T>(`api/${entity}/search`, { fieldName: search })
    return response.data as T[];;
}