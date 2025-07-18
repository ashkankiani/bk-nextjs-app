'use client'
import { reducerUserReset } from '@/store/slice/user'
import { deleteCookie } from 'cookies-next'
import { useEffect } from 'react'
import useHook from '@/hooks/controller/useHook'

export default function TheSignOutUi() {
  const { dispatch, router } = useHook()

  const handlerDeleteSession = async () => {
    await handlerLogout()
  }

  // حذف سشن از طریق سرور
  const handlerLogout = () => {
    dispatch(reducerUserReset())
    deleteCookie('bk-session')
    router.push('/')
  }

  useEffect(() => {
    handlerDeleteSession()
  }, [])

  return 'در حال خروج...'
}
