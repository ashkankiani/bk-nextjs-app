import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AddProvider,
  DeleteProvider,
  GetProviders,
  GetProvidersByServiceId,
  ShowProvider,
  UpdateProvider,
} from '@/api/apisAdmin'
import {
  TypeApiAddProviderReq,
  TypeApiDeleteProviderReq,
  TypeApiUpdateProviderReq,
} from '@/types/typeApiAdmin'

function useGetProviders(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetProviders'],
    queryFn: () => GetProviders(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useShowProvider(id: number, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['ShowProvider', id],
    queryFn: () => ShowProvider({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useAddProvider(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddProviderReq) => AddProvider(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetProviders'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteProvider(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteProviderReq) => DeleteProvider(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['GetProviders'] })
      client.invalidateQueries({ queryKey: ['GetProvidersByServiceId', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useUpdateProvider(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateProviderReq) => UpdateProvider(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['ShowProvider', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useGetProvidersByServiceId(id: number , Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetProvidersByServiceId', id],
    queryFn: () => GetProvidersByServiceId({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

export {
  useGetProviders,
  useShowProvider,
  useAddProvider,
  useDeleteProvider,
  useUpdateProvider,
  useGetProvidersByServiceId,
}
