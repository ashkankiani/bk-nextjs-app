import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl,
  createErrorResponseWithMessage, serializeBigIntToNumber,
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
    // دریافت سرویس
    const order = await prisma.orders.findUnique({
      where: { bankTransactionCode: id },
    })

    if(order){
      createErrorResponseWithMessage('سفارش یافت نشد')
    }

    return createSuccessResponseWithData(serializeBigIntToNumber(order))
  } catch (error) {
    return handlerRequestError(error)
  }
}
