'use client'
import { useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Controller, useForm } from 'react-hook-form'
import { bkToast, checkingTimeBetweenTimes, PNtoEN } from '@/libs/utility'
import { dateNowP, numberWithCommas } from '@/libs/convertor'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import { setSearchQuery } from '@/store/slice/user'
import Link from 'next/link'
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import useController from '@/hooks/controller/useController'
import useHook from '@/hooks/controller/useHook'
import { useGetServices } from '@/hooks/user/useService'
import { useGetProvidersByServiceId } from '@/hooks/user/useProvider'
import { TypeApiGetProvidersByServiceIdRes, TypeApiGetServicesRes } from '@/types/typeApiUser'

export default function TheHomeUi() {
  const { dispatch, theme, isLogin, user, setting, router } = useHook()

  const { setStartEndDate } = useController()

  const [activeService, setActiveService] = useState<TypeApiGetServicesRes | null>(null)
  const [activeProvider, setActiveProvider] = useState<TypeApiGetProvidersByServiceIdRes | null>(
    null
  )

  const { data: dataServices, isLoading: isLoadingServices } = useGetServices()
  const { data: dataProviders, isLoading: isLoadingProviders } = useGetProvidersByServiceId(
    {
      serviceId: activeService?.id ?? 0,
    },
    {
      enabled: !!activeService,
    }
  )

  type TypeFormInTheHomeUi = {
    serviceId: number
    providerId: number
    startDate: DateObject
    endDate: DateObject
  }
  type TypeFormOutTheHomeUi = {
    service: TypeApiGetServicesRes
    provider: TypeApiGetProvidersByServiceIdRes
    startDate: string
    endDate: string
  }

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeFormInTheHomeUi>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeFormInTheHomeUi) => {
    if (!activeService || !activeProvider) {
      bkToast('success', 'سرویس یا ارائه دهنده ای وجود ندارد.')
      return
    }

    const transformedData: TypeFormOutTheHomeUi = {
      service: activeService,
      provider: activeProvider,
      startDate: PNtoEN(data.startDate.format('YYYY/MM/DD')),
      // startDate: data.startDate.setHour(0).setMinute(0).setSecond(0).setMillisecond(0).format("YYYY-MM-DD"),
      endDate: PNtoEN(data.endDate.format('YYYY/MM/DD')),
      // endDate: data.endDate.setHour(23).setMinute(59).setSecond(59).setMillisecond(999).format("YYYY-MM-DD")
    }

    dispatch(setSearchQuery(transformedData))
    router.push('/reserve')
  }

  const handlerSetService = (id: number) => {
    const service = dataServices!.filter(item => item.id === id)[0]
    setActiveService(service)
  }

  const handlerSetProvider = (id: number) => {
    const provider = dataProviders!.filter(item => item.id === id)[0]
    setActiveProvider(provider)
  }

  return (
    <>
      <div className="bk-box md:w-8/12 lg:w-5/12">
        <TheHeader />
        <div className="bk-box-wrapper">
          <h1 className="bk-box-wrapper-title">دریافت نوبت</h1>
          <p className="bk-box-wrapper-description">
            {user && <strong className="pl-1">{user.fullName}</strong>}
            <span>به سامانه نوبت گیری سریع ما خوش آمدید.</span>
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="columns-1 gap-4 sm:mb-4 sm:columns-2">
              <select
                {...register('serviceId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'خدمت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input indent-2 max-sm:mb-2"
                onChange={e => handlerSetService(Number(e.target.value))}
              >
                {isLoadingServices ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataServices && dataServices.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب خدمت
                    </option>
                    {dataServices?.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                        disabled={
                          item.startDate !== null &&
                          item.endDate !== null &&
                          checkingTimeBetweenTimes(item.startDate, item.endDate)
                        }
                      >
                        {item.name}
                        {item.startDate !== null &&
                          item.endDate !== null &&
                          checkingTimeBetweenTimes(item.startDate, item.endDate) &&
                          ' (پایان زمان خدمت)'}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>خدمتی برای نمایش وجود ندارد.</option>
                )}
              </select>

              <select
                {...register('providerId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'ارائه دهنده ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input indent-2 max-sm:mb-2"
                onChange={e => handlerSetProvider(Number(e.target.value))}
              >
                {isLoadingProviders ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataProviders && dataProviders.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب ارائه دهنده
                    </option>
                    {dataProviders?.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                        disabled={
                          (item.startDate &&
                            item.endDate &&
                            checkingTimeBetweenTimes(item.startDate, item.endDate)) ||
                          !item.status
                        }
                      >
                        {item.user.fullName} - {numberWithCommas(item.service.price!)} تومان
                        {item.startDate &&
                          item.endDate &&
                          checkingTimeBetweenTimes(item.startDate, item.endDate) &&
                          ' (پایان زمان ارائه دهنده)'}
                        {!item.status && ' (غیرفعال شده توسط مدیریت)'}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا خدمت را انتخاب کنید.</option>
                )}
              </select>
            </div>
            <div className="columns-1 gap-4 sm:mb-4 sm:columns-2">
              <Controller
                control={control}
                name="startDate"
                rules={{
                  required: {
                    value: true,
                    message: 'تاریخ شروع ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      editable={false}
                      value={value}
                      onChange={date => {
                        onChange(date?.isValid ? date : undefined)
                      }}
                      containerClassName="w-full max-sm:mb-2"
                      className={'red ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      minDate={dateNowP().add(setting.minReservationDate, 'day')}
                      maxDate={dateNowP().add(setting.maxReservationDate, 'day')}
                      placeholder="تاریخ شروع"
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="endDate"
                rules={{
                  required: {
                    value: true,
                    message: 'تاریخ پایان ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      editable={false}
                      value={value}
                      onChange={date => {
                        onChange(date?.isValid ? date : undefined)
                      }}
                      containerClassName="w-full max-sm:mb-2"
                      className={'red ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      minDate={dateNowP().add(setting.minReservationDate, 'day')}
                      maxDate={dateNowP().add(setting.maxReservationDate, 'day')}
                      placeholder="تاریخ پایان"
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    />
                  </>
                )}
              />
            </div>

            {Object.keys(errors).length !== 0 && (
              <div className="flex-center-center fa-regular-16px mb-4 gap-2 rounded bg-white p-2">
                <FormErrorMessage errors={errors} name="serviceId" />
                <FormErrorMessage errors={errors} name="providerId" />
                <FormErrorMessage errors={errors} name="startDate" />
                <FormErrorMessage errors={errors} name="endDate" />
              </div>
            )}
            {setting.minReservationDate === 0 && (
              <div className="flex-center-center mb-4 mt-2 flex-wrap gap-2 sm:my-6 sm:gap-4">
                <div
                  className="bk-button cursor-pointer bg-primary-800 p-2 dark:bg-primary-900"
                  onClick={() => setStartEndDate('today', setValue)}
                >
                  برای امروز
                </div>
                <div
                  className="bk-button cursor-pointer bg-primary-800 p-2 dark:bg-primary-900"
                  onClick={() => setStartEndDate('tomorrow', setValue)}
                >
                  برای فردا
                </div>
                <div
                  className="bk-button cursor-pointer bg-primary-800 p-2 dark:bg-primary-900"
                  onClick={() => setStartEndDate('7day', setValue)}
                >
                  7 روز آینده
                </div>
                <div
                  className="bk-button cursor-pointer bg-primary-800 p-2 dark:bg-primary-900"
                  onClick={() => setStartEndDate('30day', setValue)}
                >
                  30 روز آینده
                </div>
                <div
                  className="bk-button cursor-pointer bg-primary-800 p-2 dark:bg-primary-900"
                  onClick={() => setStartEndDate('nextMonth', setValue)}
                >
                  ماه آینده
                </div>
              </div>
            )}
            {isLogin || setting.permissionSearchShiftWork ? (
              <div className="mt-2">
                <button className="bk-button fa-sbold-18px mx-auto w-full bg-primary-500 dark:bg-primary-900 sm:w-36">
                  جستجو
                </button>
              </div>
            ) : (
              <p className="fa-regular-18px text-center">
                <span>برای جستجوی نوبت باید</span>
                <Link className="fa-bold-18px px-1 text-red-800" href="/account/sign-in">
                  وارد سیستم
                </Link>
                <span>شوید.</span>
              </p>
            )}
          </form>
        </div>
        <TheFooter />
      </div>
    </>
  )
}
