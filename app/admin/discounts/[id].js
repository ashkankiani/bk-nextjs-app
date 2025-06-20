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
import {hookGetDiscount, hookUpdateDiscount} from "@/hooks/admin/hookDiscount";
import {dateNowP, stringToDateObjectP} from "@/libs/convertor";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function EditDiscount({id}) {
    const router = useRouter()

    const theme = useSelector(state => state.app.initTheme)

    const refStartDate = useRef()
    const refEndDate = useRef()

    const [loadingPage, setLoadingPage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
    const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)

    const items = [
        "title",
        "code",
        "type",
        "amount",
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
        data.amount = parseInt(data.amount)
        if (data.startDate instanceof DateObject || data.endDate instanceof DateObject) {
            data.startDate = PNtoEN(data.startDate.format())
            data.endDate = PNtoEN(data.endDate.format())
        }
        handlerUpdateDiscount(data)
    }

    const getDiscount = async () => {

        await hookGetDiscount(id, (response, message) => {
            if (response) {
                setLoadingPage(true)

                items.forEach(item => {
                    setValue(item, message[item])
                })

                message.startDate !== null && setValue('startDate', stringToDateObjectP(message.startDate))
                message.endDate !== null && setValue('endDate', stringToDateObjectP(message.endDate))

                message.startDate !== null ? setMinDate(stringToDateObjectP(message.startDate)): setMinDate(new Date())
                message.endDate !== null ? setMaxDate(stringToDateObjectP(message.endDate)): setMinDate({})
            } else {
                bkToast('error', message)
            }
        })
    }
    const handlerUpdateDiscount = async data => {
        setLoading(true)
        await hookUpdateDiscount(data, id, (response, message) => {
            setLoading(false)
            if (response) {
                bkToast('success', message)
                router.push('/admin/discounts')
            } else {
                bkToast('error', message)
            }
        })
    }
    useEffect(() => {
        getDiscount()
    }, [])

    useEffect(() => {
        if ((watch('startDate') === undefined && watch('endDate') === undefined) || (watch('startDate') === null && watch('endDate') === null)) {
            setStatusRequiredStartDate(false)
            setStatusRequiredEndDate(false)
        }else{
            setStatusRequiredStartDate(true)
            setStatusRequiredEndDate(true)
        }
    })



    return (
        <>
            <HeadPage title="ویرایش کد تخفیف"/>
            <HeaderPage title="ویرایش کد تخفیف" description="کد تخفیف خود را ویرایش کنید.">
                <Link href="/admin/discounts" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست تخفیف ها</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                {
                    loadingPage ?
                        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex-center-start flex-wrap">
                                <div className="panel-col-33">
                                    <label>عنوان تخفیف<span>*</span></label>
                                    <input
                                        {...register('title', {
                                            required: {
                                                value: true,
                                                message: 'عنوان تخفیف ضروری است',
                                            },
                                        })}
                                        type="text" className="bk-input"/>
                                    <FormErrorMessage errors={errors} name="title"/>
                                </div>
                                <div className="panel-col-33">
                                    <label>کد تخفیف<span>*</span></label>
                                    <input
                                        {...register('code', {
                                            required: {
                                                value: true,
                                                message: 'کد تخفیف ضروری است',
                                            },
                                        })}
                                        placeholder="این کد را به مشتریان میدهید تا در سبد خریدشان اعمال کنند."
                                        type="text" className="bk-input"/>
                                    <FormErrorMessage errors={errors} name="code"/>
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
                                <div className="panel-col-33">
                                    <label>نحوه تخفیف<span>*</span></label>
                                    <select
                                        {...register('type', {
                                            required: {
                                                value: true,
                                                message: 'نحوه تخفیف ضروری است',
                                            },
                                        })}
                                        // defaultValue=""
                                        className="bk-input">
                                        <option value="" disabled selected>انتخاب کنید</option>
                                        <option value="CONSTANT">تخفیف ثابت روی کل سبد خرید</option>
                                        <option value="PERCENT">درصد تخفیف روی کل سبد خرید</option>
                                    </select>
                                    <FormErrorMessage errors={errors} name="type"/>
                                </div>
                                <div className="panel-col-33">
                                    <label>میزان تخفیف<span>*</span></label>
                                    <input
                                        {...register('amount', {
                                            required: {
                                                value: true,
                                                message: 'میزان تخفیف ضروری است',
                                            },
                                            min: {
                                                value: 1,
                                                message: " باید از 0 بیشتر باشد."
                                            },
                                            max: {
                                                value: watch('type') === 'PERCENT' ? 100 : 100000000,
                                                message: " نباید از 100 بیشتر باشد."
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'یک عدد صحیح وارد کنید.',
                                            },
                                        })}
                                        onKeyPress={onlyTypeNumber}
                                        placeholder="[تخفیف ثابت: مبلغ به تومان] [درصد تخفیف: عدد 1 تا 100]"
                                        type="text" className="bk-input"/>
                                    <FormErrorMessage errors={errors} name="amount"/>
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
                                            <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت کد تخفیف</span>
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