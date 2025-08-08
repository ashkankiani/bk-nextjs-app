'use client'
import { AiOutlineSave } from 'react-icons/ai'
import { useEffect } from 'react'
import { bkToast, OnlyTypeNumber } from '@/libs/utility'
import { useForm } from 'react-hook-form'
import TheSpinner from '@/components/layout/TheSpinner'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import Link from 'next/link'
import { TbPlugConnected } from 'react-icons/tb'
import useHook from '@/hooks/controller/useHook'
import { useGetSettings, useUpdateSetting } from '@/hooks/admin/useSetting'
import LicenceManagement from '@/app/admin/settings/components/LicenceManagement'
import { TypeApiSetting } from '@/types/typeApiEntity'

export default function TheSettingsUi() {
  const { permissions } = useHook()

  const items = [
    'name',
    'url',
    'address',
    'phone',
    'theme',
    'emailStatus',
    // "headerCode",
    'footerCode',
    'smsCancellationReservation',
    'emailCancellationReservation',
  ]
  const itemsBoolean = [
    'automaticConfirmation',
    'cancellationReservationUser',
    // "cancellationReservationProvider",
    'groupReservation',
    'shiftWorkStatus',
    'permissionSearchShiftWork',
    'registerOTP',
    'loginOTP',
    'cart',
    'guestReservation',
  ]
  const itemsInteger = [
    'id',
    'minReservationDate',
    'maxReservationDate',
    'minReservationTime',
    'cancellationDeadline',
    'maxReservationDaily',
    'maxReservationMonthly',
    'minReservationLock',
  ]

  const {
    data: dataSettings,
    isLoading: isLoadingSettings,
    isFetched: isFetchedSettings,
  } = useGetSettings()
  const { mutateAsync: mutateAsyncUpdateSetting, isPending: isPendingUpdateSetting } =
    useUpdateSetting()

  useEffect(() => {
    if (isFetchedSettings && dataSettings && dataSettings[0]) {
      items.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, dataSettings[0][item])
      })
      itemsBoolean.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, dataSettings[0][item].toString())
      })
      itemsInteger.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, parseInt(dataSettings[0][item]))
      })

      // setValue('id', dataPermission.id)
      // setValue('catalogId', dataPermission.catalogId)
    }
  }, [isFetchedSettings])

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeApiSetting>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeApiSetting) => {
    itemsBoolean.forEach(item => {
      // @ts-expect-error ok!
      data[item] = data[item] === 'true'
    })
    itemsInteger.forEach(item => {
      // @ts-expect-error ok!
      data[item] = parseInt(data[item])
    })

    await mutateAsyncUpdateSetting(data)
      .then(res => {
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  return (
    <>
      <HeaderPage
        title="تنظیمات"
        description="تنظیمات ظاهری و نمایشی و پیکربندی وب سرویس خود را انجام دهید."
      >
        {permissions.viewConnections && (
          <Link href="/admin/connections" className="action">
            <TbPlugConnected size="24px" className="ml-2 inline-flex align-middle" />
            <span>پیامک و درگاه بانکی</span>
          </Link>
        )}
      </HeaderPage>

      <div className="panel-main">
        {isLoadingSettings ? (
          <TheSpinner />
        ) : (
          <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-center-start flex-wrap">
              <div className="panel-col-33">
                <label>
                  نام برند<span>*</span>
                </label>
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'نام برند ضروری است',
                    },
                  })}
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="name" />
              </div>
              <div className="panel-col-33">
                <label>آدرس وب سایت</label>
                <input {...register('url')} type="text" className="bk-input" />
                <FormErrorMessage errors={errors} name="url" />
              </div>
              <div className="panel-col-33">
                <label>آدرس پستی</label>
                <input {...register('address')} type="text" className="bk-input" />
                <FormErrorMessage errors={errors} name="address" />
              </div>
              <div className="panel-col-33">
                <label>شماره تماس</label>
                <input
                  {...register('phone')}
                  onKeyDown={OnlyTypeNumber}
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="phone" />
              </div>
              <div className="panel-col-33">
                <label>
                  پوسته ظاهری سایت<span>*</span>
                </label>
                <select
                  {...register('theme', {
                    required: {
                      value: true,
                      message: 'پوسته ظاهری سایت ضروری است',
                    },
                  })}
                  defaultValue="THEME1"
                  className="bk-input"
                >
                  <option value="THEME1">قالب نمایشی 1</option>
                  <option value="THEME2">قالب نمایشی 2</option>
                  <option value="THEME3">قالب نمایشی 3</option>
                </select>
                <FormErrorMessage errors={errors} name="theme" />
              </div>
              <div className="panel-col-33">
                <label>
                  حداقل زمان شروع رزرو<span>*</span>
                </label>
                <input
                  {...register('minReservationDate', {
                    required: {
                      value: true,
                      message: 'حداقل زمان شروع رزرو ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    max: {
                      value: 60,
                      message: ' نباید از 60 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="از زمان حال تا چند روز آینده میتواند رزرو کند."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="minReservationDate" />
              </div>
              <div className="panel-col-33">
                <label>
                  حداکثر زمان پایان رزرو<span>*</span>
                </label>
                <input
                  {...register('maxReservationDate', {
                    required: {
                      value: true,
                      message: 'حداکثر زمان پایان رزرو ضروری است',
                    },
                    min: {
                      value:
                        Number(watch('minReservationDate')) > 60
                          ? 0
                          : Number(watch('minReservationDate')),
                      message:
                        ' برابر یا بزرگتر از ' + watch('minReservationDate') + ' بیشتر باشد.',
                    },
                    max: {
                      value: 60,
                      message: ' نباید از 60 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="از زمان حال تا چند روز آینده میتواند رزرو کند."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="maxReservationDate" />
              </div>
              <div className="panel-col-33">
                <label>
                  حداقل دقیقه قبل شروع رزرو<span>*</span>
                </label>
                <input
                  {...register('minReservationTime', {
                    required: {
                      value: true,
                      message: 'حداقل دقیقه قبل شروع رزرو ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    max: {
                      value: 1439,
                      message: ' نباید از 1439 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="چند دقیقه قبل از شروع اولین رزرو میتواند رزرو کند."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="minReservationTime" />
              </div>
              <div className="panel-col-33">
                <label>
                  وضعیت پیش فرض رزرو<span>*</span>
                </label>
                <select
                  {...register('automaticConfirmation', {
                    required: {
                      value: true,
                      message: 'وضعیت پیش فرض رزرو ضروری است',
                    },
                    // setValueAs: value => value === 'true',
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، بلافاصله رزرو تکمیل شود.</option>
                  <option value="false">خیر، در صف بررسی قرار گیرد.</option>
                </select>
                <FormErrorMessage errors={errors} name="automaticConfirmation" />
              </div>
              <div className="panel-col-33">
                <label>
                  امکان لغو رزرو برای کاربر<span>*</span>
                </label>
                <select
                  {...register('cancellationReservationUser', {
                    required: {
                      value: true,
                      message: 'امکان لغو رزرو برای کاربر ضروری است',
                    },
                    // setValueAs: value => value === 'true',
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، میتواند رزروش را لغو کند.</option>
                  <option value="false">خیر، نمیتواند رزروش را لغو کند.</option>
                </select>
                <FormErrorMessage errors={errors} name="cancellationReservationUser" />
              </div>
              {/*
                <div className="panel-col-33">
                  <label>امکان لغو رزرو برای ارائه دهنده<span>*</span></label>
                  <select
                    {...register('cancellationReservationProvider', {
                      required: {
                        value: true,
                        message: 'امکان لغو رزرو برای ارائه دهنده ضروری است',
                      },
                      // setValueAs: value => value === 'true',
                    })}
                    className="bk-input">
                    <option value="true">بله، میتواند رزرو کاربر را لغو کند.</option>
                    <option value="false">خیر، نمیتواند رزرو کاربر را لغو کند.</option>
                  </select>
                  <FormErrorMessage errors={errors} name="cancellationReservationProvider"/>
                </div>
*/}
              <div className="panel-col-33">
                <label>
                  اطلاع رسانی پیامکی لغو رزرو<span>*</span>
                </label>
                <select
                  {...register('smsCancellationReservation', {
                    required: {
                      value: true,
                      message: 'اطلاع رسانی پیامکی لغو رزرو ضروری است',
                    },
                  })}
                  defaultValue="ADMIN-PROVIDER-USER"
                  className="bk-input"
                >
                  <option value="NONE">بدون ارسال پیامک</option>
                  <option value="ADMIN">ارسال به مدیر سرویس</option>
                  <option value="PROVIDER">ارسال به ارائه دهنده</option>
                  <option value="USER">ارسال به کاربر</option>
                  <option value="ADMIN_PROVIDER">ارسال به مدیر سرویس + ارائه دهنده</option>
                  <option value="ADMIN_USER">ارسال به مدیر سرویس + کاربر</option>
                  <option value="PROVIDER_USER">ارسال به ارائه دهنده + کاربر</option>
                  <option value="ADMIN_PROVIDER_USER">
                    ارسال به مدیر سرویس + ارائه دهنده + کاربر
                  </option>
                </select>
                <FormErrorMessage errors={errors} name="smsCancellationReservation" />
              </div>
              <div className="panel-col-33">
                <label>
                  اطلاع رسانی ایمیل لغو رزرو<span>*</span>
                </label>
                <select
                  {...register('emailCancellationReservation', {
                    required: {
                      value: true,
                      message: 'اطلاع رسانی ایمیل لغو رزرو ضروری است',
                    },
                  })}
                  defaultValue="ADMIN-PROVIDER-USER"
                  className="bk-input"
                >
                  <option value="NONE">بدون ارسال ایمیل</option>
                  <option value="ADMIN">ارسال به مدیر سرویس</option>
                  <option value="PROVIDER">ارسال به ارائه دهنده</option>
                  <option value="USER">ارسال به کاربر</option>
                  <option value="ADMIN_PROVIDER">ارسال به مدیر سرویس + ارائه دهنده</option>
                  <option value="ADMIN_USER">ارسال به مدیر سرویس + کاربر</option>
                  <option value="PROVIDER_USER">ارسال به ارائه دهنده + کاربر</option>
                  <option value="ADMIN_PROVIDER_USER">
                    ارسال به مدیر سرویس + ارائه دهنده + کاربر
                  </option>
                </select>
                <FormErrorMessage errors={errors} name="emailCancellationReservation" />
              </div>
              <div className="panel-col-33">
                <label>
                  حداقل دقیقه مورد نیاز قبل از لغو<span>*</span>
                </label>
                <input
                  {...register('cancellationDeadline', {
                    required: {
                      value: true,
                      message: 'حداقل دقیقه مورد نیاز قبل از لغو ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    max: {
                      value: 10080,
                      message: ' نباید از 10080 معادل نهایتا یک هفته بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  type="text"
                  className="bk-input"
                  placeholder="چند دقیقه مانده به شروع رزرو میتوان رزرو را حذف یا لغو کرد."
                />
                <FormErrorMessage errors={errors} name="cancellationDeadline" />
              </div>
              <div className="panel-col-33">
                <label>
                  امکان رزرو گروهی<span>*</span>
                </label>
                <select
                  {...register('groupReservation', {
                    required: {
                      value: true,
                      message: 'امکان رزرو گروهی ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، میتواند چندین رزرو را همزمان سفارش دهد.</option>
                  <option value="false">خیر، در هر سفارش میتواند فقط یک رزرو سفارش دهد.</option>
                </select>
                <FormErrorMessage errors={errors} name="groupReservation" />
              </div>
              <div className="panel-col-33">
                <label>
                  وضعیت ایمیل در ایجاد کاربر<span>*</span>
                </label>
                <select
                  {...register('emailStatus', {
                    required: {
                      value: true,
                      message: 'وضعیت ایمیل در ایجاد کاربر ضروری است',
                    },
                  })}
                  defaultValue="OPTIONAL"
                  className="bk-input"
                >
                  <option value="OPTIONAL">اختیاری باشد.</option>
                  <option value="MANDATORY">اجباری باشد.</option>
                  <option value="DELETE">فیلد حذف شود.</option>
                </select>
                <FormErrorMessage errors={errors} name="emailStatus" />
              </div>

              <div className="panel-col-33">
                <label>
                  حداکثر تعداد رزرو کاربر در روز<span>*</span>
                  <span className="fa-regular-14px">رزرو نامحدود = 0</span>
                </label>
                <input
                  {...register('maxReservationDaily', {
                    required: {
                      value: true,
                      message: 'حداکثر تعداد رزرو کاربر در روز ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    max: {
                      value: 100,
                      message: ' نباید از 100 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="هر رزرو یک رزرو حساب می شود."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="maxReservationDaily" />
              </div>
              <div className="panel-col-33">
                <label>
                  حداکثر تعداد نوبت در ماه<span>*</span>
                  <span className="fa-regular-14px">رزرو نامحدود = 0</span>
                </label>
                <input
                  {...register('maxReservationMonthly', {
                    required: {
                      value: true,
                      message: 'حداکثر تعداد نوبت در ماه ضروری است',
                    },
                    max: {
                      value: 100,
                      message: ' نباید از 100 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="در یک ماه میتواند چند نوبت رزرو کند."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="maxReservationMonthly" />
              </div>
              <div className="panel-col-33">
                <label>
                  وضعیت باکس روزهای بدون نوبت کاری<span>*</span>
                </label>
                <select
                  {...register('shiftWorkStatus', {
                    required: {
                      value: true,
                      message: 'وضعیت باکس روزهای بدون نوبت کاری ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">
                    بله، اگر نوبت کاری در آن روز وجود ندارد باکس را نمایش بده.
                  </option>
                  <option value="false">
                    خیر، اگر نوبت کاری در آن روز وجود ندارد باکس را نمایش نده.
                  </option>
                </select>
                <FormErrorMessage errors={errors} name="shiftWorkStatus" />
              </div>
              <div className="panel-col-33">
                <label>
                  اجازه جستجوی نوبت کاری<span>*</span>
                </label>
                <select
                  {...register('permissionSearchShiftWork', {
                    required: {
                      value: true,
                      message: 'اجازه جستجوی نوبت کاری ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، بدون ورود به حساب کاربری میتواند جستجو نماید.</option>
                  <option value="false">خیر، بدون ورود به حساب کاربری نمیتواند جستجو نماید.</option>
                </select>
                <FormErrorMessage errors={errors} name="permissionSearchShiftWork" />
              </div>

              <div className="panel-col-33">
                <label>
                  ثبت نام کاربر با تایید شماره موبایل<span>*</span>
                </label>
                <select
                  {...register('registerOTP', {
                    required: {
                      value: true,
                      message: 'ثبت نام کاربر با تایید شماره موبایل ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">
                    بله، هنگام ثبت نام کاربر باید شماره موبایل خود را تایید نماید.
                  </option>
                  <option value="false">
                    خیر، هنگام ثبت نام نیازی به تایید شماره موبایل کاربر نیست.
                  </option>
                </select>
                <FormErrorMessage errors={errors} name="registerOTP" />
              </div>

              <div className="panel-col-33">
                <label>
                  ورود کاربر با کد تایید یکبار مصرف پیامکی<span>*</span>
                </label>
                <select
                  {...register('loginOTP', {
                    required: {
                      value: true,
                      message: 'ورود کاربر با کد تایید یکبار مصرف پیامکی ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">
                    بله، هنگام ورود کاربر میتواند با روش کد یکبار مصرف وارد سیستم شود.
                  </option>
                  <option value="false">
                    خیر، هنگام ورود کاربر با کدملی و رمزعبور وارد سیستم شود.
                  </option>
                </select>
                <FormErrorMessage errors={errors} name="loginOTP" />
              </div>

              <div className="panel-col-33">
                <label>
                  وضعیت ایجاد سبد خرید<span>*</span>
                </label>
                <select
                  {...register('cart', {
                    required: {
                      value: true,
                      message: 'وضعیت ایجاد سبد خرید ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، کاربران بتوانند خدمات مختلف را یکجا خرید کنند.</option>
                  <option value="false">خیر، کاربران فقط میتوانند یک خدمت خرید کنند.</option>
                </select>
                <FormErrorMessage errors={errors} name="cart" />
              </div>

              <div className="panel-col-33">
                <label>
                  حداقل مدت زمان قفل نوبت انتخاب شده<span>*</span>
                </label>
                <input
                  {...register('minReservationLock', {
                    required: {
                      value: true,
                      message: 'حداقل مدت زمان قفل نوبت انتخاب شده ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    max: {
                      value: 8644,
                      message: ' نباید از 86400 معادل نهایتا یک روز بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  type="text"
                  className="bk-input"
                  placeholder="نوبت رزرو شده کاربر تا چند دقیقه تا تایید پرداخت بانک باید قفل شود."
                />
                <FormErrorMessage errors={errors} name="minReservationLock" />
              </div>

              <div className="panel-col-33">
                <label>
                  رزرو سریع به عنوان مهمان<span>*</span>
                </label>
                <select
                  {...register('guestReservation', {
                    required: {
                      value: true,
                      message: 'رزرو سریع به عنوان مهمان ضروری است',
                    },
                  })}
                  className="bk-input"
                >
                  <option value="true">بله، بدون عضویت میتواند نوبت رزرو نماید.</option>
                  <option value="false">خیر، برای رزرو نوبت باید ثبت نام نماید.</option>
                </select>
                <FormErrorMessage errors={errors} name="guestReservation" />
              </div>

              <div className="my-4 w-full p-4">
                <hr className="panel-section-separator" />
              </div>

              {/*<div className="panel-col-100">*/}
              {/*  <label>اسکریپت در هدر</label>*/}
              {/*  <textarea*/}
              {/*    {...register('headerCode')}*/}
              {/*    dir="ltr"*/}
              {/*    rows={5} className="bk-input text-left"/>*/}
              {/*  <FormErrorMessage errors={errors} name="headerCode"/>*/}
              {/*</div>*/}

              <div className="panel-col-100">
                <label>اسکریپت در فوتر</label>
                <textarea
                  {...register('footerCode')}
                  dir="ltr"
                  rows={5}
                  className="bk-input text-left"
                />
                <FormErrorMessage errors={errors} name="footerCode" />
              </div>
              {permissions.editSettings && (
                <div className="panel-col-100">
                  <button
                    className={
                      'panel-form-submit ' + (isPendingUpdateSetting ? 'disable-action' : '')
                    }
                    type="submit"
                  >
                    {isPendingUpdateSetting ? (
                      <TheSpinner />
                    ) : (
                      <span>
                        <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                        ثبت تنظیمات
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
        <LicenceManagement />
      </div>
    </>
  )
}
