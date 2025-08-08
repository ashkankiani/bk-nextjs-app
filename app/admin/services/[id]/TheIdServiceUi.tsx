'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { bkToast, OnlyTypeNumber, PNtoEN } from '@/libs/utility'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import TheSpinner from '@/components/layout/TheSpinner'
import DatePicker, { DatePickerRef } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { dateNowP, fullStringToDateObjectP } from '@/libs/convertor'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useParams } from 'next/navigation'
import useHook from '@/hooks/controller/useHook'
import { useGetUsersByCatalogId } from '@/hooks/admin/useUser'
import { useShowService, useUpdateService } from '@/hooks/admin/useService'
import { TypeApiUpdateServiceReq, TypeFormService } from '@/types/typeApiAdmin'

export default function TheIdServiceUi() {
  const params = useParams()
  const id = Number(params.id)

  const { theme, router } = useHook()

  const { data: dataUsers, isLoading: isLoadingUsers } = useGetUsersByCatalogId(3) // ایدی 3 برای کاربران ارائه دهنده است.
  const {
    data: dataService,
    isLoading: isLoadingService,
    isFetched: isFetchedService,
  } = useShowService(id, {
    enabled: isLoadingUsers,
  })
  const { mutateAsync: mutateAsyncUpdateService, isPending: isPendingUpdateService } =
    useUpdateService()

  const refStartDate = useRef<DatePickerRef>(null)
  const refEndDate = useRef<DatePickerRef>(null)

  const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
  const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
  const [minDate, setMinDate] = useState(dateNowP())
  const [maxDate, setMaxDate] = useState(dateNowP().add(1, 'year'))

  const items = [
    'userId',
    'name',
    'gender',
    'description',
    'descriptionAfterPurchase',
    'codPayment',
    'onlinePayment',
    'smsToAdminService',
    'smsToAdminProvider',
    'smsToUserService',
    'emailToAdminService',
    'emailToAdminProvider',
    'emailToUserService',
  ]

  const itemsInteger = ['periodTime', 'price', 'capacity']

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TypeFormService>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeFormService) => {
    // itemsInteger.forEach(item => {
    //   data[item] = parseInt(data[item])
    // })

    const transformedData: TypeApiUpdateServiceReq = {
      id: dataService!.id,
      userId: data.userId,

      name: data.name,
      periodTime: parseInt(data.periodTime),
      price: parseInt(data.price),
      capacity: parseInt(data.capacity),

      startDate: data.startDate ? PNtoEN(data.startDate.format('YYYY/MM/DD')) : null,
      endDate: data.endDate ? PNtoEN(data.endDate.format('YYYY/MM/DD')) : null,

      gender: data.gender,

      codPayment: data.codPayment,
      onlinePayment: data.onlinePayment,

      smsToAdminService: data.smsToAdminService,
      smsToAdminProvider: data.smsToAdminProvider,
      smsToUserService: data.smsToUserService,

      emailToAdminService: data.emailToAdminService,
      emailToAdminProvider: data.emailToAdminProvider,
      emailToUserService: data.emailToUserService,

      description: data.description && data.description.length === 0 ? null : data.description,
      descriptionAfterPurchase:
        data.descriptionAfterPurchase && data.descriptionAfterPurchase.length === 0
          ? null
          : data.descriptionAfterPurchase,
    }

    await mutateAsyncUpdateService(transformedData)
      .then(res => {
        bkToast('success', res.Message)
        router.push('/admin/services')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  useEffect(() => {
    if (isFetchedService && dataService) {
      items.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, dataService[item])
      })
      itemsInteger.forEach(item => {
        // @ts-expect-error ok!
        setValue(item, parseInt(dataService[item]))
      })

      if (dataService.startDate !== null && dataService.startDate !== undefined) {
        setValue('startDate', fullStringToDateObjectP(dataService.startDate))
        setMinDate(fullStringToDateObjectP(dataService.startDate))
      }
      if (dataService.endDate !== null && dataService.endDate !== undefined) {
        setValue('endDate', fullStringToDateObjectP(dataService.endDate))
        setMaxDate(fullStringToDateObjectP(dataService.endDate))
      }
    }
  }, [isFetchedService])

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

  return (
    <>
      <HeaderPage title="ویرایش خدمت" description="خدمت خود را ویرایش کنید.">
        <Link href="/admin/services" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست خدمات</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {isLoadingService ? (
          <TheSpinner />
        ) : (
          <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-center-start flex-wrap">
              <div className="panel-col-33">
                <label>
                  نام خدمت<span>*</span>
                </label>
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'عنوان ضروری است',
                    },
                  })}
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="name" />
              </div>
              <div className="panel-col-33">
                <label>
                  مدیر خدمت<span>*</span>
                </label>
                <select
                  {...register('userId', {
                    required: {
                      value: true,
                      message: 'مدیر خدمت ضروری است',
                    },
                  })}
                  // defaultValue={dataService.userId}
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
                  مدت زمان خدمت<span>*</span>
                </label>
                <input
                  {...register('periodTime', {
                    required: {
                      value: true,
                      message: 'مدت زمان خدمت ضروری است',
                    },
                    min: {
                      value: 1,
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
                  placeholder="هر رزرو چند دقیقه طول می کشد."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="periodTime" />
              </div>
              <div className="panel-col-33">
                <label>
                  قیمت خدمت<span>*</span>
                </label>
                <input
                  {...register('price', {
                    required: {
                      value: true,
                      message: 'قیمت خدمت ضروری است',
                    },
                    min: {
                      value: 0,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="تومان وارد شود."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="price" />
              </div>
              <div className="panel-col-33">
                <label>
                  ظرفیت در هر رزرو<span>*</span>
                </label>
                <input
                  {...register('capacity', {
                    required: {
                      value: true,
                      message: 'ظرفیت در هر رزرو ضروری است',
                    },
                    min: {
                      value: 1,
                      message: ' باید از 0 بیشتر باشد.',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'یک عدد صحیح وارد کنید.',
                    },
                  })}
                  onKeyDown={OnlyTypeNumber}
                  placeholder="چند نفر میتوانند هر نوبت رزرو را بخرند."
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="capacity" />
              </div>
              <div className="panel-col-33">
                <label>جنسیت رزرو کننده</label>
                <select {...register('gender')} defaultValue="NONE" className="bk-input">
                  <option value="NONE">فرقی نمی کند</option>
                  <option value="MAN">آقا</option>
                  <option value="WOMAN">خانم</option>
                </select>
                <FormErrorMessage errors={errors} name="gender" />
              </div>

              <div className="panel-col-33">
                <label>تاریخ شروع{statusRequiredStartDate && <span>*</span>}</label>
                <Controller
                  control={control}
                  name="startDate"
                  rules={{
                    required: {
                      value: statusRequiredStartDate,
                      message: 'تاریخ شروع ضروری است',
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
                              setValue('startDate', null)
                              setMinDate(dateNowP())
                              if (refStartDate.current) refStartDate.current.closeCalendar()
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
                <label>تاریخ پایان{statusRequiredEndDate && <span>*</span>}</label>
                <Controller
                  control={control}
                  name="endDate"
                  rules={{
                    required: {
                      value: statusRequiredEndDate,
                      message: 'تاریخ پایان ضروری است',
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

              <div className="my-4 w-full p-4">
                <hr className="panel-section-separator" />
              </div>

              <div className="panel-col-33">
                <label>
                  نوع پرداخت<span>*</span>
                </label>
                <div className="panel-row-checkbox">
                  <label>
                    <input type="checkbox" {...register('codPayment')} />
                    در محل
                  </label>
                  <label>
                    <input type="checkbox" {...register('onlinePayment')} />
                    آنلاین
                  </label>
                </div>
              </div>
              <div className="panel-col-33">
                <label>ارسال پیامک</label>
                <div className="panel-row-checkbox">
                  <label>
                    <input type="checkbox" {...register('smsToAdminService')} />
                    مدیر سیستم
                  </label>
                  <label>
                    <input type="checkbox" {...register('smsToAdminProvider')} />
                    ارائه دهنده
                  </label>
                  <label>
                    <input type="checkbox" {...register('smsToUserService')} />
                    کاربر
                  </label>
                </div>
              </div>
              <div className="panel-col-33">
                <label>ارسال ایمیل</label>
                <div className="panel-row-checkbox">
                  <label>
                    <input type="checkbox" {...register('emailToAdminService')} />
                    مدیر سیستم
                  </label>
                  <label>
                    <input type="checkbox" {...register('emailToAdminProvider')} />
                    ارائه دهنده
                  </label>
                  <label>
                    <input type="checkbox" {...register('emailToUserService')} />
                    کاربر
                  </label>
                </div>
              </div>

              <div className="my-4 w-full p-4">
                <hr className="panel-section-separator" />
              </div>

              <div className="panel-col-100">
                <label>معرفی خدمت</label>
                <textarea {...register('description')} rows={5} className="bk-input text-right" />
              </div>
              <div className="panel-col-100">
                <label>دستورالعمل پس از خرید</label>
                <textarea
                  {...register('descriptionAfterPurchase')}
                  rows={5}
                  className="bk-input text-right"
                  placeholder="پس از رزرو، دستورالعمل به کاربر نمایش داده می شود."
                />
              </div>

              <div className="panel-col-100">
                <button
                  className={
                    'panel-form-submit ' + (isPendingUpdateService ? 'disable-action' : '')
                  }
                  type="submit"
                >
                  {isPendingUpdateService ? (
                    <TheSpinner />
                  ) : (
                    <span>
                      <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                      ثبت خدمت
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
