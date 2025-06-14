import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AddDiscount, DeleteDiscount, GetDiscounts, ShowDiscount, UpdateDiscount} from "@/api/apisAdmin";
import {TypeApiAddDiscountReq, TypeApiDeleteDiscountReq, TypeApiUpdateDiscountReq} from "@/types/typeApi";


function useGetDiscounts(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetDiscounts'],
        queryFn: () => GetDiscounts(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useShowDiscount(id: number, Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['ShowDiscount' + id],
        queryFn: () => ShowDiscount({id}),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useAddDiscount(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiAddDiscountReq) => AddDiscount(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetDiscounts']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useDeleteDiscount(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiDeleteDiscountReq) => DeleteDiscount(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetDiscounts']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useUpdateDiscount(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateDiscountReq) => UpdateDiscount(data),
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({queryKey: ['ShowDiscount' + variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useGetDiscounts,
    useShowDiscount,
    useAddDiscount,
    useDeleteDiscount,
    useUpdateDiscount
}
