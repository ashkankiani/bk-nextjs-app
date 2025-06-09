"use client"
import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {AiFillPlusCircle} from "react-icons/ai";
import {hookListReservations} from "@/hooks/admin/hookReservation";
import {bkToast, PNtoEN} from "@/libs/utility";
import {useEffect, useState} from "react";
import {dateNowP, numberWithCommas} from "@/libs/convertor";
import TheSpinner from "@/components/layout/TheSpinner";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";


export default function TheDashboardUi() {

  const {permissions} = useHook()

  const [loading, setLoading] = useState(false)

  const [reservationsYesterday, setReservationsYesterday] = useState([])
  const [reservationsToday, setReservationsToday] = useState([])
  const [reservationsTomorrow, setReservationsTomorrow] = useState([])
  const [reservationsTotal, setReservationsTotal] = useState([])

  const handlerCountReservationsTotal = async () => {
    setLoading(false)
    // let params = {
    //   type: "condition",
    //   condition:
    //     {
    //       include: {
    //         order: {
    //           select: {
    //             price: true
    //           }
    //         },
    //       }
    //     }
    // }
    await hookListReservations((response, message) => {
      if (response) {
        setLoading(true)

        let filteredYesterday = message.filter(item => item.date === PNtoEN(dateNowP().subtract(1, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).format()));
        let filteredToday = message.filter(item => item.date === PNtoEN(dateNowP().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).format()));
        let filteredTomorrow = message.filter(item => item.date === PNtoEN(dateNowP().add(1, 'days').setHour(0).setMinute(0).setSecond(0).setMillisecond(0).format()));

        setReservationsTotal(message)
        setReservationsYesterday(filteredYesterday)
        setReservationsToday(filteredToday)
        setReservationsTomorrow(filteredTomorrow)

      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    if (permissions.viewDashboard) {
      handlerCountReservationsTotal()
    }
  }, [])


  const countStatuses = (data) => {
    let statuses = {
      "REVIEW": 0,
      "COMPLETED": 0,
      "DONE": 0,
      "CANCELED": 0,
      "REJECTED": 0
    };

    for (let item of data) {
      if (Object.prototype.hasOwnProperty.call(statuses, item.status)) {
        statuses[item.status]++;
      }
    }

    return statuses;
  }

  const sumPricesForDoneStatus = (data, statuses) => {
    let sum = 0;
    for (let item of data) {
      if (statuses.includes(item.status)) {
        sum += item.order.price;
      }
    }
    return sum;
  }

  return (
    <>
      <HeadPage title="داشبورد"/>
      <HeaderPage title="داشبورد" description="خلاصه اطلاعات سامانه را مشاهده نمایید.">
        {
          permissions.addServices &&
          <Link href="/admin/services/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>خدمت جدید</span>
          </Link>
        }
        {
          permissions.addProviders &&
          <Link href="/admin/providers/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>ارائه دهنده جدید</span>
          </Link>
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
        {
          permissions.viewDashboard ?
            loading ?
              <>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="panel-boxed">
                      <h2 className="fa-bold-26px mb-6 text-primary-700">خلاصه فروش</h2>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">فروش کل</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{numberWithCommas(sumPricesForDoneStatus(reservationsTotal, ["DONE"]))}<span
                          className="fa-regular-14px mr-1 align-middle">تومان</span></span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">فروش دیروز</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{numberWithCommas(sumPricesForDoneStatus(reservationsYesterday, ["DONE"]))}<span
                          className="fa-regular-14px mr-1 align-middle">تومان</span></span>
                      </div>
                      <div className="flex-center-between py-2">
                        <span className="fa-regular-16px">فروش امروز</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{numberWithCommas(sumPricesForDoneStatus(reservationsToday, ["DONE"]))}<span
                          className="fa-regular-14px mr-1 align-middle">تومان</span></span>
                      </div>
                    </div>
                    <div className="panel-boxed">
                      <h2 className="fa-bold-26px mb-6 text-primary-700">پیش بینی</h2>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">مجموع کل رزروها</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{reservationsTotal.length}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">پیش بینی فروش امروز</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{numberWithCommas(sumPricesForDoneStatus(reservationsToday, ["COMPLETED", "REVIEW"]))}<span
                          className="fa-regular-14px mr-1 align-middle">تومان</span></span>
                      </div>
                      <div className="flex-center-between py-2">
                        <span className="fa-regular-16px">پیش بینی فروش فردا</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{numberWithCommas(sumPricesForDoneStatus(reservationsTomorrow, ["COMPLETED", "REVIEW"]))}<span
                          className="fa-regular-14px mr-1 align-middle">تومان</span></span>
                      </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="panel-boxed">
                      <h2 className="fa-bold-26px mb-6 text-primary-700">آمار دیروز</h2>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">مجموع رزروها</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{reservationsYesterday.length}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای در صف بررسی</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsYesterday).REVIEW}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای تکمیل شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsYesterday).COMPLETED}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای انجام شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsYesterday).DONE}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای لغو شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsYesterday).CANCELED}</span>
                      </div>
                      <div className="flex-center-between py-2">
                        <span className="fa-regular-16px">رزروهای رد شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsYesterday).REJECTED}</span>
                      </div>
                    </div>
                    <div className="panel-boxed">
                      <h2 className="fa-bold-26px mb-6 text-primary-700">آمار امروز</h2>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">مجموع رزروها</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{reservationsToday.length}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای در صف بررسی</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsToday).REVIEW}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای تکمیل شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsToday).COMPLETED}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای انجام شده</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsToday).DONE}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای لغو شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsToday).CANCELED}</span>
                      </div>
                      <div className="flex-center-between py-2">
                        <span className="fa-regular-16px">رزروهای رد شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsToday).REJECTED}</span>
                      </div>
                    </div>
                    <div className="panel-boxed">
                      <h2 className="fa-bold-26px mb-6 text-primary-700">آمار فردا</h2>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">مجموع رزروها</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{reservationsTomorrow.length}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای در صف بررسی</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsTomorrow).REVIEW}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای تکمیل شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsTomorrow).COMPLETED}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای انجام شده</span>
                        <span className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsTomorrow).DONE}</span>
                      </div>
                      <div className="flex-center-between border-b dark:border-darkNavy2 py-2">
                        <span className="fa-regular-16px">رزروهای لغو شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsTomorrow).CANCELED}</span>
                      </div>
                      <div className="flex-center-between py-2">
                        <span className="fa-regular-16px">رزروهای رد شده</span>
                        <span
                          className="fa-bold-22px sm:fa-bold-26px">{countStatuses(reservationsTomorrow).REJECTED}</span>
                      </div>
                    </div>
                </div>
              </>
              :
              <TheSpinner/>
            :
            <p>به پنل خوش آمدید</p>
        }
      </div>
    </>
  )
}
