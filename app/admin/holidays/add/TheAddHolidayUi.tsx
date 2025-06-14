"use client"
import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {Controller, useForm} from "react-hook-form";
import {bkToast, PNtoEN} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";
import {useAddHoliday} from "@/hooks/admin/useHoliday";
import {TypeApiAddHolidayReq} from "@/types/typeApi";

export default function TheAddHolidayUi() {

    const {router, theme} = useHook()

    const {mutateAsync: mutateAsyncAddHoliday, isPending: isPendingAddHoliday} = useAddHoliday()

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeApiAddHolidayReq>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeApiAddHolidayReq) => {
        await mutateAsyncAddHoliday(data).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        }).finally(() => {
            router.push('/admin/holidays')
        })
    }

    return (
        <>
            <HeadPage title="افزودن روز تعطیل جدید"/>
            <HeaderPage title="افزودن روز تعطیل جدید" description="روزهای تعطیل دلخواه ایجاد کنید.">
                <Link href="/admin/holidays" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست تعطیلات</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex-center-start flex-wrap">
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
                                            onChange={(date) => {
                                                onChange(date?.isValid ? PNtoEN(date.format()) : undefined);
                                            }}
                                            containerClassName="w-full"
                                            className={"green " + (theme !== "light" ? "bg-dark" : "")}
                                            inputClass="bk-input"
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
                        <div className="panel-col-75">
                            <label>عنوان<span>*</span></label>
                            <input
                                {...register('title', {
                                    required: {
                                        value: true,
                                        message: 'عنوان ضروری است',
                                    },
                                })}
                                type="text" className="bk-input"/>
                            <FormErrorMessage errors={errors} name="title"/>
                        </div>
                        <div className="panel-col-100">
                            <button
                                className={
                                    'panel-form-submit ' +
                                    (isPendingAddHoliday ? 'disable-action' : '')
                                }
                                type="submit">
                                {isPendingAddHoliday ? (
                                    <TheSpinner/>
                                ) : (
                                    <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت تعطیلی جدید</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
