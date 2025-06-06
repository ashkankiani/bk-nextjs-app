import Link from "next/link";
import {HiOutlineChevronLeft, HiOutlineChevronRight} from "react-icons/hi";
import {AiOutlineEye} from "react-icons/ai";
import imageLogo from "@/public/images/logo.png";
import imageLogoIcon from "@/public/images/logo-icon.png";
import {BsQrCodeScan} from "react-icons/bs";
import SelectThemeAdmin from "@/components/back-end/layout/section/SelectTheme";
import ItemMenuSidebar from "@/components/back-end/layout/section/ItemMenuSidebar";
import {IoExitOutline} from "react-icons/io5";
import React from "react";

type TypeTheSidebarProps = {
    toggleSidebar: boolean
    setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>
    menuInMobile: boolean
    setMenuInMobile: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TheSidebar({toggleSidebar, setToggleSidebar, menuInMobile, setMenuInMobile}: TypeTheSidebarProps) {
  return (
    <aside
      className={"panel-aside transition-all duration-500 " + (toggleSidebar ? "md:px-6 md:basis-[300px] md:min-w-[300px] " : "basis-[80px] min-w-[80px] ")
        +
        (
          menuInMobile
            ? 'max-lg:fixed max-lg:top-0 max-lg:right-0'
            : 'max-lg:fixed max-lg:top-0 max-lg:right-[-320px]'
        )
      }>


      <Link href="/admin/dashboard" className="block max-lg:mb-4" onClick={() => setMenuInMobile(!menuInMobile)}>
        {
          toggleSidebar ?
            <img src={imageLogo.src} className="mx-auto dark:brightness-200 w-8/12" alt="logo"/>
            :
            <img src={imageLogoIcon.src} className="mx-auto dark:brightness-200" alt="logo"/>
        }
      </Link>

      <div className="hidden lg:block w-full py-6 relative">
        <div className={"panel-aside-toggle " + (toggleSidebar ? "-left-12" : "-left-9")}
             onClick={() => setToggleSidebar(!toggleSidebar)}>
          {
            toggleSidebar ?
              <HiOutlineChevronRight size="32px" className="text-primary-400  dark:text-primary-900"/>
              :
              <HiOutlineChevronLeft size="32px" className="text-primary-400  dark:text-primary-900"/>
          }
        </div>
      </div>

      <ItemMenuSidebar toggleSidebar={toggleSidebar} menuInMobile={menuInMobile} setMenuInMobile={setMenuInMobile}/>

      <Link href="/" target="_blank"
            className={"my-2 p-2 fa-sbold-18px " + (toggleSidebar ? "flex-center-start gap-2" : "flex-center-center")}>
        <AiOutlineEye className="text-primary-900 dark:text-primary-700" size="30px"/>
        <div className={"transition-all whitespace-nowrap " + (toggleSidebar ? "" : "hidden")}>مشاهده سایت</div>
      </Link>

      <SelectThemeAdmin toggleSidebar={toggleSidebar}/>

      <Link href="/account/sign-out" className="flex-center-start gap-2 my-2 p-2 fa-sbold-18px">
        <IoExitOutline className="text-primary-900 dark:text-primary-700" size="30px"/>
        <div className="transition-all whitespace-nowrap ">خروج</div>
      </Link>

      <Link href="/admin/settings#licence"
            className={"my-2 p-2 fa-sbold-18px bg-red-500 text-white rounded-md " + (toggleSidebar ? "flex-center-start gap-2" : "flex-center-center")}>
        <BsQrCodeScan className="text-primary-900 dark:text-primary-700" size="24px"/>
        <div className={"transition-all whitespace-nowrap " + (toggleSidebar ? "" : "hidden")}>محصول شما هنوز
          فعال نشده است.
        </div>
      </Link>

    </aside>
  )
}