
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CreateMenu, deleteMenu, getMenuById, TreeMenuItem, updateMenu } from "../service/menu.service";
import type { MenuItem } from '../../../interface/menu/Menu.interface';


const menuKeys = {
    list: () => ["menu", "list"] as const,
    tree: () => ["tree", "list"] as const,
    detail: (id: number) => ["menu", "detail", id] as const
}

export const useMenuQuery = () => {
    const qc = useQueryClient();

    // const listQuery = useQuery(
    //     {
    //         queryKey: menuKeys.list(),
    //         queryFn: getAllMenu
    //     }
    // );

    const createMut = useMutation(
        {
            mutationFn: (menu: MenuItem) => CreateMenu(menu),
            onSuccess: () => { qc.invalidateQueries({ queryKey: menuKeys.tree() }) }
        }
    )

    const updateMut = useMutation({
        mutationFn: ({ id, menu }: { id: number, menu: MenuItem }) => updateMenu({ id, menu }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: menuKeys.tree() }) }
    })


    const findById = (id: number) =>
        qc.fetchQuery({
            queryKey: menuKeys.detail(id),
            queryFn: () => getMenuById(id),
            staleTime: 0,
        });

    const deleteMut = useMutation({
        mutationFn: (id: number) => deleteMenu(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: menuKeys.tree() })
    })

    const treeMenuQuery = useQuery({
        queryKey: menuKeys.tree(),
        queryFn: TreeMenuItem
    })

    return {

        tree: treeMenuQuery.data ?? [],
        treeAll: treeMenuQuery.refetch,
        treeting: treeMenuQuery.isLoading,

        items: [],
        loading: true,
        // error: ,

        create: createMut.mutateAsync,
        creating: createMut.isPending,

        update: updateMut.mutateAsync,
        updating: updateMut.isPending,

        remove: deleteMut.mutateAsync,
        removing: deleteMut.isPending,

        findById
    }
}