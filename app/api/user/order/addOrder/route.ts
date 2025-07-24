import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError, serializeBigIntToString,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { generateTrackingCodeWithDate } from '@/libs/utility'
import {dateNowP} from "@/libs/convertor";

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
    userId,
    // discountId,
    price,
    discountPrice,
    totalPrice,
  } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    userId,
    // discountId,
    price,
    discountPrice,
    totalPrice,
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

    const trackingCode = generateTrackingCodeWithDate()

    // ثبت سفارش جدید
    const order = await prisma.orders.create({
      data: {
        ...body,
        trackingCode,
        expiresAt: dateNowP().add(settings[0].minReservationLock, 'minutes').valueOf(),
      },
    })

    // hint orderId kafiye

    return createSuccessResponseWithData(serializeBigIntToString(order))
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
