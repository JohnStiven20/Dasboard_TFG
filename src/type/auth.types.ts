export interface MenuItemTree {
    id: string;
    label: string;
    route: string;
    icon: string;
    children: MenuItemTree[] | null;
}

export interface LoginResponse {
    id: number;
    username: string;
    token: string;
    tree: MenuItemTree[];
}


export interface AuthState {
    token: string | null;
    id: number;
    username: string;
    icon?: string;
    tree: MenuItemTree[];
    routes: string[];
    expiresAT: number | null
    typeAccount: string
}