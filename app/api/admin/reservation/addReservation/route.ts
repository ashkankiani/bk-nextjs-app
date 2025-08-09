import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError,
  serializeBigIntToNumber,
} from '@/app/api/_utils/handleRequest'
import { fullStringToDateObjectP } from '@/libs/convertor'
import prisma from '@/prisma/client'
import { TypeApiConnection, TypeApiSetting } from '@/types/typeApiEntity'
import {callInternalApi} from "@/app/api/_utils/callInternalApi";
import {generateCode} from "@/libs/utility";

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
    orderId,
    serviceId,
    providerId,
    userId,
    // dateTimeStartEpoch,
    // dateTimeEndEpoch,
    date,
    time,
    status,
    paymentType,
    price,
    description,
    smsToAdminService,
    smsToAdminProvider,
    smsToUserService,
    emailToAdminService,
    emailToAdminProvider,
    emailToUserService,
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    orderId,
    serviceId,
    providerId,
    userId,
    // dateTimeStartEpoch,
    // dateTimeEndEpoch,
    date,
    time,
    status,
    paymentType,
    price,
    // description,
    smsToAdminService,
    smsToAdminProvider,
    smsToUserService,
    emailToAdminService,
    emailToAdminProvider,
    emailToUserService,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
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


    // محاسبه زمان شروع و پایان
    const [startHour, startMinute] = time[0].split(':').map(Number)
    const [endHour, endMinute] = time[1].split(':').map(Number)

    const dateTimeStartEpoch = fullStringToDateObjectP(
      `${date} ${startHour}:${startMinute}`,
      'YYYY/MM/DD HH:mm'
    ).valueOf()
    const dateTimeEndEpoch = fullStringToDateObjectP(
      `${date} ${endHour}:${endMinute}`,
      'YYYY/MM/DD HH:mm'
    ).valueOf()


    // try {
    //   // ایجاد در حال رزرو برای زمان مورد نیاز
    //   await prisma.reservations.create({
    //     data: params,
    //   })
    // } catch (error) {
    //   if (error.meta?.target === 'PRIMARY') {
    //     return createErrorResponseWithMessage(
    //       'یک یا چندتا از نوبت های شما در حال رزرو توسط کاربر دیگری هستند.'
    //     )
    //   } else {
    //     return handlerRequestError(error)
    //   }
    // }



    // let transactionId = null
    // if (method !== 'COD') {
    //   // تراکنش ثبت می شود
    //   const transaction = await prisma.transaction.create({
    //     data: {
    //       bankName: method,
    //       authority: authority,
    //       amount: price,
    //       cardNumber: cardNumber,
    //     },
    //   })
    //   transactionId = transaction.id
    // }

    // پرداخت ثبت می شود
    const payment = await prisma.payments.create({
      data: {
        paymentType: paymentType,
        userId: userId,
        transactionId: null,
        description: description, // حذف به نظرم
      },
    })


    // // دریافت سرویس
    // const service = await prisma.services.findUnique({
    //   where: { id: parseInt(serviceId) },
    // })

    // if (!service) {
    //   return createErrorResponseWithMessage('دسترسی به سرویس مویثر نشد.')
    // }

    // سفارش آپدیت می شود
    await prisma.orders.create({
      data: {
        trackingCode: orderId,
        method: "COD",
        authority: generateCode().toString(),
        status: "COMPLETED",
        userId: userId,
        paymentId: payment.id,
        price: parseInt(price),
        totalPrice: parseInt(price), // after add discount => send totalPrice
        expiresAt: null,
      },
    })

    const params = {
      orderId,
      serviceId,
      providerId,
      userId,
      dateTimeStartEpoch,
      dateTimeEndEpoch,
      date,
      time: time.join('-'), // "15:00-16:00"
      status,
    }


    // رزرو آپدیت می شود
    const order = await prisma.reservations.create({
      data: params,
    })

    // دریافت سفارش نهایی
    // const order = await prisma.orders.findUnique({
    //   where: {
    //     trackingCode: orderId,
    //   },
    // })

    // دریافت اطلاعات رزروهای نهایی
    const reservations = await prisma.reservations.findMany({
      where: {
        orderId,
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

    //  ارسال پیامک و ایمیل
    if (status === 'COMPLETED') {
      await sendSmsAndEmail(
          orderId,
          smsToAdminService,
          smsToAdminProvider,
          smsToUserService,
          emailToAdminService,
          emailToAdminProvider,
          emailToUserService
      )
    }

    return createSuccessResponseWithData({
      order: serializeBigIntToNumber(order),
      reservations: serializeBigIntToNumber(reservations),
      // automaticConfirmation: settings[0].automaticConfirmation,
    })










    // const cardNumber = '' // خالی است چون تراکنش نداریم
    // const authority = generateCode().toString()
    // return await updateOrder(
    //   settings[0],
    //   status,
    //   orderId, // trackingCode
    //     price,
    //   userId,
    //   'COD', //method,
    //   // authority,
    //   // service.price,
    //   // cardNumber
    //   description,
    //     paymentType,
    // smsToAdminService,
    // smsToAdminProvider,
    // smsToUserService,
    // emailToAdminService,
    // emailToAdminProvider,
    // emailToUserService,
    // )
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}

// // تابع کمکی آپدیت رزرو و سفارش
// async function updateOrder(
//   setting: TypeApiSetting,
//   status: TypeReservationsStatus,
//   trackingCode: string,
//   price: string,
//   userId: string,
//   method: TypeOrderMethod,
//   // authority: string,
//   // price: number,
//   // cardNumber: string
//   description: string | null,
//   paymentType: TypePaymentType,
//   smsToAdminService: boolean,
//   smsToAdminProvider: boolean,
//   smsToUserService: boolean,
//   emailToAdminService: boolean,
//   emailToAdminProvider: boolean,
//   emailToUserService: boolean
// ) {
//
// }

// تابع کمکی برای آپدیت سفارش
async function sendSmsAndEmail(
  trackingCode: string,
  smsToAdminService: boolean,
  smsToAdminProvider: boolean,
  smsToUserService: boolean,
  emailToAdminService: boolean,
  emailToAdminProvider: boolean,
  emailToUserService:boolean
) {
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


    if (smsToAdminService) {
      await sendSmsNotifications(paramsSms, reservation.service.user.mobile)
    }
    if (smsToAdminProvider) {
      await sendSmsNotifications(paramsSms, reservation.provider.user.mobile)
    }
    if (smsToUserService) {
      await sendSmsNotifications(paramsSms, reservation.user.mobile)
    }

    if (emailToAdminService) {
      if (reservation.service.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.service.user.email)
      }
    }
    if (emailToAdminProvider) {
      if (reservation.provider.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.provider.user.email)
      }
    }
    if (emailToUserService) {
      if (reservation.user.email) {
        await sendEmailNotifications(paramsEmail, reservation.user.email)
      }
    }
  }
}
