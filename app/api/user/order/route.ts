import prisma from '@/prisma/client'
import {
  checkMethodAllowed,
  createErrorResponse,
  createSuccessResponseWithData,
  getQueryStringByUrl,
  handlerRequestError,
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

  const trackingCode = getQueryStringByUrl(request.url, 'trackingCode')

  // بررسی وجود trackingCode
  if (!trackingCode) {
    return createErrorResponse('Tracking Code Is Required')
  }

  try {
    const orders = await prisma.orders.findMany({
      where: {
        trackingCode: trackingCode,
      },
    })
    return createSuccessResponseWithData(orders)
  } catch (error) {
    return handlerRequestError(error)
  }
}
