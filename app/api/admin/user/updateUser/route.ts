import prisma from '@/prisma/client'
import {
  handlerRequestError,
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithMessage,
} from '@/app/api/_utils/handleRequest'
import { checkUserExistenceForUpdate } from '@/app/api/_utils/helperPrisma'

const allowedMethods = ['PUT']

export async function PUT(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const body = await request.json()

  const { id, codeMeli, email, mobile } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    id,
    codeMeli,
    email,
    mobile,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // آیا کاربر قبل تر با این کدملی یا موبایل ثبت نام کرده یا خیر؟
    const hasUser = await checkUserExistenceForUpdate(codeMeli, email, mobile)

    if (hasUser !== 0) {
      return createErrorResponseWithMessage('کاربر با این کد ملی یا ایمیل یا موبایل وجود دارد.')
    }

    // ایجاد عملیات آپدیت کاربر
    await prisma.users.update({
      data: body,
      where: { codeMeli }, // {id},
    })

    return createSuccessResponseWithMessage('کاربر آپدیت شد.')
  } catch (error) {
    return handlerRequestError(error)
  }
}
