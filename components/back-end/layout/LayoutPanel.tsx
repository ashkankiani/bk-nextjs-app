import {ReactNode, useState} from "react";
import useHook from "@/hooks/controller/useHook";
import {RxHamburgerMenu} from "react-icons/rx";
import TheSidebar from "@/components/back-end/layout/TheSidebar";
import TheFooter from "@/components/back-end/layout/TheFooter";
import Link from "next/link";
import imageLogo from "@/public/images/logo.png";
import {IoMdClose} from "react-icons/io";

export default function LayoutPanel({children}:{ children: ReactNode }) {
  const {user, permissions, router} = useHook()
  const [toggleSidebar, setToggleSidebar] = useState(true)
  if ((user === null) || !permissions.admin) router.push('/account/sign-in')

  const [menuInMobile, setMenuInMobile] = useState(false)

  const toggleMenuInMobile = () => {
    setMenuInMobile(current => !current)
  }

  return (
    <div className="container-fluid h-auto flex items-stretch justify-stretch relative">
      <TheSidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} menuInMobile={menuInMobile} setMenuInMobile={setMenuInMobile}/>
      <div
        className={"panel-container " + (toggleSidebar ? "panel-container-100-300" : "panel-container-100-80")}>
        <div
          className="flex-center-between md:hidden p-4 text-black bg-primary-400 dark:bg-darkNavy1 dark:text-gray-50">
          <Link href="/">
            <img src={imageLogo.src} className="dark:brightness-200 w-10/12" alt="logo"/>
          </Link>
          {
            menuInMobile ?
              <IoMdClose
                size="32px"
                className="cursor-pointer"
                onClick={() => toggleMenuInMobile()}
              />
              :
              <RxHamburgerMenu size="32px" className="cursor-pointer" onClick={() => toggleMenuInMobile()}/>
          }
        </div>
        <main>
          {children}
        </main>
        <TheFooter/>
      </div>
    </div>
  )
}
