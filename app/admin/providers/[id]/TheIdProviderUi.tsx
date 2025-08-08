'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { bkToast, OnlyTypeNumber, PNtoEN } from '@/libs/utility'
import DatePicker, {DatePickerRef} from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import TheSpinner from '@/components/layout/TheSpinner'
import { dateNowP, fullStringToDateObjectP } from '@/libs/convertor'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useParams } from 'next/navigation'
import useHook from '@/hooks/controller/useHook'
import { TypeApiUpdateProviderReq, TypeFormProvider } from '@/types/typeApiAdmin'
import { useGetServices } from '@/hooks/admin/useService'
import { useShowProvider, useUpdateProvider } from '@/hooks/admin/useProvider'
import { useGetUsersByCatalogId } from '@/hooks/admin/useUser'

export default function TheIdProviderUi() {
  const params = useParams()
  const id = Number(params.id)

  const { theme, router } = useHook()

  const { data: dataServices, isLoading: isLoadingServices } = useGetServices()
  const { data: dataUsers, isLoading: isLoadingUsers } = useGetUsersByCatalogId(3, {
    enabled: isLoadingServices,
  }) // ایدی 3 برای کاربران ارائه دهنده است.

  const {
    data: dataProvider,
    // isLoading: isLoadingProvider,
    isFetched: isFetchedProvider,
  } = useShowProvider(id, {
    enabled: isLoadingUsers,
  })

  const { mutateAsync: mutateAsyncUpdateProvider, isPending: isPendingUpdateProvider } =
    useUpdateProvider()

  const refStartDate = useRef<DatePickerRef>(null)
  const refEndDate = useRef<DatePickerRef>(null)

  const refStartTime = useRef<DatePickerRef>(null)
  const refEndTime = useRef<DatePickerRef>(null)

  const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
  const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)

  const [statusRequiredStartTime, setStatusRequiredStartTime] = useState(false)
  const [statusRequiredEndTime, setStatusRequiredEndTime] = useState(false)

  const [minDate, setMinDate] = useState(dateNowP())
  const [maxDate, setMaxDate] = useState(dateNowP().add(1, 'year'))

  const [errorPeriodTime, setErrorPeriodTime] = useState(false)

  const items = ['description']
  const itemsBoolean = ['status', 'workHolidays']
  const itemsInteger = ['serviceId', 'userId', 'slotTime']

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeFormProvider>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeFormProvider) => {
    // itemsBoolean.forEach(item => {
    //   // @ts-expect-error ok!
    //   data[item] = data[item] === 'true'
    // })
    // itemsInteger.forEach(item => {
    //   // @ts-expect-error ok!
    //   data[item] = parseInt(data[item])
    // })

    const transformedData: TypeApiUpdateProviderReq = {
      id: dataProvider!.id,
      serviceId: data.serviceId,
      userId: data.userId,
      slotTime: data.slotTime,
      startDate: data.startDate ? PNtoEN(data.startDate.format('YYYY/MM/DD')) : null,
      endDate: data.endDate ? PNtoEN(data.endDate.format('YYYY/MM/DD')) : null,
      startTime: data.startTime ? PNtoEN(data.startTime.format('HH:mm')) : null,
      endTime: data.endTime ? PNtoEN(data.endTime.format('HH:mm')) : null,
      status: data.status === 'true',
      workHolidays: data.workHolidays === 'true',
      description: data.description,
    }

    await mutateAsyncUpdateProvider(transformedData)
      .then(res => {
        bkToast('success', res.Message)
        router.push('/admin/providers')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  useEffect(() => {
    if (isFetchedProvider && dataProvider) {
      items.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, dataProvider[item])
      })
      itemsBoolean.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, dataProvider[item].toString())
      })
      itemsInteger.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, parseInt(dataProvider[item]))
      })

      if (dataProvider.startDate !== null && dataProvider.startDate !== undefined) {
        setValue('startDate', fullStringToDateObjectP(dataProvider.startDate))
        setMinDate(fullStringToDateObjectP(dataProvider.startDate))
      }
      if (dataProvider.endDate !== null && dataProvider.endDate !== undefined) {
        setValue('endDate', fullStringToDateObjectP(dataProvider.endDate))
        setMaxDate(fullStringToDateObjectP(dataProvider.endDate))
      }

      if (dataProvider.startTime !== null && dataProvider.startTime !== undefined) {
        const arrayStartTime = dataProvider.startTime.split(':')
        setValue('startTime', dateNowP().setHour(Number(arrayStartTime[0])).setMinute(Number(arrayStartTime[1])))
      }
      if (dataProvider.endTime !== null && dataProvider.endTime !== undefined) {
        const arrayEndTime = dataProvider.endTime.split(':')
        setValue('endTime', dateNowP().setHour(Number(arrayEndTime[0])).setMinute(Number(arrayEndTime[1])))
      }
    }
  }, [isFetchedProvider])

  // useEffect(() => {
  //   if (
  //     (watch('startDate') === undefined && watch('endDate') === undefined) ||
  //     (watch('startDate') === null && watch('endDate') === null)
  //   ) {
  //     setStatusRequiredStartDate(false)
  //     setStatusRequiredEndDate(false)
  //   } else {
  //     setStatusRequiredStartDate(true)
  //     setStatusRequiredEndDate(true)
  //   }
  // })

  useEffect(() => {
    const startTime = watch('startTime')
    const endTime = watch('endTime')

    if (startTime && endTime) {
      compareTime(startTime.format('HH:mm'), endTime.format('HH:mm'))
      setStatusRequiredStartTime(true)
      setStatusRequiredEndTime(true)

      setStatusRequiredStartDate(true)
      setStatusRequiredEndDate(true)
    }else{
      setStatusRequiredStartTime(false)
      setStatusRequiredEndTime(false)
      setErrorPeriodTime(false)

      setStatusRequiredStartDate(false)
      setStatusRequiredEndDate(false)
    }
  }, [watch('startTime'), watch('endTime')])

  // useEffect(() => {
  //   if (watch('startTime') !== undefined && watch('endTime') !== undefined) {
  //     if (watch('startTime') !== null && watch('endTime') !== null) {
  //       compareTime(watch('startTime').format('HH:mm'), watch('endTime').format('HH:mm'))
  //     }
  //   }
  //
  //   if (
  //     (watch('startTime') === undefined && watch('endTime') === undefined) ||
  //     (watch('startTime') === null && watch('endTime') === null)
  //   ) {
  //     setStatusRequiredStartTime(false)
  //     setStatusRequiredEndTime(false)
  //     setErrorPeriodTime(false)
  //   } else {
  //     setStatusRequiredStartTime(true)
  //     setStatusRequiredEndTime(true)
  //   }
  // })

  // hint: ino 2 bar daram
  function compareTime(time1: string, time2: string) {
    const [hour1, minute1] = time1.split(':')
    const [hour2, minute2] = time2.split(':')
    return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2)
      ? setErrorPeriodTime(true)
      : setErrorPeriodTime(false)
  }

  return (
    <>
      <HeaderPage
        title="ویرایش ارائه دهنده"
        description="تنظیمات ارائه دهنده خود را ویرایش نمایید."
      >
        <Link href="/admin/providers" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست ارائه دهندگان</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-33">
              <label>
                خدمت<span>*</span>
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
              >
                {isLoadingServices ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataServices && dataServices.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب کنید
                    </option>
                    {dataServices?.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا خدمت را ثبث کنید.</option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="serviceId" />
            </div>
            <div className="panel-col-33">
              <label>
                ارائه دهنده<span>*</span>
              </label>
              <select
                {...register('userId', {
                  required: {
                    value: true,
                    message: 'ارائه دهنده ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
              >
                {isLoadingUsers ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataUsers && dataUsers.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب کنید
                    </option>
                    {dataUsers?.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.fullName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا کاربر با سطح ارائه دهنده ثبث کنید.</option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="userId" />
            </div>
            <div className="panel-col-33">
              <label>
                مدت استراحت بین هر نوبت<span>*</span>
              </label>
              <input
                {...register('slotTime', {
                  required: {
                    value: true,
                    message: 'مدت استراحت بین هر نوبت ضروری است',
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
                placeholder="بین یک رزرو تا رزرو دیگر چند دقیقه فاصله باشد."
                type="text"
                className="bk-input"
              />
              <FormErrorMessage errors={errors} name="slotTime" />
            </div>

            <div className="my-4 w-full p-4">
              <hr className="panel-section-separator" />
            </div>

            <div className="panel-col-33">
              <label>تاریخ شروع فعالیت{statusRequiredStartDate && <span>*</span>}</label>
              <Controller
                control={control}
                name="startDate"
                rules={{
                  required: {
                    value: statusRequiredStartDate,
                    message: 'تاریخ شروع فعالیت ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      ref={refStartDate}
                      editable={false}
                      value={value}
                      onChange={date => {
                        onChange(date?.isValid ? date : undefined)
                        // date?.isValid && setMinDate(date)
                      }}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      // minDate={new Date()}
                      minDate={minDate}
                      maxDate={maxDate}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    >
                      <div className="flex-center-center pb-2">
                        <div
                          className="panel-date-picker-reset"
                          onClick={() => {
                            setValue('startDate', null)
                            setMinDate(dateNowP())
                            if (refStartDate.current) refStartDate.current?.closeCalendar()
                          }}
                        >
                          ریست
                        </div>
                      </div>
                    </DatePicker>
                  </>
                )}
              />
              <FormErrorMessage errors={errors} name="startDate" />
            </div>
            <div className="panel-col-33">
              <label>تاریخ پایان فعالیت{statusRequiredEndDate && <span>*</span>}</label>
              <Controller
                control={control}
                name="endDate"
                rules={{
                  required: {
                    value: statusRequiredEndDate,
                    message: 'تاریخ پایان فعالیت ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      ref={refEndDate}
                      editable={false}
                      value={value}
                      onChange={date => {
                        if (date?.isValid) {
                          onChange(date)
                          setMaxDate(date)
                        }
                      }}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      minDate={minDate}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    >
                      <div className="flex-center-center pb-2">
                        <div
                          className="panel-date-picker-reset"
                          onClick={() => {
                            setValue('endDate', null)
                            setMaxDate(dateNowP().add(1, 'year'))
                            if (refEndDate.current) refEndDate.current.closeCalendar()
                          }}
                        >
                          ریست
                        </div>
                      </div>
                    </DatePicker>
                  </>
                )}
              />
              <FormErrorMessage errors={errors} name="endDate" />
            </div>

            <div className="panel-col-33 max-md:hidden"></div>

            <div className="panel-col-33">
              <label>شروع استراحت ثابت{statusRequiredStartTime && <span>*</span>}</label>
              <Controller
                control={control}
                name="startTime"
                rules={{
                  required: {
                    value: statusRequiredStartTime,
                    message: 'شروع استراحت ثابت ضروری است',
                  },
                  validate: () =>
                    !errorPeriodTime || 'ساعت شروع باید کوچکتر از ساعت پایان باشد.',
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      disableDayPicker
                      ref={refStartTime}
                      value={value}
                      onChange={date => {
                        onChange(date?.isValid ? date : undefined)
                      }}
                      editable={false}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      plugins={
                        // eslint-disable-next-line react/jsx-key
                        [<TimePicker hideSeconds />]
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="HH:mm"
                      calendarPosition="bottom-center"
                    >
                      <div className="flex-center-center pb-2">
                        <div
                          className="panel-date-picker-reset"
                          onClick={() => {
                            setValue('startTime', null)
                            setMinDate(dateNowP())
                            if (refStartTime.current) refStartTime.current.closeCalendar()
                          }}
                        >
                          ریست
                        </div>
                      </div>
                    </DatePicker>
                  </>
                )}
              />
              <FormErrorMessage errors={errors} name="startTime" />
            </div>
            <div className="panel-col-33">
              <label>پایان استراحت ثابت{statusRequiredEndTime && <span>*</span>}</label>
              <Controller
                control={control}
                name="endTime"
                rules={{
                  required: {
                    value: statusRequiredEndTime,
                    message: 'پایان استراحت ثابت ضروری است',
                  },
                }}
                render={({
                  field: { onChange, value },
                }) => (
                  <>
                    <DatePicker
                      disableDayPicker
                      ref={refEndTime}
                      value={value}
                      onChange={date => {
                        onChange(date?.isValid ? date : undefined)
                      }}
                      editable={false}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
                      plugins={
                        // eslint-disable-next-line react/jsx-key
                        [<TimePicker hideSeconds />]
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="HH:mm"
                      calendarPosition="bottom-center"
                    >
                      <div className="flex-center-center pb-2">
                        <div
                          className="panel-date-picker-reset"
                          onClick={() => {
                            setValue('endTime', null)
                            setMaxDate(dateNowP().add(1, 'year'))
                            if (refEndTime.current) refEndTime.current.closeCalendar()
                          }}
                        >
                          ریست
                        </div>
                      </div>
                    </DatePicker>
                  </>
                )}
              />
              <FormErrorMessage errors={errors} name="endTime" />
            </div>

            <div className="my-4 w-full p-4">
              <hr className="panel-section-separator" />
            </div>

            <div className="panel-col-33">
              <label>وضعیت ارائه دهنده برای انجام خدمت</label>
              <select
                {...register('status', {
                  required: {
                    value: true,
                    message: 'وضعیت ارائه دهنده برای انجام خدمت ضروری است',
                  },
                })}
                className="bk-input"
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
              <FormErrorMessage errors={errors} name="status" />
            </div>

            <div className="panel-col-33">
              <label>در روزهای تعطیل رسمی کار می کند؟</label>
              <select
                {...register('workHolidays', {
                  required: {
                    value: true,
                    message: 'وضعیت کار در روزهای تعطیل ضروری است',
                  },
                })}
                className="bk-input"
              >
                <option value="true">بله</option>
                <option value="false">خیر</option>
              </select>
              <FormErrorMessage errors={errors} name="workHolidays" />
            </div>

            <div className="panel-col-33">
              <label>تصویر</label>
              <input type="file" className="bk-input" />
            </div>

            <div className="panel-col-100">
              <label>معرفی ارائه دهنده</label>
              <textarea {...register('description')} rows={5} className="bk-input text-right" />
              <FormErrorMessage errors={errors} name="description" />
            </div>

            <div className="panel-col-100">
              <button
                className={'panel-form-submit ' + (isPendingUpdateProvider ? 'disable-action' : '')}
                type="submit"
              >
                {isPendingUpdateProvider ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                    ثبت ارائه دهنده
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
