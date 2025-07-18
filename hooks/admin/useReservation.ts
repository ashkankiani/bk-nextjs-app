import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AddReservation,
  AppreciationReservation,
  DeleteReservation,
  GetReservations,
  GetReservationTimeSheetsInDate,
  ReminderReservation,
  ShowReservation,
  UpdateReservation,
  UpdateStatusReservation,
} from '@/api/apisAdmin'
import {
  TypeApiAddReservationReq,
  TypeApiAppreciationReservationReq,
  TypeApiDeleteReservationReq,
  TypeApiGetReservationsReq,
  TypeApiGetReservationTimeSheetsInDateReq,
  TypeApiReminderReservationReq,
  TypeApiUpdateReservationReq,
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

function useShowReservation(id: number, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['ShowReservation', id],
    queryFn: () => ShowReservation({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useAddReservation(Optional?: object) {
  const client = useQueryClient()
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

function useUpdateReservation(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateReservationReq) => UpdateReservation(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['ShowReservation', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

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
function useGetReservationTimeSheetsInDate(Optional?: object) {
  // const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiGetReservationTimeSheetsInDateReq) =>
      GetReservationTimeSheetsInDate(data),
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

export {
  useGetReservations,
  useShowReservation,
  useAddReservation,
  useDeleteReservation,
  useUpdateReservation,
  useUpdateStatusReservation,
  useReminderReservation,
  useAppreciationReservation,
  useGetReservationTimeSheetsInDate,
}
