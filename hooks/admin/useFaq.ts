import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AddFaq, DeleteFaq, GetFaqs, ShowFaq, UpdateFaq} from "@/api/apisAdmin";
import {TypeApiAddFaqReq, TypeApiDeleteFaqReq, TypeApiUpdateFaqReq} from "@/types/typeApi";


function useGetFaqs(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetFaqs'],
        queryFn: () => GetFaqs(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useShowFaq(id: number, Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['ShowFaq' + id],
        queryFn: () => ShowFaq({id}),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}

function useAddFaq(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiAddFaqReq) => AddFaq(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetFaqs']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useDeleteFaq(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiDeleteFaqReq) => DeleteFaq(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetFaqs']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}

function useUpdateFaq(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateFaqReq) => UpdateFaq(data),
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({queryKey: ['ShowFaq' + variables.id]})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useGetFaqs,
    useShowFaq,
    useAddFaq,
    useDeleteFaq,
    useUpdateFaq
}
