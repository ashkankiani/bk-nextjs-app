import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useRouter} from "next/router";
import {bkToast, PNtoEN} from "@/libs/utility";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookGetHoliday, hookUpdateHoliday} from "@/hooks/admin/hookHoliday";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useSelector} from "react-redux";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function EditHoliday({id}) {
    const router = useRouter()

    const theme = useSelector(state => state.app.initTheme)

    const [loadingPage, setLoadingPage] = useState(false)
    const [loading, setLoading] = useState(false)


    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        criteriaMode: 'all',
    })


    const onSubmit = data => {
        handlerUpdateHoliday(data)
    }

    const getHoliday = async () => {
        await hookGetHoliday(id, (response, message) => {
            if (response) {
                setLoadingPage(true)
                setValue('date', message.date)
                setValue('title', message.title)
            } else {
                bkToast('error', message)
            }
        })
    }
    const handlerUpdateHoliday = async data => {
        setLoading(true)
        await hookUpdateHoliday(data, id, (response, message) => {
            setLoading(false)
            if (response) {
                bkToast('success', message)
                router.push('/admin/holidays')
            } else {
                bkToast('error', message)
            }
        })
    }
    useEffect(() => {
        getHoliday()
    }, [])

    return (
        <>
            <HeadPage title="ویرایش روز تعطیل"/>
            <HeaderPage title="ویرایش روز تعطیل" description="روز تعطیل خود را ویرایش کنید.">
                <Link href="/admin/holidays" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست تعطیلات</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                {
                    loadingPage ?
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
                                                     field: {onChange,  value},
                                                     // fieldState: {invalid, isDirty}, //optional
                                                     // formState: {errors}, //optional, but necessary if you want to show an error message
                                                 }) => (
                                            <>
                                                <DatePicker
                                                    editable={true}
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
                                            (loading ? 'disable-action' : '')
                                        }
                                        type="submit">
                                        {loading ? (
                                            <TheSpinner/>
                                        ) : (
                                            <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ویرایش روز تعطیل</span>
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