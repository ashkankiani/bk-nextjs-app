import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
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
  const { title } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    title,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // ثبت سطح دسترسی جدید
    const newCatalog = await prisma.catalogs.create({
      data: body,
    })

    // ثبت مجوز برای سطح دسترسی
    await prisma.permissions.create({
      data: { catalogId: newCatalog.id },
    })

    return createSuccessResponseWithMessage('سطح دسترسی ثبت شد.')
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
