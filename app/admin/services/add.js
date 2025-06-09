import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {bkToast, onlyTypeNumber, PNtoEN} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookAddService} from "@/hooks/admin/hookService";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useSelector} from "react-redux";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import {dateNowP} from "@/libs/convertor";
import {hookListUsersByCatalogId} from "@/hooks/admin/hookUser";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function AddService() {

  const router = useRouter()

  const theme = useSelector(state => state.app.initTheme)

  const refStartDate = useRef()
  const refEndDate = useRef()

  const [loading, setLoading] = useState(false)
  const [loadingListUsers, setLoadingListUsers] = useState(false)
  const [dataUsers, setDataUsers] = useState([])
  const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
  const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
  const [minDate, setMinDate] = useState(new Date())
  const [maxDate, setMaxDate] = useState({})


  const itemsInteger = [
    "periodTime",
    "price",
    "capacity",
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
    itemsInteger.forEach(item => {
      data[item] = parseInt(data[item])
    })

    if (data.description.length === 0) {
      data.description = null
    }
    if (data.descriptionAfterPurchase.length === 0) {
      data.descriptionAfterPurchase = null
    }

    // if (statusRequiredStartDate && statusRequiredEndDate) {
    //   data.startDate = PNtoEN(data.startDate.valueOf())
    //   data.endDate = PNtoEN(data.endDate.valueOf())
    // }
// console.log(data)
    addService(data)
  }

  const addService = async data => {
    setLoading(true)
    await hookAddService(data, (response, message) => {
      setLoading(false)
      if (response) {
        router.push('/admin/services')
        bkToast('success', message)
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
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {
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


  return (
    <>
      <HeadPage title="افزودن خدمت جدید"/>
      <HeaderPage title="افزودن خدمت جدید" description="خدمت که ارائه میدهید را در این قسمت اضافه نمایید.">
        <Link href="/admin/services" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست خدمات</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-33">
              <label>نام خدمت<span>*</span></label>
              <input
                {...register('name', {
                  required: {
                    value: true,
                    message: 'عنوان ضروری است',
                  },
                })}
                type="text" className="bk-input"/>
              <FormErrorMessage errors={errors} name="name"/>
            </div>
            <div className="panel-col-33">
              <label>مدیر خدمت<span>*</span></label>
              <select
                {...register('userId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'مدیر خدمت ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input">
                {
                  loadingListUsers ?
                    dataUsers.length > 0 ?
                      <>
                        <option value="" disabled selected>انتخاب کنید</option>
                        {
                          dataUsers?.map((item, index) =>
                            <option key={index} value={item.id}>{item.fullName}</option>
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
              <label>مدت زمان خدمت<span>*</span></label>
              <input
                {...register('periodTime', {
                  required: {
                    value: true,
                    message: 'مدت زمان خدمت ضروری است',
                  },
                  min: {
                    value: 1,
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
                placeholder="هر رزرو چند دقیقه طول می کشد."
                type="text" className="bk-input"/>
              <FormErrorMessage errors={errors} name="periodTime"/>
            </div>
            <div className="panel-col-33">
              <label>قیمت خدمت<span>*</span></label>
              <input
                {...register('price', {
                  required: {
                    value: true,
                    message: 'قیمت خدمت ضروری است',
                  },
                  min: {
                    value: 0,
                    message: " باید از 0 بیشتر باشد."
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'یک عدد صحیح وارد کنید.',
                  },
                })}
                onKeyPress={onlyTypeNumber}
                placeholder="تومان وارد شود."
                type="text" className="bk-input"/>
              <FormErrorMessage errors={errors} name="price"/>
            </div>
            <div className="panel-col-33">
              <label>ظرفیت در هر نوبت<span>*</span></label>
              <input
                {...register('capacity', {
                  required: {
                    value: true,
                    message: 'ظرفیت در هر نوبت ضروری است',
                  },
                  min: {
                    value: 1,
                    message: " باید از 0 بیشتر باشد."
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'یک عدد صحیح وارد کنید.',
                  },
                })}
                onKeyPress={onlyTypeNumber}
                placeholder="چند نفر میتوانند هر نوبت رزرو را بخرند."
                type="text" className="bk-input"/>
              <FormErrorMessage errors={errors} name="capacity"/>
            </div>
            <div className="panel-col-33">
              <label>جنسیت رزرو کننده</label>
              <select
                {...register('gender')}
                defaultValue="NONE"
                className="bk-input">
                <option value="NONE">فرقی نمی کند</option>
                <option value="MAN">مرد</option>
                <option value="WOMAN">زن</option>
              </select>
              <FormErrorMessage errors={errors} name="gender"/>
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
                        onChange(date?.isValid ? PNtoEN(date.format('YYYY/MM/DD')) : undefined);
                        date?.isValid && setMinDate(date)
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
                        onChange(date?.isValid ? PNtoEN(date.format('YYYY/MM/DD')) : undefined);
                        date?.isValid && setMaxDate(date)
                      }}
                      containerClassName="w-full"
                      className={"green " + (theme !== "light" ? "bg-dark" : "")}
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

            <div className="w-full p-4 my-4">
              <hr className="panel-section-separator"/>
            </div>

            <div className="panel-col-33">
              <label>نوع پرداخت</label>
              <div className="panel-row-checkbox">
                <label><input type="checkbox" className="bk-checkbox" {...register('codPayment')}/>در محل</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('onlinePayment')}/>آنلاین</label>
              </div>
            </div>
            <div className="panel-col-33">
              <label>ارسال پیامک</label>
              <div className="panel-row-checkbox">
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToAdminService')}/>مدیر
                  سرویس</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToAdminProvider')}/>ارائه
                  دهنده</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('smsToUserService')}/>کاربر</label>
              </div>
            </div>
            <div className="panel-col-33">
              <label>ارسال ایمیل</label>
              <div className="panel-row-checkbox">
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToAdminService')}/>مدیر
                  سرویس</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToAdminProvider')}/>ارائه دهنده</label>
                <label><input type="checkbox" className="bk-checkbox" {...register('emailToUserService')}/>کاربر</label>
              </div>
            </div>

            <div className="w-full p-4 my-4">
              <hr className="panel-section-separator"/>
            </div>

            <div className="panel-col-100">
              <label>معرفی خدمت</label>
              <textarea
                {...register('description')}
                rows="5" className="bk-input text-right"/>
            </div>
            <div className="panel-col-100">
              <label>دستورالعمل پس از خرید</label>
              <textarea
                {...register('descriptionAfterPurchase')}
                rows="5" className="bk-input text-right"
                placeholder="پس از رزرو، دستورالعمل به کاربر نمایش داده می شود."/>
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
                  <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت خدمت</span>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}
