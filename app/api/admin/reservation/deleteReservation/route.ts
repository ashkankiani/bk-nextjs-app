import prisma from '@/prisma/client'
import {
  handlerRequestError,
  checkMethodAllowed,
  createSuccessResponseWithMessage,
  getQueryStringByUrl,
  createErrorResponseWithMessage,
} from '@/app/api/_utils/handleRequest'

const allowedMethods = ['DELETE']

export async function DELETE(request: Request) {
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
    // شناسه رزرو
    const reserveId = parseInt(id)

    // پیدا کردن رزرو
    const reservation = await prisma.reservations.findUnique({
      where: {
        id: reserveId,
      },
    })

    // بررسی آیا رزرو وجود دارد
    if (!reservation) {
      return createErrorResponseWithMessage('رزرو یافت نشد.')
    }

    // استخراج داده های رزرو
    const { orderId, paymentId, transactionId } = reservation

    const transactionOperations = [
      prisma.reservations.delete({ where: { id: reserveId } }),
      prisma.orders.delete({ where: { id: orderId } }),
      prisma.payments.delete({ where: { id: paymentId } }),
    ]

    if (transactionId) {
      transactionOperations.push(prisma.transaction.delete({ where: { id: transactionId } }))
    }

    // حذف رزرو
    await prisma.$transaction(transactionOperations)

    return createSuccessResponseWithMessage('رزرو حذف شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
