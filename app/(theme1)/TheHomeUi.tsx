"use client"
import {useState} from "react";
import DatePicker, {DateObject} from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {Controller, useForm} from "react-hook-form";
import {checkingTimeBetweenTimes} from "@/libs/utility";
import {dateNowP, numberWithCommas} from "@/libs/convertor";
import FormErrorMessage from "@/components/back-end/layout/section/FormErrorMessage";
import {setSearchQuery} from "@/store/slice/user";
import Link from "next/link";
import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import useController from "@/hooks/controller/useController";
import useHook from "@/hooks/controller/useHook";
import {useGetServices} from "@/hooks/user/useService";
import {useGetProvidersForService} from "@/hooks/user/useProvider";
import {TypeApiGetProvidersForServiceRes, TypeApiServices} from "@/types/typeApi";

export default function TheHomeUi() {
    const {dispatch, router, theme, isLogin, user, setting} = useHook()

    const {setStartEndDate} = useController()

    // const [loadingServices, setLoadingServices] = useState(false)
    // const [loadingProviders, setLoadingProviders] = useState(false)

    // const [services, setServices] = useState([]);
    // const [providers, setProviders] = useState([]);

    const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);

    const {data: dataServices, isLoading: isLoadingServices} = useGetServices()
    const {data: dataProviders, isLoading: isLoadingProviders} = useGetProvidersForService(
        {
            serviceId: selectedServiceId as number,
        },
        {
            enabled: !!selectedServiceId,
        }
    )


    type TypeFormInTheHomeUi = {
        serviceId?: number
        providerId?: number
        startDate: DateObject
        endDate: DateObject

    }
    type TypeFormOutTheHomeUi = {
        service: TypeApiServices
        provider: TypeApiGetProvidersForServiceRes
        startDate: number
        endDate: number
    }
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeFormInTheHomeUi>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeFormInTheHomeUi) => {
        const service = dataServices?.filter(item => item.id === data.serviceId)[0]
        const provider = dataProviders?.filter(item => item.id === data.providerId)[0]

        if (!service || !provider) return // یا ارور مناسب بده
        const transformedData: TypeFormOutTheHomeUi = {
            service,
            provider,
            startDate: data.startDate.setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
            endDate: data.endDate.setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()
        }

        dispatch(setSearchQuery(transformedData))
        // router.push('/reserve')
    }

    return (
        <>
            <div className="bk-box md:w-8/12 lg:w-5/12">
                <TheHeader/>
                <div className="bk-box-wrapper">
                    <h1 className="bk-box-wrapper-title">دریافت نوبت</h1>
                    <p className="bk-box-wrapper-description">
                        {
                            user && <strong className="pl-1">{user.fullName}</strong>
                        }
                        <span>به سامانه نوبت گیری سریع ما خوش آمدید.</span>
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="columns-1 sm:columns-2 sm:mb-4 gap-4">
                            <select
                                {...register('serviceId', {
                                    valueAsNumber: true,
                                    required: {
                                        value: true,
                                        message: 'خدمت ضروری است',
                                    },
                                })}
                                defaultValue=""
                                className="bk-input indent-2 max-sm:mb-2"
                                onChange={e => setSelectedServiceId(Number(e.target.value))}
                            >
                                {
                                    isLoadingServices ?
                                        <option value="" disabled>در حال بارگزاری...</option>
                                        :
                                        dataServices && dataServices.length > 0 ?
                                            <>
                                                <option value="" disabled>انتخاب خدمت</option>
                                                {
                                                    dataServices?.map((item, index) =>
                                                        <option
                                                            key={index}
                                                            value={item.id}
                                                            disabled={item.startDate !== null && item.endDate !== null && checkingTimeBetweenTimes(item.startDate, item.endDate)}>
                                                            {item.name}
                                                            {item.startDate !== null && item.endDate !== null && checkingTimeBetweenTimes(item.startDate, item.endDate) && ' (پایان زمان خدمت)'}
                                                        </option>
                                                    )
                                                }
                                            </>
                                            :
                                            <option>خدمتی برای نمایش وجود ندارد.</option>
                                }
                            </select>

                            <select
                                {...register('providerId', {
                                    valueAsNumber: true,
                                    required: {
                                        value: true,
                                        message: 'ارائه دهنده ضروری است',
                                    },
                                })}
                                defaultValue=""
                                className="bk-input indent-2 max-sm:mb-2">
                                {
                                    isLoadingProviders ?
                                        <option value="" disabled>ابتدا خدمت را انتخاب کنید.</option>
                                        :
                                        dataProviders && dataProviders.length > 0 ?
                                            <>
                                                <option value="" disabled>انتخاب ارائه دهنده</option>
                                                {
                                                    dataProviders?.map((item, index) =>
                                                        <option
                                                            key={index}
                                                            value={item.id}
                                                            disabled={item.startDate !== null && item.endDate !== null && checkingTimeBetweenTimes(item.startDate, item.endDate) || !item.status}>
                                                            {item.user.fullName} - {numberWithCommas(item.service.price!)} تومان
                                                            {item.startDate !== null && item.endDate !== null && checkingTimeBetweenTimes(item.startDate, item.endDate) && ' (پایان زمان ارائه دهنده)'}
                                                            {!item.status && ' (غیرفعال شده توسط مدیریت)'}
                                                        </option>
                                                    )
                                                }
                                            </>
                                            :
                                            <option>ارائه دهنده ای برای نمایش وجود ندارد.</option>
                                }
                            </select>
                        </div>
                        <div className="columns-1 sm:columns-2 sm:mb-4 gap-4">
                            <Controller
                                control={control}
                                name="startDate"
                                rules={{
                                    required: {
                                        value: true,
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
                                            editable={false}
                                            value={value}
                                            onChange={(date) => {
                                                onChange(date?.isValid ? date : undefined);
                                            }}
                                            containerClassName="w-full max-sm:mb-2"
                                            className={"red " + (theme !== "light" ? "bg-dark" : "")}
                                            inputClass="bk-input"
                                            minDate={dateNowP().add(setting.minReservationDate, 'day')}
                                            maxDate={dateNowP().add(setting.maxReservationDate, 'day')}
                                            placeholder="تاریخ شروع"
                                            calendar={persian}
                                            locale={persian_fa}
                                            format="YYYY/MM/DD"
                                            calendarPosition="bottom-center"
                                        />
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="endDate"
                                rules={{
                                    required: {
                                        value: true,
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
                                            editable={false}
                                            value={value}
                                            onChange={(date) => {
                                                onChange(date?.isValid ? date : undefined);
                                            }}
                                            containerClassName="w-full max-sm:mb-2"
                                            className={"red " + (theme !== "light" ? "bg-dark" : "")}
                                            inputClass="bk-input"
                                            minDate={dateNowP().add(setting.minReservationDate, 'day')}
                                            maxDate={dateNowP().add(setting.maxReservationDate, 'day')}
                                            placeholder="تاریخ پایان"
                                            calendar={persian}
                                            locale={persian_fa}
                                            format="YYYY/MM/DD"
                                            calendarPosition="bottom-center"
                                        />
                                    </>
                                )}
                            />

                        </div>

                        {
                            Object.keys(errors).length !== 0 &&
                            <div className="flex-center-center rounded fa-regular-16px p-2 mb-4 gap-2 bg-white">
                                <FormErrorMessage errors={errors} name="serviceId"/>
                                <FormErrorMessage errors={errors} name="providerId"/>
                                <FormErrorMessage errors={errors} name="startDate"/>
                                <FormErrorMessage errors={errors} name="endDate"/>
                            </div>
                        }
                        {
                            setting.minReservationDate === 0 &&
                            <div className="flex-center-center flex-wrap gap-2 sm:gap-4 mt-2 mb-4 sm:my-6">
                                <div className="bk-button bg-primary-800 dark:bg-primary-900 p-2 cursor-pointer"
                                     onClick={() => setStartEndDate('today', setValue)}>برای امروز
                                </div>
                                <div className="bk-button bg-primary-800 dark:bg-primary-900 p-2 cursor-pointer"
                                     onClick={() => setStartEndDate('tomorrow', setValue)}>برای فردا
                                </div>
                                <div className="bk-button bg-primary-800 dark:bg-primary-900 p-2 cursor-pointer"
                                     onClick={() => setStartEndDate('7day', setValue)}>7 روز آینده
                                </div>
                                <div className="bk-button bg-primary-800 dark:bg-primary-900 p-2 cursor-pointer"
                                     onClick={() => setStartEndDate('30day', setValue)}>30 روز آینده
                                </div>
                                <div className="bk-button bg-primary-800 dark:bg-primary-900 p-2 cursor-pointer"
                                     onClick={() => setStartEndDate('nextMonth', setValue)}>ماه آینده
                                </div>
                            </div>
                        }
                        {
                            isLogin || setting.permissionSearchShiftWork ?
                                <div className="mt-2">
                                    <button
                                        className="bk-button bg-primary-500 dark:bg-primary-900 w-full sm:w-36 mx-auto fa-sbold-18px">جستجو
                                    </button>
                                </div>
                                :
                                <p className="text-center fa-regular-18px">
                                    <span>برای جستجوی نوبت باید</span>
                                    <Link className="px-1 text-red-800 fa-bold-18px" href="/account/sign-in">وارد
                                        سیستم</Link>
                                    <span>شوید.</span>
                                </p>
                        }
                    </form>
                </div>
                <TheFooter/>
            </div>
        </>
    )
}