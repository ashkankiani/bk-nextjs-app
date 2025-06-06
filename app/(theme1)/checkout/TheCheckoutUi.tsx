import {useEffect, useState} from "react";
import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import {dateNowP, fullStringToDateObjectP, numberWithCommas} from "@/libs/convertor";
import {
  bkToast,
  generateTrackingCodeWithDate,
  isCurrentTimeInRange,
  textGenderType,
  textSettingsBankName
} from "@/libs/utility";
import {hookGetDiscount} from "@/hooks/user/hookDiscount";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookGetConnections} from "@/hooks/user/hookConnection";
import {hookSendGateway} from "@/hooks/user/hookGateway";
import {deleteCart, setOrder} from "@/store/slice/user";
import useController from "@/hooks/controller/useController";
import {BsCart3} from "react-icons/bs";
import {hookAddDraftReservation} from "@/hooks/user/hookDraft";
import Link from "next/link";
import Popup from "reactjs-popup";
import {hookGetReservationWhere} from "@/hooks/user/hookReservation";
import useHook from "@/hooks/controller/useHook";
import ModalFastRegister from "@/app/(theme1)/checkout/component/ModalFastRegister";

export default function TheCheckoutUi() {

  const {dispatch, router, cart, searchQuery, isLogin, user, setting} = useHook()

  const {
    calculatorReservationUser,
    conditionReservation,
  } = useController()

  const initTotalPrice = cart.reduce((total, obj) => total + obj.price, 0)
  const [loading, setLoading] = useState(false)

  const [loadingDiscount, setLoadingDiscount] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountPrice, setDiscountPrice] = useState(0)
  const [discountType, setDiscountType] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountId, setDiscountId] = useState(null)
  const [discountBox, setDiscountBox] = useState(false)

  const [totalPrice, setTotalPrice] = useState(initTotalPrice)
  const [paymentType, setPaymentType] = useState(null)

  const [trackingCode] = useState(generateTrackingCodeWithDate())

  const [gateways, setGateways] = useState([])

  const [modalGuest, setModalGuest] = useState(false)

  const handlerGetConnections = async () => {
    await hookGetConnections((response, message) => {
      let listGateways = []
      if (response) {

        if ((message.bankName1 !== 'NONE') && message.merchantId1 !== "") {
          listGateways.push({
            name: message.bankName1,
            merchantId: message.merchantId1,
            type: "OnlinePayment"
          })
        }
        if ((message.bankName2 !== 'NONE') && message.merchantId2 !== "") {
          listGateways.push({
            name: message.bankName2,
            merchantId: message.merchantId2,
            type: "OnlinePayment"
          })
        }

        setGateways(listGateways)
      } else {
        bkToast('error', message)
      }
    })
  }

  const checkDiscount = () => {
    if (discountCode === "" || discountCode.length === 0) {
      bkToast('error', 'کد تخفیف را وارد کنید.')
    } else {
      handlerSearchDiscount()
    }
  }

  const handlerSearchDiscount = async () => {
    setLoadingDiscount(true)
    let params = {
      code: discountCode
    }

    await hookGetDiscount(params, async (response, message) => {
      setLoadingDiscount(false)
      if (response) {
        if (message.length > 0) {
          message = message[0]
          if (message.startDate !== null && message.endDate !== null) {
            let startDate = fullStringToDateObjectP(message.startDate).valueOf()
            let endDate = fullStringToDateObjectP(message.endDate).valueOf()
            let currentTime = dateNowP.valueOf()
            if (isCurrentTimeInRange(startDate, endDate, currentTime)) {
              await setDiscountInCart(message)
            } else {
              bkToast('error', 'کد تخفیف ' + message.title + ' منقضی شده.')
            }
          } else {
            await setDiscountInCart(message)
          }
        } else {
          bkToast('error', 'کد تخفیف یافت نشد.')
        }
      } else {
        bkToast('error', message)
      }
    })
  }

  const setDiscountInCart = async (message) => {
    setDiscountBox(false)
    setDiscountId(message.id)
    setDiscountType(message.type)
    setDiscountAmount(message.amount)
    calcTotalAndDiscountPrice(message.type, message.amount)
    bkToast('success', 'کد تخفیف ' + message.title + ' اعمال شد.')
  }

  const calcTotalAndDiscountPrice = (type, amount) => {
    if (type === 'CONSTANT') {
      setDiscountPrice(amount)
      setTotalPrice(initTotalPrice - amount)
    }
    if (type === 'PERCENT') {
      let calc = (amount * initTotalPrice) / 100
      setDiscountPrice(calc)
      setTotalPrice(initTotalPrice - calc)
    }
  }

  const checkReservation = async () => {
    if (paymentType === null) {
      bkToast('error', 'روش پرداختی را انتخاب نمایید.')
      return
    }
    if (isLogin && user !== null) {
      if (searchQuery.service.gender !== "NONE") {
        if (user.gender === "NONE") {
          bkToast('error', "لطفا ابتدا در پروفایل خود جنسیت خود را انتخاب کنید.")
        } else if (user.gender !== searchQuery.service.gender) {
          bkToast('error', "این نوبت مخصوص " + textGenderType(searchQuery.service.gender) + " میباشد.")
        }
        return false
      }
      await checkDraft()
    } else {
      if (setting.guestReservation) {
        setModalGuest(true)
      } else {
        bkToast('error', 'برای رزرو نوبت باید در سایت ثبت نام/ورود نمایید.')
      }

    }
  }

  const checkDraft = async (userGuest) => {
    let allPreReserve = []
    for (let i = 0; i < cart.length; i++) {
      let params = {
        serviceId: cart[i].service.id,
        providerId: cart[i].provider.id,
        userId: user ? user.id : userGuest.id,
        dateTimeStartEpoch: parseInt(fullStringToDateObjectP(cart[i].date + ' ' + parseInt(cart[i].time[0].split(':')[0]) + ':' + parseInt(cart[i].time[0].split(':')[1]), "YYYY/MM/DD HH:mm").valueOf()),
        dateTimeEndEpoch: parseInt(fullStringToDateObjectP(cart[i].date + ' ' + parseInt(cart[i].time[1].split(':')[0]) + ':' + parseInt(cart[i].time[1].split(':')[1]), "YYYY/MM/DD HH:mm").valueOf()),
        date: cart[i].date,
        time: cart[i].time.join('-'), // format "15:00-16:00"
        createEpoch: dateNowP().valueOf()
      }
      allPreReserve.push(params)
    }
    addDraftReservation(allPreReserve)
  }

  const addDraftReservation = async data => {
    await hookAddDraftReservation(data, async (response, message) => {
      if (response) {
        await goGateway()
      } else {
        bkToast('error', message)
      }
    })
  }

  const goGateway = async () => {
    setLoading(true)
    let data = {}
    let authority = ""
    if (paymentType.name === 'ZARINPAL') {
      data = {
        gateway: paymentType.name,
        action: 'authority',
        params: {
          description: 'شماره سفارش: ' + trackingCode + ' برای: ' + (user ? user.fullName : "کاربر ناشناس") + ' کدملی: ' + user.codeMeli,
          merchant_id: paymentType.merchantId,
          currency: "IRT",
          amount: totalPrice,
          ...(user !== null && {metadata: {mobile: user.mobile, email: user.email}}),
          callback_url: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/zarinpal',
          // callback_url: process.env.NEXT_PUBLIC_FULL_PATH + '/payment',
        }
      }
      await hookSendGateway(data, (response, message) => {
        setLoading(false)
        if (response) {
          authority = message.authority
          router.push('https://www.zarinpal.com/pg/StartPay/' + message.authority)
        } else {
          bkToast('error', message)
        }
      })
    } else if (paymentType.name === 'IDPAY') {
      bkToast("error", "درگاه غیرفعال است.")
    } else if (paymentType.name === 'ZIBAL') {
      data = {
        gateway: paymentType.name,
        action: 'authority',
        params: {
          merchant: paymentType.merchantId,
          // merchant: "zibal",
          description: 'شماره سفارش: ' + trackingCode + ' برای: ' + (user ? user.fullName : "کاربر ناشناس") + ' کدملی: ' + user.codeMeli,
          orderId: trackingCode,
          amount: totalPrice * 10, // Rial To Toman
          ...(user !== null && {mobile: user.mobile}),
          callbackUrl: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/zibal',
        }
      }
      await hookSendGateway(data, (response, message) => {
        setLoading(false)
        if (response) {
          authority = message.trackId.toString()
          router.push('https://gateway.zibal.ir/start/' + message.trackId)
        } else {
          bkToast('error', message.error)
        }
      })
    } else if (paymentType.name === 'AQAYEPARDAKHT') {
      data = {
        gateway: paymentType.name,
        action: 'authority',
        params: {
          pin: paymentType.merchantId,
          // pin: "sandbox",
          amount: totalPrice,
          invoice_id: trackingCode,
          desc: 'شماره سفارش: ' + trackingCode + ' برای: ' + (user ? user.fullName : "کاربر ناشناس") + ' کدملی: ' + user.codeMeli,
          ...(user !== null && {metadata: {mobile: user.mobile, email: user.email}}),
          // callback: process.env.NEXT_PUBLIC_FULL_PATH + '/payment',
          callback: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/aqayepardakht',
        }
      }
      await hookSendGateway(data, (response, message) => {
        setLoading(false)
        if (response) {
          authority = message.transid
          router.push('https://panel.aqayepardakht.ir/startpay/' + message.transid)
          // router.push('https://panel.aqayepardakht.ir/startpay/sandbox/' + message.transid)
        } else {
          bkToast('error', message)
        }
      })
    } else if (paymentType.name === 'UnknownPayment') {
      router.push('/payment')
    } else {
      bkToast('error', 'روش پرداختی تعریف نشده است.')
    }

    dispatch(setOrder({
      trackingCode: trackingCode,
      discountId: discountId,
      discountPrice: discountPrice === 0 ? null : discountPrice,
      totalPrice: initTotalPrice,
      paymentType: paymentType,
      merchantId: paymentType.type !== 'UnknownPayment' ? paymentType.merchantId : null,
      authority: authority,
      cart: cart,
    }))

  }

  const handlerGetReservationUser = async () => {
    let month = dateNowP()
    let epochFirstMonth = month.toFirstOfMonth().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf()
    let epochLastMonth = month.add(1, 'month').toLastOfMonth().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()

    let params = {
      type: "condition",
      condition: {
        where: {
          AND: [
            {userId: user.id},
            {
              status: {
                in: ['REVIEW', 'COMPLETED', 'DONE'],
              },
            },
            {
              dateTimeStartEpoch: {
                gte: epochFirstMonth,
              }
            },
            {
              dateTimeEndEpoch: {
                lte: epochLastMonth,
              }
            }
          ],
        },
      }
    }
    await hookGetReservationWhere(params, (response, message) => {
      if (response) {
        calculatorReservationUser(message, cart)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    if (isLogin) {
      handlerGetReservationUser()
    }
    handlerGetConnections()
  }, [])


  useEffect(() => {
    if (isLogin) {
      handlerGetReservationUser()
    }
    if (discountCode.length > 0 && discountType !== null) {
      calcTotalAndDiscountPrice(discountType, discountAmount)
    } else {
      setTotalPrice(initTotalPrice)
    }
  }, [cart])


  return (
    <>
      <div className="bk-box md:w-10/12">
        <TheHeader/>
        <div className="bk-box-wrapper">
          <h1 className="bk-box-wrapper-title">نهایی سازی وقت رزرو</h1>
          <p className="bk-box-wrapper-description">پیش فاکتور شماره <strong>{trackingCode}</strong> را مشاهده
            مینمایید. لطفا پس از بررسی سفارش خود را تکمیل نمایید.</p>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="fa-sbold-18px text-center text-white bg-gray-700 dark:bg-darkNavy1 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 font-light">#</th>
                <th scope="col" className="px-6 py-3">خدمت</th>
                <th scope="col" className="px-6 py-3">ارائه دهنده</th>
                <th scope="col" className="px-6 py-3">تاریخ</th>
                <th scope="col" className="px-6 py-3">ساعت</th>
                <th scope="col" className="px-6 py-3">هزینه</th>
                <th scope="col" className="px-6 py-3">عملیات</th>
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 text-center fa-sbold-16px">
              {
                cart.length > 0 ?
                  cart?.map((item, index) =>
                    <tr key={index}>
                      <td className="px-6 py-3">{index + 1}</td>
                      <td className="px-6 py-3">{item.service.name}{searchQuery.service.gender !== "NONE" &&
                        <span className="pr-1">({textGenderType(searchQuery.service.gender)})</span>}</td>
                      <td className="px-6 py-3">{item.provider.user.fullName}</td>
                      <td className="px-6 py-3"> {item.date}</td>
                      <td className="px-6 py-3">{item.time[0]} تا {item.time[1]}</td>
                      <td className="px-6 py-3">{numberWithCommas(item.price)} تومان</td>
                      <td className="px-6 py-3"><span onClick={() => dispatch(deleteCart(index))}
                                                      className="text-red-500 cursor-pointer">حذف</span></td>
                    </tr>
                  ) :
                  <tr>
                    <td colSpan={7}>
                      <div className="flex-center-center flex-col gap-4 py-4">
                        <BsCart3 size="44px"/>
                        <p className="text-red-500">سبد خرید شما خالی است.</p>
                      </div>
                    </td>
                  </tr>

              }
              </tbody>
              {
                cart.length > 0 &&
                <tfoot className="text-white text-center fa-sbold-16px">
                <tr>
                  <td colSpan="3"></td>
                  <td colSpan="1" className="bg-gray-500 dark:bg-gray-600 px-6 py-3">
                    <div className="cursor-pointer" onClick={() => setDiscountBox(!discountBox)}>کد
                      تخفیف دارید؟
                    </div>
                  </td>
                  <td colSpan="1" className="bg-gray-600 dark:bg-gray-700 px-6 py-3">
                    <span>مبلغ تخفیف:</span>
                    <span className="mr-2 text-xl">{numberWithCommas(discountPrice)} تومان</span>
                  </td>
                  <td colSpan="2" className="bg-green-700 dark:bg-green-800 px-6 py-3">
                    <span>قیمت نهایی:</span>
                    <span className="mr-2 text-xl">{numberWithCommas(totalPrice)} تومان</span>
                  </td>
                </tr>
                </tfoot>
              }

            </table>
          </div>

          {
            discountBox &&
            <div
              className="flex-center-between flex-col sm:flex-row gap-4 bg-gray-500 dark:bg-gray-700 my-8 px-2 md:px-8 py-3">
              <input onChange={(e) => setDiscountCode(e.target.value)} type="text" defaultValue={discountCode}
                     className="bk-input w-56" placeholder="کد تخفیف را درج نمایید."/>
              <div
                onClick={() => checkDiscount()}
                className={
                  'bk-button border border-white text-white fa-sbold-16px cursor-pointer ' +
                  (loadingDiscount ? 'disable-action' : '')}>
                {loadingDiscount ? (
                  <TheSpinner/>
                ) : (
                  'اعمـال کـد تخفیف'
                )}
              </div>
            </div>
          }

          {/*|| setting.maxReservationDaily === 0*/}
          {
            (cart.length > 0 && conditionReservation !== null) ?
              ((conditionReservation.countOldReservedToday >= setting.maxReservationDaily) && setting.maxReservationDaily !== 0) ?
                <div className="bg-red-900 dark:bg-red-700 my-8 px-2 md:px-8 py-3">
                  <p className="fa-sbold-18px text-white text-center">
                    <span>حداکثر رزرو روزانه</span>
                    <span
                      className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{setting.maxReservationDaily}</span>
                    <span>رزرو در روز است. برای رزرو جدید فردا مراجعه نمایید.</span>
                  </p>
                </div>
                :
                ((conditionReservation.totalReservedMonth > setting.maxReservationMonthly) && setting.maxReservationMonthly !== 0) ?
                  <div className="bg-red-900 dark:bg-red-700 my-8 px-2 md:px-8 py-3">
                    <p className="fa-sbold-18px text-white text-center">
                      <span>سقف رزرو این ماه</span>
                      <span
                        className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{setting.maxReservationMonthly}</span>
                      <span>نوبت در ماه است. شما قبلا</span>
                      <span
                        className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.countOldReservedMonth}</span>
                      <span>نوبت داشته اید و اکنون</span>
                      {
                        conditionReservation.offsetReserveMonth === 0
                          ?
                          <span className="px-1">نمیتوانید برای این ماه رزروی داشته باشید.</span>
                          :
                          <>
                            <span
                              className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.offsetReserveMonth}</span>
                            <span>نوبت دیگر می توانید رزرو داشته باشید.</span>
                            {
                              conditionReservation.offsetReserveMonth < conditionReservation.countCartReservedInMonth ?
                                <>
                                  <span
                                    className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.countCartReservedInMonth - conditionReservation.offsetReserveMonth}</span>
                                  <span>نوبت اضافه از سبد خرید خود حذف نمایید.</span>
                                </>
                                :
                                null
                            }
                          </>
                      }
                    </p>
                  </div> :
                  ((conditionReservation.totalReservedNextMonth > setting.maxReservationMonthly) && setting.maxReservationMonthly !== 0) ?
                    <div className="bg-red-900 dark:bg-red-700 my-8 px-2 md:px-8 py-3">
                      <p className="fa-sbold-18px text-white text-center">
                        <span>سقف رزرو ماه بعد</span>
                        <span
                          className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{setting.maxReservationMonthly}</span>
                        <span>نوبت در ماه است. شما قبلا</span>
                        <span
                          className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.countOldReservedNextMonth}</span>
                        <span>نوبت داشته اید و اکنون</span>
                        {
                          conditionReservation.offsetReserveNextMonth === 0
                            ?
                            <span className="px-1">نمیتوانید برای ماه بعد رزروی داشته باشید.</span>
                            :
                            <>
                            <span
                              className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.offsetReserveNextMonth}</span>
                              <span>نوبت دیگر می توانید رزرو داشته باشید.</span>
                              {
                                conditionReservation.offsetReserveNextMonth < conditionReservation.countCartReservedInNextMonth ?
                                  <>
                                  <span
                                    className="bg-yellow-800 px-3 mx-2 fa-bold-18px rounded-full">{conditionReservation.countCartReservedInNextMonth - conditionReservation.offsetReserveNextMonth}</span>
                                    <span>نوبت اضافه از سبد خرید خود حذف نمایید.</span>
                                  </>
                                  :
                                  null
                              }
                            </>
                        }
                      </p>
                    </div>
                    :
                    <div className="flex-center-between flex-wrap gap-4 bg-green-900 dark:bg-green-700 my-8 px-4 md:px-8 py-3">
                      {
                        searchQuery.service.onlinePayment === false && searchQuery.service.codPayment === false ?
                          <>
                            <div className="mr-2 text-lg font-medium text-white text-right">روش پرداختی برای خدمت تعیین
                              نشده
                              است.
                            </div>
                          </>
                          :
                          <>
                            <div>
                              {
                                searchQuery.service.onlinePayment &&
                                gateways.map((item, index) =>
                                  <div className="flex-center-start py-2" key={index}>
                                    <input
                                      onChange={() => setPaymentType(item)}
                                      id={item.name} type="radio" name="payment"
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-100 dark:border-gray-300"/>
                                    <label htmlFor={item.name} className="mr-2 text-lg font-medium text-white">پرداخت
                                      آنلاین
                                      بانکی (درگاه {textSettingsBankName(item.name)})</label>
                                  </div>
                                )
                              }
                              {
                                searchQuery.service.codPayment &&
                                <div className="flex-center-start py-2">
                                  <input
                                    onChange={() => setPaymentType({
                                      name: "UnknownPayment",
                                      type: "UnknownPayment"
                                    })
                                    }
                                    id="codPayment" type="radio" name="payment"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-100 dark:border-gray-300"/>
                                  <label htmlFor="codPayment" className="mr-2 text-lg font-medium text-white">پرداخت در
                                    محل</label>
                                </div>
                              }

                            </div>
                            <div onClick={() => checkReservation()}
                                 className={
                                   'bk-button p-4 max-sm:mx-auto border border-white text-white fa-sbold-18px cursor-pointer ' +
                                   (loading ? 'disable-action' : '')}>
                              {
                                loading ? (
                                  <TheSpinner/>
                                ) : (
                                  'تکمیل سفارش'
                                )
                              }
                            </div>
                          </>
                      }

                    </div>
              :
              <div className="flex-center-center gap-x-4 mt-8">
                <Link
                  href="/"
                  className="bk-button bg-gray-500 dark:bg-gray-700 w-full sm:w-44 fa-sbold-18px">دریافت نوبت
                  جدید</Link>
              </div>
          }

        </div>
        <TheFooter/>
      </div>
      {
        setting.guestReservation &&
        <Popup
          className="bg-modal"
          contentStyle={{width: '100%'}}
          modal
          open={modalGuest}
          nested
          onClose={() => setModalGuest(false)}
        >
          {close => <ModalFastRegister checkDraft={checkDraft} close={close}/>}
        </Popup>
      }
    </>
  )
}