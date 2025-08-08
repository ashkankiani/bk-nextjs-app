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
    // دریافت لیست در حال رزروها
    const reservations = await prisma.reservations.findMany({
      where: {
        status: {
          in: ['PENDING'],
        },
      },
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
        order: {
          include: {
            payment: {
              include: {
                transaction: true
              }
            },
            discount: true
          },
        },
      },
    })


    return createSuccessResponseWithData(serializeBigIntToNumber(reservations))
  } catch (error) {
    return handlerRequestError(error)
  }
}
