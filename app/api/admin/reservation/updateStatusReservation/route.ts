import prisma from '@/prisma/client'
import {
  handlerRequestError,
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
} from '@/app/api/_utils/handleRequest'
import { fullStringToDateObjectP } from '@/libs/convertor'
import { callInternalApi } from '@/app/api/_utils/callInternalApi'

const allowedMethods = ['PUT']

export async function PUT(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()

  const {
    reserve,
    statusReserve,
    status,
    smsChangeStatusToAdminProvider,
    smsChangeStatusToUserService,
    emailChangeStatusToAdminProvider,
    emailChangeStatusToUserService,
    smsStatusDoneToAdminProvider,
    smsStatusDoneToUserService,
    emailStatusDoneToAdminProvider,
    emailStatusDoneToUserService,
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    reserve,
    statusReserve,
    status,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  // بررسی وجود داده های ورودی مورد نیاز
  if (status === 'COMPLETED' || status === 'CANCELED') {
    const errorMessage = checkRequiredFields({
      smsChangeStatusToAdminProvider,
      smsChangeStatusToUserService,
      emailChangeStatusToAdminProvider,
      emailChangeStatusToUserService,
    })

    if (errorMessage) {
      return createErrorResponseWithMessage(errorMessage)
    }
  }

  // بررسی وجود داده های ورودی مورد نیاز
  if (status === 'DONE') {
    const errorMessage = checkRequiredFields({
      smsStatusDoneToAdminProvider,
      smsStatusDoneToUserService,
      emailStatusDoneToAdminProvider,
      emailStatusDoneToUserService,
    })

    if (errorMessage) {
      return createErrorResponseWithMessage(errorMessage)
    }
  }

  try {
    // آپدیت سفارش
    await prisma.orders.update({
      data: {
        status: status,
      },
      where: { id: body.reserve.orderId },
    })

    // آپدیت رزرو
    await prisma.reservations.update({
      data: body.update,
      where: { id: body.reserve.id },
    })

    // ساخت پارامترهای پایه
    const paramsSms = {
      type: 'changeStatusReservation',
      trackingCode: body.reserve.order.trackingCode,
      dateName: fullStringToDateObjectP(body.reserve.date).weekDay.name,
      date: body.reserve.date,
      time: body.reserve.time.replace('-', ' تا '),
      service: body.reserve.order.provider.service.name,
      provider: body.reserve.order.provider.user.fullName,
      status:
        body.update.status === 'DONE'
          ? 'انجام'
          : body.update.status === 'COMPLETED'
            ? 'تایید'
            : 'رد',
    }

    // ساخت پارامترهای ایمیل
    const paramsEmail = {
      ...paramsSms,
      title:
        body.statusReserve === 'THANK'
          ? 'تشکر! رزرو شما با موفقیت انجام شد.'
          : body.statusReserve === 'YES'
            ? 'تبریک! رزرو شما با موفقیت توسط مدیر تایید شد.'
            : 'متاسفیم! رزرو شما توسط مدیر رد شد.',
      subject: `تغییر وضعیت رزرو ${body.reserve.order.trackingCode}`,
      text:
        body.statusReserve === 'THANK'
          ? 'پایان رزرو! رزرو شما با موفقیت انجام شد.'
          : body.statusReserve === 'YES'
            ? 'تغییر وضعیت رزرو! رزرو شما با موفقیت تایید شد.'
            : 'متاسفیم! رزرو شما توسط مدیر رد شد.',
    }

    const sendNotifications = async () => {
      if (body.smsChangeStatusToAdminProvider || body.smsStatusDoneToAdminProvider) {
        await callInternalApi('/admin/sms/send-sms', {
          method: 'POST',
          body: { ...paramsSms, mobile: body.reserve.order.provider.user.mobile },
        })
      }
      if (body.smsChangeStatusToUserService || body.smsStatusDoneToUserService) {
        await callInternalApi('/admin/sms/send-sms', {
          method: 'POST',
          body: { ...paramsSms, mobile: body.reserve.order.user.mobile },
        })
      }
      if (body.emailChangeStatusToAdminProvider || body.emailStatusDoneToAdminProvider) {
        if (body.reserve.order.provider.user.email) {
          await callInternalApi('/admin/email/send-email', {
            ...paramsEmail,
            email: body.reserve.order.provider.user.email,
          })
        }
      }
      if (body.emailChangeStatusToUserService || body.emailStatusDoneToUserService) {
        if (body.reserve.order.user.email) {
          await callInternalApi('/admin/email/send-email', {
            ...paramsEmail,
            email: body.reserve.order.user.email,
          })
        }
      }
    }

    await sendNotifications()

    return createSuccessResponseWithMessage('وضعیت رزرو آپدیت شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
