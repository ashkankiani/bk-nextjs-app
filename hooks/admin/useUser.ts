import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AddUser,
  DeleteUser,
  GetUsers,
  GetUsersByCatalogId,
  ImportUsers,
  ShowUser,
  UpdateUser,
} from '@/api/apisAdmin'
import {
  TypeApiAddUserReq,
  TypeApiDeleteUserReq,
  TypeApiImportUsersReq,
  TypeApiUpdateUserReq,
} from '@/types/typeApiAdmin'

function useGetUsers(Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetUsers'],
    queryFn: () => GetUsers(),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useShowUser(id: number, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['ShowUser', id],
    queryFn: () => ShowUser({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

function useAddUser(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiAddUserReq) => AddUser(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetUsers'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useDeleteUser(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiDeleteUserReq) => DeleteUser(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['GetUsers'] })
      client.invalidateQueries({ queryKey: ['GetUsersByCatalogId', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useUpdateUser(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateUserReq) => UpdateUser(data),
    onSuccess: (data, variables, context) => {
      client.invalidateQueries({ queryKey: ['ShowUser', variables.id] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useImportUsers(Optional?: object) {
  const client = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiImportUsersReq[]) => ImportUsers(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['GetUsers'] })
    },
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useGetUsersByCatalogId(id: number, Optional?: object) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['GetUsersByCatalogId', id],
    queryFn: () => GetUsersByCatalogId({ id }),
    ...Optional,
  })
  return {
    data,
    isLoading,
    isFetched,
  }
}

export {
  useGetUsers,
  useShowUser,
  useAddUser,
  useDeleteUser,
  useUpdateUser,
  useGetUsersByCatalogId,
}
