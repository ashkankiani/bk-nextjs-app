"use client"
import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import React, {useEffect, useState} from "react";
import {hookCancelReservation, hookGetReservationWhere} from "@/hooks/user/hookReservation";
import {
  bkToast,
  textPaymentType,
  textReservationsStatus,
  textSettingsBankName
} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {dateNowP, fullStringToDateObjectP, minuteIntegerToTime, numberWithCommas} from "@/libs/convertor";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import useHook from "@/hooks/controller/useHook";
import DisplayOrderPaymentInformationForUser
  from "@/app/(theme1)/account/reservations/component/DisplayOrderPaymentInformationForUser";

export default function TheReservationsUi() {
  const { user, setting} = useHook()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCancel, setLoadingCancel] = useState<boolean>(false)
  const [data, setData] = useState([])

  const showColumnStatus = (setting.cancellationReservationUser)

  const handlerListReservationsWhere = async () => {
    setLoading(false)
    const params = {
      // type: "condition",
      condition:
        {
          where: {
            userId: user.id
          },
          include: {
            order: {
              include: {
                payment: {
                  include: {
                    transaction: {}
                  },
                },
                user: {},
                provider: {
                  include: {
                    service: {
                      include: {
                        user: {
                          select: {
                            mobile: true,
                            email: true,
                          }
                        }
                      }
                    },
                    user: {}
                  }
                },
              }
            },
          }
        }
    }
    await hookGetReservationWhere(params, (response, message) => {
      if (response) {
        setLoading(true)
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListReservationsWhere()
  }, [])

  const handlerCancelReservation = async (item, close) => {
    if (checkCancellationDeadline()) {
      const data = {
        reserve: item,
        update: {
          status: "CANCELED"
        }
      }
      setLoadingCancel(true)
      await hookCancelReservation(data, (response, message) => {
        if (response) {
          setLoadingCancel(false)
          handlerListReservationsWhere()
          close()
          // dispatch(setUser(message))
          bkToast('success', message)
        } else {
          bkToast('error', message)
        }
      })
    }
  }

  const checkCancellationDeadline = (targetTime):boolean => {
    const now = dateNowP().valueOf();
    const diff = targetTime - now;
    const diffInMinutes = Math.ceil(diff / 1000 / 60);

    if (diffInMinutes < setting.cancellationDeadline) {
      return false
    } else {
      return true
    }
  }

  return (
      <div className="bk-box md:w-10/12">
        <TheHeader/>
        <div className="bk-box-wrapper">
          <h1 className="bk-box-wrapper-title">لیست رزرو</h1>
          <p className="bk-box-wrapper-description">در این بخش وضعیت کلی رزروهای خود را میتوانید مشاهده
            کنید.</p>
          <div className="relative overflow-x-auto bk-table-transparent">
            <table className="w-full text-center">
              <thead
                className="bg-green-100 dark:bg-darkNavy3 fa-sbold-18px">
              <tr>
                <th width={50}>ردیف</th>
                <th>کد پیگیری</th>
                <th>نوبت برای</th>
                <th>تاریخ رزرو</th>
                <th>پرداخت</th>
                <th>وضعیت</th>
                {
                  showColumnStatus &&
                  <th width={100}>عملیات</th>
                }
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-darkNavy2 fa-regular-18px">
              {
                loading ?
                  data.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.order.trackingCode}</td>
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
                          <div>{numberWithCommas(item.order.totalPrice)} تومان</div>
                          <div>{textPaymentType(item.order.payment.paymentType)}</div>
                          {
                            item.order.payment.transaction ?
                              <>
                                <div>درگاه {textSettingsBankName(item.order.payment.transaction.bankName)}</div>
                                <div>شماره تراکنش {item.order.payment.transaction.trackId}</div>
                              </>
                              :
                              false
                          }
                        </td>
                        <td>
                          {textReservationsStatus(item.status)}
                        </td>
                        {
                          showColumnStatus &&
                          <td>

                            <div className="flex-center-center gap-3">

                              {
                                item.status === 'DONE' &&

                                <Popup
                                  className="bg-modal"
                                  contentStyle={{width: '100%'}}
                                  trigger={
                                    <div className="bk-button p-2 bg-green-500 cursor-pointer">فاکتور</div>
                                  }
                                  modal
                                  nested
                                >
                                  {close => <DisplayOrderPaymentInformationForUser item={item} close={close}/>}
                                </Popup>
                              }

                              {
                                setting.cancellationReservationUser && item.status === 'REVIEW' ||
                                setting.cancellationReservationUser && item.status === 'COMPLETED' &&

                                <Popup
                                  className="bg-modal"
                                  contentStyle={{width: '100%'}}
                                  trigger={
                                    <div className="bk-button p-2 bg-yellow-500 cursor-pointer">لغو</div>
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
                                      <div className="panel-modal-title">لغو رزرو ({item.order.trackingCode})</div>
                                      <div className="panel-modal-content">
                                        {
                                          checkCancellationDeadline(item.dateTimeStartEpoch) ?
                                            <>
                                              <p className="mb-2">آیا از لغو رزرو زیر مطمئن هستید؟</p>
                                              <p>
                                          <span>روز:<strong
                                            className="px-1 text-red-500">{fullStringToDateObjectP(item.date).weekDay.name}</strong></span>
                                                <span>تاریخ:<strong
                                                  className="px-1 text-red-500">{item.date}</strong></span>
                                                <span>ساعت:<strong
                                                  className="px-1 text-red-500">{item.time.replace('-', ' تا ')}</strong></span>
                                              </p>
                                            </>
                                            :
                                            <p>حداقل زمان لغو رزرو،<strong
                                              className="px-1 text-red-500">{minuteIntegerToTime(setting.cancellationDeadline, 'string')}</strong>دقیقه
                                              قبل از شروع رزرو است. پس نمیتوانید این رزرو را لغو نمایید.</p>
                                        }
                                      </div>
                                      <div className="panel-modal-footer">

                                        {
                                          checkCancellationDeadline(item.dateTimeStartEpoch) &&
                                          <div className={"panel-modal-confirm-delete " + (loadingCancel ? "disable-action" : "cursor-pointer")}
                                               onClick={() => handlerCancelReservation(item, close)}>
                                            {
                                              loadingCancel ?
                                                <TheSpinner/>
                                                :
                                                'مطمنم، رزرو را لغو کن'
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

                              }
                            </div>
                          </td>
                        }
                      </tr>
                    ) :
                    <tr>
                      <td colSpan={showColumnStatus ? 7 : 6}>رزروی
                        برای نمایش وجود ندارد.
                      </td>
                    </tr>
                  :
                  <tr>
                    <td colSpan={showColumnStatus ? 7 : 6}>
                      <TheSpinner/></td>
                  </tr>
              }

              </tbody>
            </table>
          </div>

        </div>
        <TheFooter/>
      </div>
  )
}