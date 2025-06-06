import Link from "next/link";
import {useRouter} from "next/router";
import useMenu from "@/hooks/controller/useMenu";
import React from "react";
import {TypeMenu} from "@/types/typeConfig";

type TypeItemMenuSidebarProps = {
    toggleSidebar: boolean
    menuInMobile: boolean
    setMenuInMobile: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ItemMenuSidebar({toggleSidebar, menuInMobile, setMenuInMobile}: TypeItemMenuSidebarProps) {

    const {menu} = useMenu()
    const router = useRouter()
    const pathname = router.pathname
    const path = pathname.split('/')
    const currentPath = path[path.length - 1]

    return (


        (Object.keys(menu) as Array<keyof TypeMenu>).map((key) => {
            const item = menu[key];
            if (!item.permission) return null;

            return (
                <Link
                    key={key}
                    href={`/admin/${item.name}`}
                    className={`my-2 p-2 fa-sbold-18px ${
                        toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center'
                    }${currentPath === item.name ? ' bg-primary-500 dark:bg-slate-800 rounded-xl' : ''}`}
                    onClick={() => setMenuInMobile(!menuInMobile)}
                >
                    {item.icon}
                    <div
                        className={`transition-all whitespace-nowrap overflow-auto ${
                            toggleSidebar ? '' : 'hidden'
                        }`}
                    >
                        {item.title}
                    </div>
                </Link>
            );
        })



        // menu.permission.includes(role) &&
        // <Link href={"/admin/" + menu.name}
        //       className={"my-2 p-2 fa-sbold-18px " + (toggleSidebar ? "flex-center-start gap-2" : "flex-center-center") + (currentPath === menu.name ? ' bg-primary-500 dark:bg-slate-800 rounded-xl' : '')}>
        //   {children}
        //   <div className={"transition-all whitespace-nowrap " + (toggleSidebar ? "" : "hidden")}>{menu.title}</div>
        // </Link>
    )
}