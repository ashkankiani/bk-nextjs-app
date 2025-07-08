"use client"
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {RiDeleteBin5Line} from "react-icons/ri";
import {useEffect, useRef, useState} from "react";
import {bkToast, dayNameByIndex, PNtoEN} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";

import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useParams} from "next/navigation";
import useHook from "@/hooks/controller/useHook";
import {useShowProvider} from "@/hooks/admin/useProvider";
import {useAddTimeSheet, useDeleteTimeSheet, useShowTimeSheet} from "@/hooks/admin/useTimeSheet";
import {TypeApiAddTimeSheetReq, TypeFormTimeSheet} from "@/types/typeApiAdmin";

export default function TheTimeSheetProviderUi() {

    const params = useParams()
    const id = Number(params.id)

    const {theme, router, permissions} = useHook()

    const {data: dataProvider, isLoading: isLoadingProvider} = useShowProvider(id) // ایدی 3 برای کاربران ارائه دهنده است.
    const {data: dataTimeSheet, isLoading: isLoadingTimeSheet, refetch: refetchTimeSheet} = useShowTimeSheet(id) // ایدی 3 برای کاربران ارائه دهنده است.

    const {mutateAsync: mutateAsyncDeleteTimeSheet, isPending: isPendingDeleteTimeSheet} = useDeleteTimeSheet()

    const handlerDeleteTimeSheet = async (id: number) => {
        await mutateAsyncDeleteTimeSheet({id}).then(async (res) => {
            bkToast('success', res.Message)
            await refetchTimeSheet()
        }).catch(errors => {
            bkToast('error', errors.Reason)
        })
    }


    /* -----------------------------------------------
                        Section Add
       ----------------------------------------------- */

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
    } = useForm<TypeFormTimeSheet>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeFormTimeSheet) => {


        const transformedData: TypeApiAddTimeSheetReq = {

            serviceId: dataProvider!.serviceId,

            providerId: dataProvider!.id,

            // dayName: data.dayName,
            // dayIndex: data.dayIndex,
            startTime: PNtoEN(data.startTime.format('HH:mm')),
            endTime: PNtoEN(data.endTime.format('HH:mm')),

        }

        if (data.dayName === "1,2,3,4,5,6,7") {
            let array = [1, 2, 3, 4, 5, 6, 7]
            await createTime(array, transformedData)
        } else if (data.dayName === "1,2,3,4,5,6") {
            let array = [1, 2, 3, 4, 5, 6]
            await createTime(array, transformedData)
        } else if (data.dayName === "1,3,5") {
            let array = [1, 3, 5]
            await createTime(array, transformedData)
        } else if (data.dayName === "2,4,6") {
            let array = [2, 4, 6]
            await createTime(array, transformedData)
        } else {
            transformedData['dayIndex'] = parseInt(transformedData.dayName)
            transformedData.dayName = dayNameByIndex(parseInt(transformedData.dayName) - 1)
            await addTimeSheet(transformedData)
        }

    }


    const createTime = async (array, transformedData) => {
        for (let i = 0; i < array.length; i++) {
            transformedData['dayIndex'] = parseInt(array[i])
            transformedData.dayName = dayNameByIndex(parseInt(array[i]) - 1)
            await addTimeSheet(transformedData)
        }
    }

    const {mutateAsync: mutateAsyncAddTimeSheet, isPending: isPendingAddTimeSheet} = useAddTimeSheet()

    const addTimeSheet = async data => {

        await mutateAsyncAddTimeSheet(data).then( async (res) => {
            bkToast('success', res.Message)
            await refetchTimeSheet()
        }).catch(errors => {
            bkToast('error', errors.Reason)
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
            <HeaderPage title="تقویم کاری" description="تقویم کاری به ارائه دهنده اضافه یا ویرایش نمایید.">
                <Link href="/admin/providers" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست ارائه دهندگان</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">

                {
                    permissions.addTimesheets &&
                    <>
                        <h1 className="mb-8 fa-regular-20px leading-10">
                            <span>شما در حال ارائه شیفت در تقویم کاری</span>
                            <strong className="text-green-500 border-b border-red-500 pb-1 mx-2">
                                {
                                    isLoadingProvider ? <TheSpinner/> : dataProvider && dataProvider.user.fullName
                                }
                            </strong>
                            <span>برای خدمت</span>
                            <strong className="text-primary-500 border-b border-red-500 pb-1 mx-2">
                                {
                                    isLoadingProvider ? <TheSpinner/> : dataProvider && dataProvider.service.name
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
                                    permissions.addTimesheets &&
                                    <div className="panel-col-100">
                                        <button
                                            className={
                                                'panel-form-submit ' +
                                                (isPendingAddTimeSheet ? 'disable-action' : '')
                                            }
                                            type="submit">
                                            {isPendingAddTimeSheet ? (
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
                    <h1 className="mb-8 fa-regular-20px leading-10">برنامه زمانبندی که برای ارائه دهنده این خدمت تعیین
                        کرده اید.</h1>
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
                                isLoadingTimeSheet ?
                                    <tr>
                                        <td colSpan={4}><TheSpinner/></td>
                                    </tr>
                                    :
                                    dataTimeSheet && dataTimeSheet.length > 0 ?
                                        dataTimeSheet?.map((item, index) =>
                                            <tr key={index}>
                                                <td>{item.dayName}</td>
                                                <td>{item.startTime}</td>
                                                <td>{item.endTime}</td>
                                                <td>
                                                    <div className="flex-center-center gap-3">
                                                        {
                                                            isPendingDeleteTimeSheet ?
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

                            }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}
