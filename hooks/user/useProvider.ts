import {useQuery} from '@tanstack/react-query'
import {GetProvidersForService} from "@/api/apisUser";

function useGetProvidersForService(params: { serviceId: number }, Optional?: object) {
    const {data, isLoading, isFetched} = useQuery({
        queryKey: ['GetProviders', params?.serviceId],
        queryFn: () => GetProvidersForService(params),
        ...Optional,
    })
    return {
        data,
        isLoading,
        isFetched,
    }
}


export {useGetProvidersForService}
