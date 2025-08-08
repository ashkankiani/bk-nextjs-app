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
  const reserveId = getQueryStringByUrl(request.url)

  // بررسی وجود ID
  if (!reserveId) {
    return createErrorResponseWithMessage('آیدی ضروری است.')
  }

  try {

    // پیدا کردن رزرو
    const reservation = await prisma.reservations.findUnique({
      where: {
        id: reserveId,
      },
    })

    // بررسی آیا رزرو وجود دارد
    if (!reservation || !reservation.orderId ) {
      console.log(2222222222)
      return createErrorResponseWithMessage('رزرو یافت نشد.')
    }

    // پیدا کردن تعداد رزروها
    const reservations = await prisma.reservations.count({
      where: {
        orderId: reservation.orderId,
      },
    })

    // بررسی آیا رزروها وجود دارد
    if (!reservations ) {
      return createErrorResponseWithMessage('رزرو یافت نشد.')
    }


    if(reservations > 1){
      await prisma.reservations.delete({ where: { id: reserveId } })
    }else{

      // دریافت سفارش
      const order = await prisma.orders.findUnique({
        where: {
          trackingCode: reservation.orderId,
        },
      })

      // بررسی آیا سفارش وجود دارد
      if (!order) {
        return createErrorResponseWithMessage('رزرو یافت نشد.')
      }


      const transactions = [
        prisma.orders.deleteMany({ where: { id: order.id } }),
      ]

      if (order.paymentId) {
        transactions.unshift(
            prisma.transaction.deleteMany({ where: { Payments: { some: { id: order.paymentId } } } }),
            prisma.payments.deleteMany({ where: { id: order.paymentId } })
        )
      }

      await prisma.$transaction(transactions)

      // await prisma.$transaction([
      //   prisma.transaction.deleteMany({ where: { Payments: { some: { id: order.paymentId } } } }),
      //   prisma.payments.deleteMany({ where: {  id: order.paymentId  } }),
      //   prisma.orders.deleteMany({ where: { id: order.id } }),
      // ]);

    }



    return createSuccessResponseWithMessage('رزرو حذف شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
