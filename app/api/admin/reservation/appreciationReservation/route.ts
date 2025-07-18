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
    discountCode,
    smsAppreciationToAdminProvider,
    smsAppreciationToUserService,
    emailAppreciationToAdminProvider,
    emailAppreciationToUserService,
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    reserve,
    discountCode,
    smsAppreciationToAdminProvider,
    smsAppreciationToUserService,
    emailAppreciationToAdminProvider,
    emailAppreciationToUserService,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // ساخت پارامترهای پایه
    const params = {
      type: 'appreciationReservation',
      trackingCode: body.reserve.order.trackingCode,
      dateName: fullStringToDateObjectP(body.reserve.date).weekDay.name,
      date: body.reserve.date,
      time: body.reserve.time.replace('-', ' تا '),
      service: body.reserve.order.provider.service.name,
      provider: body.reserve.order.provider.user.fullName,
      fullName: body.reserve.order.user.fullName,
      discountCode: body.discountCode,
    }

    // ساخت پارامترهای ایمیل
    const paramsEmail = {
      ...params,
      title: 'تبریک! یک کد تخفیف هدیه دریافت نمودید.',
      subject: 'کد تخفیف برای ' + body.reserve.order.trackingCode,
      text: `تبریک! یک کد تخفیف جدید دریافت نمودید.`,
      content: body.discountCode,
    }

    const sendNotifications = async () => {
      if (body.smsAppreciationToAdminProvider) {
        await callInternalApi('/admin/sms/send-sms', {
          method: 'POST',
          body: { ...params, mobile: body.reserve.order.provider.user.mobile },
        })
      }
      if (body.smsAppreciationToUserService) {
        await callInternalApi('/admin/sms/send-sms', {
          method: 'POST',
          body: { ...params, mobile: body.reserve.order.user.mobile },
        })
      }
      if (body.emailAppreciationToAdminProvider) {
        await callInternalApi('/admin/email/send-email', {
          ...paramsEmail,
          email: body.reserve.order.provider.user.email,
        })
      }
      if (body.emailAppreciationToUserService && body.reserve.order.user.email) {
        await callInternalApi('/admin/email/send-email', {
          ...paramsEmail,
          email: body.reserve.order.user.email,
        })
      }
    }

    // ارسال قدردانی های درخواستی
    await sendNotifications()

    return createSuccessResponseWithMessage('قدردانی رزرو ارسال شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
