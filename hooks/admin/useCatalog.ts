import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AddCatalog, DeleteCatalog, GetCatalogs} from "@/api/apisAdmin";
import {TypeApiAddCatalogReq, TypeApiDeleteCatalogReq} from "@/types/typeApi";


function useGetCatalogs(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetCatalogs'],
        queryFn: () => GetCatalogs(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}


function useAddCatalog(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiAddCatalogReq) => AddCatalog(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetCatalogs']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useDeleteCatalog(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiDeleteCatalogReq) => DeleteCatalog(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetCatalogs']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

export {
    useGetCatalogs,
    useAddCatalog,
    useDeleteCatalog,
}
