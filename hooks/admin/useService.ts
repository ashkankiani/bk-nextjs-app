import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AddService, DeleteService, GetServices, ShowService, UpdateService } from '@/api/apisAdmin'
import {
  TypeApiAddServiceReq,
  TypeApiDeleteServiceReq,
  TypeApiUpdateServiceReq,
} from '@/types/typeApiAdmin'

function useGetServices(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetServices'],
    queryFn: () => GetServices(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useShowService(id: number, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['ShowService', id],
    queryFn: () => ShowService({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useAddService(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddServiceReq) => AddService(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetServices'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteService(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteServiceReq) => DeleteService(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetServices'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useUpdateService(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateServiceReq) => UpdateService(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['ShowService', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useGetServices, useShowService, useAddService, useDeleteService, useUpdateService }
