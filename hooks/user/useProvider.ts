import { useQuery } from '@tanstack/react-query'
import { GetProvidersByServiceId } from '@/api/apisUser'

function useGetProvidersByServiceId(params: { serviceId: number }, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetProvidersByServiceId', params.serviceId],
    queryFn: () => GetProvidersByServiceId(params),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

export { useGetProvidersByServiceId }
