import prisma from '@/prisma/client'
import {
  checkMethodAllowed,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
  getQueryStringByUrl,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'

const allowedMethods = ['DELETE']

export async function DELETE(request: Request) {
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  const id = getQueryStringByUrl(request.url)

  // بررسی وجود ID
  if (!id) {
    return createErrorResponseWithMessage('آیدی ضروری است.')
  }

  try {
    await prisma.timeSheets.delete({
      where: { id: parseInt(id) },
    })

    return createSuccessResponseWithMessage('deleted successfully')
  } catch (error) {
    return handlerRequestError(error)
  }
}
