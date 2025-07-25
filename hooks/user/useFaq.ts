import { GetFaqs } from '@/api/apisUser'
import { useQuery } from '@tanstack/react-query'

function useGetFaqs(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
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

export { useGetFaqs }
