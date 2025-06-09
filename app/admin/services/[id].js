import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useRouter} from "next/router";
import {bkToast, onlyTypeNumber, PNtoEN} from "@/libs/utility";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useSelector} from "react-redux";
import {hookGetService, hookUpdateService} from "@/hooks/admin/hookService";
import {dateNowP, stringToDateObjectP} from "@/libs/convertor";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import {hookListUsersWhere} from "@/hooks/admin/hookUser";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function EditService({id}) {
    const router = useRouter()

    const theme = useSelector(state => state.app.initTheme)

    const refStartDate = useRef()
    const refEndDate = useRef()

    const [loadingPage, setLoadingPage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingListUsers, setLoadingListUsers] = useState(false)
    const [dataUsers, setDataUsers] = useState([])
    const [dataService, setDataService] = useState([])
    const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
    const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
    // const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)

    const items = [
        "name",
        "gender",
        "description",
        "descriptionAfterPurchase",
        "codPayment",
        "onlinePayment",
        "smsToAdminService",
        "smsToAdminProvider",
        "smsToUserService",
        "emailToAdminService",
        "emailToAdminProvider",
        "emailToUserService",
    ];

    const itemsInteger = [
        "userId",
        "periodTime",
        "price",
        "capacity",
    ];

    const {
        register,
        control,
        watch,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        criteriaMode: 'all',
    })


    const onSubmit = data => {

        itemsInteger.forEach(item => {
            data[item] = parseInt(data[item])
        })

        if (data.startDate instanceof DateObject || data.endDate instanceof DateObject) {
            data.startDate = PNtoEN(data.startDate.format())
            data.endDate = PNtoEN(data.endDate.format())
        }
        handlerUpdateService(data)
    }

    const handlerGetService = async () => {

        await hookGetService(id, (response, message) => {
            if (response) {

                setDataService(message)
                setLoadingPage(true)

                items.forEach(item => {
                    setValue(item, message[item])
                })
                itemsInteger.forEach(item => {
                    setValue(item, parseInt(message[item]))
                })

                message.startDate !== null && setValue('startDate', stringToDateObjectP(message.startDate))
                message.endDate !== null && setValue('endDate', stringToDateObjectP(message.endDate))

                // message.startDate !== null ? setMinDate(stringToDateObjectP(message.startDate)) : setMinDate(new Date())
                // message.endDate !== null ? setMaxDate(stringToDateObjectP(message.endDate)) : setMinDate({})
            } else {
                bkToast('error', message)
            }
        })
    }
    const handlerUpdateService = async data => {
        setLoading(true)
        await hookUpdateService(data, id, (response, message) => {
            setLoading(false)
            if (response) {
                bkToast('success', message)
                router.push('/admin/services')
            } else {
                bkToast('error', message)
            }
        })
    }

    useEffect(() => {
        if ((watch('startDate') === undefined && watch('endDate') === undefined) || (watch('startDate') === null && watch('endDate') === null)) {
            setStatusRequiredStartDate(false)
            setStatusRequiredEndDate(false)
        } else {
            setStatusRequiredStartDate(true)
            setStatusRequiredEndDate(true)
        }
    })

    const handlerListUsersWhere = async () => {
        setLoadingListUsers(false)
        let params = {
            type: "condition",
            condition:
              {
                  where: {
                      catalogId: 3
                  },
                  select: {
                      id: true,
                      fullName: true
                  }
              }
        }
        await hookListUsersWhere(params, (response, message) => {
            setLoadingListUsers(true)
            if (response) {
                setDataUsers(message)
                handlerGetService()
            } else {
                bkToast('error', message)
            }
        })
    }

    useEffect(() => {
        handlerListUsersWhere()
    }, [])

    return (
        <>
            <HeadPage title="ویرایش خدمت"/>
            <HeaderPage title="ویرایش خدمت" description="خدمت خود را ویرایش کنید.">
                <Link href="/admin/services" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست خدمات</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                {
                    loadingPage ?
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
                                      defaultValue={dataService.userId}
                                      className="bk-input">
                                        {
                                            loadingListUsers ?
                                              dataUsers.length > 0 ?
                                                <>
                                                    <option value="" disabled>انتخاب کنید</option>
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
                                    <label>ظرفیت در هر رزرو<span>*</span></label>
                                    <input
                                        {...register('capacity', {
                                            required: {
                                                value: true,
                                                message: 'ظرفیت در هر رزرو ضروری است',
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
                                                     field: {onChange,  value},
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
                                                     field: {onChange,  value},
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

                                <div className="w-full p-4 my-4">
                                    <hr className="panel-section-separator"/>
                                </div>

                                <div className="panel-col-33">
                                    <label>نوع پرداخت<span>*</span></label>
                                    <div className="panel-row-checkbox">
                                        <label><input type="checkbox" {...register('codPayment')}/>در محل</label>
                                        <label><input type="checkbox" {...register('onlinePayment')}/>آنلاین</label>
                                    </div>
                                </div>
                                <div className="panel-col-33">
                                    <label>ارسال پیامک</label>
                                    <div className="panel-row-checkbox">
                                        <label><input type="checkbox" {...register('smsToAdminService')}/>مدیر
                                            سیستم</label>
                                        <label><input type="checkbox" {...register('smsToAdminProvider')}/>ارائه
                                            دهنده</label>
                                        <label><input type="checkbox" {...register('smsToUserService')}/>کاربر</label>
                                    </div>
                                </div>
                                <div className="panel-col-33">
                                    <label>ارسال ایمیل</label>
                                    <div className="panel-row-checkbox">
                                        <label><input type="checkbox" {...register('emailToAdminService')}/>مدیر
                                            سیستم</label>
                                        <label><input type="checkbox" {...register('emailToAdminProvider')}/>ارائه دهنده</label>
                                        <label><input type="checkbox" {...register('emailToUserService')}/>کاربر</label>
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