import TheHeader from "@/components/front-end/theme1/layout/TheHeader";
import TheFooter from "@/components/front-end/theme1/layout/TheFooter";
import {useEffect, useState} from "react";
import {hookSendGateway} from "@/hooks/user/hookGateway";
import {bkToast} from "@/libs/utility";
import Link from "next/link";
import {hookAddReservation} from "@/hooks/user/hookReservation";
import {hookGetOrder} from "@/hooks/user/hookOrder";
import TheSpinner from "@/components/layout/TheSpinner";
import {setCart} from "@/store/slice/user";
import useHook from "@/hooks/controller/useHook";

// {query}
export default function ThePaymentUi() {
    const {dispatch, router, searchQuery, order, user, setting} = useHook()

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
            trackingCode: order.trackingCode
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

    const callbackChecker = async () => {
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
                    }
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
                    }
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
            console.log("IDPAY")
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
                    }
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
                status: setting.automaticConfirmation ? "COMPLETED" : "REVIEW",

                paymentType: order.paymentType.type,
                ...data
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
                <TheHeader/>
                <h1 className="text-xl font-semibold mb-4 text-center">نتیجه عملیات بانکی</h1>

                {
                    loading ?
                        statusPayment ?
                            <>
                                <p className="text-lg mb-4 text-center">عملیات بانکی با موفقیت انجام شد.</p>
                                <div className="my-8 flex-center-center flex-col">
                                    <p className="text-lg mb-4 text-center">کد پیگیری رزرو خود را یادداشت نمایید:</p>
                                    <p
                                        className="bg-white rounded-md text-5xl font-bold leading-normal font-poppins text-green-700 dark:text-green-600 mb-4 text-center px-8 border border-green-700">{order.trackingCode}</p>
                                </div>
                                {
                                    paymentId &&
                                    <div className="my-8 flex-center-center flex-col">
                                        <p className="text-lg mb-4 text-center">شماره تراکنش بانکی</p>
                                        <p
                                            className="bg-white rounded-md text-5xl font-bold leading-normal font-poppins text-green-700 dark:text-green-600 mb-4 text-center px-8 border border-green-700">{paymentId}</p>
                                    </div>
                                }
                                {
                                    !setting.automaticConfirmation &&
                                    <p
                                        className="text-lg bg-white dark:bg-darkNavy1 opacity-80 rounded-md p-2 text-red-500 mb-4 text-center">رزرو
                                        شما ثبت شد و در وضعیت <strong>در صف بررسی</strong> قرار گرفت، پس از تایید مدیر سیستم، پیامک تاییدیه
                                        برای شما ارسال می شود.</p>
                                }
                                {
                                    searchQuery.service.descriptionAfterPurchase !== null && searchQuery.service.descriptionAfterPurchase.length > 0 &&
                                    <div className="bg-white bg-opacity-50 dark:bg-opacity-5 p-4 rounded-md">
                                        <h2 className="text-xl font-semibold mb-4 text-center">دستورالعمل</h2>
                                        <p className="text-lg text-center leading-10 mb-0">
                                            {searchQuery.service.descriptionAfterPurchase}
                                        </p>
                                    </div>
                                }
                            </>
                            :
                            <>
                                <p className="text-lg mb-4 text-center">عملیات بانکی با موفقیت انجام نشد.</p>
                                <div className="flex-center-center flex-col my-8">
                                    <p className="text-xl font-semibold mb-4 text-center">تلاش مجدد برای پرداخت</p>
                                    {
                                        paymentId &&
                                        <p className="text-lg mb-4 text-center">
                                            <span>شناسه: </span>
                                            <span dir="ltr">{transferId}</span>
                                        </p>
                                    }
                                    <Link href="/checkout"
                                          className="bk-button fa-sbold-18px bg-green-700 dark:bg-primary-900 cursor-pointer">
                                        پرداخت مجدد
                                    </Link>
                                </div>
                            </>
                        :
                        <TheSpinner/>
                }

                <TheFooter/>
            </div>
        </>
    )
}