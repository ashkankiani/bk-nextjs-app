import {useMutation, useQuery} from '@tanstack/react-query'
import {AddReservations, AvailableTimes, GetReservationsByUserId} from '@/api/apisUser'
import {
  TypeApiAddReservationsReq,
  TypeApiAvailableTimesReq,
  TypeApiGetReservationsByUserIdReq
} from '@/types/typeApiUser'

function useAvailableTimes(query: TypeApiAvailableTimesReq, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: [
      'AvailableTimes',
      query.serviceId,
      query.providerId,
      query.startDate,
      query.providerId,
    ],
    queryFn: () => AvailableTimes(query),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useGetReservationsByUserId(query: TypeApiGetReservationsByUserIdReq, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['AvailableTimes', query.userId],
    queryFn: () => GetReservationsByUserId(query),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useAddReservations(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddReservationsReq[]) => AddReservations(data),
    onSuccess: () => {},
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}


export { useAvailableTimes, useGetReservationsByUserId , useAddReservations}
