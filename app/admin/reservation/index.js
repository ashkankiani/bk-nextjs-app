import HeadPage from "@/components/layout/HeadPage";
import {AiFillPlusCircle} from "react-icons/ai";
import Link from "next/link";
import {RiDeleteBin5Line} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import {FaFilter} from "react-icons/fa";
import {bkToast, PNtoEN, textPaymentType, textReservationsStatus} from "@/libs/utility";
import {useEffect, useState} from "react";
import {
  hookAppreciationReservation,
  hookChangeReservation, hookDeleteReservation,
  hookGetReservationWhere,
  hookReminderReservation
} from "@/hooks/admin/hookReservation";
import TheSpinner from "@/components/layout/TheSpinner";
import {dateNowP, fullStringToDateObjectP, numberWithCommas} from "@/libs/convertor";
import DisplayOrderPaymentInformation from "@/components/back-end/reservation/DisplayOrderPaymentInformation";
import Popup from "reactjs-popup";
import {CgNotes} from "react-icons/cg";
import {IoCheckmarkSharp, IoClose, IoCloseSharp} from "react-icons/io5";
import {PiAlarmBold} from "react-icons/pi";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {TbShoppingCartHeart} from "react-icons/tb";
import TheExport from "@/components/layout/TheExport";
import useHook from "@/hooks/controller/useHook";

