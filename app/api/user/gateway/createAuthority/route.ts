import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import {TypeOrderMethod} from '@/types/typeConfig'
import { TypeApiConnection } from '@/types/typeApiEntity'
import { callExternalApi } from '@/app/api/_utils/callExternalApi'
import {generateCode} from "@/libs/utility";
import {TYPE_ONLINE_PAYMENT_STATUS} from "@/libs/constant";
import Qs from "qs";

const allowedMethods = ['POST']

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //   return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()
  const {
    type,
    gateway,
    price,
    userId,
    orderId,
  }: {
    type: 'OnlinePayment' | 'UnknownPayment'
    gateway: TypeOrderMethod
    price: number
    userId: number
    orderId: string
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    type,
    gateway,
    price,
    userId,
    orderId,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // دریافت کاربر
    const user = await prisma.users.findUnique({
      where: { id: userId },
    })

    // بررسی وجود کاربر
    if (!user) {
      return createErrorResponseWithMessage('دسترسی به کاربر مویثر نشد.')
    }

    // دریافت داده های ارتباطات
    const connections: TypeApiConnection[] = await prisma.connections.findMany()

    if (!connections || !connections[0]) {
      return createErrorResponseWithMessage('دسترسی به ارتباطات مویثر نشد.')
    }

    if (connections[0].bankName1 === 'NONE' && connections[0].bankName1 === 'NONE') {
      return createErrorResponseWithMessage('مشخصات درگاه بانک ثبت نشده است.')
    }

    const trackingCode = orderId

    const merchant =
      gateway === connections[0].bankName1 ? connections[0].merchantId1 : connections[0].merchantId2

    const text =
      'شماره سفارش: ' +
      trackingCode +
      ' برای: ' +
      (user ? user.fullName : 'کاربر ناشناس') +
      ' کدملی: ' +
      user.codeMeli


    if (type === 'UnknownPayment') {

      const Authority = generateCode().toString()

      const queryString = {
        Type: type,
        Status: TYPE_ONLINE_PAYMENT_STATUS.PAID,
        Authority,
      }

      // آپدیت سفارش
      await updateOrderWithTransactionCode(trackingCode, 'COD', Authority)

      return createSuccessResponseWithData({
        authority: Authority,
        url: process.env.NEXT_PUBLIC_FULL_PATH + '/payment?' + Qs.stringify(queryString),
      })
    }
    if (type === 'OnlinePayment') {
      if (gateway === 'ZARINPAL') {
        const params = {
          description: text,
          merchant_id: merchant,
          currency: 'IRT',
          amount: price,
          metadata: {
            mobile: user.mobile,
            email: user.email,
          },
          callback_url: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/zarinpal',
        }

        // ارسال درخواست برای دریافت URL پرداخت
        const getUrl = await callExternalApi({
          method: 'POST',
          url: 'https://payment.zarinpal.com/pg/v4/payment/request.json',
          data: params,
        })

        // بررسی دریافت URL پرداخت
        // 	{
        // 		"authority": "A0000000000000000000000000006q6xwoen",
        // 		"fee": 3650,
        // 		"fee_type": "Merchant",
        // 		"code": 100,
        // 		"message": "Success"
        // 	}
        if (getUrl.status) {
          // آپدیت سفارش
          await updateOrderWithTransactionCode(trackingCode, 'ZARINPAL', getUrl.data.data.authority)

          return createSuccessResponseWithData({
            authority: getUrl.data.data.authority,
            url: 'https://payment.zarinpal.com/pg/StartPay/' + getUrl.data.data.authority,
          })
        } else {
          return createErrorResponseWithMessage(getUrl.errorMessage)
        }
      }

      if (gateway === 'ZIBAL') {
        const params = {
          merchant: merchant,
          description: text,
          orderId: trackingCode,
          amount: price * 10, // Rial To Toman
          mobile: user.mobile,
          callbackUrl: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/zibal',
        }

        // ارسال درخواست برای دریافت URL پرداخت
        const getUrl = await callExternalApi({
          method: 'POST',
          url: 'https://gateway.zibal.ir/v1/request',
          data: params,
        })

        // بررسی دریافت URL پرداخت
        // {
        // 		"message": "success",
        // 		"result": 100,
        // 		"trackId": 4173967078
        // }

        if (getUrl.status) {
          // آپدیت سفارش
          await updateOrderWithTransactionCode(
            trackingCode,
            'ZIBAL',
            getUrl.data.trackId.toString()
          )

          // if(getUrl.result ===100){
          return createSuccessResponseWithData({
            authority: getUrl.data.trackId.toString(),
            url: 'https://gateway.zibal.ir/start/' + getUrl.data.trackId,
          })
          // }
        } else {
          return createErrorResponseWithMessage(getUrl.errorMessage)
        }
      }

      if (gateway === 'AQAYEPARDAKHT') {
        const params = {
          pin: merchant, // sandbox = "sandbox"
          amount: price,
          invoice_id: trackingCode,
          desc: text,
          metadata: {
            mobile: user.mobile,
            email: user.email,
          },
          callback: process.env.NEXT_PUBLIC_FULL_PATH + '/api/user/gateway/callback/aqayepardakht',
        }

        // ارسال درخواست برای دریافت URL پرداخت
        const getUrl = await callExternalApi({
          method: 'POST',
          url: 'https://panel.aqayepardakht.ir/api/v2/create',
          data: params,
        })

        // بررسی دریافت URL پرداخت
        // sandbox url  :'https://panel.aqayepardakht.ir/startpay/sandbox/'
        if (getUrl.status) {
          // آپدیت سفارش
          await updateOrderWithTransactionCode(trackingCode, 'AQAYEPARDAKHT', getUrl.data.transid)

          return createSuccessResponseWithData({
            authority: getUrl.data.transid,
            url:
              merchant === 'sandbox'
                ? 'https://panel.aqayepardakht.ir/startpay/sandbox/' + getUrl.data.transid
                : 'https://panel.aqayepardakht.ir/startpay/' + getUrl.data.transid,
          })
        } else {
          return createErrorResponseWithMessage(getUrl.errorMessage)
        }
      }

      if (gateway === 'IDPAY') {
        return createErrorResponseWithMessage('درگاه غیرفعال است.')

        /*      const params = {}
          
                                        // ارسال درخواست برای دریافت URL پرداخت
                                        const getUrl = await callExternalApi({
                                          method: 'POST',
                                          url: "https://api.idpay.ir/v1.1/payment" ,
                                          data: params,
                                          headers: {
                                              'X-API-KEY': merchant,
                                          }
                                        })
          
          
                                        // بررسی دریافت URL پرداخت
                                        // res.data.errors
                                        if (getUrl.status) {
          
                              // آپدیت سفارش
                              await updateOrderWithTransactionCode(trackingCode , getUrl.data.transid)
          
          
                                          return createSuccessResponseWithData(getUrl)
                                        } else {
                                          return createErrorResponseWithMessage(getUrl.errorMessage)
                                        }
                                        */
      }
    }
    return createErrorResponseWithMessage('دسترسی به درگاه بانک مویثر نشد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}

// تابع کمکی برای آپدیت سفارش
async function updateOrderWithTransactionCode(
  trackingCode: string,
  method: TypeOrderMethod,
  authority: string
) {
  return await prisma.orders.update({
    where: {
      trackingCode,
    },
    data: {
      method,
      authority,
    },
  })
}
