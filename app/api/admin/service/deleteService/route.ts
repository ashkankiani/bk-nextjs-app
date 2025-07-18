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
    // آیا سرویس دارای ارائه دهنده می باشد؟
    const serviceHasProvider = await prisma.providers.count({
      where: { serviceId: parseInt(id) },
    })

    if (serviceHasProvider !== 0) {
      return createErrorResponseWithMessage('ابتدا ارائه دهنده متصل به سرویس را حذف کنید.')
    }

    // حذف سرویس
    await prisma.services.delete({
      where: { id: parseInt(id) },
    })

    return createSuccessResponseWithMessage('سرویس حذف شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
