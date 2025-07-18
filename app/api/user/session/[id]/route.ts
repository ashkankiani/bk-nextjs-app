import prisma from '@/prisma/client'
import {
  checkMethodAllowed,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  getQueryStringByUrl,
  handlerRequestError,
  serializeBigIntToNumber,
} from '@/app/api/_utils/handleRequest'

const allowedMethods = ['GET']

export async function GET(request: Request) {
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
    // حذف سشن‌هایی که منقضی شده‌اند (بیش از 1 روز قبل)
    await prisma.sessions.deleteMany({
      where: {
        expires: {
          lte: Date.now() - 86400000, // One Day
        },
      },
    })

    const session = await prisma.sessions.findUnique({
      where: {
        userId: parseInt(id),
      },
    })

    // تبدیل BigInt به عدد برای ارسال به کلاینت
    const safeSession = session ? serializeBigIntToNumber(session) : null

    return createSuccessResponseWithData(safeSession)
  } catch (error) {
    return handlerRequestError(error)
  }
}
