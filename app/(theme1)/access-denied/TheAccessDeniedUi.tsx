import Link from 'next/link'
import {useEffect} from 'react'
import {deleteCookie} from 'cookies-next'
import {reducerUserReset} from '@/store/slice/user'
import Image405 from "@/public/images/405.png"
import Image from "next/image";
import useHook from "@/hooks/controller/useHook";

export default function TheAccessDeniedUi() {
    const {dispatch} = useHook()

    useEffect(() => {
        dispatch(reducerUserReset())
        deleteCookie("bk-session")
    }, [])

    return (
        <div className="bg-black/80 rounded-lg shadow-lg p-8 mx-auto block w-full md:w-4/12">
            <Image src={Image405} className="mx-auto" alt="مجوز رد شد"/>
            <div className="wrapper-text mt-6 text-center text-white mx-auto">
                <h1 className="mb-2 fa-bold-24px">اجازه دسترسی رد شد. لطفا وارد شوید!</h1>
                <p className="mb-2 fa-regular-18px">شما دارای دسترسی لازم نیستید.</p>
                <p className="mb-4 fa-regular-18px">اگر بیشتر از حد مجاز تلاش کنید، IP شما مسدود می شود.</p>
                <div>
                    <Link
                        href="/"
                        className="bk-button bg-green-400 fa-sbold-20px mx-auto w-72 "
                    >
                        ورود به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    )
}
