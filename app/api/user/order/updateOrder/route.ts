import prisma from '@/prisma/client'
import {
  handlerRequestError,
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage, createSuccessResponseWithData,
} from '@/app/api/_utils/handleRequest'
import {dateNowP} from "@/libs/convertor";
import {generateCode} from "@/libs/utility";
import {TYPE_ONLINE_PAYMENT_STATUS} from "@/libs/constant";

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

  const { trackingCode } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    trackingCode,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {

    // دریافت تنظیمات
    const settings = await prisma.settings.findMany()

    if (!settings || !settings[0]) {
      return createErrorResponseWithMessage('دسترسی به تنظیمات مویثر نشد.')
    }

    // ایجاد یک اتوریتی برای پرداخت های COD
    const Type = 'UnknownPayment'
    const Status = TYPE_ONLINE_PAYMENT_STATUS.PAID
    const Authority = generateCode().toString()

    // آپدیت سفارش
    await prisma.orders.update({
      where: {
        trackingCode,
      },
      data: {
        authority: Authority,
        status: 'COMPLETED',
        expiresAt: null,
      },
    })

    // آپدیت وضعیت رزرو
    await prisma.reservations.updateMany({
      where: {
        orderId: trackingCode,
      },
      data: {
        // status: 'PENDING',
        status: settings[0].automaticConfirmation ? 'COMPLETED' : 'REVIEW',
      },
    })

    return createSuccessResponseWithData({
      Type,
      Status,
      Authority
    })
  } catch (error) {
    return handlerRequestError(error)
  }
}
