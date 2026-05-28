import type { MenuItemDTO } from "../menu/Menu.interface";

export interface LoginResponse {
    id: number;
    username: string;
    token: string;
    routes: string[];
    tree: MenuItemDTO[];
}