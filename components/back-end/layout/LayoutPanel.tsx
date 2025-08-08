'use client'
import { ReactNode, useState } from 'react'
import useHook from '@/hooks/controller/useHook'
import { RxHamburgerMenu } from 'react-icons/rx'
import TheSidebar from '@/components/back-end/layout/TheSidebar'
import TheFooter from '@/components/back-end/layout/TheFooter'
import Link from 'next/link'
import imageLogo from '@/public/images/logo.png'
import { IoMdClose } from 'react-icons/io'
import { Cn } from '@/libs/utility'

export default function LayoutPanel({ children }: { children: ReactNode }) {
  const { user, permissions, router } = useHook()
  const [toggleSidebar, setToggleSidebar] = useState(true)

  if (user === null || !permissions.admin) router.push('/account/sign-in')

  const [menuInMobile, setMenuInMobile] = useState(false)

  const toggleMenuInMobile = () => {
    setMenuInMobile(current => !current)
  }

  return (
    <div className="container-fluid relative flex h-auto items-stretch justify-stretch">
      <TheSidebar
        toggleSidebar={toggleSidebar}
        setToggleSidebar={setToggleSidebar}
        menuInMobile={menuInMobile}
        setMenuInMobile={setMenuInMobile}
      />
      <div
        className={Cn(
          toggleSidebar ? 'panel-container-100-300' : 'panel-container-100-80',
          'panel-container'
        )}
      >
        <div className="flex-center-between bg-primary-400 p-4 text-black dark:bg-darkNavy1 dark:text-gray-50 md:hidden">
          <Link href="/">
            <img src={imageLogo.src} className="w-10/12 dark:brightness-200" alt="logo" />
          </Link>
          {menuInMobile ? (
            <IoMdClose
              size="32px"
              className="cursor-pointer"
              onClick={() => toggleMenuInMobile()}
            />
          ) : (
            <RxHamburgerMenu
              size="32px"
              className="cursor-pointer"
              onClick={() => toggleMenuInMobile()}
            />
          )}
        </div>
        <main>{children}</main>
        <TheFooter />
      </div>
    </div>
  )
}
