import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignPermissionToAccount, getPermissionsByAccount, removePermissionFromAccount } from "../service/accountpermission.service";
import type { AccountPermsion } from "../ui/accountForm.ui";


type Vars = { permissionid: number; accountid: number };
const EMPTY_PERMISSIONS: AccountPermsion[] = [];

const accountPermissionKeys = {
    list: () => ["accountpermission", "list"],
    detail: (id: number) => ["accountpermission", "list", id]
}


export const useAccountPermission = (accountid?: number) => {
    
    const qc = useQueryClient();

    const assignPermissionMut = useMutation({
        mutationFn: ({ permissionid, accountid }: Vars) =>
            assignPermissionToAccount(permissionid, accountid),
        onSuccess: (_data, { accountid }) => {
            qc.invalidateQueries({ queryKey: accountPermissionKeys.detail(accountid) });
        },
    });

    const removePermissionMut = useMutation({
        mutationFn: ({ permissionid, accountid }: Vars) =>
            removePermissionFromAccount(permissionid, accountid),
        onSuccess: (_data, { accountid }) => {
            qc.invalidateQueries({ queryKey: accountPermissionKeys.detail(accountid) });
        },
    });

    const getPermissionsMut = useMutation({
        mutationFn: (accountid: number) => getPermissionsByAccount(accountid),
    })

    const {
        data,
        isLoading,
        isFetching,
        refetch,
        error,
    } = useQuery({
        queryKey: accountPermissionKeys.detail(accountid ?? -1),
        queryFn: () => getPermissionsByAccount(accountid!), // ! porque enabled controla nulos
        enabled: accountid != null, 
        staleTime: 0,
    });


    return {

        items: data ?? EMPTY_PERMISSIONS,
        isLoading,
        isFetching,
        error,
        refetch,

        assignPermission: assignPermissionMut.mutateAsync,
        removePermission: removePermissionMut.mutateAsync,

        getPermissions: getPermissionsMut.mutateAsync,
        // Opcional: flags de estado
        isAssigning: assignPermissionMut.isPending,
        isRemoving: removePermissionMut.isPending,
        assignError: assignPermissionMut.error,
        removeError: removePermissionMut.error,
    };
};
