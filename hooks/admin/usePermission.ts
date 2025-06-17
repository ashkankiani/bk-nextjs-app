import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { ShowPermission, UpdatePermission} from "@/api/apisAdmin";
import {TypeApiUpdatePermissionReq} from "@/types/typeApiAdmin";


function useShowPermission(id: number, Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['ShowPermission' , id],
        queryFn: () => ShowPermission({id}),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useUpdatePermission(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdatePermissionReq) => UpdatePermission(data),
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({queryKey: ['ShowPermission' , variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useShowPermission,
    useUpdatePermission
}
