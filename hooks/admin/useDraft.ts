import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteDrafts, GetDrafts } from '@/api/apisAdmin'

function useGetDrafts(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetDrafts'],
    queryFn: () => GetDrafts(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useDeleteDrafts(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => DeleteDrafts(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetDrafts'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useGetDrafts, useDeleteDrafts }
