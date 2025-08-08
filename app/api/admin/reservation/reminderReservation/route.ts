import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
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
  const {
    reserve,
    smsReminderToAdminProvider,
    smsReminderToUserService,
    emailReminderToAdminProvider,
    emailReminderToUserService,
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    reserve,
    smsReminderToAdminProvider,
    smsReminderToUserService,
    emailReminderToAdminProvider,
    emailReminderToUserService,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // ساخت پارامترهای پایه
    const paramsSms = {
      type: 'reminderReservation',
      trackingCode: body.reserve.order.trackingCode,
      dateName: fullStringToDateObjectP(body.reserve.date).weekDay.name,
      date: body.reserve.date,
      time: body.reserve.time.replace('-', ' تا '),
      service: body.reserve.service.name,
      provider: body.reserve.provider.user.fullName,
    }

    // ساخت پارامترهای ایمیل
    const paramsEmail = {
      ...paramsSms,
      title: 'یادآوری! رزرو خود را مرور نمایید.',
      subject: `تغییر وضعیت رزرو ${body.reserve.order.trackingCode}`,
      text: 'یادآوری! رزرو خود را مرور نمایید.',
    }

    const sendNotifications = async () => {
      if (body.smsReminderToAdminProvider && body.reserve.provider.user.mobile) {
        await callInternalApi('api/admin/sms/sendSms', {
          method: 'POST',
          body: { ...paramsSms, mobile: body.reserve.provider.user.mobile },
        })
      }
      if (body.smsReminderToUserService && body.reserve.user.mobile) {
        await callInternalApi('api/admin/sms/sendSms', {
          method: 'POST',
          body: { ...paramsSms, mobile: body.reserve.user.mobile },
        })
      }
      if (body.emailReminderToAdminProvider && body.reserve.provider.user.email) {
        await callInternalApi('/admin/email/sendEmail', {
          method: 'POST',
          body: {...paramsEmail, email: body.reserve.provider.user.email}
        })
      }
      if (body.emailReminderToUserService && body.reserve.user.email) {
        await callInternalApi('/admin/email/sendEmail', {
          method: 'POST',
          body: {...paramsEmail, email: body.reserve.user.email}
        })
      }
    }

    // ارسال یاداوری های درخواستی
    await sendNotifications()

    return createSuccessResponseWithMessage('یادآوری رزرو ارسال شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
