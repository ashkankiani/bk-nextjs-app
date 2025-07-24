import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AddOrder,
  DeleteOrder, GetOrderByBankTransactionCode,
  GetOrders,
  ShowOrder,
  UpdateOrder,
} from '@/api/apisUser'
import {
  TypeApiAddOrderReq,
  TypeApiDeleteOrderReq, TypeApiGetOrderByBankTransactionCodeReq,
  TypeApiUpdateOrderReq,
} from '@/types/typeApiUser'
import {GetProvidersByServiceId} from "@/api/apisAdmin";

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

function useShowOrder(id: number, Optional?: object) {
  const { data, isLoading, isFetched, refetch , isRefetching } = useQuery({
    queryKey: ['ShowOrder', id],
    queryFn: () => ShowOrder({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
    refetch,
    isRefetching,
  }
}

function useAddOrder(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddOrderReq) => AddOrder(data),
    onSuccess: () => {
      // client.invalidateQueries({ queryKey: ['GetOrders'] }) // hint
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteOrder(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteOrderReq) => DeleteOrder(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetOrders'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useUpdateOrder(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateOrderReq) => UpdateOrder(data),
    onSuccess: (data, variables, context) => {
      // client.invalidateQueries({ queryKey: ['ShowOrder', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}


function useGetOrderByBankTransactionCode(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiGetOrderByBankTransactionCodeReq) => GetOrderByBankTransactionCode(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}



export { useGetOrders, useShowOrder, useAddOrder, useDeleteOrder, useUpdateOrder , useGetOrderByBankTransactionCode}
