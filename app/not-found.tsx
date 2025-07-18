import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Image404 from '@/public/images/404.png'

export const metadata: Metadata = {
  title: 'Error 404',
}

export default function NotFound() {
  return (
    <div className="mx-auto block w-full rounded-lg bg-black/80 p-8 shadow-lg md:w-4/12">
      <Image src={Image404} className="mx-auto" alt="صفحه 404" />
      <div className="wrapper-text mx-auto mt-6 text-center text-white">
        <h1 className="fa-bold-24px mb-2">خطای 404 - صفحه یافت نشد</h1>
        <p className="fa-regular-18px mb-4">صفحه درخواست شده وجود ندارد.</p>
        {/*<p className="mb-4 fa-regular-18px">اگر بیشتر از حد مجاز تلاش کنید، IP شما مسدود می شود.</p>*/}
        <div>
          <Link href="/" className="bk-button fa-sbold-20px mx-auto w-72 bg-green-400">
            ورود به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
