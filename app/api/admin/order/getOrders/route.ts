import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed, serializeBigIntToNumber,
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

  try {

    // دریافت لیست سفارشات
    const orders = await prisma.orders.findMany({
      include: {
        payment: true,
        discount: true,
        Reservations: {
          include: {
            user: true,
            service: {
              include: {
                user: true
              }
            },
            provider: {
              include: {
                user: true
              }
            },
          },
        }
      },
    })

    return createSuccessResponseWithData(serializeBigIntToNumber(orders))
  } catch (error) {
    return handlerRequestError(error)
  }
}
