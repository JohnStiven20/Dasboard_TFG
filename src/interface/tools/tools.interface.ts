export interface ToolCreateDTO {
    name: string;
    description?: string;
}

export interface ToolUpdateDTO {
    name?: string;
    description?: string;
}

export interface Tool {
    id: number;
    name: string;
    description?: string;
}

