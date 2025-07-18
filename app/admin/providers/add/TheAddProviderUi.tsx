'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { bkToast, onlyTypeNumber, PNtoEN } from '@/libs/utility'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import TheSpinner from '@/components/layout/TheSpinner'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import { dateNowP } from '@/libs/convertor'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useGetServices } from '@/hooks/admin/useService'
import useHook from '@/hooks/controller/useHook'
import { useAddProvider } from '@/hooks/admin/useProvider'
import { TypeApiAddProviderReq, TypeFormProvider } from '@/types/typeApiAdmin'
import { useGetUsersByCatalogId } from '@/hooks/admin/useUser'

export default function TheAddProviderUi() {
  const { router, theme } = useHook()

  const { data: dataServices, isLoading: isLoadingServices } = useGetServices()
  const { data: dataUsers, isLoading: isLoadingUsers } = useGetUsersByCatalogId(3, {
    enabled: isLoadingServices,
  }) // ایدی 3 برای کاربران ارائه دهنده است.

  const { mutateAsync: mutateAsyncAddProvider, isPending: isPendingAddProvider } = useAddProvider()

  const refStartDate = useRef()
  const refEndDate = useRef()

  const refStartTime = useRef()
  const refEndTime = useRef()

  const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
  const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)

  const [statusRequiredStartTime, setStatusRequiredStartTime] = useState(false)
  const [statusRequiredEndTime, setStatusRequiredEndTime] = useState(false)

  const [minDate, setMinDate] = useState(dateNowP())
  const [maxDate, setMaxDate] = useState(dateNowP().add(1, 'year'))

  const [errorPeriodTime, setErrorPeriodTime] = useState(false)

  const itemsBoolean = ['status', 'workHolidays']
  const itemsInteger = ['slotTime']

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
    itemsBoolean.forEach(item => {
      data[item] = data[item] === 'true'
    })
    itemsInteger.forEach(item => {
      data[item] = parseInt(data[item])
    })

    const transformedData: TypeApiAddProviderReq = {
      serviceId: data.serviceId,
      userId: data.userId,
      slotTime: data.slotTime,
      startDate: data.startDate ? PNtoEN(data.startDate.format('YYYY/MM/DD')) : null,
      endDate: data.endDate ? PNtoEN(data.endDate.format('YYYY/MM/DD')) : null,
      startTime: data.startTime ? PNtoEN(data.startTime.format('HH:mm')) : null,
      endTime: data.endTime ? PNtoEN(data.endTime.format('HH:mm')) : null,
      status: data.status,
      workHolidays: data.workHolidays,
      description: data.description,
    }

    await mutateAsyncAddProvider(transformedData)
      .then(res => {
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
      .finally(() => {
        router.push('/admin/providers')
      })
  }

  useEffect(() => {
    if (
      (watch('startDate') === undefined && watch('endDate') === undefined) ||
      (watch('startDate') === null && watch('endDate') === null)
    ) {
      setStatusRequiredStartDate(false)
      setStatusRequiredEndDate(false)
    } else {
      setStatusRequiredStartDate(true)
      setStatusRequiredEndDate(true)
    }
  })

  useEffect(() => {
    if (watch('startTime') !== undefined && watch('endTime') !== undefined) {
      if (watch('startTime') !== null && watch('endTime') !== null) {
        compareTime(watch('startTime').format('HH:mm'), watch('endTime').format('HH:mm'))
      }
    }

    if (
      (watch('startTime') === undefined && watch('endTime') === undefined) ||
      (watch('startTime') === null && watch('endTime') === null)
    ) {
      setStatusRequiredStartTime(false)
      setStatusRequiredEndTime(false)
      setErrorPeriodTime(false)
    } else {
      setStatusRequiredStartTime(true)
      setStatusRequiredEndTime(true)
    }
  })

  function compareTime(time1, time2) {
    const [hour1, minute1] = time1.split(':')
    const [hour2, minute2] = time2.split(':')
    return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2)
      ? setErrorPeriodTime(true)
      : setErrorPeriodTime(false)
  }

  return (
    <>
      <HeaderPage title="ارائه دهنده جدید" description="ارائه دهنده به خدمت خود اضافه نمایید.">
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
                  valueAsNumber: true,
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
                onKeyPress={onlyTypeNumber}
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
                  // fieldState: {invalid, isDirty}, //optional
                  // formState: {errors}, //optional, but necessary if you want to show an error message
                }) => (
                  <>
                    <DatePicker
                      ref={refStartDate}
                      editable={false}
                      value={value}
                      onChange={date => {
                        if (date?.isValid) {
                          onChange(date)
                          setMinDate(date)
                        }
                      }}
                      containerClassName="w-full"
                      className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                      inputClass="bk-input"
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
                            ;(setValue('startDate', null), refStartDate.current.closeCalendar())
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
                  // fieldState: {invalid, isDirty}, //optional
                  // formState: {errors}, //optional, but necessary if you want to show an error message
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
                            ;(setValue('endDate', null), refEndDate.current.closeCalendar())
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
                    errorPeriodTime !== true || 'ساعت شروع باید کوچکتر از ساعت پایان باشد.',
                }}
                render={({
                  field: { onChange, value },
                  // fieldState: {invalid, isDirty}, //optional
                  // formState: {errors}, //optional, but necessary if you want to show an error message
                }) => (
                  <>
                    <DatePicker
                      disableDayPicker
                      ref={refStartTime}
                      value={value}
                      onChange={date => {
                        if (date?.isValid) {
                          onChange(date)
                        }
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
                            ;(setValue('startTime', null), refStartTime.current.closeCalendar())
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
                  // fieldState: {invalid, isDirty}, //optional
                  // formState: {errors}, //optional, but necessary if you want to show an error message
                }) => (
                  <>
                    <DatePicker
                      disableDayPicker
                      ref={refEndTime}
                      value={value}
                      onChange={date => {
                        if (date?.isValid) {
                          onChange(date)
                        }
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
                            ;(setValue('endTime', null), refEndTime.current.closeCalendar())
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
                defaultValue="false"
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
                className={'panel-form-submit ' + (isPendingAddProvider ? 'disable-action' : '')}
                type="submit"
              >
                {isPendingAddProvider ? (
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
