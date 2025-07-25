import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AddOrder,
  GetOrderByAuthority,
  ShowOrder,
  UpdateOrder,
} from '@/api/apisUser'
import {
  TypeApiAddOrderReq,
   TypeApiGetOrderByAuthorityReq,
  TypeApiUpdateOrderReq,
} from '@/types/typeApiUser'

// function useGetOrders(Optional?: object) {
//   const { data, isLoading, isFetched } = useQuery({
//     queryKey: ['GetOrders'],
//     queryFn: () => GetOrders(),
//     ...Optional,
//   })
//   return {
//     data,
//     isLoading,
//     isFetched,
//   }
// }

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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddOrderReq) => AddOrder(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

/*function useDeleteOrder(Optional?: object) {
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
}*/

function useUpdateOrder(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateOrderReq) => UpdateOrder(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}


function useGetOrderByAuthority(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiGetOrderByAuthorityReq) => GetOrderByAuthority(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}



export { useShowOrder, useAddOrder, useUpdateOrder , useGetOrderByAuthority}
