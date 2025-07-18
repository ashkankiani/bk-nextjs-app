export default function LicenceManagement() {
  return (
    <form action="" className="panel-boxed mt-6" id="license">
      <div className="flex-center-center mx-auto max-w-md flex-col gap-2 rounded-md bg-gray-100 dark:bg-darkNavy1">
        <div className="fa-bold-26px mb-2">فعالسازی محصول</div>
        <p className="mb-2">لایسنس فعال سازی خود را وارد نمایید.</p>
        <input type="text" className="bk-input" placeholder="کد 36 رقمی دریافتی از ژاکت" />
        <button className="bk-button fa-bold-20px w-full bg-green-500">فعالسازی</button>
      </div>
    </form>
  )
}
