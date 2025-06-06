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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-medium before:container before:absolute before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
        <div className="relative">
          <Image src={Image404} alt="PAGE_NOT_FOUND" />
          <p className="my-5 ">صفحه یافت نشد</p>
          <Link href="/" className="bk-button bg-green-700 mx-auto max-w-52">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
