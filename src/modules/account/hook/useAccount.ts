import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAccount, deleteAaccount, findByAccountid, geallAccount, updateAccountPartial } from "../service/account.service";
import type { Account } from "../interface/account";


const accountKeys = {
    list: () => ["account", "list"],
    detail: (id: number) => ["account", "list", id]
}

export const useAccount = () => {

    const qc = useQueryClient();

    const createMut = useMutation({
        mutationFn: (account: Account) => createAccount(account),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: accountKeys.list()});
        },
    });

    const findById = (id: number) =>
        qc.fetchQuery({
            queryKey: accountKeys.detail(id),
            queryFn: () => findByAccountid(id),
            staleTime: 0,
        });

    const updateMut = useMutation({
        mutationFn: ({ id, account }: { id: number; account: Account }) => {
            return updateAccountPartial(id, account);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: accountKeys.list() });
        },
    });

    const deleteMut = useMutation({
        mutationFn: (id: number) => deleteAaccount(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.list() })
    })

    const list = useQuery({
        queryKey: accountKeys.list(),
        queryFn: geallAccount,
    });

    return {
        create: createMut.mutateAsync,
        creating: createMut.isPending,

        items: list.data ?? [],
        isLoading: list.isLoading,

        update: updateMut.mutateAsync,
        updating: updateMut.isPending,

        remove: deleteMut.mutateAsync,
        deleting: deleteMut.isPending,

        findById,
    }


}
