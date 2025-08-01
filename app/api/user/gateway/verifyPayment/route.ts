import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError,
  serializeBigIntToNumber,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { TypeOrderMethod, TypeReservationsStatus } from '@/types/typeConfig'
import { TypeApiConnection, TypeApiSetting } from '@/types/typeApiEntity'
import { callExternalApi } from '@/app/api/_utils/callExternalApi'
import { TypeApiVerifyPaymentReq } from '@/types/typeApiUser'
import { fullStringToDateObjectP } from '@/libs/convertor'
import { callInternalApi } from '@/app/api/_utils/callInternalApi'

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

  const { authority, trackingCode, method, price, userId }: TypeApiVerifyPaymentReq = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    authority,
    trackingCode,
    method,
    price,
    userId,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // // دریافت کاربر
    // const user = await prisma.users.findUnique({
    //   where: { id: userId },
    // })
    //
    // // بررسی وجود کاربر
    // if (!user) {
    //   return createErrorResponseWithMessage('دسترسی به کاربر مویثر نشد.')
    // }

    // دریافت داده های ارتباطات
    const connections: TypeApiConnection[] = await prisma.connections.findMany()

    if (!connections || !connections[0]) {
      return createErrorResponseWithMessage('دسترسی به ارتباطات مویثر نشد.')
    }

    if (connections[0].bankName1 === 'NONE' && connections[0].bankName1 === 'NONE') {
      return createErrorResponseWithMessage('مشخصات درگاه بانک ثبت نشده است.')
    }

    // دریافت داده های تنظیمات
    const settings: TypeApiSetting[] = await prisma.settings.findMany()

    if (!settings) {
      return createErrorResponseWithMessage('دسترسی به تنظمیات مویثر نشد.')
    }

    const status = settings[0].automaticConfirmation ? 'COMPLETED' : 'REVIEW'

    const merchant =
      method === connections[0].bankName1 ? connections[0].merchantId1 : connections[0].merchantId2

    if (method === 'COD') {
      const cardNumber = '' // خالی است چون تراکنش نداریم
      return await updateOrder(
        settings[0],
        status,
        trackingCode,
        userId,
        method,
        authority,
        price,
        cardNumber
      )
    }
    if (method === 'ZARINPAL') {
      const params = {
        merchant_id: merchant,
        amount: price,
        authority: authority,
      }

      type TypeGetUrl = {
        status: boolean
        data: {
          data: {
            // wages: [],
            code: number
            message: string
            card_hash: string
            card_pan: string
            ref_id: number
            fee_type: string
            fee: number
            shaparak_fee: string
            // order_id: null
          }
        }
        errors?: {
          code: number
        }
        errorMessage?: string
      }

      // ارسال درخواست برای دریافت URL پرداخت
      const getUrl: TypeGetUrl = await callExternalApi({
        method: 'POST',
        url: 'https://payment.zarinpal.com/pg/v4/payment/verify.json',
        data: params,
      })

      // بررسی دریافت URL پرداخت
      // {
      //   "data": {
      //     "code": 100,
      //     "message": "Verified",
      //     "card_hash": "1EBE3EBEBE35C7EC0F8D6EE4F2F859107A87822CA179BC9528767EA7B5489B69",
      //     "card_pan": "502229******5995",
      //     "ref_id": 201,
      //     "fee_type": "Merchant",
      //     "fee": 0
      //   },
      //   "errors": []
      // }

      if (getUrl.status) {
        if (getUrl.data.data.code === 101) {
          return createErrorResponseWithMessage('تراکنش قبلا تایید شده است.')
        }
        if (getUrl.data.data.code === 100) {
          const cardNumber = getUrl.data.data.card_pan
          return await updateOrder(
            settings[0],
            status,
            trackingCode,
            userId,
            method,
            authority,
            price,
            cardNumber
          )
        }

        if (getUrl.data.data.code !== 100 || getUrl.data.data.code !== 101) {
          const errors: Record<string, string> = {
            '-9': 'خطای اعتبار سنجی - مرچنت کد یا آدرس بازگشت',
            '-10': 'ای پی یا مرچنت كد پذیرنده صحیح نیست.',
            '-11': 'مرچنت کد فعال نیست، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
            '-12':
              'تلاش بیش از دفعات مجاز در یک بازه زمانی کوتاه به امور مشتریان زرین پال اطلاع دهید',
            '-15':
              'درگاه پرداخت به حالت تعلیق در آمده است، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
            '-16': 'سطح تایید پذیرنده پایین تر از سطح نقره ای است.',
            '-17': 'محدودیت پذیرنده در سطح آبی',
            '-50': 'مبلغ پرداخت شده با مقدار مبلغ ارسالی در متد وریفای متفاوت است.',
            '-51': 'پرداخت ناموفق',
            '-52':
              'خطای غیر منتظره‌ای رخ داده است. پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.',
            '-53': 'پرداخت متعلق به این مرچنت کد نیست.',
            '-54': 'اتوریتی نامعتبر است.',
            '-55': 'تراکنش مورد نظر یافت نشد',
            '101': 'تراکنش وریفای شده است.',
          }
          return createErrorResponseWithMessage(errors[getUrl?.errors.code])
        }
      } else {
        return createErrorResponseWithMessage(getUrl?.errorMessage)
      }
    }

    if (method === 'ZIBAL') {
      console.log(111111111)
      const params = {
        merchant: merchant,
        trackId: parseInt(authority),
      }

      type TypeGetUrl = {
        status: boolean
        data: {
          paidAt: string
          amount: number
          result: number
          status: number
          refNumber: number
          description: string
          cardNumber: string
          orderId: string
          message: string
        }
        errorMessage?: string
      }

      // ارسال درخواست برای دریافت URL پرداخت
      const getUrl: TypeGetUrl = await callExternalApi({
        method: 'POST',
        url: 'https://gateway.zibal.ir/v1/verify',
        data: params,
      })

      // بررسی دریافت URL پرداخت
      // {
      //     message: 'success',
      //     result: 100,
      //     refNumber: '128941868166',
      //     paidAt: '2025-07-25T16:11:59.947000',
      //     status: 1,
      //     amount: 10000,
      //     orderId: '1404053161119',
      //     description: 'شماره سفارش: 1404053161119 برای: مدیریت کدملی: 4180317125',
      //     cardNumber: '603799******5795',
      //     multiplexingInfos: []
      //   }

      if (getUrl.status) {
        if (getUrl.data.result === 201) {
          createErrorResponseWithMessage('تراکنش قبلا تایید شده است.')
        }
        if (getUrl.data.result === 100) {
          const cardNumber = getUrl.data.cardNumber
          return await updateOrder(
            settings[0],
            status,
            trackingCode,
            userId,
            method,
            authority,
            price,
            cardNumber
          )
        } else {
          const errors: Record<string, string> = {
            102: 'مرچند یافت نشد.',
            103: 'مرچند غیرفعال است.',
            104: 'مرچند نامعتبر است.',
            202: 'سفارش پرداخت نشده یا ناموفق بوده است.',
            203: 'کد پیگیری نامعتبر می‌باشد.',
          }
          createErrorResponseWithMessage(errors[getUrl?.data.result])
        }
      } else {
        return createErrorResponseWithMessage(getUrl?.errorMessage)
      }
    }

    if (method === 'AQAYEPARDAKHT') {
      const params = {
        pin: merchant,
        amount: price,
        transid: authority,
      }

      type TypeGetUrl = {
        status: boolean
        data: {
          status: string
          code: string
        }
        errorMessage?: string
      }

      // ارسال درخواست برای دریافت URL پرداخت
      const getUrl: TypeGetUrl = await callExternalApi({
        method: 'POST',
        url: 'https://panel.aqayepardakht.ir/api/v2/verify',
        data: params,
      })

      // بررسی دریافت URL پرداخت
      // {
      // "status" : "success",
      // "code" : "1"
      // }

      if (getUrl.status) {
        if (getUrl.data.code === '2') {
          createErrorResponseWithMessage('تراکنش قبلا تایید شده است.')
        }
        if (getUrl.data.code === '1') {
          const cardNumber = '' // خود درگاه نمیده
          return await updateOrder(
            settings[0],
            status,
            trackingCode,
            userId,
            method,
            authority,
            price,
            cardNumber
          )
        } else {
          const errors: Record<string, string> = {
            '-1': 'amount نمی تواند خالی باشد',
            '-2': 'کد پین درگاه نمی تواند خالی باشد',
            '-3': 'callback نمی تواند خالی باشد',
            '-4': 'amount باید عددی باشد',
            '-5': 'amount باید بین 1,000 تا 200,000,000 تومان باشد',
            '-6': 'کد پین درگاه اشتباه هست',
            '-7': 'transid نمی تواند خالی باشد',
            '-8': 'تراکنش مورد نظر وجود ندارد',
            '-9': 'کد پین درگاه با درگاه تراکنش مطابقت ندارد',
            '-10': 'مبلغ با مبلغ تراکنش مطابقت ندارد',
            '-11': 'درگاه درانتظار تایید و یا غیر فعال است',
            '-12': 'امکان ارسال درخواست برای این پذیرنده وجود ندارد',
            '-13': 'شماره کارت باید 16 رقم چسبیده بهم باشد',
            '-14': 'درگاه برروی سایت دیگری درحال استفاده است',
          }
          createErrorResponseWithMessage(errors[getUrl?.data.code])
        }
      } else {
        return createErrorResponseWithMessage(getUrl?.errorMessage)
      }
    }

    if (method === 'IDPAY') {
      return createErrorResponseWithMessage('درگاه غیرفعال است.')
    }

    return createErrorResponseWithMessage('دسترسی به درگاه بانک مویثر نشد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}

// تابع کمکی برای آپدیت سفارش
async function sendSms(trackingCode: string) {
  // دریافت اطلاعات رزروهای نهایی
  const reservations = await prisma.reservations.findMany({
    where: {
      orderId: trackingCode,
    },
    include: {
      service: {
        include: {
          user: true,
        },
      },
      provider: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  })

  const sendSmsNotifications = async (paramsSms: object, mobile: string) => {
    await callInternalApi('api/admin/sms/sendSms', {
      method: 'POST',
      body: { ...paramsSms, mobile },
    })
  }
  const sendEmailNotifications = async (paramsEmail: object, email: string) => {
    await callInternalApi('/admin/email/sendEmail', {
      method: 'POST',
      body: { ...paramsEmail, email },
    })
  }

  for (const reservation of reservations) {
    // ساخت پارامترهای پایه
    const paramsSms = {
      type: 'confirmReservation',
      trackingCode: trackingCode,
      dateName: fullStringToDateObjectP(reservation.date).weekDay.name,
      date: reservation.date,
      time: reservation.time.replace('-', ' تا '),
      service: reservation.service.name,
      provider: reservation.provider.user.fullName,
    }
    const paramsEmail = {
      ...paramsSms,
      title: 'تبریک! رزرو شما با موفقیت ثبت شد.',
      subject: `رزرو جدید ${trackingCode}`,
      text: 'تبریک! یک سفارش جدید ثبت شد.',
    }

    if (reservation.service.smsToAdminService) {
      await sendSmsNotifications(paramsSms, reservation.service.user.mobile)
    }
    if (reservation.service.smsToAdminProvider) {
      await sendSmsNotifications(paramsSms, reservation.provider.user.mobile)
    }
    if (reservation.service.smsToUserService) {
      await sendSmsNotifications(paramsSms, reservation.user.mobile)
    }

    if (reservation.service.emailToAdminService) {
      if (reservation.service.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.service.user.email)
      }
    }
    if (reservation.service.emailToAdminProvider) {
      if (reservation.provider.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.provider.user.email)
      }
    }
    if (reservation.service.emailToUserService) {
      if (reservation.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.user.email)
      }
    }
  }
}

