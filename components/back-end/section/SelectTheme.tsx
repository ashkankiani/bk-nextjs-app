import { WiDaySunny } from 'react-icons/wi'
import { FiMoon } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'
import { setInitTheme } from '@/store/slice/app'
import useHook from '@/hooks/controller/useHook'
import { Cn } from '@/libs/utility'

type TypeSelectThemeAdminProps = {
  toggleSidebar: boolean
}

export default function SelectThemeAdmin({ toggleSidebar }: TypeSelectThemeAdminProps) {
  const { theme, dispatch } = useHook()

  const [darkMode, setDarkMode] = useState(theme)
  const darkHandler = () => {
    setDarkMode('light')
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
    dispatch(setInitTheme('dark'))
  }
  const lightHandler = () => {
    setDarkMode('dark')
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
    dispatch(setInitTheme('light'))
  }
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      darkHandler()
    } else {
      lightHandler()
    }
  }, [])

  return (
    <>
      {darkMode === 'dark' ? (
        <div
          className={Cn(
            toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center',
            'fa-sbold-18px my-2 cursor-pointer p-2'
          )}
          onClick={darkHandler}
        >
          <FiMoon className="text-primary-900 dark:text-primary-700" size="30px" />
          <div className={Cn(toggleSidebar ? '' : 'hidden', 'whitespace-nowrap transition-all')}>
            تاریک
          </div>
        </div>
      ) : darkMode === 'light' ? (
        <div
          className={Cn(
            toggleSidebar ? 'flex-center-start gap-2' : 'flex-center-center',
            'fa-sbold-18px my-2 cursor-pointer p-2'
          )}
          onClick={lightHandler}
        >
          <WiDaySunny className="text-primary-900 dark:text-primary-700" size="30px" />
          <div className={Cn(toggleSidebar ? '' : 'hidden', 'whitespace-nowrap transition-all')}>
            روشن
          </div>
        </div>
      ) : null}
    </>
  )
}
