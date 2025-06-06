import { WiDaySunny } from 'react-icons/wi'
import { FiMoon } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setInitTheme } from '@/store/slice/app'
import useHook from "@/hooks/controller/useHook";

export default function SelectTheme() {
  const dispatch = useDispatch()
  const {theme} = useHook()

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
        <div className="inline-flex cursor-pointer bk-button bg-amber-700 p-2" onClick={darkHandler}>
          <FiMoon size="22px" />
        </div>
      ) : darkMode === 'light' ? (
        <div className="inline-flex cursor-pointer bk-button bg-amber-700 p-2" onClick={lightHandler}>
          <WiDaySunny size="22px" />
        </div>
      ) : null}
    </>
  )
}
