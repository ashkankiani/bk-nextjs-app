import {
  checkMethodAllowed,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { TypeApiSettings } from '@/types/typeApiAdmin'

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
    const settings: TypeApiSettings[] = await prisma.settings.findMany()
    return createSuccessResponseWithData(settings[0])
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
