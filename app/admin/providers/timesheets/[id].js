import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {RiDeleteBin5Line} from "react-icons/ri";
import {useEffect, useRef, useState} from "react";
import {bkToast, dayNameByIndex, PNtoEN} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookAddTimeSheet} from "@/hooks/admin/hookTimeSheet";
import {Controller, useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import DatePicker, {DateObject} from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {hookDeleteTimeSheetProvider, hookGetProviderWhere, hookGetTimeSheetProvider} from "@/hooks/admin/hookProvider";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";

import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function AddTimeSheetProvider({id}) {

  const permissions = useSelector(state => state.user.permissions)

  const theme = useSelector(state => state.app.initTheme)


  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingData, setLoadingDate] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [dataProvider, setDataProvider] = useState([])
  const [data, setData] = useState([])


  const handlerGetProviderWhere = async () => {
    setLoadingProvider(false)
    let params = {
      type: "condition",
      how: "findUnique",
      condition: {
        where: {
          id: parseInt(id)
        },
        include: {
          service: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              fullName: true
            }
          },
        },
      }
    }
    await hookGetProviderWhere(params, (response, message) => {
      setLoadingProvider(true)
      if (response) {
        setDataProvider({
          serviceId: message.serviceId,
          serviceName: message.service.name,
          userName: message.user.fullName
        })
      } else {
        bkToast('error', message)
      }
    })
  }
  const handlerGetTimeSheet = async () => {
    await hookGetTimeSheetProvider(id, (response, message) => {
      if (response) {
        setLoadingDate(true)
        setLoadingPage(true)
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {
    handlerGetProviderWhere()
    handlerGetTimeSheet()
  }, [])

  const handlerDeleteTimeSheet = async (id) => {
    setLoadingDelete(true)
    setLoadingDate(true)
    await hookDeleteTimeSheetProvider(id, (response, message) => {
      setLoadingDelete(false)
      setLoadingDate(false)
      if (response) {
        bkToast('success', message)
        handlerGetTimeSheet()
      } else {
        bkToast('error', message)
      }
    })
  }


  /* -----------------------------------------------
                      Section Add
     ----------------------------------------------- */
  const [loading, setLoading] = useState(false)

  const refStartTime = useRef()
  const refEndTime = useRef()
  const [errorPeriodTime, setErrorPeriodTime] = useState(false)

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

  const onSubmit = async data => {

    data['serviceId'] = parseInt(dataProvider.serviceId)
    data['providerId'] = parseInt(id)
    if (data.startTime instanceof DateObject || data.endTime instanceof DateObject) {
      data.startTime = PNtoEN(data.startTime.format('HH:mm'))
      data.endTime = PNtoEN(data.endTime.format('HH:mm'))
    }


    if (data.dayName === "1,2,3,4,5,6,7") {
      let array = [1, 2, 3, 4, 5, 6, 7]
      await createTime(array, data)
    } else if (data.dayName === "1,2,3,4,5,6") {
      let array = [1, 2, 3, 4, 5, 6]
      await createTime(array, data)
    } else if (data.dayName === "1,3,5") {
      let array = [1, 3, 5]
      await createTime(array, data)
    } else if (data.dayName === "2,4,6") {
      let array = [2, 4, 6]
      await createTime(array, data)
    } else {
      data['dayIndex'] = parseInt(data.dayName)
      data.dayName = dayNameByIndex(parseInt(data.dayName) - 1)
      await addTimeSheet(data)
    }

  }


  const createTime = async (array, data) => {
    for (let i = 0; i < array.length; i++) {
      data['dayIndex'] = parseInt(array[i])
      data.dayName = dayNameByIndex(parseInt(array[i]) - 1)
      await addTimeSheet(data)
    }
  }
  const addTimeSheet = async data => {
    setLoading(true)
    setLoadingDate(true)
    await hookAddTimeSheet(data, (response, message) => {
      setLoading(false)
      setLoadingDate(false)
      if (response) {
        bkToast('success', message)
        handlerGetTimeSheet()
        // router.push('/admin/providers')
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {

    if ((watch('startTime') !== undefined && watch('endTime') !== undefined)) {
      if ((watch('startTime') !== null && watch('endTime') !== null)) {
        compareTime(watch("startTime").format('HH:mm'), watch("endTime").format('HH:mm'))
      }
    }

  })


  function compareTime(time1, time2) {
    const [hour1, minute1] = time1.split(':');
    const [hour2, minute2] = time2.split(':');
    return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2) ? setErrorPeriodTime(true) : setErrorPeriodTime(false);
  }


  return (
    <>
      <HeadPage title="تقویم کاری"/>
      <HeaderPage title="تقویم کاری" description="تقویم کاری به ارائه دهنده اضافه یا ویرایش نمایید.">
        <Link href="/admin/providers" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست ارائه دهندگان</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {
          loadingPage ?
            <>
              {
                permissions.addTimesheets &&
                <>
                  <h1 className="mb-8 fa-regular-20px leading-10">
                    <span>شما در حال ارائه شیفت در تقویم کاری</span>
                    <strong className="text-green-500 border-b border-red-500 pb-1 mx-2">
                      {
                        loadingProvider && dataProvider.userName
                      }
                    </strong>
                    <span>برای خدمت</span>
                    <strong className="text-primary-500 border-b border-red-500 pb-1 mx-2">
                      {
                        loadingProvider && dataProvider.serviceName
                      }
                    </strong>
                    <span>میباشید.</span>
                  </h1>
                  <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex-center-start flex-wrap">
                      <div className="panel-col-33">
                        <label>انتخاب روز<span>*</span></label>
                        <select
                          {...register('dayName', {
                            required: {
                              value: true,
                              message: 'انتخاب روز ضروری است',
                            },
                          })}
                          defaultValue=""
                          className="bk-input">
                          <option value="" disabled>انتخاب کنید</option>
                          <option value="1">شنبه</option>
                          <option value="2">یکشنبه</option>
                          <option value="3">دوشنبه</option>
                          <option value="4">سه‌شنبه</option>
                          <option value="5">چهارشنبه</option>
                          <option value="6">پنجشنبه</option>
                          <option value="7">جمعه</option>
                          <option value="1,2,3,4,5,6,7">تمام هفته</option>
                          <option value="1,2,3,4,5,6">تمام هفته به غیر از جمعه</option>
                          <option value="1,3,5">روزهای زوج (شنبه، دوشنبه، چهارشنبه)</option>
                          <option value="2,4,6">روزهای فرد (یکشنبه، سه‌شنبه، پنجشنبه)</option>
                        </select>
                        <FormErrorMessage errors={errors} name="dayName"/>
                      </div>


                      <div className="panel-col-33">
                        <label>ساعت شروع<span>*</span></label>
                        <Controller
                          control={control}
                          name="startTime"
                          rules={{
                            required: {
                              value: true,
                              message: 'ساعت شروع ضروری است',
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
                        <label>ساعت پایان<span>*</span></label>
                        <Controller
                          control={control}
                          name="endTime"
                          rules={{
                            required: {
                              value: true,
                              message: 'ساعت پایان ضروری است',
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

                      {
                        permissions.deleteTimesheets &&
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
                                                   className="inline-flex align-middle ml-2"/>ثبت زمان بندی</span>
                            )}
                          </button>
                        </div>

                      }
                    </div>
                  </form>
                </>
              }
              <div className="mt-10">
                <h1 className="mb-8 fa-regular-20px leading-10">برنامه زمانبندی که برای ارائه دهنده این خدمت تعیین کرده اید.</h1>
                <div className="bk-table">
                  <table>
                    <thead>
                    <tr>
                      <th>روز</th>
                      <th>ساعت شروع</th>
                      <th>ساعت پایان</th>
                      <th>عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      loadingData ?
                        data.length > 0 ?
                          data?.map((item, index) =>
                            <tr key={index}>
                              <td>{item.dayName}</td>
                              <td>{item.startTime}</td>
                              <td>{item.endTime}</td>
                              <td>
                                <div className="flex-center-center gap-3">
                                  {/*<Link href={"/admin/providers/" + item.id}><FiEdit*/}
                                  {/*    size="26px"/></Link>*/}
                                  {
                                    loadingDelete ?
                                      <TheSpinner/>
                                      :
                                      permissions.deleteTimesheets &&
                                      <RiDeleteBin5Line
                                        onClick={() => handlerDeleteTimeSheet(item.id)}
                                        className="text-red-500 cursor-pointer"
                                        size="28px"/>
                                  }
                                </div>
                              </td>
                            </tr>
                          ) :
                          <tr>
                            <td colSpan={4}>برنامه زمانی برای نمایش وجود ندارد.</td>
                          </tr>
                        :
                        <tr>
                          <td colSpan={4}><TheSpinner/></td>
                        </tr>
                    }
                    </tbody>
                  </table>
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

export const getServerSideProps = ({query}) => {
  const id = query.id
  return {props: {id}}
}