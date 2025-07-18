import { useQuery } from '@tanstack/react-query'
import { GetServices } from '@/api/apisUser'

function useGetServices(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetServices'],
    queryFn: () => GetServices(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

export { useGetServices }
