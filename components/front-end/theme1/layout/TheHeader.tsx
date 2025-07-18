import Link from 'next/link'
import imageLogo from '@/public/images/logo.png'
import SelectTheme from '@/components/front-end/theme1/components/SelectTheme'
import { BiExit } from 'react-icons/bi'
import { RiSettings4Line } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { BsCalendar2Heart, BsCart3 } from 'react-icons/bs'
import useHook from '@/hooks/controller/useHook'

export default function TheHeader() {
  const { router, isLogin, permissions } = useHook()

  return (
    <header>
      <div className="flex-center-between mb-8 flex-col gap-4 sm:flex-row">
        <Link href="/">
          <img src={imageLogo.src} className="dark:brightness-200" alt="logo" />
        </Link>

        <div className="flex-center-center gap-x-2">
          <SelectTheme />
          {isLogin ? (
            <>
              <Link href="/account/reservation" className="bk-button bg-green-700 p-2">
                <BsCalendar2Heart size="22px" />
              </Link>
              {permissions.admin && (
                <Link
                  href="/admin/dashboard"
                  target="_blank"
                  className="bk-button bg-slate-700 p-2"
                >
                  <RiSettings4Line size="22px" />
                </Link>
              )}
              <Link href="/account/profile" className="bk-button bg-primary-700 p-2">
                <CgProfile size="22px" />
              </Link>
              <Link href="/checkout" className="bk-button bg-emerald-800 p-2">
                <BsCart3 size="22px" />
              </Link>
              <div
                onClick={() => router.push('/account/sign-out')}
                className="bk-button cursor-pointer bg-red-700 p-2"
              >
                <BiExit size="22px" />
              </div>
            </>
          ) : (
            <>
              <Link href="/account/sign-up" className="bk-button fa-bold-16px bg-green-700 py-2">
                ثبت نام
              </Link>
              <Link href="/account/sign-in" className="bk-button fa-bold-16px bg-slate-700 py-2">
                ورود
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
