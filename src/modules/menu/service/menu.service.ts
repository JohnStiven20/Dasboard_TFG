import { http } from "../../../api/http"
import type { MenuItem, MenuItemDTO } from "../../../interface/menu/Menu.interface"


export const CreateMenu = async (menu: MenuItem): Promise<MenuItem> => {
    const { data } = await http.post<MenuItem>("api/menuItem",
        {
            label: menu.label,
            icon: menu.icon,
            route: menu.route,
            sortOrder: 1,
            parentId: menu.parentId !== undefined && menu.parentId !== undefined ? Number(menu.parentId) : undefined
        }
    )
    return data;
}


export const getAllMenu = async (): Promise<MenuItem[]> => {
    const { data } = await http.get<MenuItem[]>("api/menuItem");
    return data
}


export const updateMenu = async ({ id, menu }: { id: number, menu: MenuItem }): Promise<MenuItem[]> => {
    const { data } = await http.put<MenuItem[]>(`api/menuItem/${id}`,
        {
            label: menu.label,
            icon: menu.icon,
            route: menu.route,
            sortOrder: 1,
            parentId: menu.parentId !== undefined && menu.parentId !== undefined ? Number(menu.parentId) : undefined
        }
    );
    return data
}


export const deleteMenu = async (id: number) => {
    await http.delete(`api/menuItem/${id}`)
}


export const getMenuById = async (id: number): Promise<MenuItem> => {
    const { data } = await http.get<MenuItem>(`api/menuItem/${id}`);
    return data;
}

export const TreeMenuItem = async (): Promise<MenuItemDTO[]> => {
    const { data } = await http.get<MenuItemDTO[]>("/api/menuItem/tree");
    return data
}
