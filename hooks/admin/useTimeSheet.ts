import { useMutation, useQuery } from '@tanstack/react-query'
import { AddTimeSheet, DeleteTimeSheet, ShowTimeSheet } from '@/api/apisAdmin'
import { TypeApiAddTimeSheetReq, TypeApiDeleteTimeSheetReq } from '@/types/typeApiAdmin'

function useShowTimeSheet(id: number, Optional?: object) {
  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['ShowTimeSheet', id],
    queryFn: () => ShowTimeSheet({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
    refetch,
  }
}

function useAddTimeSheet(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddTimeSheetReq) => AddTimeSheet(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetTimeSheets']})
      // client.invalidateQueries({queryKey: ['GetTimeSheets', variables.providerId]})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteTimeSheet(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteTimeSheetReq) => DeleteTimeSheet(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetTimeSheets']})
      // client.invalidateQueries({queryKey: ['GetTimeSheets', variables.id]})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useShowTimeSheet, useAddTimeSheet, useDeleteTimeSheet }
