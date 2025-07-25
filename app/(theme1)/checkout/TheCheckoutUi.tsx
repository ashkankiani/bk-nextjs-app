'use client'
import { useEffect, useState } from 'react'
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import { numberWithCommas } from '@/libs/convertor'
import { bkToast, textGenderType } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { deleteCart } from '@/store/slice/user'
import useController from '@/hooks/controller/useController'
import { BsCart3 } from 'react-icons/bs'
import Link from 'next/link'
import Popup from 'reactjs-popup'
import useHook from '@/hooks/controller/useHook'
import ModalFastRegister from '@/app/(theme1)/checkout/component/ModalFastRegister'
import { useAddReservations, useGetReservationsByUserId } from '@/hooks/user/useReservation'
import { TypeBankName, TypeDiscountsType, TypeGender, TypeOrderMethod } from '@/types/typeConfig'
import { useCheckDiscount } from '@/hooks/user/useDiscount'
import { TypeApiDiscount, TypeApiOrder } from '@/types/typeApiEntity'
import { TypeApiAddOrderReq, TypeApiAddReservationsReq } from '@/types/typeApiUser'
import { useCreateAuthority, useGetGateways } from '@/hooks/user/useGateway'
import { useAddOrder, useUpdateOrder } from '@/hooks/user/useOrder'

