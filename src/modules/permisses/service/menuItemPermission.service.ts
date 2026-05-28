import { http } from "../../../api/http";
import type { MenuItemDTO } from "../../../interface/menu/Menu.interface";


const BASE = "/api/menuItem-permission";


export async function assignPermissionsToMenuItem(
    permissionid: number,
    menuItemIds: number[]
): Promise<void> {
    await http.post(`${BASE}/assign/${permissionid}`, menuItemIds);
}

export async function getMenuItemsByPermissionId(
    permissionId: number
): Promise<MenuItemDTO[]> {
    const { data } = await http.get<MenuItemDTO[]>(
        `${BASE}/menuItems/by-permission/${permissionId}`
    );
    return data;
}
