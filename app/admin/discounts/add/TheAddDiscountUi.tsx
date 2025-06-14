"use client"
import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {bkToast, onlyTypeNumber, PNtoEN} from "@/libs/utility";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TheSpinner from "@/components/layout/TheSpinner";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import {dateNowP} from "@/libs/convertor";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";
import {useAddDiscount} from "@/hooks/admin/useDiscount";
import {TypeApiAddDiscountReq} from "@/types/typeApi";
import {TypeDiscountsType} from "@/types/typeConfig";

export default function TheAddDiscountUi() {

    const {router, theme} = useHook()

    const {mutateAsync: mutateAsyncAddDiscount, isPending: isPendingAddDiscount} = useAddDiscount()


    const refStartDate = useRef(null)
    const refEndDate = useRef(null)

    const [statusRequiredStartDate, setStatusRequiredStartDate] = useState(false)
    const [statusRequiredEndDate, setStatusRequiredEndDate] = useState(false)
    const [maxDate, setMaxDate] = useState(dateNowP().add(1, "year"))

    type TypeFormAddDiscountUi = {
        title: string;
        code: string;
        startDate: DateObject | null
        endDate: DateObject | null
        type: TypeDiscountsType;
        amount: string;
    }


    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeFormAddDiscountUi>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeFormAddDiscountUi) => {

        const transformedData: TypeApiAddDiscountReq = {
            title: data.title,
            code: data.code,
            type: data.type,
            amount: parseInt(data.amount),
        }

        if (data.startDate && data.endDate) {
                transformedData.startDate = PNtoEN(data.startDate.format())
                transformedData.endDate = PNtoEN(data.endDate.format())
        }else {
            transformedData.startDate = null
            transformedData.endDate = null
        }

        await mutateAsyncAddDiscount(transformedData).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        }).finally(() => {
            router.push('/admin/discounts')
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

    return (
        <>
            <HeadPage title="افزودن کد تخفیف جدید"/>
            <HeaderPage title="افزودن کد تخفیف جدید"
                        description="کدتخفیف یک راه عالی برای ارائه تخفیف و پاداش به مشتریان شماست.">
                <Link href="/admin/discounts" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست تخفیف ها</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
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
                                                if (date?.isValid) {
                                                    onChange(date);
                                                }
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
                                                if (date?.isValid) {
                                                    onChange(date);
                                                    setMaxDate(date)
                                                }
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
                        <div className="panel-col-33">
                            <label>نحوه تخفیف<span>*</span></label>
                            <select
                                {...register('type', {
                                    required: {
                                        value: true,
                                        message: 'نحوه تخفیف ضروری است',
                                    },
                                })}
                                defaultValue=""
                                className="bk-input">
                                <option value="" disabled>انتخاب کنید</option>
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
                                        message: watch('type') === 'PERCENT' ? "نباید از 100 بیشتر باشد." : "نباید از 100000000 بیشتر باشد."
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
                                    (isPendingAddDiscount ? 'disable-action' : '')
                                }
                                type="submit">
                                {isPendingAddDiscount ? (
                                    <TheSpinner/>
                                ) : (
                                    <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت کد تخفیف</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
