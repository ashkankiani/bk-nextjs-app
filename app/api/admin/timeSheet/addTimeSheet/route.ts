import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'

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
  const { serviceId, providerId, dayName, dayIndex, startTime, endTime } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    serviceId,
    providerId,
    dayName,
    dayIndex,
    startTime,
    endTime,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // ثبت تقویم کاری جدید
    await prisma.timeSheets.create({
      data: body,
    })

    return createSuccessResponseWithMessage('تقویم کاری ثبت شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