export default function Reservation() {
  const {user, permissions} = useHook()

  const [loading, setLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingChangeReservation, setLoadingChangeReservation] = useState(false)
  const [loadingDoneReservation, setLoadingDoneReservation] = useState(false)
  const [loadingReminder, setLoadingReminder] = useState(false)
  const [loadingAppreciation, setLoadingAppreciation] = useState(false)
  const [statusReserve, setStatusReserve] = useState(null)

  const [dataExport, setDataExport] = useState([])

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
  const [discountCode, setDiscountCode] = useState("")


  const [data, setData] = useState([])
  const [activeTimeFrame, setActiveTimeFrame] = useState({
    name: 'امروز',
    startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
    endEpoch: dateNowP().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
  })
  const [timeFrame] = useState([
      {
        name: 'امروز',
        startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
      },
      {
        name: 'دیروز',
        startEpoch: dateNowP().subtract(1, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().subtract(1, 'days').setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
      },
      {
        name: 'فردا',
        startEpoch: dateNowP().add(1, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().add(1, 'days').setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
      },
      {
        name: '7 روز آینده',
        startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().add(7, 'days').setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
      },
      {
        name: '7 روز قبل',
        startEpoch: dateNowP().subtract(7, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
      },
      {
        name: '30 روز آینده',
        startEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().add(30, 'days').setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf(),
      },
      {
        name: '30 روز قبل',
        startEpoch: dateNowP().subtract(30, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
        endEpoch: dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf(),
      },
      {
        name: 'همه رزروها',
        startEpoch: 0,
        endEpoch: 111111111111111,
      }
    ]
  )

  const handlerListReservationsWhere = async (date) => {
    setLoading(false)
    let params = {
      type: "condition",
      condition:
        {
          where: {
            dateTimeStartEpoch: {
              gte: date.startEpoch,
            },
            dateTimeEndEpoch: {
              lte: date.endEpoch,
            }
          },
          include: {
            order: {
              include: {
                payment: {
                  include: {
                    transaction: {}
                  },
                },
                discount: {},
                user: {},
                provider: {
                  include: {
                    service: {},
                    user: {}
                  }
                },
              }
            },
          }
        }
    }

    // The provider only sees their own reservations
    if (user.catalogId === 3) {
      params.condition.where.providerId = {in: user.providerIds};
    }

    await hookGetReservationWhere(params, async (response, message) => {
      if (response) {
        setLoading(true)
        setData(message)
        await createObjExportForReservations(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListReservationsWhere(activeTimeFrame)
  }, [activeTimeFrame])


  const handlerDeleteReservation = async (id) => {
    setLoadingDelete(true)
    await hookDeleteReservation(id, (response, message) => {
      if (response) {
        setLoadingDelete(false)
        bkToast('success', message)
        handlerListReservationsWhere(activeTimeFrame)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerChangeReservation = async (item, status, close) => {
    let data = {
      reserve: item,
      statusReserve: statusReserve,
      smsChangeStatusToAdminProvider: smsChangeStatusToAdminProvider,
      smsChangeStatusToUserService: smsChangeStatusToUserService,
      emailChangeStatusToAdminProvider: emailChangeStatusToAdminProvider,
      emailChangeStatusToUserService: emailChangeStatusToUserService,
      update: {
        status: status
      }
    }
    setLoadingChangeReservation(true)
    await hookChangeReservation(data, (response, message) => {
      if (response) {
        setLoadingChangeReservation(false)
        handlerListReservationsWhere(activeTimeFrame)
        close()
        bkToast('success', message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDoneReservation = async (item, status, close) => {
    let data = {
      reserve: item,
      statusReserve: statusReserve,
      smsStatusDoneToAdminProvider: smsStatusDoneToAdminProvider,
      smsStatusDoneToUserService: smsStatusDoneToUserService,
      emailStatusDoneToAdminProvider: emailStatusDoneToAdminProvider,
      emailStatusDoneToUserService: emailStatusDoneToUserService,
      update: {
        status: status
      }
    }
    setLoadingDoneReservation(true)
    await hookChangeReservation(data, (response, message) => {
      if (response) {
        setLoadingDoneReservation(false)
        handlerListReservationsWhere(activeTimeFrame)
        close()
        bkToast('success', message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerReminderReservation = async (item, close) => {

    if (smsReminderToAdminProvider || smsReminderToUserService || emailReminderToAdminProvider || emailReminderToUserService) {
      let data = {
        reserve: item,
        smsReminderToAdminProvider: smsReminderToAdminProvider,
        smsReminderToUserService: smsReminderToUserService,
        emailReminderToAdminProvider: emailReminderToAdminProvider,
        emailReminderToUserService: emailReminderToUserService,
      }
      setLoadingReminder(true)
      await hookReminderReservation(data, (response, message) => {
        if (response) {
          setLoadingReminder(false)
          close()
          bkToast('success', message)
        } else {
          bkToast('error', message)
        }
      })
    } else {
      bkToast('error', 'حتما باید یک فرد را برای پیامک یا ایمیل انتخاب نمایید.')
    }
  }

  const handlerAppreciationReservation = async (item, close) => {
    if (discountCode.length === 0) {
      bkToast('error', "کد تخفیف نمیتواند خالی باشد.")
      return
    }
    if (smsAppreciationToAdminProvider || smsAppreciationToUserService || emailAppreciationToAdminProvider || emailAppreciationToUserService) {
      let data = {
        reserve: item,
        discountCode: discountCode,
        smsAppreciationToAdminProvider: smsAppreciationToAdminProvider,
        smsAppreciationToUserService: smsAppreciationToUserService,
        emailAppreciationToAdminProvider: emailAppreciationToAdminProvider,
        emailAppreciationToUserService: emailAppreciationToUserService,
      }
      setLoadingAppreciation(true)
      await hookAppreciationReservation(data, (response, message) => {
        if (response) {
          setLoadingAppreciation(false)
          close()
          bkToast('success', message)
        } else {
          bkToast('error', message)
        }
      })
    } else {
      bkToast('error', 'حتما باید یک فرد را برای پیامک یا ایمیل انتخاب نمایید.')
    }
  }


  const createObjExportForReservations = async OBJ => {
    let sameExport = []
    OBJ.map(item => {
      sameExport.push([
        item.order.trackingCode,
        PNtoEN(fullStringToDateObjectP(item.createdAt, 'YYYY-MM-DDTHH:MM:SS.SSSZ').format('YYYY/MM/DD - HH:MM')),
        item.order.user.fullName,
        item.order.user.mobile,
        item.order.user.codeMeli,
        item.order.provider.service.name,
        item.order.provider.user.fullName,
        item.date,
        item.time,
        fullStringToDateObjectP(item.date).weekDay.name,
        item.order.discountPrice ? numberWithCommas(item.order.price - item.order.discountPrice) : numberWithCommas(item.order.price),
        textPaymentType(item.order.payment.paymentType),
        textReservationsStatus(item.status)
      ])
    })
    setDataExport(sameExport)
  }

  return (
    <>
      <HeadPage title="رزروها"/>
      <HeaderPage title="رزروها" description="در اینجا لیست رزروها را مشاهده کنید.">

        {
          permissions.viewReservation &&
          <TheExport
            title="برون بری رزرو"
            loading={loading}
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
        }
        {
          permissions.addReservation &&
          <Link href="/admin/reservation/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>رزرو جدید</span>
          </Link>
        }

      </HeaderPage>

      <div className="panel-main">
        <div
          className="flex-center-between flex-wrap gap-4 mb-8 border border-slate-200 dark:border-darkNavy3 rounded-md bg-gray-100 dark:bg-darkNavy1 p-4">
          <div className="flex-center-start flex-wrap gap-2 fa-sbold-16px ">
            <div className="bk-button py-2 pr-0 w-fit text-neutral-800 dark:text-white fa-bold-18px"><FaFilter
              size="18px" className="inline-flex align-middle ml-1"/>فیلتر رزروها
            </div>

            {
              timeFrame.map((item, index) =>
                <div
                  key={index}
                  className={"bk-button p-2 cursor-pointer w-fit " +
                    (activeTimeFrame.name === item.name ? 'bg-green-600' : 'bg-primary-600 dark:bg-primary-900')}
                  onClick={() => setActiveTimeFrame(item)}>
                  {item.name}
                </div>
              )
            }

          </div>
        </div>
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th width={50}>ردیف</th>
              <th>کد پیگیری</th>
              <th>خریدار</th>
              <th>رزرو برای</th>
              <th>تاریخ رزرو</th>
              <th>پرداخت</th>
              <th>وضعیت</th>
              <th width={155}>عملیات</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data.map((item, index) =>
                    <tr key={index}>
                      <td
                        className={
                          item.status === 'DONE' ? 'bg-green-500' :
                            item.status === 'REVIEW' ? 'bg-yellow-500' :
                              item.status === 'REJECTED' ? 'bg-slate-500' :
                                item.status === 'CANCELED' ? 'bg-red-500' : 'bg-white dark:text-neutral-800'
                        }
                      >{index + 1}</td>
                      <td>
                        <div>{item.order.trackingCode}</div>
                        <div
                          dir="ltr">{PNtoEN(fullStringToDateObjectP(item.createdAt, 'YYYY-MM-DDTHH:MM:SS.SSSZ').format('YYYY/MM/DD - HH:MM'))}</div>
                      </td>
                      <td>
                        <div>{item.order.user.fullName}</div>
                        <div>{item.order.user.mobile}</div>
                        <div>{item.order.user.codeMeli}</div>
                      </td>
                      <td>
                        <div>{item.order.provider.service.name}</div>
                        <div>{item.order.provider.user.fullName}</div>
                      </td>
                      <td>
                        <div>{item.date}</div>
                        <div>{item.time.replace('-', ' تا ')}</div>
                        <div>{fullStringToDateObjectP(item.date).weekDay.name}</div>
                      </td>
                      <td>
                        <div>{item.order.discountPrice ? numberWithCommas(item.order.price - item.order.discountPrice) : numberWithCommas(item.order.price)} تومان</div>
                        <div>{textPaymentType(item.order.payment.paymentType)}</div>
                      </td>
                      <td>


                        <div>
                          {
                            item.status === 'DONE' ?
                              <strong className="text-green-500">{textReservationsStatus(item.status)}</strong> :
                              item.status === 'REVIEW' ?
                                <strong className="text-yellow-500">{textReservationsStatus(item.status)}</strong>
                                :
                                textReservationsStatus(item.status)
                          }
                        </div>
                        {
                          permissions.editReservation &&
                          <>
                            {
                              item.status === 'COMPLETED' &&
                              <Popup
                                className="bg-modal"
                                contentStyle={{width: '100%'}}
                                trigger={
                                  <div className="inline-flex text-center">
                                    <IoCheckmarkSharp onClick={() => setStatusReserve('THANK')}
                                                      className="inline-flex w-7 h-7 text-green-500 cursor-pointer mx-1"
                                                      size="24px"/>
                                  </div>
                                }
                                modal
                                nested
                              >
                                {close =>
                                  <div className="panel-wrapper-modal max-w-[500px]">
                                    <IoClose
                                      size="32px"
                                      onClick={close}
                                      className="absolute left-4 top-4 cursor-pointer"
                                    />

                                    <div className="panel-modal-title"> تایید انجام رزرو
                                      ({item.order.trackingCode})
                                    </div>
                                    <div className="panel-modal-content">
                                      <p className="mb-2">آیا رزرو زیر را انجام داده اید؟</p>
                                      <p>
                                      <span>روز:<strong
                                        className="px-1 text-red-500">{fullStringToDateObjectP(item.date).weekDay.name}</strong></span>
                                        <span>تاریخ:<strong className="px-1 text-red-500">{item.date}</strong></span>
                                        <span>ساعت:<strong
                                          className="px-1 text-red-500">{item.time.replace('-', ' تا ')}</strong></span>
                                      </p>
                                      <div className="mt-6">
                                        <label className="fa-sbold-18px">ارسال پیامک تشکر</label>
                                        <div className="panel-row-checkbox">
                                          <label><input type="checkbox" defaultChecked={smsStatusDoneToAdminProvider}
                                                        onChange={() => setSmsStatusDoneToAdminProvider(!smsStatusDoneToAdminProvider)}/>ارائه
                                            دهنده</label>
                                          <label><input type="checkbox" defaultChecked={smsStatusDoneToUserService}
                                                        onChange={() => setSmsStatusDoneToUserService(!smsStatusDoneToUserService)}/>کاربر</label>
                                        </div>
                                      </div>
                                      <div className="mt-8">
                                        <label className="fa-sbold-18px">ارسال ایمیل تشکر</label>
                                        <div className="panel-row-checkbox">
                                          <label><input type="checkbox" defaultChecked={emailStatusDoneToAdminProvider}
                                                        onChange={() => setEmailStatusDoneToAdminProvider(!emailStatusDoneToAdminProvider)}/>ارائه
                                            دهنده</label>
                                          <label><input type="checkbox" defaultChecked={emailChangeStatusToUserService}
                                                        onChange={() => setEmailStatusDoneToUserService(!emailStatusDoneToUserService)}/>کاربر</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="panel-modal-footer">
                                      <div className="panel-modal-confirm"
                                           onClick={() => handlerDoneReservation(item, "DONE", close)}>
                                        {
                                          loadingDoneReservation ?
                                            <TheSpinner/>
                                            :
                                            'مطمنم، رزرو انجام شده'
                                        }
                                      </div>
                                      <div className="panel-modal-close"
                                           onClick={close}>بستن
                                      </div>
                                    </div>

                                  </div>
                                }
                              </Popup>


                            }
                            {
                              item.status === 'REVIEW' &&
                              <>
                                <Popup
                                  className="bg-modal"
                                  contentStyle={{width: '100%'}}
                                  trigger={
                                    <div className="inline-flex text-center">
                                      <IoCheckmarkSharp onClick={() => setStatusReserve('YES')}
                                                        className="inline-flex w-7 h-7 text-green-500 cursor-pointer mx-1"
                                                        size="24px"/>
                                      <IoCloseSharp onClick={() => setStatusReserve('NO')}
                                                    className="inline-flex w-7 h-7 text-red-500 cursor-pointer mx-1"
                                                    size="24px"/>
                                    </div>
                                  }
                                  modal
                                  nested
                                >
                                  {close =>
                                    <div className="panel-wrapper-modal max-w-[500px]">
                                      <IoClose
                                        size="32px"
                                        onClick={close}
                                        className="absolute left-4 top-4 cursor-pointer"
                                      />

                                      <div className="panel-modal-title">{statusReserve ? 'تایید' : 'رد'} رزرو
                                        ({item.order.trackingCode})
                                      </div>
                                      <div className="panel-modal-content">
                                        <p className="mb-2">آیا از {statusReserve ? 'تایید' : 'رد'} رزرو زیر مطمئن
                                          هستید؟</p>
                                        <p>
                                      <span>روز:<strong
                                        className="px-1 text-red-500">{fullStringToDateObjectP(item.date).weekDay.name}</strong></span>
                                          <span>تاریخ:<strong className="px-1 text-red-500">{item.date}</strong></span>
                                          <span>ساعت:<strong
                                            className="px-1 text-red-500">{item.time.replace('-', ' تا ')}</strong></span>
                                        </p>
                                        <div className="mt-6">
                                          <label className="fa-sbold-18px">ارسال پیامک وضعیت جدید</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox"
                                                          defaultChecked={smsChangeStatusToAdminProvider}
                                                          onChange={() => setSmsChangeStatusToAdminProvider(!smsChangeStatusToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox" defaultChecked={smsChangeStatusToUserService}
                                                          onChange={() => setSmsChangeStatusToUserService(!smsChangeStatusToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                        <div className="mt-8">
                                          <label className="fa-sbold-18px">ارسال ایمیل وضعیت جدید</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox"
                                                          defaultChecked={emailChangeStatusToAdminProvider}
                                                          onChange={() => setEmailChangeStatusToAdminProvider(!emailChangeStatusToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox"
                                                          defaultChecked={emailChangeStatusToUserService}
                                                          onChange={() => setEmailChangeStatusToUserService(!emailChangeStatusToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="panel-modal-footer">

                                        {
                                          statusReserve ?
                                            <div className="panel-modal-confirm"
                                                 onClick={() => handlerChangeReservation(item, "COMPLETED", close)}>
                                              {
                                                loadingChangeReservation ?
                                                  <TheSpinner/>
                                                  :
                                                  'مطمنم، رزرو را تایید کن'
                                              }
                                            </div>
                                            :
                                            <div
                                              className={"panel-modal-confirm-delete " + (loadingChangeReservation ? "disable-action" : "cursor-pointer")}
                                              onClick={() => handlerChangeReservation(item, "CANCELED", close)}>
                                              {
                                                loadingChangeReservation ?
                                                  <TheSpinner/>
                                                  :
                                                  'مطمنم، رزرو را رد کن'
                                              }
                                            </div>
                                        }
                                        <div className="panel-modal-close"
                                             onClick={close}>بستن
                                        </div>
                                      </div>

                                    </div>
                                  }
                                </Popup>
                              </>
                            }
                          </>
                        }
                      </td>
                      <td>
                        <div className="flex-center-end gap-3">
                          {
                            permissions.editReservation &&
                            <>
                              {
                                item.status === "DONE" &&
                                <Popup
                                  className="bg-modal"
                                  contentStyle={{width: '100%'}}
                                  trigger={
                                    <div>
                                      <TbShoppingCartHeart
                                        className="cursor-pointer"
                                        size="28px"/>
                                    </div>
                                  }
                                  modal
                                  nested
                                >
                                  {close =>
                                    <div className="panel-wrapper-modal max-w-[500px]">
                                      <IoClose
                                        size="32px"
                                        onClick={close}
                                        className="absolute left-4 top-4 cursor-pointer"
                                      />
                                      <div className="panel-modal-title">ارسال قدردانی ({item.order.trackingCode})</div>
                                      <div className="panel-modal-content">
                                        <div>
                                          <label className="fa-sbold-18px">ارسال پیامک قدردانی</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox"
                                                          defaultChecked={smsAppreciationToAdminProvider}
                                                          onChange={() => setSmsAppreciationToAdminProvider(!smsAppreciationToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox" defaultChecked={smsAppreciationToUserService}
                                                          onChange={() => setSmsAppreciationToUserService(!smsAppreciationToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                        <div className="mt-8">
                                          <label className="fa-sbold-18px">ارسال ایمیل قدردانی</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox"
                                                          defaultChecked={emailAppreciationToAdminProvider}
                                                          onChange={() => setEmailAppreciationToAdminProvider(!emailAppreciationToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox"
                                                          defaultChecked={emailAppreciationToUserService}
                                                          onChange={() => setEmailAppreciationToUserService(!emailAppreciationToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                        <div className="mt-8">
                                          <label className="block mb-2 fa-sbold-18px">کد تخفیف</label>
                                          <input className="bk-input" name="discountCode"
                                                 onChange={e => setDiscountCode(e.target.value)}
                                                 placeholder="کد تخفیف خود را وارد کنید."/>
                                        </div>
                                      </div>
                                      <div className="panel-modal-footer">
                                        <div className="panel-modal-confirm"
                                             onClick={() => handlerAppreciationReservation(item, close)}>
                                          {
                                            loadingAppreciation ?
                                              <TheSpinner/>
                                              :
                                              'مطمنم، کد تخفیف قدردانی را ارسال کن'
                                          }
                                        </div>
                                        <div className="panel-modal-close"
                                             onClick={close}>بیخیال شو
                                        </div>
                                      </div>

                                    </div>
                                  }
                                </Popup>
                              }


                              {
                                item.status === 'COMPLETED' &&
                                <Popup
                                  className="bg-modal"
                                  contentStyle={{width: '100%'}}
                                  trigger={
                                    <div>
                                      <PiAlarmBold
                                        className="cursor-pointer"
                                        size="28px"/>
                                    </div>
                                  }
                                  modal
                                  nested
                                >
                                  {close =>
                                    <div className="panel-wrapper-modal max-w-[500px]">
                                      <IoClose
                                        size="32px"
                                        onClick={close}
                                        className="absolute left-4 top-4 cursor-pointer"
                                      />
                                      <div className="panel-modal-title">ارسال یادآوری ({item.order.trackingCode})</div>
                                      <div className="panel-modal-content">
                                        <div>
                                          <label className="fa-sbold-18px">ارسال پیامک یادآوری</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox" defaultChecked={smsReminderToAdminProvider}
                                                          onChange={() => setSmsReminderToAdminProvider(!smsReminderToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox" defaultChecked={smsReminderToUserService}
                                                          onChange={() => setSmsReminderToUserService(!smsReminderToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                        <div className="mt-8">
                                          <label className="fa-sbold-18px">ارسال ایمیل یادآوری</label>
                                          <div className="panel-row-checkbox">
                                            <label><input type="checkbox" defaultChecked={emailReminderToAdminProvider}
                                                          onChange={() => setEmailReminderToAdminProvider(!emailReminderToAdminProvider)}/>ارائه
                                              دهنده</label>
                                            <label><input type="checkbox" defaultChecked={emailReminderToUserService}
                                                          onChange={() => setEmailReminderToUserService(!emailReminderToUserService)}/>کاربر</label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="panel-modal-footer">
                                        <div className="panel-modal-confirm"
                                             onClick={() => handlerReminderReservation(item, close)}>
                                          {
                                            loadingReminder ?
                                              <TheSpinner/>
                                              :
                                              'مطمنم، یادآوری را ارسال کن'
                                          }
                                        </div>
                                        <div className="panel-modal-close"
                                             onClick={close}>بیخیال شو
                                        </div>
                                      </div>

                                    </div>
                                  }
                                </Popup>
                              }


                              <Popup
                                className="bg-modal"
                                contentStyle={{width: '100%'}}
                                trigger={
                                  <div>
                                    <CgNotes
                                      className="cursor-pointer"
                                      size="25px"/>
                                  </div>
                                }
                                modal
                                nested
                              >
                                {close => <DisplayOrderPaymentInformation item={item} close={close}/>}
                              </Popup>

                              {
                                (item.status === 'COMPLETED' || item.status === 'REVIEW') &&
                                <Link href={"/admin/reservation/" + item.id}><FiEdit
                                  size="26px"/></Link>
                              }
                            </>
                          }
                          {
                            permissions.deleteReservation &&
                            <Popup
                              className="bg-modal"
                              contentStyle={{width: '100%'}}
                              trigger={
                                <div>
                                  <RiDeleteBin5Line
                                    className="text-red-500 cursor-pointer"
                                    size="28px"/>
                                </div>
                              }
                              modal
                              nested
                            >
                              {close =>
                                <div className="panel-wrapper-modal max-w-[500px]">
                                  <IoClose
                                    size="32px"
                                    onClick={close}
                                    className="absolute left-4 top-4 cursor-pointer"
                                  />
                                  <div className="panel-modal-title">حذف رزرو
                                    ({item.order.trackingCode})
                                  </div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف رزرو مطمن هستید؟</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteReservation(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، رزرو را حذف کن'
                                      }
                                    </div>
                                    <div className="panel-modal-close"
                                         onClick={close}>بیخیال شو
                                    </div>
                                  </div>

                                </div>
                              }
                            </Popup>
                          }
                        </div>
                      </td>
                    </tr>
                  ) :
                  <tr>
                    <td colSpan={8}>رزروی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={8}><TheSpinner/></td>
                </tr>
            }

            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
