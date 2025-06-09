import HeadPage from "@/components/layout/HeadPage";
import {AiOutlineSave, AiOutlineSetting} from "react-icons/ai";
import {useEffect, useState} from "react";
import {bkToast, onlyTypeNumber} from "@/libs/utility";
import {hookGetConnections, hookUpdateConnections} from "@/hooks/admin/hookConnection";
import {useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {MdEmail} from "react-icons/md";
import {FaSms} from "react-icons/fa";
import {hookSendSms} from "@/hooks/user/hookSms";
import {hookSendEmail} from "@/hooks/admin/hookEmail";
import {useSelector} from "react-redux";
import Link from "next/link";

export default function Connections() {

  const permissions = useSelector(state => state.user.permissions)


  const [loadingPage, setLoadingPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [loadingTestSms, setLoadingTestSms] = useState(false)
  const [loadingTestEmail, setLoadingTestEmail] = useState(false)

  const items = [
    "bankName1",
    "merchantId1",
    "bankName2",
    "merchantId2",
    "smsName",
    "smsURL",
    "smsToken",
    "smsUserName",
    "smsPassword",
    "smsFrom",
    "smsCodePattern1",
    "smsCodePattern2",
    "smsCodePattern3",
    "smsCodePattern4",
    "smsCodePattern5",
    "smsCodePattern6",
    "smtpURL",
    "smtpUserName",
    "smtpPassword",
  ];

  const itemsInteger = [
    "smtpPort",
  ];

  const handlerGetConnections = async () => {
    await hookGetConnections((response, message) => {
      setLoadingPage(true)
      if (response) {
        items.forEach(item => {
          setValue(item, message[item])
        })
        itemsInteger.forEach(item => {
          setValue(item, parseInt(message[item]))
        })
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerGetConnections()
  }, [])


  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm({
    criteriaMode: 'all',
  })

  const onSubmit = data => {
    itemsInteger.forEach(item => {
      data[item] = parseInt(data[item])
    })
    handlerUpdateConnections(data)
  }

  const handlerUpdateConnections = async data => {
    setLoading(true)
    await hookUpdateConnections(data, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', message)
      } else {
        bkToast('error', message)
      }
    })
  }


  const handlerTestEmail = async (e) => {
    e.preventDefault()
    setLoadingTestEmail(true)
    let params = {
      title: "تبریک! میل سرور شما صحیح کار میکند.",
      subject: "ایمیل تست از رزرواسیون کیان",
      text: "پیکربندی شما برای ارسال ایمیل صحیح است.",
      email: email,
      trackingCode: '123456',
      dateName: 'شنبه',
      date: '1404/01/01',
      time: '10:00 تا 11:00',
      service: 'رزرواسیون کیان',
      provider: 'اشکان کیانی',
    }
    await hookSendEmail(params, (response, message) => {
      setLoadingTestEmail(false)
      if (response) {
        bkToast('success', 'ایمیل با موفقیت ارسال شد.')
      } else {
        bkToast('error', message)
      }
    })
  }


  const handlerTestSms = async (e) => {
    e.preventDefault()
    setLoadingTestSms(true)
    let params = {
      // type: "OTP",
      mobile: mobile,
      code: "123456"
    }
    await hookSendSms(params, (response, message) => {
      setLoadingTestSms(false)
      if (response) {
        bkToast('success', 'پیامک با موفقیت ارسال شد.')
      } else {
        bkToast('error', message)
      }
    })
  }


  return (
    <>
      <HeadPage title="ارتباطات"/>
      <HeaderPage title="ارتباطات" description="ارتباطات و پیگربندی وب سرویس خود را انجام دهید.">
        {
          permissions.viewSettings &&
          <Link href="/admin/connections" className="action">
            <AiOutlineSetting size="24px" className="inline-flex align-middle ml-2"/>
            <span>تنظیمات سایت</span>
          </Link>
        }
      </HeaderPage>
      <div className="panel-main">
        {
          loadingPage ?
            <>
              <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex-center-start flex-wrap">

                  <div className="panel-col-25">
                    <label>درگاه بانکی یک</label>
                    <select
                      {...register('bankName1')}
                      defaultValue="NONE"
                      className="bk-input">
                      <option value="NONE">غیرفعال</option>
                      <option value="ZARINPAL">زرین پال</option>
                      <option value="ZIBAL">زیبال</option>
                      <option value="AQAYEPARDAKHT">آقای پرداخت</option>
                      <option value="IDPAY" disabled={true}>آیدی پی (غیرفعال)</option>
                    </select>
                    <FormErrorMessage errors={errors} name="bankName1"/>
                  </div>
                  <div className="panel-col-75">
                    <label>مرچندکد یک</label>
                    <input
                      {...register('merchantId1')}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="merchantId1"/>
                  </div>
                  <div className="panel-col-25">
                    <label>درگاه بانکی دوم</label>
                    <select
                      {...register('bankName2')}
                      defaultValue="NONE"
                      className="bk-input">
                      <option value="NONE">غیرفعال</option>
                      <option value="ZARINPAL">زرین پال</option>
                      <option value="ZIBAL">زیبال</option>
                      <option value="AQAYEPARDAKHT">آقای پرداخت</option>
                      <option value="IDPAY" disabled={true}>آیدی پی (غیرفعال)</option>
                    </select>
                    <FormErrorMessage errors={errors} name="bankName2"/>
                  </div>
                  <div className="panel-col-75">
                    <label>مرچندکد دوم</label>
                    <input
                      {...register('merchantId2')}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="merchantId2"/>
                  </div>

                  <div className="w-full p-4 my-4">
                    <hr className="panel-section-separator"/>
                  </div>

                  <div className="panel-col-33">
                    <label>نام سیستم پیامکی</label>
                    <select
                      {...register('smsName')}
                      defaultValue="NONE"
                      className="bk-input">
                      <option value="NONE">غیرفعال</option>
                      <option value="IPPANEL">آی پی پنل (IPPANEL)</option>
                      <option value="MELIPAYAMAK">ملی پیامک (melipayamak.com)</option>
                      <option value="KAVENEGAR">کاوه نگار (kavenegar.com)</option>
                      <option value="FARAZSMS">فراز اس ام اس (farazsms.com)</option>
                      <option value="SMSIR">ایده پردازان (sms.ir)</option>
                    </select>
                    <FormErrorMessage errors={errors} name="smsName"/>
                  </div>
                  <div className="panel-col-33">
                    <label>آدرس API سیستم پیامکی</label>
                    <input
                      {...register('smsURL')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsURL"/>
                  </div>
                  <div className="panel-col-33">
                    <label>توکن سیستم پیامکی</label>
                    <input
                      {...register('smsToken')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsToken"/>
                  </div>
                  <div className="panel-col-33">
                    <label>نام کاربری سیستم پیامکی</label>
                    <input
                      {...register('smsUserName')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsUserName"/>
                  </div>
                  <div className="panel-col-33">
                    <label>کلمه عبور سیستم پیامکی</label>
                    <input
                      {...register('smsPassword')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsPassword"/>
                  </div>
                  <div className="panel-col-33">
                    <label>شماره خط سیستم پیامکی</label>
                    <input
                      {...register('smsFrom')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsFrom"/>
                  </div>

                  <div className="w-full p-4 my-4">
                    <hr className="panel-section-separator"/>
                  </div>

                  <div className="panel-col-25">
                    <label>کد پترن پیامک یکبار مصرف</label>
                    <input
                      {...register('smsCodePattern1')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern1"/>
                  </div>

                  <div className="panel-col-25">
                    <label>کد پترن لغو رزرو<span
                      className="fa-regular-14px">خالی باشد = پیامک لفو ارسال نمی شود</span></label>
                    <input
                      {...register('smsCodePattern2')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern2"/>
                  </div>
                  <div className="panel-col-25">
                    <label>کد پترن تایید رزرو</label>
                    <input
                      {...register('smsCodePattern3')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern3"/>
                  </div>

                  <div className="panel-col-25">
                    <label>کد پترن تغییر وضعیت رزرو</label>
                    <input
                      {...register('smsCodePattern4')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern4"/>
                  </div>
                  <div className="panel-col-25">
                    <label>کد پترن یادآوری رزرو</label>
                    <input
                      {...register('smsCodePattern5')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern5"/>
                  </div>

                  <div className="panel-col-25">
                    <label>کد پترن قدردانی پس از انجام رزرو</label>
                    <input
                      {...register('smsCodePattern6')}
                      type="text" dir="ltr" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smsCodePattern6"/>
                  </div>

                  {/*<div className="panel-col-25">*/}
                  {/*  <label>پترن 7</label>*/}
                  {/*  <input*/}
                  {/*    {...register('smsCodePattern7')}*/}
                  {/*    type="text" dir="ltr" className="bk-input"/>*/}
                  {/*  <FormErrorMessage errors={errors} name="smsCodePattern7"/>*/}
                  {/*</div>*/}
                  {/*<div className="panel-col-25">*/}
                  {/*  <label>پترن 8</label>*/}
                  {/*  <input*/}
                  {/*    {...register('smsCodePattern8')}*/}
                  {/*    type="text" dir="ltr" className="bk-input"/>*/}
                  {/*  <FormErrorMessage errors={errors} name="smsCodePattern8"/>*/}
                  {/*</div>*/}

                  <div className="w-full p-4 my-4">
                    <hr className="panel-section-separator"/>
                  </div>

                  <div className="panel-col-25">
                    <label>نام میزبان SMTP</label>
                    <input
                      {...register('smtpURL')}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smtpURL"/>
                  </div>
                  <div className="panel-col-25">
                    <label>پورت</label>
                    <input
                      {...register('smtpPort', {
                        min: {
                          value: 0,
                          message: " باید از 0 بیشتر باشد."
                        },
                        max: {
                          value: 1000,
                          message: " نباید از 1000 معادل نهایتا یک هفته بیشتر باشد."
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'یک عدد صحیح وارد کنید.',
                        },
                      })}
                      onKeyPress={onlyTypeNumber}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smtpPort"/>
                  </div>
                  <div className="panel-col-25">
                    <label>نام کاربری</label>
                    <input
                      {...register('smtpUserName')}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smtpUserName"/>
                  </div>
                  <div className="panel-col-25">
                    <label>کلمه عبور</label>
                    <input
                      {...register('smtpPassword')}
                      type="text" className="bk-input"/>
                    <FormErrorMessage errors={errors} name="smtpPassword"/>
                  </div>
                  {
                    permissions.editConnections &&
                    <div className="panel-col-100">
                      <button
                        className={
                          'panel-form-submit ' +
                          (loading ? 'disable-action' : '')
                        }
                        type="submit">
                        {loading ? (
                          <TheSpinner/>
                        ) : (
                          <span><AiOutlineSave size="24px"
                                               className="inline-flex align-middle ml-2"/>ثبت ارتباطات</span>
                        )}
                      </button>
                    </div>
                  }
                </div>
              </form>
              {
                permissions.editConnections &&
                <>
                  <div className="w-full p-4 my-4">
                    <hr className="panel-section-separator"/>
                  </div>
                  <div className="panel-col-100">
                    <div className="prose prose-sm text-neutral-800 dark:text-white max-w-full">
                      <p className="font-bold text-primary-800">تست اتصالات</p>
                      <p>برای اینکه از اتصال سامانه پیامکی و ایمیل خود مطمن شوید میتوانید از این بخش استفاده کنید. توجه
                        فرمایید ثبت <strong>کد پترن پیامک یکبار مصرف</strong> ضروری است.</p>
                    </div>

                    <form onSubmit={handlerTestSms} className="flex-center-start gap-4 flex-wrap mt-4">
                      <input
                        onChange={e => setMobile(e.target.value)}
                        minLength={11}
                        maxLength={11}
                        onKeyPress={onlyTypeNumber}
                        placeholder="شماره موبایل خود را وارد کنید."
                        type="text" className="bk-input max-w-sm"/>
                      <button
                        type="submit"
                        className={
                          'bk-button-green ' +
                          (loadingTestSms ? 'disable-action' : '')
                        }>
                        {loadingTestSms ? (
                          <TheSpinner/>
                        ) : (
                          <span><FaSms size="24px" className="inline-flex align-middle ml-2"/>تست ارسال پیامک</span>
                        )}
                      </button>
                    </form>


                    <form onSubmit={handlerTestEmail} className="flex-center-start gap-4 flex-wrap mt-4">
                      <input
                        onChange={e => setEmail(e.target.value)}
                        placeholder="ایمیل خود را وارد کنید."
                        type="text" className="bk-input max-w-sm"/>
                      <button
                        type="submit"
                        className={
                          'bk-button-red ' +
                          (loadingTestEmail ? 'disable-action' : '')
                        }>
                        {loadingTestEmail ? (
                          <TheSpinner/>
                        ) : (
                          <span><MdEmail size="24px" className="inline-flex align-middle ml-2"/>تست ارسال ایمیـل</span>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              }
              <div className="w-full p-4 my-4">
                <hr className="panel-section-separator"/>
              </div>
              <div className="prose prose-sm text-neutral-800 dark:text-white max-w-full my-8">
                <div className="border-b dark:border-black">
                  <p className="font-bold text-primary-800">برای سامانه ملی پیامک</p>
                  <ul>
                    <li>آدرس API:<span className="mr-1 font-bold"
                                       dir="ltr">https://console.melipayamak.com/api/send/</span></li>
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
                  <p>کاوه نگار اجازه ارسال بیش از سه متغیر را نمیدهد پس باید جمع جورتر پیامک فرستاد.</p>
                  <ul>
                    <li>آدرس API:<span className="mr-1 font-bold" dir="ltr">https://api.kavenegar.com/v1/</span></li>
                    <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>مثال روش ثبت پترن:<span
                      className="mr-1 font-bold">رزرو با کد پیگیری <span dir="ltr">%token</span> روز: <span
                      dir="ltr">%token1</span> تاریخ: <span dir="ltr">%token2</span> ساعت: <span
                      dir="ltr">%token3</span> با موفقیت لغو شد.</span>
                    </li>
                  </ul>
                  <p className="font-bold text-primary-800">متغیرها:</p>
                  <ul>
                    <li>OTP:<span className="mr-1 font-bold">کد</span></li>
                    <li>cancellationReservation:<span className="mr-1 font-bold">کدرهگیری - تاریخ - ساعت</span></li>
                    <li>confirmReservation:<span className="mr-1 font-bold">کدرهگیری - تاریخ - ساعت</span></li>
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
                      className="mr-1 font-bold">رزرو با کد پیگیری <span dir="ltr">%trackingCode%</span> روز: <span
                      dir="ltr">%dateName%</span> تاریخ: <span dir="ltr">%date%</span> ساعت: <span
                      dir="ltr">%time%</span> با موفقیت لغو شد.</span>
                    </li>
                    <li>نام های متغیرهایی که باید استفاده کنید.<span className="mr-1 font-bold">trackingCode - dateName - date - time - service - provider - status</span>
                    </li>
                  </ul>
                  <p className="font-bold text-primary-800">برای سامانه فراز اس ام اس (روش 2)</p>
                  <ul>
                    <li>آدرس API:<span className="mr-1 font-bold" dir="ltr">https://ippanel.com/api/select</span></li>
                    <li>نام کاربری:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>رمز عبور:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>مثال روش ثبت پترن:<span
                      className="mr-1 font-bold">رزرو با کد پیگیری <span dir="ltr">%trackingCode%</span> روز: <span
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
                    <li>آدرس API:<span className="mr-1 font-bold" dir="ltr">https://ippanel.com/api/select</span></li>
                    <li>نام کاربری:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>رمز عبور:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>شماره خط:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>مثال روش ثبت پترن:<span
                      className="mr-1 font-bold">رزرو با کد پیگیری <span dir="ltr">%trackingCode%</span> روز: <span
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
                    <li>آدرس API:<span className="mr-1 font-bold" dir="ltr">https://api.sms.ir/v1</span></li>
                    <li>توکن:<span className="mr-1 font-bold">از سایتش دریافت کنید.</span></li>
                    <li>مثال روش ثبت پترن:<span
                      className="mr-1 font-bold">رزرو با کد پیگیری <span dir="ltr">#trackingCode#</span> روز: <span
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
            </>
            :
            <TheSpinner/>
        }
      </div>
    </>
  )
}