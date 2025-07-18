import { useQuery } from '@tanstack/react-query'
import { GetSettings } from '@/api/apisUser'

function useGetSettings(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
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

export { useGetSettings }
