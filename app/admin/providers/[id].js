import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {bkToast, onlyTypeNumber, PNtoEN} from "@/libs/utility";
import {hookGetProvider, hookUpdateProvider} from "@/hooks/admin/hookProvider";
import {hookListServices} from "@/hooks/admin/hookService";
import {hookListUsersByCatalogId} from "@/hooks/admin/hookUser";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useSelector} from "react-redux";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import TheSpinner from "@/components/layout/TheSpinner";
import {dateNowP, stringToDateObjectP} from "@/libs/convertor";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function AddProvider({id}) {

  const router = useRouter()

  const theme = useSelector(state => state.app.initTheme)

  const [loadingPage, setLoadingPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingListServices, setLoadingListServices] = useState(false)
  const [loadingListUsers, setLoadingListUsers] = useState(false)
  const [dataServices, setDataServices] = useState([])
  const [dataUsers, setDataUsers] = useState([])

  const refStartDate = useRef()
  const refEndDate = useRef()
  const refStartTime = useRef()
  const refEndTime = useRef()
  const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
  const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
  const [statusRequiredStartTime, setStatusRequiredStartTime] = useState(false)
  const [statusRequiredEndTime, setStatusRequiredEndTime] = useState(false)
  // const [minDate, setMinDate] = useState(new Date())
  const [maxDate, setMaxDate] = useState({})
  const [errorPeriodTime, setErrorPeriodTime] = useState(false)

  const items = [
    "description",
  ];
  const itemsBoolean = [
    "status",
    "workHolidays",
  ];
  const itemsInteger = [
    "serviceId",
    "userId",
    "slotTime",
  ];

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm({
    criteriaMode: 'all',
  })

  const onSubmit = data => {

    itemsBoolean.forEach(item => {
      data[item] = data[item] === 'true'
    })
    itemsInteger.forEach(item => {
      data[item] = parseInt(data[item])
    })

    if (data.startDate instanceof DateObject || data.endDate instanceof DateObject) {
      data.startDate = PNtoEN(data.startDate.format())
      data.endDate = PNtoEN(data.endDate.format())
    }
    if (data.startTime instanceof DateObject || data.endTime instanceof DateObject) {
      data.startTime = PNtoEN(data.startTime.format('HH:mm'))
      data.endTime = PNtoEN(data.endTime.format('HH:mm'))
    }
    handlerUpdateProvider(data)
  }


  const handlerGetProvider = async () => {
    await hookGetProvider(id, (response, message) => {
      if (response) {
        setLoadingPage(true)

        items.forEach(item => {
          setValue(item, message[item])
        })
        itemsBoolean.forEach(item => {
          setValue(item, message[item].toString())
        })
        itemsInteger.forEach(item => {
          setValue(item, parseInt(message[item]))
        })

        message.startDate !== null && setValue('startDate', stringToDateObjectP(message.startDate))
        message.endDate !== null && setValue('endDate', stringToDateObjectP(message.endDate))

        let arrayStartTime = message.startTime.split(":")
        let arrayEndTime = message.endTime.split(":")
        message.startTime !== null && setValue('startTime', dateNowP().setHour(arrayStartTime[0]).setMinute(arrayStartTime[1]))
        message.endTime !== null && setValue('endTime', dateNowP().setHour(arrayEndTime[0]).setMinute(arrayEndTime[1]))

      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerUpdateProvider = async data => {
    setLoading(true)
    await hookUpdateProvider(data, id, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', message)
        router.push('/admin/providers')
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerListServices = async () => {
    setLoadingListServices(false)
    // let params = {
    //   type: "condition",
    //   condition:
    //     {
    //       select: {
    //         id: true,
    //         name: true
    //       }
    //     }
    // }
    await hookListServices((response, message) => {
      setLoadingListServices(true)
      if (response) {
        setDataServices(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerListUsersByCatalogId = async () => {
    setLoadingListUsers(false)
    let params = {
      catalogId: 3
    }
    await hookListUsersByCatalogId(params, (response, message) => {
      setLoadingListUsers(true)
      if (response) {
        setDataUsers(message)
        //ابتدا لیست سرویس ها ئ کاربران بیاد سپس یدتاهای سرویس بیان.
        handlerGetProvider()
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListServices()
    handlerListUsersByCatalogId()
  }, [])

  useEffect(() => {
    if ((watch('startDate') === undefined && watch('endDate') === undefined) || (watch('startDate') === null && watch('endDate') === null)) {
      setStatusRequiredStartDate(false)
      setStatusRequiredEndDate(false)
    } else {
      setStatusRequiredStartDate(true)
      setStatusRequiredEndDate(true)
    }
  })
  useEffect(() => {

    if ((watch('startTime') !== undefined && watch('endTime') !== undefined)) {
      if ((watch('startTime') !== null && watch('endTime') !== null)) {
        compareTime(watch("startTime").format('HH:mm'), watch("endTime").format('HH:mm'))
      }
    }

    if ((watch('startTime') === undefined && watch('endTime') === undefined) || (watch('startTime') === null && watch('endTime') === null)) {
      setStatusRequiredStartTime(false)
      setStatusRequiredEndTime(false)
      setErrorPeriodTime(false)
    } else {
      setStatusRequiredStartTime(true)
      setStatusRequiredEndTime(true)
    }
  })


  function compareTime(time1, time2) {
    const [hour1, minute1] = time1.split(':');
    const [hour2, minute2] = time2.split(':');
    return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2) ? setErrorPeriodTime(true) : setErrorPeriodTime(false);
  }


  return (
    <>
      <HeadPage title="ویرایش ارائه دهنده"/>
      <HeaderPage title="ویرایش ارائه دهنده" description="تنظیمات ارائه دهنده خود را ویرایش نمایید.">
        <Link href="/admin/providers" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست ارائه دهندگان</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {
          loadingPage ?
            <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-center-start flex-wrap">
                <div className="panel-col-33">
                  <label>خدمت<span>*</span></label>
                  <select
                    {...register('serviceId', {
                      valueAsNumber: true,
                      required: {
                        value: true,
                        message: 'خدمت ضروری است',
                      },
                    })}
                    defaultValue=""
                    className="bk-input">
                    {
                      loadingListServices ?
                        dataServices.length > 0 ?
                          <>
                            <option value="" disabled>انتخاب کنید</option>
                            {
                              dataServices?.map((item, index) =>
                                <option key={index} value={item.id}>{item.name}</option>
                              )
                            }
                          </>
                          :
                          <option>ابتدا خدمت را ثبث کنید.</option>
                        :
                        <option value="" disabled>در حال بارگزاری...</option>
                    }
                  </select>
                  <FormErrorMessage errors={errors} name="serviceId"/>
                </div>
                <div className="panel-col-33">
                  <label>ارائه دهنده<span>*</span></label>
                  <select
                    {...register('userId', {
                      valueAsNumber: true,
                      required: {
                        value: true,
                        message: 'ارائه دهنده ضروری است',
                      },
                    })}
                    defaultValue=""
                    className="bk-input">
                    {
                      loadingListUsers ?
                        dataUsers.length > 0 ?
                          <>
                            <option value="" disabled>انتخاب کنید</option>
                            {
                              dataUsers?.map((item, index) =>
                                <option key={index}
                                        value={item.id}>{item.fullName}</option>
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
                <div className="panel-col-33">
                  <label>مدت استراحت بین هر نوبت<span>*</span></label>
                  <input
                    {...register('slotTime', {
                      required: {
                        value: true,
                        message: 'مدت استراحت بین هر نوبت ضروری است',
                      },
                      min: {
                        value: 0,
                        message: " باید از 0 بیشتر باشد."
                      },
                      max: {
                        value: 1439,
                        message: " نباید از 1439 بیشتر باشد."
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'یک عدد صحیح وارد کنید.',
                      },
                    })}
                    onKeyPress={onlyTypeNumber}
                    placeholder="بین یک رزرو تا رزرو دیگر چند دقیقه فاصله باشد."
                    type="text" className="bk-input"/>
                  <FormErrorMessage errors={errors} name="slotTime"/>
                </div>


                <div className="w-full p-4 my-4">
                  <hr className="panel-section-separator"/>
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
                               field: {onChange, value},
                               // fieldState: {invalid, isDirty}, //optional
                               // formState: {errors}, //optional, but necessary if you want to show an error message
                             }) => (
                      <>
                        <DatePicker
                          ref={refStartDate}
                          editable={false}
                          value={value}
                          onChange={(date) => {
                            onChange(date?.isValid ? date : undefined);
                            // date?.isValid && setMinDate(date)
                          }}
                          containerClassName="w-full"
                          className={"green " + (theme !== "light" ? "bg-dark" : "")}
                          inputClass="bk-input"
                          // minDate={new Date()}
                          minDate={dateNowP()}
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
                                setValue('startDate', null), refStartDate.current.closeCalendar()
                              }}
                            >
                              ریست
                            </div>
                          </div>
                        </DatePicker>
                      </>
                    )}
                  />
                  <FormErrorMessage errors={errors} name="startDate"/>
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
                               field: {onChange, value},
                               // fieldState: {invalid, isDirty}, //optional
                               // formState: {errors}, //optional, but necessary if you want to show an error message
                             }) => (
                      <>
                        <DatePicker
                          ref={refEndDate}
                          editable={false}
                          value={value}
                          onChange={(date) => {
                            onChange(date?.isValid ? date : undefined);
                            date?.isValid && setMaxDate(date)
                          }}
                          containerClassName="w-full"
                          className={"green " + (theme !== "light" ? "bg-dark" : "")}
                          inputClass="bk-input"
                          // minDate={minDate}
                          minDate={dateNowP()}
                          calendar={persian}
                          locale={persian_fa}
                          format="YYYY/MM/DD"
                          calendarPosition="bottom-center"
                        >
                          <div className="flex-center-center pb-2">
                            <div
                              className="panel-date-picker-reset"
                              onClick={() => {
                                setValue('endDate', null), refEndDate.current.closeCalendar()
                              }}
                            >
                              ریست
                            </div>
                          </div>
                        </DatePicker>
                      </>
                    )}
                  />
                  <FormErrorMessage errors={errors} name="endDate"/>
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
                      validate: () => errorPeriodTime !== true || 'ساعت شروع باید کوچکتر از ساعت پایان باشد.'
                    }}
                    render={({
                               field: {onChange, value},
                               // fieldState: {invalid, isDirty}, //optional
                               // formState: {errors}, //optional, but necessary if you want to show an error message
                             }) => (
                      <>
                        <DatePicker
                          disableDayPicker
                          ref={refStartTime}
                          value={value}
                          onChange={(date) => {
                            onChange(date?.isValid ? date : undefined);
                          }}
                          editable={false}
                          containerClassName="w-full"
                          className={"green " + (theme !== "light" ? "bg-dark" : "")}
                          inputClass="bk-input"
                          plugins={
                            // eslint-disable-next-line react/jsx-key
                            [<TimePicker hideSeconds/>]
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
                                setValue('startTime', null), refStartTime.current.closeCalendar()
                              }}
                            >
                              ریست
                            </div>
                          </div>
                        </DatePicker>
                      </>
                    )}
                  />
                  <FormErrorMessage errors={errors} name="startTime"/>
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
                               field: {onChange, value},
                               // fieldState: {invalid, isDirty}, //optional
                               // formState: {errors}, //optional, but necessary if you want to show an error message
                             }) => (
                      <>
                        <DatePicker
                          disableDayPicker
                          ref={refEndTime}
                          value={value}
                          onChange={(date) => {
                            onChange(date?.isValid ? date : undefined);
                          }}
                          editable={false}
                          containerClassName="w-full"
                          className={"green " + (theme !== "light" ? "bg-dark" : "")}
                          inputClass="bk-input"
                          plugins={
                            // eslint-disable-next-line react/jsx-key
                            [<TimePicker hideSeconds/>]
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
                                setValue('endTime', null), refEndTime.current.closeCalendar()
                              }}
                            >
                              ریست
                            </div>
                          </div>
                        </DatePicker>
                      </>
                    )}
                  />
                  <FormErrorMessage errors={errors} name="endTime"/>
                </div>

                <div className="w-full p-4 my-4">
                  <hr className="panel-section-separator"/>
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
                    className="bk-input">
                    <option value="true">فعال</option>
                    <option value="false">غیرفعال</option>
                  </select>
                  <FormErrorMessage errors={errors} name="status"/>
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
                    className="bk-input">
                    <option value="true">بله</option>
                    <option value="false">خیر</option>
                  </select>
                  <FormErrorMessage errors={errors} name="workHolidays"/>
                </div>

                <div className="panel-col-33">
                  <label>تصویر</label>
                  <input type="file" className="bk-input"/>
                </div>


                <div className="panel-col-100">
                  <label>معرفی ارائه دهنده</label>
                  <textarea
                    {...register('description')}
                    rows="5" className="bk-input text-right"/>
                  <FormErrorMessage errors={errors} name="description"/>
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
                      <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت ارائه دهنده</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
            :
            <TheSpinner/>
        }
      </div>
    </>
  )
}

export const getServerSideProps = ({query}) => {
  const id = query.id
  return {props: {id}}
}