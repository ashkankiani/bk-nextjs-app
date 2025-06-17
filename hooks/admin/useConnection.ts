import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {GetConnections, UpdateConnection} from "@/api/apisAdmin";
import {TypeApiUpdateConnectionReq} from "@/types/typeApiAdmin";


function useGetConnections(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetConnections'],
        queryFn: () => GetConnections(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}


function useUpdateConnection(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateConnectionReq) => UpdateConnection(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetConnections']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useGetConnections,
    useUpdateConnection
}
