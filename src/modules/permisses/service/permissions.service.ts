import { http } from "../../../api/http";

import type { Permission } from "../../../interface/permisssion/permission.interface";


export async function createPermissions(permission: Permission): Promise<Permission> {
    const { data } = await http.post("api/permission", {
        name: permission.name,
        description: permission.description
    });

    return data;
}


export async function getAllPermissons(): Promise<Permission[]> {
    const { data } = await http.get("api/permission");
    return data;
}


export async function getPermissionById(id: number): Promise<Permission> {
    const { data } = await http.get(`api/permission/${id}`);
    return data;
}

export async function updatePermissions(id: number, permission: Permission): Promise<Permission> {
    const { data } = await http.put(`api/permission/${id}`, {
        name: permission.name,
        description: permission.description

    });
    return data;
}

export async function deletePermissions(id: number): Promise<boolean> {
    await http.delete(`api/permission/${id}`);
    return true
}