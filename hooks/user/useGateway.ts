import { useMutation, useQuery } from '@tanstack/react-query'
import { AddReservations, CreateAuthority, GetGateways, VerifyPayment } from '@/api/apisUser'
import {
  TypeApiAddReservationsReq,
  TypeApiCreateAuthorityReq,
  TypeApiVerifyPaymentReq,
} from '@/types/typeApiUser'

function useGetGateways(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetGateways'],
    queryFn: () => GetGateways(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useCreateAuthority(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiCreateAuthorityReq) => CreateAuthority(data),
    onSuccess: () => {},
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useVerifyPayment(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiVerifyPaymentReq) => VerifyPayment(data),
    onSuccess: () => {},
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useGetGateways, useCreateAuthority, useVerifyPayment }
