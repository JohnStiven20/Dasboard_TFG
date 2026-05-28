import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPermissions, deletePermissions, getAllPermissons, getPermissionById, updatePermissions } from "../service/permissions.service";

import type { Permission } from "../../../interface/permisssion/permission.interface";
import type { AccountPermsion } from "../../account/ui/accountForm.ui";
import { useMemo } from "react";

const permissionsKeys = {
  list: () => ["permissions", "list"] as const,
  detail: (id: number) => ["permissions", "detail", id] as const,
};

export const usePermissionsQuery = () => {

  const qc = useQueryClient();

  const listQuery = useQuery(
    {
      queryKey: permissionsKeys.list(),
      queryFn: getAllPermissons
    }
  );


  const findById = (id: number) =>
    qc.fetchQuery({
      queryKey: permissionsKeys.detail(id),
      queryFn: () => getPermissionById(id),
      staleTime: 0,
    });

  const createMut = useMutation({
    mutationFn: (menu: Permission) => createPermissions(menu),
    onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.list() })
  })

  const updateMut = useMutation({
    mutationFn: ({ id, permission }: { id: number; permission: Permission }) => updatePermissions(id, permission),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: permissionsKeys.list() });
      qc.invalidateQueries({ queryKey: permissionsKeys.detail(vars.id) });
    }
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deletePermissions(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.list() })
  })


  const itemPermissionAccount = useMemo<AccountPermsion[]>(() => {
    const data = listQuery.data ?? [];
    return data
      .filter((e): e is typeof e & { id: NonNullable<typeof e.id> } => e.id != null)
      .map((e) => ({
        id: e.id,
        permission: e.name,
        isActive: false,
      }));
  }, [listQuery.data]);



  return {
    items: listQuery.data ?? [],
    itemPermissionAccount: itemPermissionAccount,
    isloading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    findById,

    create: createMut.mutateAsync,
    creating: createMut.isPending,

    update: updateMut.mutateAsync,
    updating: updateMut.isPending,

    remove: deleteMut.mutateAsync,
    removing: deleteMut.isPending,

  }
}


