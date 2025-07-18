import Link from 'next/link'
import { useEffect } from 'react'
import { deleteCookie } from 'cookies-next'
import { reducerUserReset } from '@/store/slice/user'
import Image405 from '@/public/images/405.png'
import Image from 'next/image'
import useHook from '@/hooks/controller/useHook'

export default function TheAccessDeniedUi() {
  const { dispatch } = useHook()

  useEffect(() => {
    dispatch(reducerUserReset())
    deleteCookie('bk-session')
  }, [])

  return (
    <div className="mx-auto block w-full rounded-lg bg-black/80 p-8 shadow-lg md:w-4/12">
      <Image src={Image405} className="mx-auto" alt="مجوز رد شد" />
      <div className="wrapper-text mx-auto mt-6 text-center text-white">
        <h1 className="fa-bold-24px mb-2">اجازه دسترسی رد شد. لطفا وارد شوید!</h1>
        <p className="fa-regular-18px mb-2">شما دارای دسترسی لازم نیستید.</p>
        <p className="fa-regular-18px mb-4">اگر بیشتر از حد مجاز تلاش کنید، IP شما مسدود می شود.</p>
        <div>
          <Link href="/" className="bk-button fa-sbold-20px mx-auto w-72 bg-green-400">
            ورود به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
