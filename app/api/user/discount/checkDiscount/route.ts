import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl,
  createErrorResponseWithMessage,
} from '@/app/api/_utils/handleRequest'
import { dateNowP, fullStringToDateObjectP } from '@/libs/convertor'
import { bkToast, checkingTimeBetweenTimes, isCurrentTimeInRange } from '@/libs/utility'

const allowedMethods = ['GET']

export async function GET(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت Id درخواست
  const code = getQueryStringByUrl(request.url, 'code')

  // بررسی وجود ID
  if (!code) {
    return createErrorResponseWithMessage('کد ضروری است.')
  }

  try {
    // دریافت کد تخفیف
    const discount = await prisma.discounts.findUnique({
      where: { code: code },
    })

    if (discount) {
      if (discount.startDate !== null && discount.endDate !== null) {
        if (checkingTimeBetweenTimes(discount.startDate, discount.endDate)) {
          return createSuccessResponseWithData(discount)
        } else {
          return createErrorResponseWithMessage('کد تخفیف ' + discount.title + ' منقضی شده.')
        }
      } else {
        return createSuccessResponseWithData(discount)
      }
    } else {
      return createErrorResponseWithMessage('کد تخفیف یافت نشد.')
    }
  } catch (error) {
    return handlerRequestError(error)
  }
}
