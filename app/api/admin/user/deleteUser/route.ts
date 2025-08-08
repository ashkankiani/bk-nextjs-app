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

    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { Payments: { some: { userId: id } } } }),
      prisma.payments.deleteMany({ where: { userId: id } }),
      prisma.orders.deleteMany({ where: { userId: id } }),
      prisma.sessions.deleteMany({ where: { userId: id } }),
    ]);

    // حذف کاربر
    await prisma.users.delete({
      where: { id: id },
    })

    return createSuccessResponseWithMessage('کاربر حذف شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