export type TypePaymentType = {
  type: 'OnlinePayment' | 'UnknownPayment'
  key: TypeBankName | TypeOrderMethod
  title: string
}
export default function TheCheckoutUi() {
  const { dispatch, router, cart, searchQuery, isLogin, user, setting } = useHook()

  const { calculatorReservationUser, conditionReservation } = useController()

  const initTotalPrice = cart.reduce((total, obj) => total + obj.price, 0)

  const [discountCode, setDiscountCode] = useState('')
  const [discountPrice, setDiscountPrice] = useState(0)

  const [activeDiscount, setActiveDiscount] = useState<TypeApiDiscount | null>(null)
  const [discountBox, setDiscountBox] = useState(false)

  const [totalPrice, setTotalPrice] = useState(initTotalPrice)
  const [paymentType, setPaymentType] = useState<TypePaymentType | null>(null)

  const [modalGuest, setModalGuest] = useState(false)

  const { mutateAsync: mutateAsyncCheckDiscount, isPending: isPendingCheckDiscount } =
    useCheckDiscount()

  const handlerSearchDiscount = async () => {
    if (discountCode === '' || discountCode.length === 0) {
      bkToast('error', 'کد تخفیف را وارد کنید.')
      return
    }

    await mutateAsyncCheckDiscount({ code: discountCode })
      .then(res => {
        setActiveDiscount(res)
        setDiscountBox(false)

        // setDiscountId(res.id)
        // setDiscountType(res.type)
        // setDiscountAmount(res.amount)

        calcTotalAndDiscountPrice(res.type, res.amount)
        bkToast('success', 'کد تخفیف ' + res.title + ' اعمال شد.')
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  const calcTotalAndDiscountPrice = (type: TypeDiscountsType, amount: number) => {
    if (type === 'CONSTANT') {
      setDiscountPrice(amount)
      setTotalPrice(initTotalPrice - amount)
    }
    if (type === 'PERCENT') {
      const calc = (amount * initTotalPrice) / 100
      setDiscountPrice(calc)
      setTotalPrice(initTotalPrice - calc)
    }
  }

  const checkReservation = async () => {
    if (paymentType === null) {
      bkToast('error', 'روش پرداختی را انتخاب نمایید.')
      return
    }
    if (isLogin && user) {
      if (searchQuery?.service.gender !== 'NONE') {
        if (user.gender === 'NONE') {
          bkToast('error', 'لطفا ابتدا در پروفایل خود جنسیت خود را انتخاب کنید.')
        } else if (user.gender !== searchQuery?.service.gender) {
          bkToast(
            'error',
            'این نوبت مخصوص ' +
              textGenderType(searchQuery?.service.gender as TypeGender) +
              ' میباشد.'
          )
        }
        return false
      }
      await addOrder()
    } else {
      if (setting.guestReservation) {
        setModalGuest(true)
      } else {
        bkToast('error', 'برای رزرو نوبت باید در سایت ثبت نام/ورود نمایید.')
      }
    }
  }

  const { mutateAsync: mutateAsyncAddOrder, isPending: isPendingAddOrder } = useAddOrder()

  const addOrder = async () => {
    const params: TypeApiAddOrderReq = {
      userId: user.id,
      discountId: activeDiscount?.id ? activeDiscount?.id : null,
      price: initTotalPrice,
      discountPrice: discountPrice,
      totalPrice: totalPrice,
    }
    await mutateAsyncAddOrder(params)
      .then(async res => {
        await addReservations(res)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  const { mutateAsync: mutateAsyncAddReservations, isPending: isPendingAddReservations } =
    useAddReservations()

  const { mutateAsync: mutateAsyncCreateAuthority, isPending: isPendingCreateAuthority } =
    useCreateAuthority()

  const addReservations = async (order: TypeApiOrder) => {
    const allPreReserve: TypeApiAddReservationsReq[] = []
    for (let i = 0; i < cart.length; i++) {
      const params: TypeApiAddReservationsReq = {
        orderId: order.trackingCode,
        serviceId: cart[i].service.id,
        providerId: cart[i].provider.id,
        userId: user.id, // userGuestId
        date: cart[i].date,
        time: cart[i].time,
      }
      allPreReserve.push(params)
    }

    await mutateAsyncAddReservations(allPreReserve)
      .then(async res => {
        if (res.status) {
          await goGateway(order)
        } else {
          bkToast('error', res.message)
        }
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  const { mutateAsync: mutateAsyncUpdateOrder, isPending: isPendingUpdateOrder } = useUpdateOrder()

  const goGateway = async (order: TypeApiOrder) => {
    if (!paymentType || !paymentType?.key) {
      // hint: باید بهش بگم ...
      bkToast('error', 'روش پرداخت آنلاین وجود ندارد.')
      return
    }
    // else if (paymentType?.type === 'UnknownPayment') {
    //   await mutateAsyncUpdateOrder({ trackingCode: order.trackingCode })
    //     .then(res => {
    //       // bkToast('success', res.Message)
    //       router.push(
    //         `/payment?${Qs.stringify(res)}`
    //       )
    //     })
    //     .catch(errors => {
    //       bkToast('error', errors.Reason)
    //     })
    // } else {
    const params = {
      type: paymentType?.type as 'OnlinePayment' | 'UnknownPayment',
      gateway: paymentType?.key as TypeBankName | 'COD',
      price: totalPrice,
      userId: user.id,
      orderId: order.trackingCode,
    }

    await mutateAsyncCreateAuthority(params)
      .then(res => {
        router.push(res.url)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })

    // }
  }

  const isCheckReservationsByUserId = isLogin && !!user

  const {
    data: dataGetReservationsByUserId,
    // isLoading: isLoadingGetReservationsByUserId,
    isFetched: isFetchedGetReservationsByUserId,
  } = useGetReservationsByUserId(
    {
      userId: user?.id ?? 0,
    },
    {
      enabled: isCheckReservationsByUserId,
    }
  )

  const { data: dataGateways, isLoading: isLoadingGateways } = useGetGateways({
    enabled: isFetchedGetReservationsByUserId,
  })

  useEffect(() => {
    if (isFetchedGetReservationsByUserId && dataGetReservationsByUserId) {
      calculatorReservationUser(dataGetReservationsByUserId, cart)
    }
  }, [isFetchedGetReservationsByUserId])

  useEffect(() => {
    if (discountCode.length > 0 && activeDiscount && activeDiscount?.type !== null) {
      calcTotalAndDiscountPrice(activeDiscount?.type, activeDiscount?.amount)
    } else {
      setTotalPrice(initTotalPrice)
    }
  }, [cart])

  if (
    !searchQuery ||
    !searchQuery?.service?.id ||
    !searchQuery?.provider?.id ||
    !searchQuery?.startDate ||
    !searchQuery?.endDate
  ) {
    router.push('/')
  }

  return (
    searchQuery && (
      <>
        <div className="bk-box md:w-10/12">
          <TheHeader />
          <div className="bk-box-wrapper">
            <h1 className="bk-box-wrapper-title">نهایی سازی وقت رزرو</h1>
            <p className="bk-box-wrapper-description">
              پس از بررسی پیش فاکتور سفارش خود را تکمیل نمایید.
            </p>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="fa-sbold-18px bg-gray-700 text-center text-white dark:bg-darkNavy1 dark:text-gray-400">
                  <tr>
                    {['#', 'خدمت', 'ارائه دهنده', 'تاریخ', 'ساعت', 'هزینه', 'عملیات'].map(item => (
                      <th key={item} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="fa-sbold-16px bg-white text-center dark:bg-gray-800">
                  {cart.length > 0 ? (
                    cart?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">
                          {item.service.name}
                          {searchQuery.service.gender !== 'NONE' && (
                            <span className="pr-1">
                              ({textGenderType(searchQuery.service.gender)})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">{item.provider.user.fullName}</td>
                        <td className="px-6 py-3"> {item.date}</td>
                        <td className="px-6 py-3">
                          {item.time[0]} تا {item.time[1]}
                        </td>
                        <td className="px-6 py-3">{numberWithCommas(item.price)} تومان</td>
                        <td className="px-6 py-3">
                          <span
                            onClick={() => dispatch(deleteCart(index))}
                            className="cursor-pointer text-red-500"
                          >
                            حذف
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex-center-center flex-col gap-4 py-4">
                          <BsCart3 size="44px" />
                          <p className="text-red-500">سبد خرید شما خالی است.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {cart.length > 0 && (
                  <tfoot className="fa-sbold-16px text-center text-white">
                    <tr>
                      <td colSpan={3}></td>
                      <td colSpan={1} className="bg-gray-500 px-6 py-3 dark:bg-gray-600">
                        <div
                          className="cursor-pointer"
                          onClick={() => setDiscountBox(!discountBox)}
                        >
                          کد تخفیف دارید؟
                        </div>
                      </td>
                      <td colSpan={1} className="bg-gray-600 px-6 py-3 dark:bg-gray-700">
                        <span>مبلغ تخفیف:</span>
                        <span className="mr-2 text-xl">
                          {numberWithCommas(discountPrice)} تومان
                        </span>
                      </td>
                      <td colSpan={2} className="bg-green-700 px-6 py-3 dark:bg-green-800">
                        <span>قیمت نهایی:</span>
                        <span className="mr-2 text-xl">{numberWithCommas(totalPrice)} تومان</span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/*==== کد تخفیف ====*/}
            {discountBox && (
              <div className="flex-center-between my-8 flex-col gap-4 bg-gray-500 px-2 py-3 dark:bg-gray-700 sm:flex-row md:px-8">
                <input
                  onChange={e => setDiscountCode(e.target.value)}
                  type="text"
                  defaultValue={discountCode}
                  className="bk-input w-56"
                  placeholder="کد تخفیف را درج نمایید."
                />
                <div
                  onClick={() => handlerSearchDiscount()}
                  className={
                    'bk-button fa-sbold-16px cursor-pointer border border-white text-white ' +
                    (isPendingCheckDiscount ? 'disable-action' : '')
                  }
                >
                  {isPendingCheckDiscount ? <TheSpinner /> : 'اعمـال کـد تخفیف'}
                </div>
              </div>
            )}

            {/*==== مدیریت تعداد رزروها برای کاربر ====*/}
            {/*|| setting.maxReservationDaily === 0*/}
            {cart.length > 0 && isCheckReservationsByUserId ? (
              conditionReservation.countOldReservedToday >= setting.maxReservationDaily &&
              setting.maxReservationDaily !== 0 ? (
                <div className="my-8 bg-red-900 px-2 py-3 dark:bg-red-700 md:px-8">
                  <p className="fa-sbold-18px text-center text-white">
                    <span>حداکثر رزرو روزانه</span>
                    <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                      {setting.maxReservationDaily}
                    </span>
                    <span>رزرو در روز است. برای رزرو جدید فردا مراجعه نمایید.</span>
                  </p>
                </div>
              ) : conditionReservation.totalReservedMonth > setting.maxReservationMonthly &&
                setting.maxReservationMonthly !== 0 ? (
                <div className="my-8 bg-red-900 px-2 py-3 dark:bg-red-700 md:px-8">
                  <p className="fa-sbold-18px text-center text-white">
                    <span>سقف رزرو این ماه</span>
                    <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                      {setting.maxReservationMonthly}
                    </span>
                    <span>نوبت در ماه است. شما قبلا</span>
                    <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                      {conditionReservation.countOldReservedMonth}
                    </span>
                    <span>نوبت داشته اید و اکنون</span>
                    {conditionReservation.offsetReserveMonth === 0 ? (
                      <span className="px-1">نمیتوانید برای این ماه رزروی داشته باشید.</span>
                    ) : (
                      <>
                        <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                          {conditionReservation.offsetReserveMonth}
                        </span>
                        <span>نوبت دیگر می توانید رزرو داشته باشید.</span>
                        {conditionReservation.offsetReserveMonth <
                        conditionReservation.countCartReservedInMonth ? (
                          <>
                            <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                              {conditionReservation.countCartReservedInMonth -
                                conditionReservation.offsetReserveMonth}
                            </span>
                            <span>نوبت اضافه از سبد خرید خود حذف نمایید.</span>
                          </>
                        ) : null}
                      </>
                    )}
                  </p>
                </div>
              ) : conditionReservation.totalReservedNextMonth > setting.maxReservationMonthly &&
                setting.maxReservationMonthly !== 0 ? (
                <div className="my-8 bg-red-900 px-2 py-3 dark:bg-red-700 md:px-8">
                  <p className="fa-sbold-18px text-center text-white">
                    <span>سقف رزرو ماه بعد</span>
                    <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                      {setting.maxReservationMonthly}
                    </span>
                    <span>نوبت در ماه است. شما قبلا</span>
                    <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                      {conditionReservation.countOldReservedNextMonth}
                    </span>
                    <span>نوبت داشته اید و اکنون</span>
                    {conditionReservation.offsetReserveNextMonth === 0 ? (
                      <span className="px-1">نمیتوانید برای ماه بعد رزروی داشته باشید.</span>
                    ) : (
                      <>
                        <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                          {conditionReservation.offsetReserveNextMonth}
                        </span>
                        <span>نوبت دیگر می توانید رزرو داشته باشید.</span>
                        {conditionReservation.offsetReserveNextMonth <
                        conditionReservation.countCartReservedInNextMonth ? (
                          <>
                            <span className="fa-bold-18px mx-2 rounded-full bg-yellow-800 px-3">
                              {conditionReservation.countCartReservedInNextMonth -
                                conditionReservation.offsetReserveNextMonth}
                            </span>
                            <span>نوبت اضافه از سبد خرید خود حذف نمایید.</span>
                          </>
                        ) : null}
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex-center-between my-8 flex-wrap gap-4 bg-green-900 px-4 py-3 dark:bg-green-700 md:px-8">
                  {searchQuery.service.onlinePayment === false &&
                  searchQuery.service.codPayment === false ? (
                    <>
                      <div className="mr-2 text-right text-lg font-medium text-white">
                        روش پرداختی برای خدمت تعیین نشده است.
                      </div>
                    </>
                  ) : (
                    <>
                      {/*==== روش های پرداخت آنلاین یا در محل ====*/}
                      <div>
                        {searchQuery.service.onlinePayment && isLoadingGateways ? (
                          <TheSpinner />
                        ) : (
                          dataGateways &&
                          dataGateways.map((item, index) => (
                            <div className="flex-center-start cursor-pointer py-2" key={index}>
                              <input
                                onChange={() => setPaymentType(item)}
                                id={item.key}
                                type="radio"
                                name="payment"
                                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-300 dark:bg-gray-100 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                              />
                              <label
                                htmlFor={item.key}
                                className="mr-2 text-lg font-medium text-white"
                              >
                                پرداخت آنلاین بانکی (درگاه {item.title})
                              </label>
                            </div>
                          ))
                        )}
                        {searchQuery.service.codPayment && (
                          <div className="flex-center-start cursor-pointer py-2">
                            <input
                              onChange={() =>
                                setPaymentType({
                                  type: 'UnknownPayment',
                                  key: 'COD',
                                  title: 'پرداخت در محل',
                                })
                              }
                              id="codPayment"
                              type="radio"
                              name="payment"
                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-300 dark:bg-gray-100 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                              htmlFor="codPayment"
                              className="mr-2 text-lg font-medium text-white"
                            >
                              پرداخت در محل
                            </label>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => checkReservation()}
                        className={
                          'bk-button fa-sbold-18px cursor-pointer border border-white p-4 text-white max-sm:mx-auto ' +
                          (isPendingCreateAuthority ||
                          isPendingAddOrder ||
                          isPendingAddReservations ||
                          isPendingUpdateOrder
                            ? 'disable-action'
                            : '')
                        }
                      >
                        {isPendingCreateAuthority ||
                        isPendingAddOrder ||
                        isPendingAddReservations ||
                        isPendingUpdateOrder ? (
                          <TheSpinner />
                        ) : (
                          'تکمیل سفارش'
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="flex-center-center mt-8 gap-x-4">
                <Link
                  href="/"
                  className="bk-button fa-sbold-18px w-full bg-gray-500 dark:bg-gray-700 sm:w-44"
                >
                  دریافت نوبت جدید
                </Link>
              </div>
            )}
          </div>
          <TheFooter />
        </div>
        {setting.guestReservation && (
          <Popup
            className="bg-modal"
            contentStyle={{ width: '100%' }}
            modal
            open={modalGuest}
            nested
            onClose={() => setModalGuest(false)}
          >
            {(close: () => void) => (
              <ModalFastRegister checkDraft={addReservations} close={close} />
            )}
          </Popup>
        )}
      </>
    )
  )
}
