import Link from "next/link";
import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import {bkToast, convertToHours, groupTimesByDate, PNtoEN, slotGenerator, textGenderType} from "@/libs/utility";
import {useEffect, useState} from "react";
import {hookGetTimeSheetWhere} from "@/hooks/user/hookTimeSheet";
import {hookListHolidays} from "@/hooks/user/hookHoliday";
import {hookGetReservationWhere} from "@/hooks/user/hookReservation";
import {hookGetDraftWhere} from "@/hooks/user/hookDraft";
import TheSpinner from "@/components/layout/TheSpinner";
import {dateNowP, fullStringToDateObjectP} from "@/libs/convertor";
import {setCart} from "@/store/slice/user";
import {IoClose} from "react-icons/io5";
import Popup from "reactjs-popup";
import useHook from "@/hooks/controller/useHook";


export default function TheReserveUi() {


  const {router, searchQuery} = useHook()

  if (searchQuery.length === 0) {
    router.push("/")
    return <TheSpinner/>
  }



  const {dispatch, router, searchQuery, cart, isLogin, user, setting} = useHook()
  const [loading, setLoading] = useState(false)
  // const [loadingDraft, setLoadingDraft] = useState(false)
  const [dataTimeSheet, setDataTimeSheet] = useState([])
  const [listTimeUserSelected, setListTimeUserSelected] = useState([])

  // const [loadingReservation, setLoadingReservation] = useState(false)
  // const [reservedTimes, setReservedTimes] = useState([])
  // const [draft, setDraft] = useState([])


  const handlerGetReservationWhere = async () => {
    // setLoadingReservation(false)
    let params = {
      // type: "condition",
      condition:
        {
          where: {
            serviceId: searchQuery.service.id,
            providerId: searchQuery.provider.id,
            // date: body.date,
            dateTimeStartEpoch: {
              gte: searchQuery.startDate,
            },
            dateTimeEndEpoch: {
              lte: searchQuery.endDate,
            },
            status: {
              in: ['REVIEW', 'COMPLETED', 'DONE'],
            },
          },
        }
    }
    await hookGetReservationWhere(params, async (response, message) => {
      if (response) {
        // setLoadingReservation(true)
        // let ObjGroupTimesByDate = groupTimesByDate(message)
        // setReservedTimes(message)
        await handlerListDraft(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerListDraft = async (reservedTimes) => {
    // setLoadingDraft(false)
    let params = {
      type: "condition",
      condition: {
        where: {
          // userId: user !== null ? user.id : null
        },
      },
      nowEpoch: dateNowP().valueOf(),
      userId: user !== null ? user.id : null
    }

    await hookGetDraftWhere(params, async (response, message) => {
      if (response) {
        // setLoadingDraft(true)
        // setDraft(message)
        let merge = reservedTimes.concat(message)
        let ObjGroupTimesByDate = groupTimesByDate(merge)
        await handlerListHolidays(ObjGroupTimesByDate)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerListHolidays = async (ObjGroupTimesByDate) => {
    setLoading(false)
    await hookListHolidays(async (response, message) => {
      if (response) {
        let dayHolidays = []
        message.map(item => {
          dayHolidays.push([item.date.replaceAll('/', '-'), item.title])
        })
        await getTimeSheet(ObjGroupTimesByDate, dayHolidays)
      } else {
        bkToast('error', message)
      }
    })
  }

  const getTimeSheet = async (ObjGroupTimesByDate, dayHolidays) => {
    let params = {
      condition:
        {
          where: {
            providerId: searchQuery.provider.id,
            serviceId: searchQuery.service.id
          },
          select: {
            dayName: true,
            dayIndex: true,
            startTime: true,
            endTime: true,
          }
        }
    }
    await hookGetTimeSheetWhere(params, async (response, message) => {
      if (response) {
        let hours = convertToHours(message)
        if (message.length !== 0) {
          let dataTimeSheet = await slotGenerator(PNtoEN(fullStringToDateObjectP(searchQuery.startDate, 'YYYY-MM-DD').format()), PNtoEN(fullStringToDateObjectP(searchQuery.endDate, 'YYYY-MM-DD').format()), hours, dayHolidays, searchQuery.provider.workHolidays, ObjGroupTimesByDate, (searchQuery.provider.startTime === null && searchQuery.provider.endTime === null) ? [] : [searchQuery.provider.startTime, searchQuery.provider.endTime], searchQuery.service.periodTime, searchQuery.provider.slotTime, setting.minReservationTime, searchQuery.service.capacity)
          setDataTimeSheet(dataTimeSheet)
        }
        setLoading(true)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerGetReservationWhere()
  }, [])

  const goCheckout = () => {
    if (setting.cart) {
      let combined = listTimeUserSelected.concat(cart);
      // حذف موارد تکراری بر اساس یک ویژگی خاص (مثلاً id)
      let uniqueCombined = combined.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.provider.id === item.provider.id && t.service.id === item.service.id && t.date === item.date && JSON.stringify(t.time) === JSON.stringify(item.time)
          ))
      );
      dispatch(setCart(uniqueCombined))
    } else {
      dispatch(setCart(listTimeUserSelected))
    }
    if (isLogin && user !== null && searchQuery.service.gender !== "NONE") {
      if (user.gender === "NONE") {
        bkToast('error', "لطفا ابتدا در پروفایل خود جنسیت خود را انتخاب کنید.")
        return
      } else if (user.gender !== searchQuery.service.gender) {
        bkToast('error', "این نوبت مخصوص " + textGenderType(searchQuery.service.gender) + " میباشد.")
        return
      }
    }
    router.push("/checkout")
  }

  const addTimeUserSelected = (dateTime) => {
    let exists = listTimeUserSelected.some(item => JSON.stringify(item) === JSON.stringify(dateTime));
    if (exists) {
      let indexArray = listTimeUserSelected.findIndex(item => JSON.stringify(item) === JSON.stringify(dateTime));
      setListTimeUserSelected(listTimeUserSelected.filter((item, index) => index !== indexArray));
    } else {
      setListTimeUserSelected(prevListTimeUserSelected => [...prevListTimeUserSelected, dateTime]);
    }
  }


  return (
    <div className="bk-box md:w-10/12">
      <TheHeader/>
      <div className="bk-box-wrapper">
        <h1 className="bk-box-wrapper-title">انتخاب وقت رزرو</h1>
        <p className="bk-box-wrapper-description">تاریخ و زمان رزرو خود را انتخاب کنید.</p>
        {
          <p className="text-lg mb-4 text-center">
            <span>شما در حال رزرو</span>
            <strong className="px-1">{searchQuery.service.name}</strong>
            <span>برای</span>
            <strong className="px-1">{searchQuery.provider.user.fullName}</strong>
            <span>در بازه</span>
            <strong className="px-1"
                    dir="ltr">{PNtoEN(fullStringToDateObjectP(searchQuery.startDate, 'YYYY-MM-DD HH:mm').format())}</strong>
            <span>تا</span>
            <strong className="px-1"
                    dir="ltr">{PNtoEN(fullStringToDateObjectP(searchQuery.endDate, 'YYYY-MM-DD HH:mm').format())}</strong
            ><span>هستید.</span>
          </p>
        }
        {
          searchQuery.service.gender !== "NONE" &&
          <p className="text-lg mb-4 text-center">
            <span>رزرو نوبت فقط برای جنسیت</span>
            <strong
              className="px-1 underline underline-offset-8">{textGenderType(searchQuery.service.gender)}</strong>
            <span>امکان پذیر است.</span>
          </p>
        }
        <form>
          <div className="md:flex-stretch-start flex-wrap my-8 max-h-[600px] overflow-y-auto">
            {
              loading ?
                dataTimeSheet.length > 0 ?
                  dataTimeSheet?.map((dataTime, index) =>
                    dataTime.dayIsHoliday === true ?
                      <div className="select" key={index}>
                        <div className="header-select">
                          <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                          <div>{dataTime.date}</div>
                        </div>
                        <div className="box-select py-4">
                          <span className="pl-1 text-red-500">تعطیل رسمی:</span>
                          <span>{dataTime.textHoliday}</span>
                        </div>
                      </div>
                      :
                      dataTime.timeSheet.length ?
                        <div className="select" key={index}>
                          <div className="header-select">
                            <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                            <div>{dataTime.date}</div>
                          </div>
                          <div className="box-select">
                            {
                              dataTime.timeSheet.map((time, indexTime) =>
                                <div
                                  className={"row-select " + (time[2] ? 'bg-neutral-100 dark:bg-darkNavy3' : '')}
                                  key={indexTime}>
                                  <label
                                    htmlFor={index + '-' + indexTime}
                                    className={"row-select-label " + (time[2] ? 'disable-action' : '')}>
                                    {time[0]} تا {time[1]} {time[2] && time[3]} (ظرفیت خالی {time[4]} نوبت)
                                  </label>
                                  <input
                                    onChange={() =>
                                      !time[2] ?
                                        addTimeUserSelected({
                                          service: searchQuery.service,
                                          provider: searchQuery.provider,
                                          // serviceName: searchQuery.service.serviceName,
                                          // providerName: searchQuery.provider.providerName,
                                          date: dataTime.date,
                                          time: [time[0], time[1]],
                                          price: searchQuery.service.price,
                                          // userId: user !== null ? user.id : null
                                        }) : false
                                    }
                                    id={index + '-' + indexTime}
                                    type="checkbox"
                                    className={time[2] ? 'bk-checkbox-active' : 'bk-checkbox'}
                                    disabled={time[2]}
                                    defaultChecked={time[2]}
                                  />
                                </div>
                              )
                            }
                          </div>
                        </div>
                        :
                        setting.shiftWorkStatus &&
                        <div className="select" key={index}>
                          <div className="header-select">
                            <div>{fullStringToDateObjectP(dataTime.date).weekDay.name}</div>
                            <div>{dataTime.date}</div>
                          </div>
                          <div className="box-select py-4">
                            <span className="pl-1 text-red-500">نداشتن نوبت:</span>
                            <span>نوبت کاری برای این روز وجود ندارد</span>
                          </div>
                        </div>
                  )
                  :
                  <div className="w-fit mx-auto bg-white bg-opacity-50 dark:bg-opacity-5 p-4 rounded-md text-center">
                    <h2 className="fa-bold-22px font-semibold mb-2">نوبت رزروی برای این بازه وجود ندارد</h2>
                    <p className="fa-regular-18px leading-10 mb-0">به عقب برگردید و یک بازه زمانی دیگر تلاش کنید.</p>
                  </div>
                :
                <div><TheSpinner/></div>
            }
          </div>
          <div className="flex-center-center flex-wrap gap-2 md:gap-x-4 mt-2">
            {
              listTimeUserSelected.length > 0 &&
              <>
                <div
                  className="bk-button bg-green-700 dark:bg-primary-900 w-full sm:w-36 fa-sbold-18px">
                  <div className="flex-center-center">
                                            <span
                                              className="flex-center-center w-7 h-7 rounded-full bg-green-900 ml-2">{listTimeUserSelected.length}</span>
                    <span>نوبت رزرو</span>
                  </div>
                </div>
                {
                  (setting.groupReservation && listTimeUserSelected.length > 0) || (!setting.groupReservation && listTimeUserSelected.length === 1) ?
                    <div onClick={() => goCheckout()}
                         className="bk-button w-full sm:w-36 fa-sbold-18px bg-primary-700 dark:bg-primary-900 cursor-pointer">مرحله
                      بعد</div>
                    :
                    <div
                      className="bk-button w-full sm:w-80 fa-sbold-18px bg-red-700 dark:bg-red-500">بیش از یک نوبت
                      نمیتوانید رزرو کنید.</div>
                }
              </>
            }

            {
              searchQuery.service.description && listTimeUserSelected.length === 0 &&
              <Popup
                className="bg-modal"
                contentStyle={{width: '100%'}}
                trigger={
                  <div className="bk-button bg-green-900 w-full sm:w-44 fa-sbold-18px cursor-pointer">معرفی
                    سرویس</div>
                }
                modal
                nested
              >
                {close =>
                  <div className="panel-wrapper-modal max-w-[600px]">
                    <IoClose
                      size="32px"
                      onClick={close}
                      className="absolute left-4 top-4 cursor-pointer"
                    />
                    <div className="panel-modal-title">معرفی سرویس</div>
                    <div className="panel-modal-content"
                         dangerouslySetInnerHTML={{__html: searchQuery.service.description}}>
                    </div>
                  </div>
                }
              </Popup>
            }

            {
              searchQuery.provider.description && listTimeUserSelected.length === 0 &&
              <Popup
                className="bg-modal"
                contentStyle={{width: '100%'}}
                trigger={
                  <div
                    className="bk-button bg-primary-700 dark:bg-primary-900 w-full sm:w-44 fa-sbold-18px cursor-pointer">معرفی
                    اپراتور</div>
                }
                modal
                nested
              >
                {close =>
                  <div className="panel-wrapper-modal max-w-[600px]">
                    <IoClose
                      size="32px"
                      onClick={close}
                      className="absolute left-4 top-4 cursor-pointer"
                    />
                    <div className="panel-modal-title">معرفی اپراتور</div>
                    <div className="panel-modal-content"
                         dangerouslySetInnerHTML={{__html: searchQuery.provider.description}}>
                    </div>
                  </div>
                }
              </Popup>
            }
            <Link
              href="/"
              className="bk-button bg-gray-500 dark:bg-gray-700 w-full sm:w-24 fa-sbold-18px">بازگشت
            </Link>
          </div>
        </form>
      </div>
      <TheFooter/>
    </div>
  )
}