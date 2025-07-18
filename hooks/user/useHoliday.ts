import { useQuery } from '@tanstack/react-query'
import { GetHolidays } from '@/api/apisUser'

function useGetHolidays(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
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

export { useGetHolidays }
