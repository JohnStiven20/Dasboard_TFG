import { useMutation, useQuery } from "@tanstack/react-query"
import { assignPermissionsToMenuItem, getMenuItemsByPermissionId } from "../service/menuItemPermission.service"
import { useMemo } from "react";



export const useMenuItemsTreeByPermission = (permissionId?: number) => {


     const assignPermissionsToMenu = useMutation({
          mutationFn: ({
               permissionId,
               menuitemsids,
          }: {
               permissionId: number;
               menuitemsids: number[];
          }) => assignPermissionsToMenuItem(permissionId, menuitemsids),

     });

     const menuQuery = useQuery({
          queryKey: ["menu-items-by-permission", permissionId],

          queryFn: async () => {
               if (!permissionId) return [];
               console.log(permissionId)
               return await getMenuItemsByPermissionId(permissionId);
          },
          enabled: !!permissionId,
     });

     const menus = useMemo(
          () => menuQuery.data?.map(e => String(e.id)) ?? [],
          [menuQuery.data]
     );

     return {
          menus: menus ?? [],
          isLoading: menuQuery.isLoading,
          refetch: menuQuery.refetch,
          assignPermissionsToMenu: assignPermissionsToMenu.mutateAsync,
     };
};


