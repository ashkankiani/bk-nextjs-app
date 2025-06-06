import Link from 'next/link'
import Image from "next/image";
import Image404 from "@/public/images/404.png";

export default function Error404() {

  return (
      <div className="bg-black/80 rounded-lg shadow-lg p-8 mx-auto block w-full md:w-4/12">
        <Image src={Image404} className="mx-auto" alt="صفحه 404" />
        <div className="wrapper-text mt-6 text-center text-white mx-auto">
          <h1 className="mb-2 fa-bold-24px">خطای 404 - صفحه یافت نشد</h1>
          <p className="mb-4 fa-regular-18px">صفحه درخواست شده وجود ندارد.</p>
          {/*<p className="mb-4 fa-regular-18px">اگر بیشتر از حد مجاز تلاش کنید، IP شما مسدود می شود.</p>*/}
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