async function updateOrder(
  setting: TypeApiSetting,
  status: TypeReservationsStatus,
  trackingCode: string,
  userId: number,
  method: TypeOrderMethod,
  authority: string,
  price: number,
  cardNumber: string
) {
  let transactionId = null
  if (method !== 'COD') {
    // تراکنش ثبت می شود
    const transaction = await prisma.transaction.create({
      data: {
        bankName: method,
        authority: authority,
        amount: price,
        cardNumber: cardNumber,
      },
    })
    transactionId = transaction.id
  }

  // پرداخت ثبت می شود
  const payment = await prisma.payments.create({
    data: {
      paymentType: method !== 'COD' ? 'OnlinePayment' : 'UnknownPayment',
      userId: userId,
      transactionId: transactionId,
      description: '1111111', // حذف به نظرم
    },
  })

  // سفارش آپدیت می شود
  await prisma.orders.update({
    where: {
      trackingCode,
    },
    data: {
      status: 'COMPLETED',
      paymentId: payment.id,
      expiresAt: null,
    },
  })

  // رزرو آپدیت می شود
  await prisma.reservations.updateMany({
    where: {
      orderId: trackingCode,
    },
    data: {
      status: status,
    },
  })

  // دریافت سفارش نهایی
  const order = await prisma.orders.findUnique({
    where: {
      trackingCode,
    },
  })

  // دریافت اطلاعات رزروهای نهایی
  const reservations = await prisma.reservations.findMany({
    where: {
      orderId: trackingCode,
    },
    include: {
      service: {
        select: {
          name: true,
          descriptionAfterPurchase: true,
        },
      },
      provider: {
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  })

  // ارسال sms
  if (status === 'COMPLETED') {
    await sendSms(trackingCode)
  }

  return createSuccessResponseWithData({
    order: serializeBigIntToNumber(order),
    reservations: serializeBigIntToNumber(reservations),
    automaticConfirmation: setting.automaticConfirmation,
  })
}
