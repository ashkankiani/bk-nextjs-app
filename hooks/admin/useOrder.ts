import { useQuery } from '@tanstack/react-query'
import { GetOrders } from '@/api/apisAdmin'

function useGetOrders(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetOrders'],
    queryFn: () => GetOrders(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

export { useGetOrders }
