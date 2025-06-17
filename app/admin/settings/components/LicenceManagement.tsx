export default function LicenceManagement(){
    return(
        <form action="" className="panel-boxed mt-6" id="license">
            <div className="flex-center-center flex-col max-w-md gap-2 mx-auto bg-gray-100 dark:bg-darkNavy1  rounded-md">
                <div className="fa-bold-26px mb-2">فعالسازی محصول</div>
                <p className="mb-2">لایسنس فعال سازی خود را وارد نمایید.</p>
                <input type="text" className="bk-input" placeholder="کد 36 رقمی دریافتی از ژاکت"/>
                <button className="bk-button w-full bg-green-500 fa-bold-20px">فعالسازی</button>
            </div>
        </form>
    )
}