import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {Fragment, useEffect, useState} from "react";
import {bkToast, PNtoEN} from "@/libs/utility";
import {hookGetProviderWhere} from "@/hooks/admin/hookProvider";
import {Controller, useForm} from "react-hook-form";
import {hookListUsers} from "@/hooks/admin/hookUser";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useSelector} from "react-redux";
import TheSpinner from "@/components/layout/TheSpinner";
import {
  hookEditReservation,
  hookGetReservationWhere,
  hookIsReservation
} from "@/hooks/admin/hookReservation";
import {useRouter} from "next/router";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import {hookListServices} from "@/hooks/admin/hookService";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {fullStringToDateObjectP} from "@/libs/convertor";


export default function EditReservation({id}) {

  const router = useRouter()

  const theme = useSelector(state => state.app.initTheme)


  const [loading, setLoading] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingReservedTimes, setLoadingReservedTimes] = useState(false)
  const [loadingReservation, setLoadingReservation] = useState(false)

  const [reserve, setReserve] = useState([])
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([])
  const [reservedTimes, setReservedTimes] = useState([])

  const [dateSelected, setDateSelected] = useState(false)
  const [timeSelected, setTimeSelected] = useState(null)


  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm({
    criteriaMode: 'all',
    // defaultValues: {
    // },
  })


  const onSubmit = data => {
    delete data.serviceId,
      delete data.providerId,
      delete data.userId,
      data.date = PNtoEN(data.date.format())
    data.time = timeSelected
    data.trackingCode = reserve.order.trackingCode
    data.user = users.filter(item => item.id === getValues('userId'))[0]
    data.service = services.filter(item => item.id === getValues('serviceId'))[0]
    data.provider = providers.filter(item => item.id === getValues('providerId'))[0]
    // data.shouldExecuteTransaction = false
    // data.price = services.filter(item => item.id === getValues('serviceId'))[0].price
    // data.totalPrice = data.price
    data.reserve = reserve
    editReservation(data)
  }


  const handlerListServices = async () => {
    setLoadingServices(false)
    await hookListServices(async (response, message) => {
      setLoadingServices(true)
      if (response) {
        setServices(message)
        await handlerListUsers(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerListUsers = async (SERVICES) => {
    setLoadingUsers(false)
    // let params = {
    //   type: "condition",
    //   condition:
    //     {
    //       where: {
    //         catalogId: 1
    //       },
    //     }
    // }
    await hookListUsers(async (response, message) => {
      setLoadingUsers(true)
      if (response) {
        setUsers(message)
        await handlerGetProvidersWhere(SERVICES)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerGetProvidersWhere = async (SERVICES) => {
    setLoadingProviders(false)
    let params = {
      type: "condition",
      how: "findMany",
      condition: {
        where: {
          serviceId: SERVICES.serviceId
        },
        include: {
          service: {
            select: {
              price: true
            }
          },
          user: {
            select: {
              id: true,
              fullName: true,
              mobile: true,
              email: true,
            }
          },
        },
      }
    }
    await hookGetProviderWhere(params, async (response, message) => {
      setLoadingProviders(true)
      if (response) {
        setProviders(message)
        await handlerGetReservationWhere(SERVICES, message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerGetReservationWhere = async (SERVICES, PROVIDERS) => {
    setLoadingReservation(false)
    let params = {
      type: "condition",
      condition:
        {
          where: {
            id: parseInt(id)
          },
          include: {
            service: {},
            user: {},
            provider: {},
            payment: {},
            order: {},
          }
        }
    }
    await hookGetReservationWhere(params, async (response, message) => {
      if (response) {
        setLoadingReservation(true)
        message = message[0]
        setReserve(message)
        setValue('serviceId', message.serviceId)
        setValue('providerId', message.providerId)
        setValue('totalPrice', message.service.price)
        setValue('userId', message.userId)
        setValue('date', fullStringToDateObjectP(message.date))
        setValue('paymentType', message.payment.paymentType)
        setValue('status', message.status)
        setValue('description', message.payment.description)
        setValue('smsToAdminService', message.service.smsToAdminService)
        setValue('smsToAdminProvider', message.service.smsToAdminProvider)
        setValue('smsToUserService', message.service.smsToUserService)
        setValue('emailToAdminService', message.service.emailToAdminService)
        setValue('emailToAdminProvider', message.service.emailToAdminProvider)
        setValue('emailToUserService', message.service.emailToUserService)
        handlerSetReservedTimes(SERVICES, PROVIDERS, message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerSetService = async (IdService) => {
    setValue('smsToAdminService', services.filter(item => item.id === IdService)[0].smsToAdminService)
    setValue('smsToAdminProvider', services.filter(item => item.id === IdService)[0].smsToAdminProvider)
    setValue('smsToUserService', services.filter(item => item.id === IdService)[0].smsToUserService)
    setValue('emailToAdminService', services.filter(item => item.id === IdService)[0].emailToAdminService)
    setValue('emailToAdminProvider', services.filter(item => item.id === IdService)[0].emailToAdminProvider)
    setValue('emailToUserService', services.filter(item => item.id === IdService)[0].emailToUserService)
  }

  const handlerSetProvider = async (IdProvider) => {
    setValue("totalPrice", providers.filter(item => item.id === IdProvider)[0].service.price)
    setValue('date', undefined)
    setValue('time', "")
    setDateSelected(false)
    setReservedTimes([])
  }

  const handlerSetReservedTimes = async (SERVICES, PROVIDERS, DATA) => {
    if (isNaN(watch("serviceId")) && isNaN(watch("providerId"))) {
      bkToast('error', 'خدمت و ارائه دهنده را انتخاب کنید.')
      return true
    } else {
      setDateSelected(true)
      setLoadingReservedTimes(false)
      const [startTime, endTime] = DATA.time.split("-");

      let params = {
        service: SERVICES.filter(item => item.id === DATA.serviceId)[0],
        provider: PROVIDERS.filter(item => item.id === DATA.providerId)[0],
        date: DATA.date
      }

      await hookIsReservation(params, async (response, message) => {
        // setLoadingUsers(true)
        if (response) {
          let filter = await modifyTimeSheet(message, startTime, endTime)
          setReservedTimes(filter)
          setLoadingReservedTimes(true)
          setTimeout(() => getIndexTime(DATA, filter, true), 1000)
        } else {
          bkToast('error', message)
        }
      })
    }

  }

  const handlerIsReservation = async (date) => {
    setDateSelected(true)
    setLoadingReservedTimes(false)
    let params = {
      service: services.filter(item => item.id === watch("serviceId"))[0],
      provider: providers.filter(item => item.id === watch("providerId"))[0],
      date: PNtoEN(date.format())
    }
    await hookIsReservation(params, (response, message) => {
      // setLoadingUsers(true)
      if (response) {
        setReservedTimes(message)
        setLoadingReservedTimes(true)
      } else {
        bkToast('error', message)
      }
    })
  }

  const getIndexTime = (DATA, FILTER, STATUS) => {
    if (STATUS) {
      const [startTime, endTime] = DATA.time.split("-");
      let indexTime = FILTER[0].timeSheet.findIndex(entry => entry.includes(startTime && endTime))
      setValue('time', indexTime.toString())
      handlerSetTime(FILTER, indexTime)
    }
  }

  const handlerSetTime = async (FILTER, index) => {
    if (!isNaN(index)) {
      let time = FILTER[0].timeSheet[index]
      setTimeSelected(time[0] + '-' + time[1])
    }
  }

  const modifyTimeSheet = (newData, startTime, endTime) => {
    for (const entry of newData[0].timeSheet) {
      if (entry.includes(startTime) && entry.includes(endTime)) {
        // اگر مقدار [e, f, true, "رزرو شده."] باشد، مقدار true را به false تغییر دهید
        if (entry[2] === true) {
          entry[2] = false;
        }
      }
    }
    return newData;
  }

  const editReservation = async data => {
    setLoading(true)
    await hookEditReservation(data, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', 'رزرو با موفقیت ویرایش شد.')
        router.push('/admin/reservation')
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    // if (!router.isReady) return;
    handlerListServices()
  }, [])


  return (
    <>
      <HeadPage title="ویرایش رزرو"/>
      <HeaderPage title="ویرایش رزرو" description="رزرو خود را ویرایش نمایید.">
        <Link href="/admin/reservation" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست رزروها</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-25">
              <label>انتخاب خدمت<span>*</span></label>
              <select
                {...register('serviceId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'خدمت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input disable"
                onChange={e => handlerSetService(parseInt(e.target.value))}
                disabled={true}
              >
                {
                  loadingServices ?
                    services.length > 0 ?
                      <>
                        <option value="" disabled selected>انتخاب کنید</option>
                        {
                          services?.map((item, index) =>
                            <option
                              key={index}
                              value={item.id}>
                              {item.name}
                            </option>
                          )
                        }
                      </>
                      :
                      <option>ابتدا خدمت و ارائه دهنده را ثبث کنید.</option>
                    :
                    <option value="" disabled>در حال بارگزاری...</option>
                }
              </select>
              <FormErrorMessage errors={errors} name="providerId"/>
            </div>
            <div className="panel-col-25">
              <label>انتخاب ارائه دهنده<span>*</span></label>
              <select
                {...register('providerId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'ارائه دهنده ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input disable"
                onChange={e => handlerSetProvider(parseInt(e.target.value))}
                disabled={true}
              >
                {
                  loadingProviders ?
                    providers.length > 0 ?
                      <>
                        <option value="" disabled>انتخاب ارائه دهنده</option>
                        {
                          providers?.map((item, index) =>
                            <option
                              key={index}
                              value={item.id}>
                              {item.user.fullName}
                            </option>
                          )
                        }
                      </>
                      :
                      <option>ارائه دهنده ای برای نمایش وجود ندارد.</option>
                    :
                    <option value="" disabled>ابتدا خدمت را انتخاب کنید.</option>
                }
              </select>
              <FormErrorMessage errors={errors} name="providerId"/>
            </div>
            <div className="panel-col-25">
              <label>قیمت خدمت (تومان)<span>*</span></label>
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
              <label onClick={() => setValue("userId", "2")}>انتخاب کاربر<span>*</span></label>
              <select
                {...register('userId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'ارائه دهنده ضروری است',
                  },
                })}
                // defaultValue=""
                className="bk-input">
                {
                  loadingUsers ?
                    users.length > 0 ?
                      <>
                        <option value="" disabled>انتخاب کنید</option>
                        {
                          users.map((item, index) =>
                            <option key={index} value={item.id}>{item.fullName} - {item.id}</option>
                          )
                        }
                      </>
                      :
                      <option>ابتدا کاربر با سطح ارائه دهنده ثبث کنید.</option>
                    :
                    <option value="" disabled>در حال بارگزاری...</option>
                }
              </select>
              <FormErrorMessage errors={errors} name="userId"/>
            </div>

            <div className="w-full p-4 my-4">
              <hr className="panel-section-separator"/>
            </div>

            <div className="panel-col-25">
              <label>تاریخ<span>*</span></label>
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
                           field: {onChange, value},
                           // fieldState: {invalid, isDirty}, //optional
                           // formState: {errors}, //optional, but necessary if you want to show an error message
                         }) => (
                  <>
                    <DatePicker
                      editable={false}
                      value={value}
                      placeholder="خدمت و ارائه دهنده را انتخاب کنید."
                      onChange={(date) => {
                        onChange(date?.isValid ? date : undefined);
                        handlerIsReservation(date)
                      }}
                      containerClassName="w-full"
                      className={"green " + (theme !== "light" ? "bg-dark" : "")}
                      inputClass={"bk-input " + (!watch("totalPrice") ? 'disable' : '')}
                      // minDate={dateNowP()}
                      disabled={!watch("totalPrice")}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-center"
                    />
                  </>
                )}
              />
              <FormErrorMessage errors={errors} name="date"/>
            </div>
            <div className="panel-col-33">
              <label>انتخاب وقت<span>*</span></label>
              <select
                {...register('time', {
                  required: {
                    value: true,
                    message: 'انتخاب وقت ضروری است',
                  },
                })}
                // defaultValue=""
                className={"bk-input " + (!watch("totalPrice") ? 'disable' : '')}
                onChange={(e) => handlerSetTime(reservedTimes, parseInt(e.target.value))}
                disabled={!watch("totalPrice")}
              >
                {
                  dateSelected ?
                    loadingReservedTimes ?
                      reservedTimes.length > 0 ?
                        reservedTimes?.map((dataTime, index) =>
                          dataTime.dayIsHoliday === true ?
                            <option key={index} selected>تعطیل رسمی: {dataTime.textHoliday}</option>
                            :
                            dataTime.timeSheet.length > 0 ?
                              <Fragment key={index}>
                                <option value="">نوبت خود را انتخاب کنید.</option>
                                {
                                  dataTime.timeSheet.map((time, indexTime) =>
                                    <option
                                      key={indexTime}
                                      value={indexTime}
                                      disabled={time[2]}
                                      // checked={time[2]}
                                    >
                                      {time[0]} تا {time[1]} {time[2] && time[3]}
                                    </option>
                                  )
                                }
                              </Fragment>
                              :
                              <option key={index}>نوبت کاری برای این روز وجود ندارد</option>
                        )
                        :
                        <option value="" disabled>نوبت رزروی برای این بازه وجود ندارد</option>
                      :
                      <option value="" disabled>در حال بارگزاری...</option>
                    :
                    <option value="" disabled>ابتدا تاریخ را مشخص کن.</option>
                }
              </select>
              <FormErrorMessage errors={errors} name="time"/>
            </div>

            <div className="panel-col-33 max-md:hidden"></div>
            <div className="panel-col-33">
              <label>نوع پرداخت<span>*</span></label>
              <select
                {...register('paymentType', {
                  required: {
                    value: true,
                    message: 'نوع پرداخت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input">
                <option value="" disabled>انتخاب کنید</option>
                <option value="Free">رایگان</option>
                <option value="CashPayment">پرداخت نقدی</option>
                <option value="CartByCart">کارت به کارت</option>
                <option value="CardReader">دستگاه کارتخوان</option>
                <option value="UnknownPayment">نامشخص</option>
              </select>
              <FormErrorMessage errors={errors} name="paymentType"/>
            </div>

            <div className="panel-col-33">
              <label>وضعیت<span>*</span></label>
              <select
                {...register('status', {
                  required: {
                    value: true,
                    message: 'نوع پرداخت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input">
                <option value="" disabled>انتخاب کنید</option>
                <option value="REVIEW">در صف بررسی</option>
                <option value="COMPLETED">تکمیل شده</option>
                {/*<option value="DONE">انجام شده</option>*/}
                {/*<option value="CANCELED">لغو شده</option>*/}
                {/*<option value="REJECTED">رد شده</option>*/}
              </select>
              <FormErrorMessage errors={errors} name="status"/>
            </div>
            <div className="panel-col-100">
              <label>توضیحات پرداخت</label>
              <textarea
                {...register('description')}
                rows="2" className="bk-input text-right"/>
              <FormErrorMessage errors={errors} name="description"/>
            </div>
            <div className="panel-col-50">
              <label>ارسال پیامک</label>
              <div className="panel-row-checkbox">
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToAdminService')}/>مدیر
                  سیستم</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToAdminProvider')}/>ارائه
                  دهنده</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToUserService')}/>کاربر</label>
              </div>
            </div>
            <div className="panel-col-50">
              <label>ارسال ایمیل</label>
              <div className="panel-row-checkbox">
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToAdminService')}/>مدیر
                  سیستم</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToAdminProvider')}/>ارائه
                  دهنده</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToUserService')}/>کاربر</label>
              </div>
            </div>
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
                  <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت ویرایش رزرو</span>
                )}
              </button>
            </div>


          </div>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps = ({query}) => {
  const id = query.id
  return {props: {id}}
}