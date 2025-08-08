'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import {Fragment, useEffect, useState} from 'react'
import { bkToast, generateTrackingCodeWithDate, PNtoEN, textGenderType } from '@/libs/utility'
import { Controller, useForm } from 'react-hook-form'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import TheSpinner from '@/components/layout/TheSpinner'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import useHook from '@/hooks/controller/useHook'
import { useGetServices } from '@/hooks/admin/useService'
import { useGetUsersByCatalogId } from '@/hooks/admin/useUser'
import { useGetProvidersByServiceId } from '@/hooks/admin/useProvider'
import {
  TypeApiGetProvidersByServiceIdRes,
  TypeApiGetServicesRes,
} from '@/types/typeApiAdmin'
import {TypeGender, TypePaymentType, TypeReservationsStatus} from '@/types/typeConfig'
import {  TypeApiUser } from '@/types/typeApiEntity'
import { useAddReservation, useAvailableTimes } from '@/hooks/admin/useReservation'

export default function TheAddReservationsUi() {
  const { router, theme } = useHook()


  // const [reservedTimes, setReservedTimes] = useState([])

  const [timeSelected, setTimeSelected] = useState(null)

  const [activeService, setActiveService] = useState<TypeApiGetServicesRes | null>(null)
  const [activeProvider, setActiveProvider] = useState<TypeApiGetProvidersByServiceIdRes | null>(null)
  const [activeUser, setActiveUser] = useState<TypeApiUser | null>(null)
  const [activeDate, setActiveDate] = useState<DateObject | null>(null)


  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeTheAddReservationsUi>({
    criteriaMode: 'all',
  })


  const { data: dataServices, isLoading: isLoadingServices } = useGetServices()
  const { data: dataUsers, isLoading: isLoadingUsers } = useGetUsersByCatalogId(1, {
    enabled: isLoadingServices,
  }) // ایدی 1 برای کاربران معمولی است.

  const { data: dataProviders, isLoading: isLoadingProviders } = useGetProvidersByServiceId(
    activeService?.id ?? 0,
    {
      enabled: !!activeService,
      // enabled: isLoadingServices && activeService !== null,
    }
  )

  const { data: dataAvailableTimes, isLoading: isLoadingAvailableTimes , refetch: refetchAvailableTimes } = useAvailableTimes({
    userId: activeUser?.id  ?? "0",
    serviceId: activeService?.id ?? 0,
    providerId: activeProvider?.id ?? 0,
    startDate: activeDate ? PNtoEN(activeDate.format()) : '',
    endDate: activeDate ? PNtoEN(activeDate.format()) : '',
    status: ['REVIEW', 'COMPLETED', 'DONE', 'PENDING'],
  }, {
    enabled: false
  })

  // const {
  //   mutateAsync: mutateAsyncReservationTimeSheetsInDate,
  //   isPending: isPendingReservationTimeSheetsInDate,
  // } = useAvailableTimes()

  const { mutateAsync: mutateAsyncAddReservation, isPending: isPendingAddReservation } =
    useAddReservation()

  type TypeTheAddReservationsUi = {
    serviceId: number
    providerId: number
    userId: number
    totalPrice: number
    date: DateObject | null
    time: string | null
    paymentType: TypePaymentType
    status: TypeReservationsStatus
    description: string
    smsToAdminService: boolean
    smsToAdminProvider: boolean
    smsToUserService: boolean
    emailToAdminService: boolean
    emailToAdminProvider: boolean
    emailToUserService: boolean
  }


  const onSubmit = async (data: TypeTheAddReservationsUi) => {
    console.log(data)
    // const transformedData: TypeApiAddReservationReq = {
    //   shouldExecuteTransaction: false,
    //   trackingCode: generateTrackingCodeWithDate(),
    //   paymentType: data.paymentType,
    //   status: data.status,
    //
    //   service: activeService,
    //   provider: activeProvider,
    //   user: activeUser,
    //
    //   price: activeService?.price,
    //   totalPrice: activeService?.price,
    //
    //   date: PNtoEN(data.date.format()),
    //   time: timeSelected,
    // }
    //
    // await mutateAsyncAddReservation(data)
    //   .then(async res => {
    //     bkToast('success', res.Message)
    //     router.push('/admin/reservation')
    //   })
    //   .catch(errors => {
    //     bkToast('error', errors.Reason)
    //   })
  }

  const handlerSetService = async (id: number) => {
    const service = dataServices!.filter(item => item.id === id)[0]
    setActiveService(service)
    setValue('smsToAdminService', service.smsToAdminService)
    setValue('smsToAdminProvider', service.smsToAdminProvider)
    setValue('smsToUserService', service.smsToUserService)
    setValue('emailToAdminService', service.emailToAdminService)
    setValue('emailToAdminProvider', service.emailToAdminProvider)
    setValue('emailToUserService', service.emailToUserService)
  }

  const handlerSetProvider = async (id: number) => {
    const provider = dataProviders!.filter(item => item.id === id)[0]
    setActiveProvider(provider)
    setValue('totalPrice', provider.service.price)
    setValue('date', null)
    setValue('time', null)
    // setReservedTimes([])
  }

  const handlerSetUser = async (id: string) => {
    const user = dataUsers!.filter(item => item.id === id)[0]
    if (activeService && activeService?.gender !== 'NONE') {
      if (user.gender === 'NONE') {
        bkToast('error', 'لطفا ابتدا در پروفایل خود جنسیت کاربر را انتخاب کنید.')
      } else if (user.gender !== activeService?.gender) {
        bkToast(
            'error',
            'این نوبت مخصوص ' +
            textGenderType(activeService?.gender as TypeGender) +
            ' میباشد.'
        )
      }
      return
    }
    setActiveUser(user)
  }

  const handlerSetTime = async index => {
    console.log(index)
    // if (!isNaN(index)) {
    //   let time = reservedTimes[0].timeSheet[index]
    //   setTimeSelected(time[0] + '-' + time[1])
    // }
  }

  const handlerGetReservationTimeSheetsInDate = async (date: DateObject) => {
    if (!activeService && !activeProvider) {
      bkToast('error', 'خدمت و ارائه دهنده را انتخاب کنید.')
      return true
    }
    setActiveDate(date)

  }

  useEffect(() => {
    refetchAvailableTimes()
  },[activeDate])

  return (
    <>
      <HeaderPage title="افزودن رزرو جدید" description="رزرو جدید اضافه نمایید.">
        <Link href="/admin/reservations" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست رزروها</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-25">
              <label>
                انتخاب خدمت<span>*</span>
              </label>
              <select
                {...register('serviceId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'خدمت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
                onChange={e => handlerSetService(parseInt(e.target.value))}
              >
                {isLoadingServices ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataServices && dataServices.length > 0 ? (
                  <>
                    <option value="" disabled selected>
                      انتخاب کنید
                    </option>
                    {dataServices.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا خدمت و ارائه دهنده را ثبث کنید.</option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="providerId" />
            </div>
            <div className="panel-col-25">
              <label>
                انتخاب ارائه دهنده<span>*</span>
              </label>
              <select
                {...register('providerId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'ارائه دهنده ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
                onChange={e => handlerSetProvider(parseInt(e.target.value))}
              >
                {isLoadingProviders ? (
                  <option value="" disabled>
                    ارائه دهنده ای برای نمایش وجود ندارد.
                  </option>
                ) : dataProviders && dataProviders.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب ارائه دهنده
                    </option>
                    {dataProviders.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.user.fullName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا خدمت را انتخاب کنید.</option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="providerId" />
            </div>
            <div className="panel-col-25">
              <label>
                قیمت خدمت (تومان)<span>*</span>
              </label>
              <input
                {...register('totalPrice', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'قیمت خدمت ضروری است',
                  },
                })}
                className="bk-input disable"
                disabled={true}
              />
            </div>
            <div className="panel-col-25">
              <label>
                انتخاب کاربر<span>*</span>
              </label>
              <select
                {...register('userId', {
                  required: {
                    value: true,
                    message: 'کاربر ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
                onChange={e => handlerSetUser(e.target.value)}
              >
                {
                  isLoadingUsers ? (
                    <option value="" disabled>
                      در حال بارگزاری...
                    </option>
                  ) : dataUsers && dataUsers.length > 0 ? (
                    <>
                      <option value="" disabled selected>
                        انتخاب کنید
                      </option>
                      {dataUsers.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.fullName + ' - ' + item.mobile}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>ابتدا کاربر عادی را ثبث کنید.</option>
                  )
                  // <option>ابتدا کاربر با سطح ارائه دهنده ثبث کنید.</option>
                }
              </select>
              <FormErrorMessage errors={errors} name="userId" />
            </div>

            <div className="my-4 w-full p-4">
              <hr className="panel-section-separator" />
            </div>

            <div className="panel-col-25">
              <label>
                تاریخ<span>*</span>
              </label>
              <Controller
                control={control}
                name="date"
                rules={{
                  required: {
                    value: true,
                    message: 'تاریخ ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      editable={false}
                      value={value}
                      placeholder="خدمت و ارائه دهنده را انتخاب کنید."
                      onChange={date => {
                        if (date?.isValid) {
                          onChange(date)
                          handlerGetReservationTimeSheetsInDate(date)
                        }
                      }}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass={'bk-input ' + (!!activeUser?.id ? '' : 'disable')}
                      // minDate={dateNowP()}
                      // disabled={!watch("totalPrice")}
                      disabled={!!activeUser?.id}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    />
                  </>
                )}
              />

              {/* hint: activeService && activeProvider && activeUser*/}
              <FormErrorMessage errors={errors} name="date" />
            </div>
            <div className="panel-col-33">
              <label>
                انتخاب وقت<span>*</span>
              </label>
              <select
                {...register('time', {
                  required: {
                    value: true,
                    message: 'انتخاب وقت ضروری است',
                  },
                })}
                defaultValue=""
                className={'bk-input ' + (!!activeUser?.id ? '' : 'disable')}
                onChange={e => handlerSetTime(parseInt(e.target.value))}
                disabled={!!activeUser?.id}
              >
                {activeDate ? (
                  isLoadingAvailableTimes ? (
                    <option value="" disabled>
                      در حال بارگزاری...
                    </option>
                  ) : dataAvailableTimes && dataAvailableTimes.length > 0 ? (
                      dataAvailableTimes?.map((dataTime, index) =>
                      dataTime.dayIsHoliday ? (
                        <option key={index} selected>
                          تعطیل رسمی: {dataTime.title}
                        </option>
                      ) : dataTime.timeSheet.length > 0 ? (
                        <Fragment key={index}>
                          <option value="">نوبت خود را انتخاب کنید.</option>
                          {dataTime.timeSheet.map((time, indexTime) => (
                            <option
                              key={indexTime}
                              value={indexTime}
                              disabled={time[2] as boolean}
                              // checked={time[2]}
                            >
                              {time[0]} تا {time[1]} {time[2] && time[3]}
                            </option>
                          ))}
                        </Fragment>
                      ) : (
                        <option key={index}>نوبت کاری برای این روز وجود ندارد</option>
                      )
                    )
                  ) : (
                    <option value="" disabled>
                      نوبت رزروی برای این بازه وجود ندارد
                    </option>
                  )
                ) : (
                  <option value="" disabled>
                    ابتدا تاریخ را مشخص کن.
                  </option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="time" />
            </div>

            <div className="panel-col-33 max-md:hidden"></div>

            <div className="panel-col-33">
              <label>
                نوع پرداخت<span>*</span>
              </label>
              <select
                {...register('paymentType', {
                  required: {
                    value: true,
                    message: 'نوع پرداخت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                <option value="Free">رایگان</option>
                <option value="CashPayment">پرداخت نقدی</option>
                <option value="CartByCart">کارت به کارت</option>
                <option value="CardReader">دستگاه کارتخوان</option>
                <option value="UnknownPayment">نامشخص</option>
              </select>
              <FormErrorMessage errors={errors} name="paymentType" />
            </div>

            <div className="panel-col-33">
              <label>
                وضعیت<span>*</span>
              </label>
              <select
                {...register('status', {
                  required: {
                    value: true,
                    message: 'وضعیت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                <option value="REVIEW">در صف بررسی</option>
                <option value="COMPLETED">تکمیل شده</option>
                {/*<option value="DONE">انجام شده</option>*/}
                {/*<option value="CANCELED">لغو شده</option>*/}
                {/*<option value="REJECTED">رد شده</option>*/}
              </select>
              <FormErrorMessage errors={errors} name="status" />
            </div>
            <div className="panel-col-100">
              <label>توضیحات پرداخت</label>
              <textarea {...register('description')} rows={2} className="bk-input text-right" />
              <FormErrorMessage errors={errors} name="description" />
            </div>
            <div className="panel-col-50">
              <label>ارسال پیامک</label>
              <div className="panel-row-checkbox">
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('smsToAdminService')}
                  />
                  مدیر سیستم
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('smsToAdminProvider')}
                  />
                  ارائه دهنده
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('smsToUserService')}
                  />
                  کاربر
                </label>
              </div>
            </div>
            <div className="panel-col-50">
              <label>ارسال ایمیل</label>
              <div className="panel-row-checkbox">
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('emailToAdminService')}
                  />
                  مدیر سیستم
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('emailToAdminProvider')}
                  />
                  ارائه دهنده
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="bk-checkbox"
                    {...register('emailToUserService')}
                  />
                  کاربر
                </label>
              </div>
            </div>
            <div className="panel-col-100">
              <button
                className={'panel-form-submit ' + (isPendingAddReservation ? 'disable-action' : '')}
                type="submit"
              >
                {isPendingAddReservation ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                    ثبت رزرو
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
