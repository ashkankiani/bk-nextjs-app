import { useQuery } from '@tanstack/react-query'
import { GetConnections, GetGateways } from '@/api/apisUser'

function useGetConnections(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
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

export { useGetConnections }
