import prisma from '@/prisma/client'
import {
  handlerRequestError,
  checkMethodAllowed,
  createSuccessResponseWithMessage,
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

  try {
    // حذف همه در حال رزروها
    // await prisma.drafts.deleteMany()

    return createSuccessResponseWithMessage('در حال رزروها حذف شدند.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
