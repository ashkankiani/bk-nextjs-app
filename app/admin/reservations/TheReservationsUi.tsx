'use client'
import { AiFillPlusCircle } from 'react-icons/ai'
import Link from 'next/link'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { bkToast, PNtoEN, textPaymentType, textReservationsStatus } from '@/libs/utility'
import { useEffect, useState } from 'react'
import TheSpinner from '@/components/layout/TheSpinner'
import { dateNowP, fullStringToDateObjectP, numberWithCommas } from '@/libs/convertor'
import Popup from 'reactjs-popup'
import { CgNotes } from 'react-icons/cg'
import { IoCheckmarkSharp, IoClose, IoCloseSharp } from 'react-icons/io5'
import { PiAlarmBold } from 'react-icons/pi'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { TbShoppingCartHeart } from 'react-icons/tb'
import TheExport from '@/components/layout/TheExport'
import useHook from '@/hooks/controller/useHook'
import {
  useAppreciationReservation,
  useDeleteReservation,
  useGetReservations,
  useReminderReservation,
  useUpdateStatusReservation,
} from '@/hooks/admin/useReservation'
import {
  TypeApiAppreciationReservationReq,
  TypeApiGetReservationsRes,
  TypeApiReminderReservationReq,
  TypeApiUpdateStatusReservationReq,
} from '@/types/typeApiAdmin'
import DisplayOrderPaymentInformationForAdmin from '@/app/admin/reservations/components/DisplayOrderPaymentInformationForAdmin'
import { TypeReservationsStatus, TypeStatusReserve } from '@/types/typeConfig'
import { TypeApiReservation } from '@/types/typeApiEntity'

export type TypeActiveTimeFrame = {
  name: string
  startEpoch: number
  endEpoch: number
}
export type TypeFilter = {
  startEpoch: number
  endEpoch: number
}

