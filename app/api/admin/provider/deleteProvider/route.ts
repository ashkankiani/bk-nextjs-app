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
    const reservations = await prisma.reservations.count({
      where: { providerId: parseInt(id) },
    })

    if (reservations > 0) {
      return createErrorResponseWithMessage('ابتدا رزروهای ارائه شده را حذف نمایید.')
    } else {
      // حذف ارائه دهنده
      await prisma.providers.delete({
        where: { id: parseInt(id) },
      })
      return createSuccessResponseWithMessage('ارائه دهنده حذف شد.')
    }
  } catch (error) {
    return handlerRequestError(error)
  }
}
