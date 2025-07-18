import { useMutation } from '@tanstack/react-query'
import { SignIn, SignInOtp, SendCodeOtp, SignUp, ResetPassword, UpdateUser } from '@/api/apisUser'
import {
  TypeApiResetPasswordReq,
  TypeApiSignUpReq,
  TypeApiUpdateUserReq,
} from '@/types/typeApiUser'

function useSignIn(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { codeMeli: string; password: string }) => SignIn(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useSignInOtp(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { mobile: string }) => SignInOtp(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useSendCodeOtp(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { mobile: string }) => SendCodeOtp(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useSignUp(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiSignUpReq) => SignUp(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useResetPassword(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiResetPasswordReq) => ResetPassword(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

function useUpdateUser(Optional?: object) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TypeApiUpdateUserReq) => UpdateUser(data),
    ...Optional,
  })
  return {
    mutateAsync,
    isPending,
  }
}

export { useSignIn, useSignInOtp, useSendCodeOtp, useSignUp, useResetPassword, useUpdateUser }
