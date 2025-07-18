"use effect"
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import { useEffect, useState } from 'react'
import { hookSendGateway } from '@/hooks/user/hookGateway'
import { bkToast } from '@/libs/utility'
import Link from 'next/link'
import { hookAddReservation } from '@/hooks/user/hookReservation'
import { hookGetOrder } from '@/hooks/user/hookOrder'
import TheSpinner from '@/components/layout/TheSpinner'
import { setCart } from '@/store/slice/user'
import useHook from '@/hooks/controller/useHook'
import {useParams} from "next/navigation";
import {useVerifyPayment} from "@/hooks/user/useGateway";

// {query}
export default function ThePaymentUi() {

  const params = useParams()
  const status: boolean = params.status
  const authority: string = params.authority

  const { dispatch, router, searchQuery, order, user, setting } = useHook()

  const [loading, setLoading] = useState(false)

  const [checkGateway, setCheckGateway] = useState(false)
  const [statusPayment, setStatusPayment] = useState(false)

  const [paymentId, setPaymentId] = useState(false)
  const [transferId, setTransferId] = useState(false)


  useEffect(() => {
    handlerGetOrder()
  }, [])

  const handlerGetOrder = async () => {
    let params = {
      trackingCode: order.trackingCode,
    }
    if (order.trackingCode === undefined) {
      bkToast('error', 'درخواست شما نامعتبر است.')
      // router.push('/account/reservation')
      return
    }
    await hookGetOrder(params, async (response, message) => {
      if (response) {
        if (message.length === 0) {
          await callbackChecker()
        } else {
          bkToast('error', 'رزرو ثبت شده است. کد پیگیری را یادداشت کنید.')
          // router.push('/account/reservation')
        }
      } else {
        bkToast('error', message)
      }
    })
  }
  const {mutateAsync: mutateAsyncVerifyPayment, isPending:isPendingVerifyPayment } = useVerifyPayment()

  const callbackChecker = async () => {

    const params = {
      authority: authority,
      authority: authority,
      price: 0
    }
    await mutateAsyncVerifyPayment(params)
        .then(async () => {


          await goGateway()
        })
        .catch(errors => {
          bkToast('error', errors.Reason)
        })



    if (order.paymentType.name === 'ZARINPAL') {
      let Authority = query.Authority
      let Status = query.Status
      setTransferId(Authority)

      if (Authority === order.authority && Status === 'OK' && !checkGateway) {
        let data = {
          gateway: 'ZARINPAL',
          action: 'verify',
          params: {
            merchant_id: order.paymentType.merchantId,
            amount: order.totalPrice,
            authority: order.authority,
          },
        }
        await hookSendGateway(data, async (response, message) => {
          setCheckGateway(true)
          if (response) {
            setStatusPayment(true)
            setPaymentId(message.ref_id)
            let params = {
              shouldExecuteTransaction: true,
              bankName: order.paymentType.name,
              trackId: message.ref_id.toString(),
              amount: order.totalPrice,
              cardNumber: message.card_pan,
              authority: order.authority,
            }
            await itemAddReservation(params)
          } else {
            bkToast('error', message.error)
          }
        })
      } else {
        bkToast('error', 'پرداخت شما ناموفق یا اشتباه است.')
        setStatusPayment(false)
      }
    } else if (order.paymentType.name === 'ZIBAL') {
      let Authority = query.trackId
      let Status = query.success
      setTransferId(Authority)

      if (Authority === order.authority && Status === '1' && !checkGateway) {
        let data = {
          gateway: 'ZIBAL',
          action: 'verify',
          params: {
            merchant: order.paymentType.merchantId,
            // merchant: "zibal",
            trackId: parseInt(order.authority),
          },
        }
        await hookSendGateway(data, async (response, message) => {
          setCheckGateway(true)
          if (response) {
            setStatusPayment(true)
            setPaymentId(Authority)
            let params = {
              shouldExecuteTransaction: true,
              bankName: order.paymentType.name,
              trackId: order.authority,
              amount: order.totalPrice,
              cardNumber: message.cardNumber,
              authority: message.refNumber.toString(), // or order.authority
            }
            await itemAddReservation(params)
          } else {
            bkToast('error', message.error)
          }
        })
      } else {
        bkToast('error', 'پرداخت شما ناموفق یا اشتباه است.')
        setStatusPayment(false)
      }
    } else if (order.paymentType.name === 'IDPAY') {
      console.log('IDPAY')
    } else if (order.paymentType.name === 'AQAYEPARDAKHT') {
      let Authority = query.transid
      let Status = query.status
      let TrackingNumber = query.tracking_number.toString()
      let CardNumber = query.cardnumber
      setTransferId(Authority)

      if (Authority === order.authority && Status === '1' && !checkGateway) {
        let data = {
          gateway: 'AQAYEPARDAKHT',
          action: 'verify',
          params: {
            pin: order.paymentType.merchantId,
            amount: order.totalPrice,
            transid: order.authority,
          },
        }
        await hookSendGateway(data, async (response, message) => {
          setCheckGateway(true)
          if (response) {
            setStatusPayment(true)
            setPaymentId(TrackingNumber)
            let params = {
              shouldExecuteTransaction: true,
              bankName: order.paymentType.name,
              trackId: TrackingNumber,
              amount: order.totalPrice,
              cardNumber: CardNumber,
              authority: order.authority, // or message.transid
            }
            await itemAddReservation(params)
          } else {
            // bkToast('error', 'تراکنش تایید نشد.')
            bkToast('error', message.error)
          }
        })
      } else {
        bkToast('error', 'پرداخت شما ناموفق یا اشتباه است.')
        setStatusPayment(false)
      }
    } else if (order.paymentType.name === 'UnknownPayment') {
      setStatusPayment(true)
      let params = {
        shouldExecuteTransaction: false,
      }
      await itemAddReservation(params)
    } else {
      setStatusPayment(false)
      bkToast('error', 'روش پرداختی تعریف نشده است.')
    }

    dispatch(setCart([]))
    setLoading(true)
  }
  const itemAddReservation = async data => {
    for (let i = 0; i < order.cart.length; i++) {
      let params = {
        trackingCode: order.trackingCode,
        user: user,
        service: searchQuery.service,
        provider: searchQuery.provider,
        discountId: order.discountId,
        discountPrice: order.discountPrice,
        totalPrice: order.totalPrice,

        date: order.cart[i].date,
        time: order.cart[i].time.join('-'),
        price: order.cart[i].price,
        status: setting.automaticConfirmation ? 'COMPLETED' : 'REVIEW',

        paymentType: order.paymentType.type,
        ...data,
      }
      // generateTrackingCode++;
      await addReservation(params)
    }
  }
  const addReservation = async data => {
    await hookAddReservation(data, (response, message) => {
      if (response) {
        bkToast('success', 'رزرو با موفقیت ثبت شد.')
      } else {
        bkToast('error', message)
      }
    })
  }

  return (
    <>
      <div className="bk-box md:w-10/12">
        <TheHeader />
        <h1 className="mb-4 text-center text-xl font-semibold">نتیجه عملیات بانکی</h1>

        {loading ? (
          statusPayment ? (
            <>
              <p className="mb-4 text-center text-lg">عملیات بانکی با موفقیت انجام شد.</p>
              <div className="flex-center-center my-8 flex-col">
                <p className="mb-4 text-center text-lg">کد پیگیری رزرو خود را یادداشت نمایید:</p>
                <p className="mb-4 rounded-md border border-green-700 bg-white px-8 text-center font-poppins text-5xl font-bold leading-normal text-green-700 dark:text-green-600">
                  {order.trackingCode}
                </p>
              </div>
              {paymentId && (
                <div className="flex-center-center my-8 flex-col">
                  <p className="mb-4 text-center text-lg">شماره تراکنش بانکی</p>
                  <p className="mb-4 rounded-md border border-green-700 bg-white px-8 text-center font-poppins text-5xl font-bold leading-normal text-green-700 dark:text-green-600">
                    {paymentId}
                  </p>
                </div>
              )}
              {!setting.automaticConfirmation && (
                <p className="mb-4 rounded-md bg-white p-2 text-center text-lg text-red-500 opacity-80 dark:bg-darkNavy1">
                  رزرو شما ثبت شد و در وضعیت <strong>در صف بررسی</strong> قرار گرفت، پس از تایید
                  مدیر سیستم، پیامک تاییدیه برای شما ارسال می شود.
                </p>
              )}
              {searchQuery.service.descriptionAfterPurchase !== null &&
                searchQuery.service.descriptionAfterPurchase.length > 0 && (
                  <div className="rounded-md bg-white bg-opacity-50 p-4 dark:bg-opacity-5">
                    <h2 className="mb-4 text-center text-xl font-semibold">دستورالعمل</h2>
                    <p className="mb-0 text-center text-lg leading-10">
                      {searchQuery.service.descriptionAfterPurchase}
                    </p>
                  </div>
                )}
            </>
          ) : (
            <>
              <p className="mb-4 text-center text-lg">عملیات بانکی با موفقیت انجام نشد.</p>
              <div className="flex-center-center my-8 flex-col">
                <p className="mb-4 text-center text-xl font-semibold">تلاش مجدد برای پرداخت</p>
                {paymentId && (
                  <p className="mb-4 text-center text-lg">
                    <span>شناسه: </span>
                    <span dir="ltr">{transferId}</span>
                  </p>
                )}
                <Link
                  href="/checkout"
                  className="bk-button fa-sbold-18px cursor-pointer bg-green-700 dark:bg-primary-900"
                >
                  پرداخت مجدد
                </Link>
              </div>
            </>
          )
        ) : (
          <TheSpinner />
        )}

        <TheFooter />
      </div>
    </>
  )
}
