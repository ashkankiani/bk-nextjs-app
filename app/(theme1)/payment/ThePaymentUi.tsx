'use client'
import TheHeader from '@/components/front-end/theme1/layout/TheHeader'
import TheFooter from '@/components/front-end/theme1/layout/TheFooter'
import { useEffect, useState } from 'react'
import {bkToast, textReservationsStatus} from '@/libs/utility'
import Link from 'next/link'
import TheSpinner from '@/components/layout/TheSpinner'
import { useSearchParams } from 'next/navigation'
import { useVerifyPayment } from '@/hooks/user/useGateway'
import { TYPE_ONLINE_PAYMENT_STATUS } from '@/libs/constant'
import { useGetOrderByBankTransactionCode } from '@/hooks/user/useOrder'
import { TypeApiVerifyPaymentRes } from '@/types/typeApiUser'

export default function ThePaymentUi() {
  const searchParams = useSearchParams()

  const Status: string = searchParams.get('Status')
  const Authority: string = searchParams.get('Authority')

  const [message, setMessage] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [order, setOrder] = useState<TypeApiVerifyPaymentRes | null>(null)
  // const [checkGateway, setCheckGateway] = useState(false)
  // const [statusPayment, setStatusPayment] = useState(false)

  // const [paymentId, setPaymentId] = useState(false)
  // const [transferId, setTransferId] = useState(false)

  const {
    mutateAsync: mutateAsyncOrderByBankTransactionCode,
    isPending: isPendingOrderByBankTransactionCode,
  } = useGetOrderByBankTransactionCode()

  const { mutateAsync: mutateAsyncVerifyPayment, isPending: isPendingVerifyPayment } =
    useVerifyPayment()

  // const {data: dataOrder , isRefetching: isRefetchingOrder, refetch: refetchOrder} = useShowOrder(order?.id , {
  //     enabled: false,
  // })

  useEffect(() => {
    handlerGetOrder()
  }, [])

  const handlerGetOrder = async () => {
    if (!Status || !Authority) {
      setMessage('درخواست شما نامعتبر است.')
      return
    }

    if (Status === TYPE_ONLINE_PAYMENT_STATUS.UN_PAID) {
      setMessage('پرداخت شما نامعتبر است.')
    }

    if (Status === TYPE_ONLINE_PAYMENT_STATUS.PAID) {
      await mutateAsyncOrderByBankTransactionCode({ id: Authority })
        .then(async order => {
          const params = {
            authority: Authority,
            trackingCode: order.trackingCode,
            bankName: order.bankName,
            price: order.price,
            userId: order.userId,
          }

          await mutateAsyncVerifyPayment(params)
            .then(res => {
              setOrder(res)
            })
            .catch(errors => {
              setHasError(true)
              setMessage(errors.Reason)
              bkToast('error', errors.Reason)
            })
        })
        .catch(errors => {
          setHasError(true)
          setMessage(errors.Reason)
          bkToast('error', errors.Reason)
        })
    }

    //       bkToast('error', 'رزرو ثبت شده است. کد پیگیری را یادداشت کنید.')
    //       // router.push('/account/reservation')
  }

  return (
    <>
      <div className="bk-box md:w-10/12">
        <TheHeader />
        <h1 className="mb-4 text-center text-xl font-semibold">نتیجه عملیات بانکی</h1>

        {!Status ||
          (!Authority && (
            <div>
              <p className="mb-4 text-center text-lg">{message}</p>
              <Link
                href="/"
                className="bk-button fa-sbold-18px cursor-pointer bg-green-700 dark:bg-primary-900"
              >
                بازگشت
              </Link>
            </div>
          ))}

        {Status === TYPE_ONLINE_PAYMENT_STATUS.UN_PAID && (
          <div>
            <p className="mb-4 text-center text-lg">{message}</p>
            <Link
              href="/"
              className="bk-button fa-sbold-18px cursor-pointer bg-green-700 dark:bg-primary-900"
            >
              بازگشت
            </Link>
          </div>
        )}

        {Status === TYPE_ONLINE_PAYMENT_STATUS.PAID && isPendingOrderByBankTransactionCode && (
          <>
            <p className="mb-4 text-center text-lg">در حال پردازش رزرو...</p>
            <TheSpinner />
          </>
        )}
        {Status === TYPE_ONLINE_PAYMENT_STATUS.PAID && hasError && (
          <>
            <p className="mb-4 text-center text-lg">{message}</p>
          </>
        )}

        {Status === TYPE_ONLINE_PAYMENT_STATUS.PAID && isPendingVerifyPayment ? (
          <>
            <p className="mb-4 text-center text-lg">در حال تایید پرداخت و صدور رزرو...</p>
            <TheSpinner />
          </>
        ) : (
          order &&
          !isPendingOrderByBankTransactionCode &&
          !isPendingVerifyPayment && (
            <>
              <p className="mb-4 text-center text-lg">عملیات بانکی با موفقیت انجام شد.</p>
              <div className="flex-center-center my-8 flex-col">
                <p className="mb-4 text-center text-lg">کد پیگیری رزرو خود را یادداشت نمایید:</p>
                <p className="mb-4 rounded-md border border-green-700 bg-white px-8 text-center font-poppins text-5xl font-bold leading-normal text-green-700 dark:text-green-600">
                  {order.order.trackingCode}
                </p>
              </div>
              {/*<div className="flex-center-center my-8 flex-col">*/}
              {/*  <p className="mb-4 text-center text-lg">شماره تراکنش بانکی</p>*/}
              {/*  <p className="mb-4 rounded-md border border-green-700 bg-white px-8 text-center font-poppins text-5xl font-bold leading-normal text-green-700 dark:text-green-600">*/}
              {/*    {order.order.bankTransactionCode}*/}
              {/*  </p>*/}
              {/*</div>*/}
              {!order.automaticConfirmation && (
                <p className="mb-4 rounded-md bg-white p-2 text-center text-lg text-red-500 opacity-80 dark:bg-darkNavy1">
                  رزرو شما ثبت شد و در وضعیت <strong>در صف بررسی</strong> قرار گرفت، پس از تایید
                  مدیر سیستم، پیامک تاییدیه برای شما ارسال می شود.
                </p>
              )}

              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="fa-sbold-18px bg-gray-700 text-center text-white dark:bg-darkNavy1 dark:text-gray-400">
                    <tr>
                      {['#', 'خدمت', 'ارائه دهنده', 'تاریخ', 'ساعت','وضعیت', 'یادداشت'].map(item => (
                        <th key={item} scope="col" className="px-6 py-3">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="fa-sbold-16px bg-white text-center dark:bg-gray-800">

                              {order.reservations.map((item, index) =>
                                      <tr key={index}>
                                          <td className="px-6 py-3">{index + 1}</td>
                                          <td className="px-6 py-3">
                                              {item.service.name}
                                          </td>
                                          <td className="px-6 py-3">{item.provider.user.fullName}</td>
                                          <td className="px-6 py-3"> {item.date}</td>
                                          <td className="px-6 py-3">
                                              {/*{item.time.split("-").[0]} تا {item.time.split("-").[1]}*/}
                                            {item.time}
                                          </td>
                                          <td className="px-6 py-3"> {textReservationsStatus(item.status)}</td>
                                          <td className="px-6 py-3">
                                              {item.service.descriptionAfterPurchase &&
                                                  item.service.descriptionAfterPurchase.length > 0 &&
                                                  // <div className="rounded-md bg-white bg-opacity-50 p-4 dark:bg-opacity-5">
                                                  //     <h2 className="mb-4 text-center text-xl font-semibold">دستورالعمل</h2>
                                                  //     <p className="mb-0 text-center text-lg leading-10">
                                                          item.service.descriptionAfterPurchase
                                                      // </p>
                                                  // </div>
                                              }
                                          </td>
                                      </tr>
                              )}

                  </tbody>
                </table>
              </div>
            </>
          )
        )}

        <TheFooter />
      </div>
    </>
  )
}
//
// : (
//     <>
//         <p className="mb-4 text-center text-lg">عملیات بانکی با موفقیت انجام نشد.</p>
//         <div className="flex-center-center my-8 flex-col">
//             <p className="mb-4 text-center text-xl font-semibold">تلاش مجدد برای پرداخت</p>
//             {paymentId && (
//                 <p className="mb-4 text-center text-lg">
//                     <span>شناسه: </span>
//                     <span dir="ltr">{transferId}</span>
//                 </p>
//             )}
//             <Link
//                 href="/checkout"
//                 className="bk-button fa-sbold-18px cursor-pointer bg-green-700 dark:bg-primary-900"
//             >
//                 پرداخت مجدد
//             </Link>
//         </div>
//     </>
// )
