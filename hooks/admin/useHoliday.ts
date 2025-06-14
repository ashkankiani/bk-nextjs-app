import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AddHoliday, DeleteHoliday, GetHolidays, ShowHoliday, UpdateHoliday} from "@/api/apisAdmin";
import {TypeApiAddHolidayReq, TypeApiDeleteHolidayReq, TypeApiUpdateHolidayReq} from "@/types/typeApi";


function useGetHolidays(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetHolidays'],
        queryFn: () => GetHolidays(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useShowHoliday(id: number, Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['ShowHoliday' + id],
        queryFn: () => ShowHoliday({id}),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useAddHoliday(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiAddHolidayReq) => AddHoliday(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetHolidays']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useDeleteHoliday(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiDeleteHolidayReq) => DeleteHoliday(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetHolidays']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useUpdateHoliday(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateHolidayReq) => UpdateHoliday(data),
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({queryKey: ['ShowHoliday' + variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useGetHolidays,
    useShowHoliday,
    useAddHoliday,
    useDeleteHoliday,
    useUpdateHoliday
}
