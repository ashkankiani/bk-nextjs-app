import React from "react";

export default function DocumentWebServiceSms() {
    return(
            <div className="prose prose-sm text-neutral-800 dark:text-white max-w-full my-8">
                <div className="border-b dark:border-black">
                    <p className="font-bold text-primary-800">برای سامانه ملی پیامک</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold"
                                           dir="ltr">https://console.melipayamak.com/api/send/</span>
                        </li>
                        <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری {"{0}"} روز: {"{1}"} تاریخ: {"{2}"} ساعت: {"{3}"} با موفقیت لغو شد.</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">متغیرها:</p>
                    <ul>
                        <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                        <li>cancellationReservation:<span
                            className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت</span></li>
                        <li>confirmReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                        <li>changeStatusReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور - وضعیت رزرو</span>
                        </li>
                        <li>reminderReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                    </ul>
                </div>
                <div className="border-b dark:border-black">
                    <p className="font-bold text-primary-800">برای سامانه کاوه نگار</p>
                    <p>کاوه نگار اجازه ارسال بیش از سه متغیر را نمیدهد پس باید جمع جورتر پیامک
                        فرستاد.</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold"
                                           dir="ltr">https://api.kavenegar.com/v1/</span></li>
                        <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری <span
                            dir="ltr">%token</span> روز: <span
                            dir="ltr">%token1</span> تاریخ: <span dir="ltr">%token2</span> ساعت: <span
                            dir="ltr">%token3</span> با موفقیت لغو شد.</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">متغیرها:</p>
                    <ul>
                        <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                        <li>cancellationReservation:<span className="mr-1 font-bold">کدرهگیری - تاریخ - ساعت</span>
                        </li>
                        <li>confirmReservation:<span
                            className="mr-1 font-bold">کدرهگیری - تاریخ - ساعت</span></li>
                        <li>changeStatusReservation:<span
                            className="mr-1 font-bold">کدرهگیری - تاریخ و ساعت - وضعیت رزرو</span></li>
                        <li>reminderReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز و تاریخ و ساعت - نام سرویس و نام اپراتور</span>
                        </li>
                    </ul>
                </div>
                <div className="border-b dark:border-black">
                    <p className="font-bold text-primary-800">برای سامانه فراز اس ام اس (روش 1)</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold" dir="ltr">https://api1.ippanel.com/api/v1 یا https://api2.ippanel.com/api/v1</span>
                        </li>
                        <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری <span
                            dir="ltr">%trackingCode%</span> روز: <span
                            dir="ltr">%dateName%</span> تاریخ: <span dir="ltr">%date%</span> ساعت: <span
                            dir="ltr">%time%</span> با موفقیت لغو شد.</span>
                        </li>
                        <li>نام های متغیرهایی که باید استفاده کنید.<span className="mr-1 font-bold">trackingCode - dateName - date - time - service - provider - status</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">برای سامانه فراز اس ام اس (روش 2)</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold"
                                           dir="ltr">https://ippanel.com/api/select</span></li>
                        <li>نام کاربری:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span>
                        </li>
                        <li>رمز عبور:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری <span
                            dir="ltr">%trackingCode%</span> روز: <span
                            dir="ltr">%dateName%</span> تاریخ: <span dir="ltr">%date%</span> ساعت: <span
                            dir="ltr">%time%</span> با موفقیت لغو شد.</span>
                        </li>
                        <li>نام های متغیرهایی که باید استفاده کنید.<span className="mr-1 font-bold">trackingCode - dateName - date - time - service - provider - status</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">متغیرها:</p>
                    <ul>
                        <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                        <li>cancellationReservation:<span
                            className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت</span></li>
                        <li>confirmReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                        <li>changeStatusReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور - وضعیت رزرو</span>
                        </li>
                        <li>reminderReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                    </ul>
                </div>
                <div className="border-b dark:border-black">
                    <p className="font-bold text-primary-800">برای سامانه های دارای IpPanel</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold"
                                           dir="ltr">https://ippanel.com/api/select</span></li>
                        <li>نام کاربری:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span>
                        </li>
                        <li>رمز عبور:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری <span
                            dir="ltr">%trackingCode%</span> روز: <span
                            dir="ltr">%dateName%</span> تاریخ: <span dir="ltr">%date%</span> ساعت: <span
                            dir="ltr">%time%</span> با موفقیت لغو شد.</span>
                        </li>
                        <li>نام های متغیرهایی که باید استفاده کنید.<span className="mr-1 font-bold">trackingCode - dateName - date - time - service - provider - status</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">متغیرها:</p>
                    <ul>
                        <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                        <li>cancellationReservation:<span
                            className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت</span></li>
                        <li>confirmReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                        <li>changeStatusReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور - وضعیت رزرو</span>
                        </li>
                        <li>reminderReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                    </ul>
                </div>
                <div className="border-b dark:border-black">
                    <p className="font-bold text-primary-800">برای سامانه ایده پردازان (sms.ir)</p>
                    <ul>
                        <li>آدرس API:<span className="mr-1 font-bold"
                                           dir="ltr">https://api.sms.ir/v1</span></li>
                        <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                        <li>مثال روش ثبت پترن:<span
                            className="mr-1 font-bold">رزرو با کد پیگیری <span
                            dir="ltr">#trackingCode#</span> روز: <span
                            dir="ltr">#dateName#</span> تاریخ: <span dir="ltr">#date#</span> ساعت: <span
                            dir="ltr">#time#</span> با موفقیت لغو شد.</span>
                        </li>
                        <li>نام های متغیرهایی که باید استفاده کنید.<span className="mr-1 font-bold">trackingCode - dateName - date - time - service - provider - status</span>
                        </li>
                    </ul>
                    <p className="font-bold text-primary-800">متغیرها:</p>
                    <ul>
                        <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                        <li>cancellationReservation:<span
                            className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت</span></li>
                        <li>confirmReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                        <li>changeStatusReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور - وضعیت رزرو</span>
                        </li>
                        <li>reminderReservation:<span className="mr-1 font-bold">کدرهگیری - نام روز - تاریخ - ساعت - نام سرویس - نام اپراتور</span>
                        </li>
                    </ul>
                </div>
            </div>
    )
}