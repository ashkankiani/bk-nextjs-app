'use client'
import Link from 'next/link'
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import { bkToast, textGenderType } from '@/libs/utility'
import { useState } from 'react'

import TheSpinner from '@/components/layout/TheSpinner'
import { fullStringToDateObjectP } from '@/libs/convertor'
import { setCart } from '@/store/slice/user'
import { IoClose } from 'react-icons/io5'
import Popup from 'reactjs-popup'
import useHook from '@/hooks/controller/useHook'
import { useAvailableTimes } from '@/hooks/user/useReservation'
import { TypeApiService } from '@/types/typeApiEntity'
import { TypeApiGetProvidersByServiceIdRes } from '@/types/typeApiUser'
import { TypeGender } from '@/types/typeConfig'

export type TypeCart = {
  service: TypeApiService
  provider: TypeApiGetProvidersByServiceIdRes
  price: number
  date: string
  time: string[]
}

export default function TheReserveUi() {
  const { dispatch, router, searchQuery, cart, isLogin, user, setting } = useHook()

  const [selectCart, setSelectCart] = useState<TypeCart[]>([])

  const { data: dataAvailableTimes, isLoading: isLoadingAvailableTimes } = useAvailableTimes({
    ...(user && { userId: user.id }),
    serviceId: searchQuery?.service.id ?? 0,
    providerId: searchQuery?.provider.id ?? 0,
    startDate: searchQuery?.startDate ?? '',
    endDate: searchQuery?.endDate ?? '',
    status: ['REVIEW', 'COMPLETED', 'DONE', 'PENDING'],
  })

  const goCheckout = () => {
    // اگر سبد خرید فعال باشد رزرو انتخابی با رزروهای سبد خرید باید تجمیع بشوند
    if (setting.cart) {
      const combined = selectCart.concat(cart)
      // حذف موارد تکراری بین سبد خرید و انتخاب شده
      const uniqueCombined: TypeCart[] = combined.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            t =>
              t.provider.id === item.provider.id &&
              t.service.id === item.service.id &&
              t.date === item.date &&
              JSON.stringify(t.time) === JSON.stringify(item.time)
          )
      )
      dispatch(setCart(uniqueCombined))
    } else {
      dispatch(setCart(selectCart))
    }

    if (isLogin && user !== null && searchQuery?.service.gender !== 'NONE') {
      if (user.gender === 'NONE') {
        bkToast('error', 'لطفا ابتدا در پروفایل خود جنسیت خود را انتخاب کنید.')
        return
      } else if (user.gender !== searchQuery?.service.gender) {
        bkToast(
          'error',
          'این نوبت مخصوص ' + textGenderType(searchQuery?.service.gender as TypeGender) + ' میباشد.'
        )
        return
      }
    }
    router.push('/checkout')
  }

  // افزودن نوبت های انتخاب شده
  const addTimeUserSelected = (dateTime: TypeCart) => {
    const exists = cart.some(item => JSON.stringify(item) === JSON.stringify(dateTime))
    if (exists) {
      const indexArray = cart.findIndex(item => JSON.stringify(item) === JSON.stringify(dateTime))
      setSelectCart(cart.filter((_, index) => index !== indexArray))
    } else {
      setSelectCart(prevListTimeUserSelected => [...prevListTimeUserSelected, dateTime])
    }
  }

  return (
    <div className="bk-box md:w-10/12">
      <TheHeader />
      <div className="bk-box-wrapper">
        {searchQuery ? (
          <>
            <h1 className="bk-box-wrapper-title">انتخاب وقت رزرو</h1>
            <p className="bk-box-wrapper-description">تاریخ و زمان رزرو خود را انتخاب کنید.</p>
            {
              <p className="mb-4 text-center text-lg">
                <span>شما در حال رزرو</span>
                <strong className="px-1">{searchQuery.service.name}</strong>
                <span>برای</span>
                <strong className="px-1">{searchQuery.provider.user.fullName}</strong>
                <span>در بازه</span>
                <strong className="px-1" dir="ltr">
                  {searchQuery.startDate}
                </strong>
                <span>تا</span>
                <strong className="px-1" dir="ltr">
                  {searchQuery.endDate}
                </strong>
                <span>هستید.</span>
              </p>
            }
            {searchQuery.service.gender !== 'NONE' && (
              <p className="mb-4 text-center text-lg">
                <span>رزرو نوبت فقط برای جنسیت</span>
                <strong className="px-1 underline underline-offset-8">
                  {textGenderType(searchQuery.service.gender)}
                </strong>
                <span>امکان پذیر است.</span>
              </p>
            )}
            <form>
              <div className="md:flex-stretch-start my-8 max-h-[600px] flex-wrap overflow-y-auto">
                {isLoadingAvailableTimes ? (
                  <div>
                    <TheSpinner />
                  </div>
                ) : dataAvailableTimes && dataAvailableTimes.length > 0 ? (
                  dataAvailableTimes?.map((dataTime, index) =>
                    dataTime.dayIsHoliday ? (
                      <div className="select" key={index}>
                        <div className="header-select">
                          <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                          <div>{dataTime.date}</div>
                        </div>
                        <div className="box-select py-4">
                          <span className="pl-1 text-red-500">تعطیل رسمی:</span>
                          <span>{dataTime.title}</span>
                        </div>
                      </div>
                    ) : dataTime.timeSheet.length ? (
                      <div className="select" key={index}>
                        <div className="header-select">
                          <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                          <div>{dataTime.date}</div>
                        </div>
                        <div className="box-select">
                          {dataTime.timeSheet.map((time, indexTime) => (
                            <div
                              className={
                                'row-select ' + (time[2] ? 'bg-neutral-100 dark:bg-darkNavy3' : '')
                              }
                              key={indexTime}
                            >
                              <label
                                htmlFor={index + '-' + indexTime}
                                className={'row-select-label ' + (time[2] ? 'disable-action' : '')}
                              >
                                {time[0]} تا {time[1]} {time[2] && time[3]} (ظرفیت خالی {time[4]}{' '}
                                نوبت)
                              </label>
                              <input
                                onChange={() =>
                                  !time[2]
                                    ? addTimeUserSelected({
                                        service: searchQuery.service,
                                        provider: searchQuery.provider,
                                        price: searchQuery.service.price,
                                        // serviceName: searchQuery.service.serviceName,
                                        // providerName: searchQuery.provider.providerName,
                                        date: dataTime.date,
                                        time: [time[0] as string, time[1] as string],
                                        // userId: user !== null ? user.id : null
                                      })
                                    : false
                                }
                                id={index + '-' + indexTime}
                                type="checkbox"
                                className={time[2] ? 'bk-checkbox-active' : 'bk-checkbox'}
                                disabled={time[2] as boolean}
                                defaultChecked={time[2] as boolean}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      setting.shiftWorkStatus && (
                        <div className="select" key={index}>
                          <div className="header-select">
                            <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                            <div>{dataTime.date}</div>
                          </div>
                          <div className="box-select py-4">
                            <span className="pl-1 text-red-500">نداشتن نوبت:</span>
                            <span>نوبت کاری برای این روز وجود ندارد</span>
                          </div>
                        </div>
                      )
                    )
                  )
                ) : (
                  <div className="mx-auto w-fit rounded-md bg-white bg-opacity-50 p-4 text-center dark:bg-opacity-5">
                    <h2 className="fa-bold-22px mb-2 font-semibold">
                      نوبت رزروی برای این بازه وجود ندارد
                    </h2>
                    <p className="fa-regular-18px mb-0 leading-10">
                      به عقب برگردید و یک بازه زمانی دیگر تلاش کنید.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex-center-center mt-2 flex-wrap gap-2 md:gap-x-4">
                {selectCart.length > 0 && (
                  <>
                    <div className="bk-button fa-sbold-18px w-full bg-green-700 dark:bg-primary-900 sm:w-36">
                      <div className="flex-center-center">
                        <span className="flex-center-center ml-2 h-7 w-7 rounded-full bg-green-900">
                          {selectCart.length}
                        </span>
                        <span>نوبت رزرو</span>
                      </div>
                    </div>
                    {(setting.groupReservation && selectCart.length > 0) ||
                    (!setting.groupReservation && selectCart.length === 1) ? (
                      <div
                        onClick={() => goCheckout()}
                        className="bk-button fa-sbold-18px w-full cursor-pointer bg-primary-700 dark:bg-primary-900 sm:w-36"
                      >
                        مرحله بعد
                      </div>
                    ) : (
                      <div className="bk-button fa-sbold-18px w-full bg-red-700 dark:bg-red-500 sm:w-80">
                        بیش از یک نوبت نمیتوانید رزرو کنید.
                      </div>
                    )}
                  </>
                )}

                {searchQuery.service.description && selectCart.length === 0 && (
                  <Popup
                    className="bg-modal"
                    contentStyle={{ width: '100%' }}
                    trigger={
                      <div className="bk-button fa-sbold-18px w-full cursor-pointer bg-green-900 sm:w-44">
                        معرفی سرویس
                      </div>
                    }
                    modal
                    nested
                  >
                    {(close: () => void) => (
                      <div className="panel-wrapper-modal max-w-[600px]">
                        <IoClose
                          size="32px"
                          onClick={close}
                          className="absolute left-4 top-4 cursor-pointer"
                        />
                        <div className="panel-modal-title">معرفی سرویس</div>
                        <div
                          className="panel-modal-content"
                          dangerouslySetInnerHTML={{
                            __html: searchQuery.service.description as string,
                          }}
                        ></div>
                      </div>
                    )}
                  </Popup>
                )}

                {searchQuery.provider.description && selectCart.length === 0 && (
                  <Popup
                    className="bg-modal"
                    contentStyle={{ width: '100%' }}
                    trigger={
                      <div className="bk-button fa-sbold-18px w-full cursor-pointer bg-primary-700 dark:bg-primary-900 sm:w-44">
                        معرفی اپراتور
                      </div>
                    }
                    modal
                    nested
                  >
                    {(close: () => void) => (
                      <div className="panel-wrapper-modal max-w-[600px]">
                        <IoClose
                          size="32px"
                          onClick={close}
                          className="absolute left-4 top-4 cursor-pointer"
                        />
                        <div className="panel-modal-title">معرفی اپراتور</div>
                        <div
                          className="panel-modal-content"
                          dangerouslySetInnerHTML={{
                            __html: searchQuery.provider.description as string,
                          }}
                        ></div>
                      </div>
                    )}
                  </Popup>
                )}
                <Link
                  href="/"
                  className="bk-button fa-sbold-18px w-full bg-gray-500 dark:bg-gray-700 sm:w-24"
                >
                  بازگشت
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div>
            <p className="bk-box-wrapper-title">رزروی وجود ندارد</p>
            <Link
              href="/"
              className="bk-button fa-sbold-18px mx-auto w-full bg-gray-500 dark:bg-gray-700 sm:w-24"
            >
              بازگشت
            </Link>
          </div>
        )}
      </div>
      <TheFooter />
    </div>
  )
}
