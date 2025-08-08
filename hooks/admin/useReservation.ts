import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AddReservation,
  AppreciationReservation,
  DeleteReservation,
  GetReservations, GetReservationsByUserId,
  AvailableTimes,
  ReminderReservation,
  // ShowReservation,
  // UpdateReservation,
  UpdateStatusReservation,
} from '@/api/apisAdmin'
import {
  TypeApiAddReservationReq,
  TypeApiAppreciationReservationReq,
  TypeApiDeleteReservationReq,
  TypeApiGetReservationsReq,
  TypeApiAvailableTimesReq,
  TypeApiReminderReservationReq,
  TypeApiUpdateStatusReservationReq,
} from '@/types/typeApiAdmin'

function useGetReservations(filter: TypeApiGetReservationsReq, Optional?: object) {
  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['GetReservations', filter.startEpoch, filter.endEpoch],
    queryFn: () => GetReservations(filter),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
    refetch,
  }
}

// function useShowReservation(id: number, Optional?: object) {
//   const { data, isLoading, isFetched } = useQuery({
//     queryKey: ['ShowReservation', id],
//     queryFn: () => ShowReservation({ id }),
//     ...Optional,
//   })
//   return {
//     data,
//     isLoading,
//     isFetched,
//   }
// }

function useAddReservation(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddReservationReq) => AddReservation(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetReservations']})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteReservation(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteReservationReq) => DeleteReservation(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetReservations']})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

// function useUpdateReservation(Optional?: object) {
//   const client = useQueryClient()
//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: (data: TypeApiUpdateReservationReq) => UpdateReservation(data),
//     onSuccess: (data, variables, context) => {
//       client.invalidateQueries({ queryKey: ['ShowReservation', variables.id] })
//     },
//     ...Optional,
//   })
//   return {
//     mutateAsync,
//     isPending,
//   }
// }

function useUpdateStatusReservation(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateStatusReservationReq) => UpdateStatusReservation(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['ShowReservation' , variables.id]})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useReminderReservation(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiReminderReservationReq) => ReminderReservation(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetReservations']})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}
function useAppreciationReservation(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAppreciationReservationReq) => AppreciationReservation(data),
    onSuccess: () => {
      // client.invalidateQueries({queryKey: ['GetReservations']})
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}


function useAvailableTimes(query: TypeApiAvailableTimesReq, Optional?: object) {
  const { data, isLoading, isFetched , refetch} = useQuery({
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
    refetch,
  }
}


function useGetReservationsByUserId(userId: string, Optional?: object) {
  const { data, isLoading, isFetched , refetch} = useQuery({
    queryKey: ['GetReservationsByUserId', userId],
    queryFn: () => GetReservationsByUserId({ userId }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
    refetch,
  }
}

export {
  useGetReservations,
  // useShowReservation,
  useAddReservation,
  useDeleteReservation,
  // useUpdateReservation,
  useUpdateStatusReservation,
  useReminderReservation,
  useAppreciationReservation,
  useAvailableTimes,
  useGetReservationsByUserId,
}
