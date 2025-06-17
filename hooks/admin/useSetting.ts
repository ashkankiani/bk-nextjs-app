import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {GetSettings, UpdateSetting} from "@/api/apisAdmin";
import {TypeApiUpdateSettingReq} from "@/types/typeApi";


function useGetSettings(Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetSettings'],
        queryFn: () => GetSettings(),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}


function useUpdateSetting(Optional?: object) {
    const client = useQueryClient()
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: TypeApiUpdateSettingReq) => UpdateSetting(data),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['GetSettings']})
        },
        ...Optional,
    })
    return {
        mutateAsync,
        isPending,
    }
}


export {
    useGetSettings,
    useUpdateSetting
}