export default function TheReservationsUi() {
  const { permissions } = useHook()

  const [statusReserve, setStatusReserve] = useState<TypeStatusReserve | null>(null)

  const [dataExport, setDataExport] = useState<string[][]>([])

  const [smsChangeStatusToAdminProvider, setSmsChangeStatusToAdminProvider] = useState(true)
  const [smsChangeStatusToUserService, setSmsChangeStatusToUserService] = useState(true)

  const [emailChangeStatusToAdminProvider, setEmailChangeStatusToAdminProvider] = useState(true)
  const [emailChangeStatusToUserService, setEmailChangeStatusToUserService] = useState(true)

  const [smsReminderToAdminProvider, setSmsReminderToAdminProvider] = useState(true)
  const [smsReminderToUserService, setSmsReminderToUserService] = useState(true)

  const [emailReminderToAdminProvider, setEmailReminderToAdminProvider] = useState(true)
  const [emailReminderToUserService, setEmailReminderToUserService] = useState(true)

  const [smsStatusDoneToAdminProvider, setSmsStatusDoneToAdminProvider] = useState(false)
  const [smsStatusDoneToUserService, setSmsStatusDoneToUserService] = useState(true)

  const [emailStatusDoneToAdminProvider, setEmailStatusDoneToAdminProvider] = useState(false)
  const [emailStatusDoneToUserService, setEmailStatusDoneToUserService] = useState(true)

  const [smsAppreciationToAdminProvider, setSmsAppreciationToAdminProvider] = useState(false)
  const [smsAppreciationToUserService, setSmsAppreciationToUserService] = useState(true)

  const [emailAppreciationToAdminProvider, setEmailAppreciationToAdminProvider] = useState(false)
  const [emailAppreciationToUserService, setEmailAppreciationToUserService] = useState(true)

  const [discountCode, setDiscountCode] = useState('')

  const [activeTimeFrame, setActiveTimeFrame] = useState<TypeActiveTimeFrame>({
    name: 'امروز',
    startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
    endEpoch: dateNowP().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
  })

  const [filter, setFilter] = useState<TypeFilter>({
    startEpoch: activeTimeFrame.startEpoch,
    endEpoch: activeTimeFrame.endEpoch,
  })

  const [timeFrame] = useState([
    {
      name: 'امروز',
      startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
      endEpoch: dateNowP().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
    },
    {
      name: 'دیروز',
      startEpoch: dateNowP()
        .subtract(1, 'days')
        .setHour(0)
        .setMinute(0)
        .setSecond(0)
        .setMillisecond(0)
        .valueOf(),
      endEpoch: dateNowP()
        .subtract(1, 'days')
        .setHour(23)
        .setMinute(59)
        .setSecond(59)
        .setMillisecond(999)
        .valueOf(),
    },
    {
      name: 'فردا',
      startEpoch: dateNowP()
        .add(1, 'days')
        .setHour(0)
        .setMinute(0)
        .setSecond(0)
        .setMillisecond(0)
        .valueOf(),
      endEpoch: dateNowP()
        .add(1, 'days')
        .setHour(23)
        .setMinute(59)
        .setSecond(59)
        .setMillisecond(999)
        .valueOf(),
    },
    {
      name: '7 روز آینده',
      startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
      endEpoch: dateNowP()
        .add(7, 'days')
        .setHour(23)
        .setMinute(59)
        .setSecond(59)
        .setMillisecond(999)
        .valueOf(),
    },
    {
      name: '7 روز قبل',
      startEpoch: dateNowP()
        .subtract(7, 'days')
        .setHour(0)
        .setMinute(0)
        .setSecond(0)
        .setMillisecond(0)
        .valueOf(),
      endEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
    },
    {
      name: '30 روز آینده',
      startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
      endEpoch: dateNowP()
        .add(30, 'days')
        .setHour(23)
        .setMinute(59)
        .setSecond(59)
        .setMillisecond(999)
        .valueOf(),
    },
    {
      name: '30 روز قبل',
      startEpoch: dateNowP()
        .subtract(30, 'days')
        .setHour(0)
        .setMinute(0)
        .setSecond(0)
        .setMillisecond(0)
        .valueOf(),
      endEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
    },
    {
      name: 'همه رزروها',
      startEpoch: 0,
      endEpoch: 111111111111111,
    },
  ])

  const {
    data: dataReservations,
    isLoading: isLoadingReservations,
    isFetched: isFetchedReservations,
    refetch: refetchReservations,
  } = useGetReservations(filter)

  useEffect(() => {
    if (isFetchedReservations && dataReservations) {
      createObjExportForReservations(dataReservations)
    }
  }, [isFetchedReservations])

  // hint: The provider only sees their own reservations
  // if (user.catalogId === 3) {
  //     params.condition.where.providerId = {in: user.providerIds};
  // }
  //

  const { mutateAsync: mutateAsyncDeleteReservation, isPending: isPendingDeleteReservation } = useDeleteReservation()

  const handlerDeleteReservation = async (id: string, close: () => void) => {
    await mutateAsyncDeleteReservation({ id })
        .then(async res => {
          bkToast('success', res.Message)
          await refetchReservations()
          close()
        })
        .catch(errors => {
          bkToast('error', errors.Reason)
        })
  }

  const {mutateAsync: mutateAsyncUpdateStatusReservation, isPending: isPendingUpdateStatusReservation,} = useUpdateStatusReservation()

  const handlerChangeReservation = async (item: TypeApiReservation, status: TypeReservationsStatus, close: () => void) => {
    const data: TypeApiUpdateStatusReservationReq = {
      reserve: item,
      statusReserve: statusReserve as TypeStatusReserve,
      status: status,
      ...((status === 'COMPLETED' || status === 'CANCELED') && {
        smsChangeStatusToAdminProvider: smsChangeStatusToAdminProvider,
        smsChangeStatusToUserService: smsChangeStatusToUserService,
        emailChangeStatusToAdminProvider: emailChangeStatusToAdminProvider,
        emailChangeStatusToUserService: emailChangeStatusToUserService,
      }),

      ...(status === 'DONE' && {
        smsStatusDoneToAdminProvider: smsStatusDoneToAdminProvider,
        smsStatusDoneToUserService: smsStatusDoneToUserService,
        emailStatusDoneToAdminProvider: emailStatusDoneToAdminProvider,
        emailStatusDoneToUserService: emailStatusDoneToUserService,
      }),
    }

    await mutateAsyncUpdateStatusReservation(data)
      .then(async res => {
        bkToast('success', res.Message)
        await refetchReservations()
        close()
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  const { mutateAsync: mutateAsyncReminderReservation, isPending: isPendingReminderReservation } = useReminderReservation()

  const handlerReminderReservation = async (item: TypeApiReservation, close: () => void) => {
    if (
      smsReminderToAdminProvider ||
      smsReminderToUserService ||
      emailReminderToAdminProvider ||
      emailReminderToUserService
    ) {
      const data: TypeApiReminderReservationReq = {
        reserve: item,
        smsReminderToAdminProvider: smsReminderToAdminProvider,
        smsReminderToUserService: smsReminderToUserService,
        emailReminderToAdminProvider: emailReminderToAdminProvider,
        emailReminderToUserService: emailReminderToUserService,
      }

      await mutateAsyncReminderReservation(data)
        .then(async res => {
          bkToast('success', res.Message)
          close()
        })
        .catch(errors => {
          bkToast('error', errors.Reason)
        })
    } else {
      bkToast('error', 'حتما باید یک فرد را برای پیامک یا ایمیل انتخاب نمایید.')
    }
  }

  const {
    mutateAsync: mutateAsyncAppreciationReservation,
    isPending: isPendingAppreciationReservation,
  } = useAppreciationReservation()
  const handlerAppreciationReservation = async (item: TypeApiReservation, close: () => void) => {
    if (discountCode.length === 0) {
      bkToast('error', 'کد تخفیف نمیتواند خالی باشد.')
      return
    }
    if (
      smsAppreciationToAdminProvider ||
      smsAppreciationToUserService ||
      emailAppreciationToAdminProvider ||
      emailAppreciationToUserService
    ) {
      const data: TypeApiAppreciationReservationReq = {
        reserve: item,
        discountCode: discountCode,
        smsAppreciationToAdminProvider: smsAppreciationToAdminProvider,
        smsAppreciationToUserService: smsAppreciationToUserService,
        emailAppreciationToAdminProvider: emailAppreciationToAdminProvider,
        emailAppreciationToUserService: emailAppreciationToUserService,
      }

      await mutateAsyncAppreciationReservation(data)
        .then(async res => {
          bkToast('success', res.Message)
          close()
        })
        .catch(errors => {
          bkToast('error', errors.Reason)
        })
    } else {
      bkToast('error', 'حتما باید یک فرد را برای پیامک یا ایمیل انتخاب نمایید.')
    }
  }

  const createObjExportForReservations = async (OBJ: TypeApiGetReservationsRes[]) => {
    const sameExport: string[][] = []
    OBJ.map(item => {
      sameExport.push([
        item.order.trackingCode,
        PNtoEN(
          fullStringToDateObjectP(String(item.createdAt), 'YYYY-MM-DDTHH:MM:SS.SSSZ').format(
            'YYYY/MM/DD - HH:mm'
          )
        ),
        item.user.fullName,
        item.user.mobile,
        item.user.codeMeli,
        item.service.name,
        item.provider.user.fullName,
        item.date,
        item.time,
        fullStringToDateObjectP(item.date).weekDay.name,
        item.order.discountPrice
          ? numberWithCommas(item.order.price - item.order.discountPrice)
          : numberWithCommas(item.order.price),
        textPaymentType(item.order.payment.paymentType),
        textReservationsStatus(item.status),
      ])
    })
    setDataExport(sameExport)
  }

  return (
    <>
      <HeaderPage title="رزروها" description="در اینجا لیست رزروها را مشاهده کنید.">
        {permissions.viewReservation && (
          <TheExport
            title="برون بری رزرو"
            loading={isLoadingReservations}
            dataExport={dataExport}
            keys="کد پیگیری,تاریخ ایجاد,نام و نام خانوادگی,موبایل,کدملی,خدمت,ارائه دهنده,تاریخ رزرو,ساعت رزرو,روز رزرو,مبلغ پرداختی,روش پرداخت,وضعیت رزرو"
            heading={[
              [
                'کد پیگیری',
                'تاریخ ایجاد',
                'نام و نام خانوادگی',
                'موبایل',
                'کدملی',
                'خدمت',
                'ارائه دهنده',
                'تاریخ رزرو',
                'ساعت رزرو',
                'روز رزرو',
                'مبلغ پرداختی',
                'روش پرداخت',
                'وضعیت رزرو',
              ],
            ]}
          />
        )}
        {permissions.addReservation && (
          <Link href="/admin/reservations/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>رزرو جدید</span>
          </Link>
        )}
      </HeaderPage>

      <div className="panel-main">
        <div className="flex-center-between mb-8 flex-wrap gap-4 rounded-md border border-slate-200 bg-gray-100 p-4 dark:border-darkNavy3 dark:bg-darkNavy1">
          <div className="flex-center-start fa-sbold-16px flex-wrap gap-2">
            <div className="bk-button fa-bold-18px w-fit py-2 pr-0 text-neutral-800 dark:text-white">
              <FaFilter size="18px" className="ml-1 inline-flex align-middle" />
              فیلتر رزروها
            </div>

            {timeFrame.map((item, index) => (
              <div
                key={index}
                className={
                  'bk-button w-fit cursor-pointer p-2 ' +
                  (activeTimeFrame.name === item.name
                    ? 'bg-green-600'
                    : 'bg-primary-600 dark:bg-primary-900')
                }
                onClick={() => {
                  setActiveTimeFrame(item)
                  setFilter({
                    startEpoch: item.startEpoch,
                    endEpoch: item.endEpoch,
                  })
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th className="w-[50px]">ردیف</th>
                <th>کد پیگیری</th>
                <th>خریدار</th>
                <th>رزرو برای</th>
                <th>تاریخ رزرو</th>
                <th>پرداخت</th>
                <th>وضعیت</th>
                <th className="w-[155px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingReservations ? (
                <tr>
                  <td colSpan={8}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataReservations && dataReservations.length > 0 ? (
                dataReservations.map((item, index) => (
                  <tr key={index}>
                    <td
                      className={
                        item.status === 'DONE'
                          ? 'bg-green-500'
                          : item.status === 'REVIEW'
                            ? 'bg-yellow-500'
                            : item.status === 'REJECTED'
                              ? 'bg-slate-500'
                              : item.status === 'CANCELED'
                                ? 'bg-red-500'
                                : 'bg-white dark:text-neutral-800'
                      }
                    >
                      {index + 1}
                    </td>
                    <td>
                      <div>{item.order.trackingCode}</div>
                      <div dir="ltr">
                        {PNtoEN(
                          fullStringToDateObjectP(
                            String(item.createdAt),
                            'YYYY-MM-DDTHH:MM:SS.SSSZ'
                          ).format('YYYY/MM/DD - HH:mm')
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{item.user.fullName}</div>
                      <div>{item.user.mobile}</div>
                      <div>{item.user.codeMeli}</div>
                    </td>
                    <td>
                      <div>{item.service.name}</div>
                      <div>{item.provider.user.fullName}</div>
                    </td>
                    <td>
                      <div>{item.date}</div>
                      <div>{item.time.replace('-', ' تا ')}</div>
                      <div>{fullStringToDateObjectP(item.date).weekDay.name}</div>
                    </td>
                    <td>
                      <div>
                        {item.order.discountPrice
                          ? numberWithCommas(item.order.price - item.order.discountPrice)
                          : numberWithCommas(item.order.price)}{' '}
                        تومان
                      </div>
                      <div>{textPaymentType(item.order.payment.paymentType)}</div>
                    </td>
                    <td>
                      <div>
                        {item.status === 'DONE' ? (
                          <strong className="text-green-500">
                            {textReservationsStatus(item.status)}
                          </strong>
                        ) : item.status === 'REVIEW' ? (
                          <strong className="text-yellow-500">
                            {textReservationsStatus(item.status)}
                          </strong>
                        ) : (
                          textReservationsStatus(item.status)
                        )}
                      </div>
                      {permissions.editReservation && (
                        <>
                          {item.status === 'COMPLETED' && (
                            <Popup
                              className="bg-modal"
                              contentStyle={{ width: '100%' }}
                              trigger={
                                <div className="inline-flex text-center">
                                  <IoCheckmarkSharp
                                    onClick={() => setStatusReserve('THANK')}
                                    className="mx-1 inline-flex h-7 w-7 cursor-pointer text-green-500"
                                    size="24px"
                                  />
                                </div>
                              }
                              modal
                              nested
                            >
                              {(close: () => void) => (
                                <div className="panel-wrapper-modal max-w-[500px]">
                                  <IoClose
                                    size="32px"
                                    onClick={close}
                                    className="absolute left-4 top-4 cursor-pointer"
                                  />

                                  <div className="panel-modal-title">
                                    {' '}
                                    تایید انجام رزرو ({item.order.trackingCode})
                                  </div>
                                  <div className="panel-modal-content">
                                    <p className="mb-2">آیا رزرو زیر را انجام داده اید؟</p>
                                    <p>
                                      <span>
                                        روز:
                                        <strong className="px-1 text-red-500">
                                          {fullStringToDateObjectP(item.date).weekDay.name}
                                        </strong>
                                      </span>
                                      <span>
                                        تاریخ:
                                        <strong className="px-1 text-red-500">{item.date}</strong>
                                      </span>
                                      <span>
                                        ساعت:
                                        <strong className="px-1 text-red-500">
                                          {item.time.replace('-', ' تا ')}
                                        </strong>
                                      </span>
                                    </p>
                                    <div className="mt-6">
                                      <label className="fa-sbold-18px">ارسال پیامک تشکر</label>
                                      <div className="panel-row-checkbox">
                                        <label>
                                          <input
                                            type="checkbox"
                                            defaultChecked={smsStatusDoneToAdminProvider}
                                            onChange={() =>
                                              setSmsStatusDoneToAdminProvider(
                                                !smsStatusDoneToAdminProvider
                                              )
                                            }
                                          />
                                          ارائه دهنده
                                        </label>
                                        <label>
                                          <input
                                            type="checkbox"
                                            defaultChecked={smsStatusDoneToUserService}
                                            onChange={() =>
                                              setSmsStatusDoneToUserService(
                                                !smsStatusDoneToUserService
                                              )
                                            }
                                          />
                                          کاربر
                                        </label>
                                      </div>
                                    </div>
                                    <div className="mt-8">
                                      <label className="fa-sbold-18px">ارسال ایمیل تشکر</label>
                                      <div className="panel-row-checkbox">
                                        <label>
                                          <input
                                            type="checkbox"
                                            defaultChecked={emailStatusDoneToAdminProvider}
                                            onChange={() =>
                                              setEmailStatusDoneToAdminProvider(
                                                !emailStatusDoneToAdminProvider
                                              )
                                            }
                                          />
                                          ارائه دهنده
                                        </label>
                                        <label>
                                          <input
                                            type="checkbox"
                                            defaultChecked={emailChangeStatusToUserService}
                                            onChange={() =>
                                              setEmailStatusDoneToUserService(
                                                !emailStatusDoneToUserService
                                              )
                                            }
                                          />
                                          کاربر
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={
                                        'panel-modal-confirm ' +
                                        (isPendingUpdateStatusReservation
                                          ? 'disable-action'
                                          : 'cursor-pointer')
                                      }
                                      onClick={() => handlerChangeReservation(item, 'DONE', close)}
                                    >
                                      {isPendingUpdateStatusReservation ? (
                                        <TheSpinner />
                                      ) : (
                                        'مطمنم، رزرو انجام شده'
                                      )}
                                    </div>
                                    <div className="panel-modal-close" onClick={close}>
                                      بستن
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Popup>
                          )}
                          {item.status === 'REVIEW' && (
                            <>
                              <Popup
                                className="bg-modal"
                                contentStyle={{ width: '100%' }}
                                trigger={
                                  <div className="inline-flex text-center">
                                    <IoCheckmarkSharp
                                      onClick={() => setStatusReserve('YES')}
                                      className="mx-1 inline-flex h-7 w-7 cursor-pointer text-green-500"
                                      size="24px"
                                    />
                                    <IoCloseSharp
                                      onClick={() => setStatusReserve('NO')}
                                      className="mx-1 inline-flex h-7 w-7 cursor-pointer text-red-500"
                                      size="24px"
                                    />
                                  </div>
                                }
                                modal
                                nested
                              >
                                {(close: () => void) => (
                                  <div className="panel-wrapper-modal max-w-[500px]">
                                    <IoClose
                                      size="32px"
                                      onClick={close}
                                      className="absolute left-4 top-4 cursor-pointer"
                                    />

                                    <div className="panel-modal-title">
                                      {statusReserve ? 'تایید' : 'رد'} رزرو (
                                      {item.order.trackingCode})
                                    </div>
                                    <div className="panel-modal-content">
                                      <p className="mb-2">
                                        آیا از {statusReserve ? 'تایید' : 'رد'} رزرو زیر مطمئن
                                        هستید؟
                                      </p>
                                      <p>
                                        <span>
                                          روز:
                                          <strong className="px-1 text-red-500">
                                            {fullStringToDateObjectP(item.date).weekDay.name}
                                          </strong>
                                        </span>
                                        <span>
                                          تاریخ:
                                          <strong className="px-1 text-red-500">{item.date}</strong>
                                        </span>
                                        <span>
                                          ساعت:
                                          <strong className="px-1 text-red-500">
                                            {item.time.replace('-', ' تا ')}
                                          </strong>
                                        </span>
                                      </p>
                                      <div className="mt-6">
                                        <label className="fa-sbold-18px">
                                          ارسال پیامک وضعیت جدید
                                        </label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsChangeStatusToAdminProvider}
                                              onChange={() =>
                                                setSmsChangeStatusToAdminProvider(
                                                  !smsChangeStatusToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsChangeStatusToUserService}
                                              onChange={() =>
                                                setSmsChangeStatusToUserService(
                                                  !smsChangeStatusToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                      <div className="mt-8">
                                        <label className="fa-sbold-18px">
                                          ارسال ایمیل وضعیت جدید
                                        </label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailChangeStatusToAdminProvider}
                                              onChange={() =>
                                                setEmailChangeStatusToAdminProvider(
                                                  !emailChangeStatusToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailChangeStatusToUserService}
                                              onChange={() =>
                                                setEmailChangeStatusToUserService(
                                                  !emailChangeStatusToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="panel-modal-footer">
                                      {statusReserve ? (
                                        <div
                                          className={
                                            'panel-modal-confirm ' +
                                            (isPendingUpdateStatusReservation
                                              ? 'disable-action'
                                              : 'cursor-pointer')
                                          }
                                          onClick={() =>
                                            handlerChangeReservation(item, 'COMPLETED', close)
                                          }
                                        >
                                          {isPendingUpdateStatusReservation ? (
                                            <TheSpinner />
                                          ) : (
                                            'مطمنم، رزرو را تایید کن'
                                          )}
                                        </div>
                                      ) : (
                                        <div
                                          className={
                                            'panel-modal-confirm-delete ' +
                                            (isPendingUpdateStatusReservation
                                              ? 'disable-action'
                                              : 'cursor-pointer')
                                          }
                                          onClick={() =>
                                            handlerChangeReservation(item, 'CANCELED', close)
                                          }
                                        >
                                          {isPendingUpdateStatusReservation ? (
                                            <TheSpinner />
                                          ) : (
                                            'مطمنم، رزرو را رد کن'
                                          )}
                                        </div>
                                      )}
                                      <div className="panel-modal-close" onClick={close}>
                                        بستن
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      <div className="flex-center-end gap-3">
                        {permissions.editReservation && (
                          <>
                            {item.status === 'DONE' && (
                              <Popup
                                className="bg-modal"
                                contentStyle={{ width: '100%' }}
                                trigger={
                                  <div>
                                    <TbShoppingCartHeart className="cursor-pointer" size="28px" />
                                  </div>
                                }
                                modal
                                nested
                              >
                                {(close: () => void) => (
                                  <div className="panel-wrapper-modal max-w-[500px]">
                                    <IoClose
                                      size="32px"
                                      onClick={close}
                                      className="absolute left-4 top-4 cursor-pointer"
                                    />
                                    <div className="panel-modal-title">
                                      ارسال قدردانی ({item.order.trackingCode})
                                    </div>
                                    <div className="panel-modal-content">
                                      <div>
                                        <label className="fa-sbold-18px">ارسال پیامک قدردانی</label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsAppreciationToAdminProvider}
                                              onChange={() =>
                                                setSmsAppreciationToAdminProvider(
                                                  !smsAppreciationToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsAppreciationToUserService}
                                              onChange={() =>
                                                setSmsAppreciationToUserService(
                                                  !smsAppreciationToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                      <div className="mt-8">
                                        <label className="fa-sbold-18px">ارسال ایمیل قدردانی</label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailAppreciationToAdminProvider}
                                              onChange={() =>
                                                setEmailAppreciationToAdminProvider(
                                                  !emailAppreciationToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailAppreciationToUserService}
                                              onChange={() =>
                                                setEmailAppreciationToUserService(
                                                  !emailAppreciationToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                      <div className="mt-8">
                                        <label className="fa-sbold-18px mb-2 block">کد تخفیف</label>
                                        <input
                                          className="bk-input"
                                          name="discountCode"
                                          onChange={e => setDiscountCode(e.target.value)}
                                          placeholder="کد تخفیف خود را وارد کنید."
                                        />
                                      </div>
                                    </div>
                                    <div className="panel-modal-footer">
                                      <div
                                        className={
                                          'panel-modal-confirm ' +
                                          (isPendingAppreciationReservation
                                            ? 'disable-action'
                                            : 'cursor-pointer')
                                        }
                                        onClick={() => handlerAppreciationReservation(item, close)}
                                      >
                                        {isPendingAppreciationReservation ? (
                                          <TheSpinner />
                                        ) : (
                                          'مطمنم، کد تخفیف قدردانی را ارسال کن'
                                        )}
                                      </div>
                                      <div className="panel-modal-close" onClick={close}>
                                        بیخیال شو
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}

                            {item.status === 'COMPLETED' && (
                              <Popup
                                className="bg-modal"
                                contentStyle={{ width: '100%' }}
                                trigger={
                                  <div>
                                    <PiAlarmBold className="cursor-pointer" size="28px" />
                                  </div>
                                }
                                modal
                                nested
                              >
                                {(close: () => void) => (
                                  <div className="panel-wrapper-modal max-w-[500px]">
                                    <IoClose
                                      size="32px"
                                      onClick={close}
                                      className="absolute left-4 top-4 cursor-pointer"
                                    />
                                    <div className="panel-modal-title">
                                      ارسال یادآوری ({item.order.trackingCode})
                                    </div>
                                    <div className="panel-modal-content">
                                      <div>
                                        <label className="fa-sbold-18px">ارسال پیامک یادآوری</label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsReminderToAdminProvider}
                                              onChange={() =>
                                                setSmsReminderToAdminProvider(
                                                  !smsReminderToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={smsReminderToUserService}
                                              onChange={() =>
                                                setSmsReminderToUserService(
                                                  !smsReminderToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                      <div className="mt-8">
                                        <label className="fa-sbold-18px">ارسال ایمیل یادآوری</label>
                                        <div className="panel-row-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailReminderToAdminProvider}
                                              onChange={() =>
                                                setEmailReminderToAdminProvider(
                                                  !emailReminderToAdminProvider
                                                )
                                              }
                                            />
                                            ارائه دهنده
                                          </label>
                                          <label>
                                            <input
                                              type="checkbox"
                                              defaultChecked={emailReminderToUserService}
                                              onChange={() =>
                                                setEmailReminderToUserService(
                                                  !emailReminderToUserService
                                                )
                                              }
                                            />
                                            کاربر
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="panel-modal-footer">
                                      <div
                                        className={
                                          'panel-modal-confirm ' +
                                          (isPendingReminderReservation
                                            ? 'disable-action'
                                            : 'cursor-pointer')
                                        }
                                        onClick={() => handlerReminderReservation(item, close)}
                                      >
                                        {isPendingReminderReservation ? (
                                          <TheSpinner />
                                        ) : (
                                          'مطمنم، یادآوری را ارسال کن'
                                        )}
                                      </div>
                                      <div className="panel-modal-close" onClick={close}>
                                        بیخیال شو
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}

                            <Popup
                              className="bg-modal"
                              contentStyle={{ width: '100%' }}
                              trigger={
                                <div>
                                  <CgNotes className="cursor-pointer" size="25px" />
                                </div>
                              }
                              modal
                              nested
                            >
                              {(close: () => void) => (
                                <DisplayOrderPaymentInformationForAdmin item={item} close={close} />
                              )}
                            </Popup>

                            {(item.status === 'COMPLETED' || item.status === 'REVIEW') && (
                              <Link href={'/admin/reservations/' + item.id}>
                                <FiEdit size="26px" />
                              </Link>
                            )}
                          </>
                        )}
                        {permissions.deleteReservation && (
                          <Popup
                            className="bg-modal"
                            contentStyle={{ width: '100%' }}
                            trigger={
                              <div>
                                <RiDeleteBin5Line
                                  className="cursor-pointer text-red-500"
                                  size="28px"
                                />
                              </div>
                            }
                            modal
                            nested
                          >
                            {(close: () => void) => (
                              <div className="panel-wrapper-modal max-w-[500px]">
                                <IoClose
                                  size="32px"
                                  onClick={close}
                                  className="absolute left-4 top-4 cursor-pointer"
                                />
                                <div className="panel-modal-title">
                                  حذف رزرو ({item.order.trackingCode})
                                </div>
                                <div className="panel-modal-content">
                                  <p>آیا از حذف رزرو مطمن هستید؟</p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div
                                    className={
                                      'panel-modal-confirm-delete ' +
                                      (isPendingDeleteReservation
                                        ? 'disable-action'
                                        : 'cursor-pointer')
                                    }
                                    onClick={() => handlerDeleteReservation(item.id, close)}
                                  >
                                    {isPendingDeleteReservation ? (
                                      <TheSpinner />
                                    ) : (
                                      'مطمنم، رزرو را حذف کن'
                                    )}
                                  </div>
                                  <div className="panel-modal-close" onClick={close}>
                                    بیخیال شو
                                  </div>
                                </div>
                              </div>
                            )}
                          </Popup>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>رزروی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
