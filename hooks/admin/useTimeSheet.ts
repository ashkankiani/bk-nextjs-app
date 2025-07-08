import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AddTimeSheet, DeleteTimeSheet, ShowTimeSheet, UpdateTimeSheet} from "@/api/apisAdmin";
import {TypeApiAddTimeSheetReq, TypeApiDeleteTimeSheetReq, TypeApiUpdateTimeSheetReq} from "@/types/typeApiAdmin";



function useShowTimeSheet(id: number, Optional?: object) {
    const {data, isLoading, isFetched, refetch} = useQuery({
        queryKey: ['ShowTimeSheet' , id],
        queryFn: () => ShowTimeSheet({id}),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
        refetch,
    }
}

function useAddTimeSheet(Optional?: object) {
    // const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiAddTimeSheetReq) => AddTimeSheet(data),
        onSuccess: () => {
            // client.invalidateQueries({queryKey: ['GetTimeSheets']})
            // client.invalidateQueries({queryKey: ['GetTimeSheets', variables.providerId]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useDeleteTimeSheet(Optional?: object) {
    // const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiDeleteTimeSheetReq) => DeleteTimeSheet(data),
        onSuccess: () => {
            // client.invalidateQueries({queryKey: ['GetTimeSheets']})
            // client.invalidateQueries({queryKey: ['GetTimeSheets', variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useUpdateTimeSheet(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateTimeSheetReq) => UpdateTimeSheet(data),
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({queryKey: ['ShowTimeSheet' , variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useShowTimeSheet,
    useAddTimeSheet,
    useDeleteTimeSheet,
    useUpdateTimeSheet
}
