

import { http } from "../../../api/http";
import type { ToolCreateDTO,  Tool as ToolDTO , ToolUpdateDTO } from "../../../interface/tools/tools.interface";


const BASE_URL = "api/tools";


export const createTool = async (data: ToolCreateDTO): Promise<ToolDTO> => {
    const response = await http.post<ToolDTO>(BASE_URL, data);
    return response.data;
};


export const getAllTools = async (): Promise<ToolDTO[]> => {
    const response = await http.get<ToolDTO[]>(BASE_URL);
    return response.data;
};


export const getToolById = async (id: number): Promise<ToolDTO> => {
    const response = await http.get<ToolDTO>(`${BASE_URL}/${id}`);
    return response.data;
};


export const updateTool = async (
    id: number,
    data: ToolUpdateDTO
): Promise<ToolDTO> => {
    const response = await http.put<ToolDTO>(`${BASE_URL}/${id}`, data);
    return response.data;
};


export const deleteTool = async (id: number): Promise<void> => {
    await http.delete(`${BASE_URL}/${id}`);
};