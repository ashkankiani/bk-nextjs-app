import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl,
  createErrorResponseWithMessage,
} from '@/app/api/_utils/handleRequest'

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
  const id = getQueryStringByUrl(request.url)

  // بررسی وجود ID
  if (!id) {
    return createErrorResponseWithMessage('آیدی ضروری است.')
  }

  try {
    // دریافت کد تخفیف
    const discount = await prisma.discounts.findUnique({
      where: { id: parseInt(id) },
    })

    return createSuccessResponseWithData(discount)
  } catch (error) {
    return handlerRequestError(error)
  }
}
