import Link from 'next/link'
import useMenu from '@/hooks/controller/useMenu'
import React from 'react'
import { TypeMenu } from '@/types/typeConfig'
import { usePathname } from 'next/navigation'
import { Cn } from '@/libs/utility'

type TypeItemMenuSidebarProps = {
  toggleSidebar: boolean
  menuInMobile: boolean
  setMenuInMobile: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ItemMenuSidebar({
  toggleSidebar,
  menuInMobile,
  setMenuInMobile,
}: TypeItemMenuSidebarProps) {
  const { menu } = useMenu()
  const pathname = usePathname()

  const path = pathname.split('/')
  const currentPath = path[path.length - 1]

  return (Object.keys(menu) as Array<keyof TypeMenu>).map(key => {
    const item = menu[key]
    if (!item.permission) return null

    return (
      <Link
        key={key}
        href={`/admin/${item.name}`}
        className={Cn(
          toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center',
          currentPath === item.name ? 'rounded-xl bg-primary-500 dark:bg-slate-800' : '',
          'fa-sbold-18px my-2 p-2'
        )}
        onClick={() => setMenuInMobile(!menuInMobile)}
      >
        {item.icon}
        <div
          className={Cn(
            toggleSidebar ? '' : 'hidden',
            'overflow-auto whitespace-nowrap transition-all'
          )}
        >
          {item.title}
        </div>
      </Link>
    )
  })
}
