import { http } from "../../../../api/http"
import type { ToolType } from "../../interface/toolType"
import type { ToolTypeCreate, ToolTypeUpdate } from "../type/interface.tooltype"



export const getToolTypes = async (): Promise<ToolType[]> => {
    const { data } = await http.get<ToolType[]>("/api/tool-types")
    return data
}

export const createToolType = async (
    toolType: ToolTypeCreate

): Promise<ToolType> => {

    const { data } = await http.post<ToolType>(
        "/api/tool-types",
        toolType
    )

    return data
}

export const updateToolType = async (
    id: number,
    toolType: ToolTypeUpdate
): Promise<ToolType> => {

    const { data } = await http.put<ToolType>(
        `/api/tool-types/${id}`,
        toolType
    )

    return data
}

export const deleteToolType = async (id: number): Promise<void> => {
    await http.delete(`/api/tool-types/${id}`)
}