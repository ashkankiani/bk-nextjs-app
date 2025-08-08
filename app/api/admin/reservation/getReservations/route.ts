import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  createErrorResponseWithMessage,
  getQueryStringByUrl, serializeBigIntToNumber,
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

  // دریافت داده های درخواست
  const startEpoch = getQueryStringByUrl(request.url, 'startEpoch')
  const endEpoch = getQueryStringByUrl(request.url, 'endEpoch')

  // بررسی وجود داده های ورودی مورد نیاز
  if (!startEpoch) {
    return createErrorResponseWithMessage('تاریخ شروع ضروری است.')
  }

  if (!endEpoch) {
    return createErrorResponseWithMessage('تاریخ پایان ضروری است.')
  }

  // // بررسی وجود داده های ورودی مورد نیاز
  // const errorMessage = checkRequiredFields({
  //   startEpoch,
  //   endEpoch,
  // });
  //
  // if (errorMessage) {
  //   return createErrorResponseWithMessage(errorMessage);
  // }

  try {
    // دریافت لیست رزروها
    const reservations = await prisma.reservations.findMany({
      where: {
        status: {
          in: ['REVIEW', 'COMPLETED', 'DONE'],
        },
        dateTimeStartEpoch: {
          gte: parseInt(startEpoch),
        },
        dateTimeEndEpoch: {
          lte: parseInt(endEpoch),
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
