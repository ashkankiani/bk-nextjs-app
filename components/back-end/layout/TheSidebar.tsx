import Link from 'next/link'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { AiOutlineEye } from 'react-icons/ai'
import imageLogo from '@/public/images/logo.png'
import imageLogoIcon from '@/public/images/logo-icon.png'
import { BsQrCodeScan } from 'react-icons/bs'
import SelectThemeAdmin from '@/components/back-end/section/SelectTheme'
import ItemMenuSidebar from '@/components/back-end/section/ItemMenuSidebar'
import { IoExitOutline } from 'react-icons/io5'
import React from 'react'
import { Cn } from '@/libs/utility'

type TypeTheSidebarProps = {
  toggleSidebar: boolean
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>
  menuInMobile: boolean
  setMenuInMobile: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TheSidebar({
  toggleSidebar,
  setToggleSidebar,
  menuInMobile,
  setMenuInMobile,
}: TypeTheSidebarProps) {
  return (
    <aside
      className={Cn(
        toggleSidebar ? 'md:min-w-[300px] md:basis-[300px] md:px-6' : 'min-w-[80px] basis-[80px]',
        menuInMobile
          ? 'max-lg:fixed max-lg:right-0 max-lg:top-0'
          : 'max-lg:fixed max-lg:right-[-320px] max-lg:top-0',
        'panel-aside transition-all duration-500'
      )}
    >
      <Link
        href="/admin/dashboard"
        className="block max-lg:mb-4"
        onClick={() => setMenuInMobile(!menuInMobile)}
      >
        {toggleSidebar ? (
          <img src={imageLogo.src} className="mx-auto w-8/12 dark:brightness-200" alt="logo" />
        ) : (
          <img src={imageLogoIcon.src} className="mx-auto dark:brightness-200" alt="logo" />
        )}
      </Link>

      <div className="relative hidden w-full py-6 lg:block">
        <div
          className={Cn(toggleSidebar ? '-left-12' : '-left-9', 'panel-aside-toggle')}
          onClick={() => setToggleSidebar(!toggleSidebar)}
        >
          {toggleSidebar ? (
            <HiOutlineChevronRight size="32px" className="text-primary-400 dark:text-primary-900" />
          ) : (
            <HiOutlineChevronLeft size="32px" className="text-primary-400 dark:text-primary-900" />
          )}
        </div>
      </div>

      <ItemMenuSidebar
        toggleSidebar={toggleSidebar}
        menuInMobile={menuInMobile}
        setMenuInMobile={setMenuInMobile}
      />

      <Link
        href="/"
        target="_blank"
        className={Cn(
          toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center',
          'fa-sbold-18px my-2 p-2'
        )}
      >
        <AiOutlineEye className="text-primary-900 dark:text-primary-700" size="30px" />
        <div className={Cn(toggleSidebar ? '' : 'hidden', 'whitespace-nowrap transition-all')}>
          مشاهده سایت
        </div>
      </Link>

      <SelectThemeAdmin toggleSidebar={toggleSidebar} />

      <Link href="/account/sign-out" className="flex-center-start fa-sbold-18px my-2 gap-2 p-2">
        <IoExitOutline className="text-primary-900 dark:text-primary-700" size="30px" />
        <div className="whitespace-nowrap transition-all">خروج</div>
      </Link>

      <Link
        href="/admin/settings#license"
        className={Cn(
          toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center',
          'fa-sbold-18px my-2 rounded-md bg-red-500 p-2 text-white'
        )}
      >
        <BsQrCodeScan className="text-primary-900 dark:text-primary-700" size="24px" />
        <div className={Cn(toggleSidebar ? '' : 'hidden', 'whitespace-nowrap transition-all')}>
          محصول شما هنوز فعال نشده است.
        </div>
      </Link>
    </aside>
  )
}
