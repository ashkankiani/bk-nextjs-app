'use client'
import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { bkToast, PNtoEN } from '@/libs/utility'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import TheSpinner from '@/components/layout/TheSpinner'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useParams } from 'next/navigation'
import useHook from '@/hooks/controller/useHook'
import { useShowHoliday, useUpdateHoliday } from '@/hooks/admin/useHoliday'
import { TypeApiUpdateHolidayReq } from '@/types/typeApiAdmin'

export default function TheIdHolidayUi() {
  const params = useParams()
  const id = Number(params.id)

  const { theme, router } = useHook()

  const {
    data: dataHoliday,
    isLoading: isLoadingHoliday,
    isFetched: isFetchedHoliday,
  } = useShowHoliday(id)
  const { mutateAsync: mutateAsyncUpdateHoliday, isPending: isPendingUpdateHoliday } =
    useUpdateHoliday()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TypeApiUpdateHolidayReq>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeApiUpdateHolidayReq) => {
    await mutateAsyncUpdateHoliday(data)
      .then(res => {
        bkToast('success', res.Message)
        router.push('/admin/holidays')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  useEffect(() => {
    if (isFetchedHoliday && dataHoliday) {
      setValue('id', dataHoliday.id)
      setValue('date', dataHoliday.date)
      setValue('title', dataHoliday.title)
    }
  }, [isFetchedHoliday])

  return (
    <>
      <HeaderPage title="ویرایش روز تعطیل" description="روز تعطیل خود را ویرایش کنید.">
        <Link href="/admin/holidays" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست تعطیلات</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        {isLoadingHoliday ? (
          <TheSpinner />
        ) : (
          <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-center-start flex-wrap">
              <div className="panel-col-25">
                <label>
                  تاریخ<span>*</span>
                </label>
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
                    field: { onChange, value },
                  }) => (
                    <>
                      <DatePicker
                        editable={true}
                        value={value}
                        onChange={date => {
                          onChange(date?.isValid ? PNtoEN(date.format()) : undefined)
                        }}
                        containerClassName="w-full"
                        className={'green ' + (theme !== 'light' ? 'bg-dark' : '')}
                        inputClass="bk-input"
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-center"
                      />
                    </>
                  )}
                />
                <FormErrorMessage errors={errors} name="date" />
              </div>
              <div className="panel-col-75">
                <label>
                  عنوان<span>*</span>
                </label>
                <input
                  {...register('title', {
                    required: {
                      value: true,
                      message: 'عنوان ضروری است',
                    },
                  })}
                  type="text"
                  className="bk-input"
                />
                <FormErrorMessage errors={errors} name="title" />
              </div>
              <div className="panel-col-100">
                <button
                  className={
                    'panel-form-submit ' + (isPendingUpdateHoliday ? 'disable-action' : '')
                  }
                  type="submit"
                >
                  {isPendingUpdateHoliday ? (
                    <TheSpinner />
                  ) : (
                    <span>
                      <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                      ویرایش روز تعطیل
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
