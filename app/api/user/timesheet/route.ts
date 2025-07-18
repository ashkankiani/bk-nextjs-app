// کامنتش کردم چون تون provider دارمش اینجا واسه چیه ؟؟

import {
  checkMethodAllowed,
  createErrorResponse,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'

const allowedMethods = ['POST']

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //   return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()
  const { condition } = body

  // بررسی وجود شماره موبایل
  if (!condition) {
    return createErrorResponse('Condition Is Required')
  }

  try {
    const timeSheets = await prisma.timeSheets.findMany(condition)
    return createSuccessResponseWithData(timeSheets)
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
