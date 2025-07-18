import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import prisma from '@/prisma/client'
import { encodeJwt } from '@/libs/authentication'
import bcrypt from 'bcrypt'
import { TypeApiProviders } from '@/types/typeApiAdmin'
import { findPermissions, findUserByCodeMeli, upsertSession } from '@/app/api/_utils/helperPrisma'

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
  const { codeMeli, password } = body
  console.log(codeMeli)
  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    codeMeli,
    password,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // بررسی وجود کاربر با این کدملی
    const hasUser = await findUserByCodeMeli(codeMeli)

    if (!hasUser) {
      return createErrorResponseWithMessage('کاربری با این کد ملی یافت نشد.')
    }

    // بررسی تطابق پسورد کاربر
    const isPasswordValid = await bcrypt.compare(password, hasUser.password)
    if (!isPasswordValid) {
      return createErrorResponseWithMessage('کلمه عبور برای این کدملی اشتباه است.')
    }

    // دریافت مجوزهای کاربر
    const permissions = await findPermissions(hasUser.catalogId)

    // مدت زمان برای نشست
    const epoch = Date.now() + 86400000 // One Day

    type TypeUser = {
      id: number
      catalogId: number
      codeMeli: string
      fullName: string
      mobile: string
      email: string | null
      locked: boolean
      providerIds?: number[]
    }
    // ساخت داده خروجی کاربر
    const user: TypeUser = {
      id: hasUser.id,
      catalogId: hasUser.catalogId,
      codeMeli: hasUser.codeMeli,
      fullName: hasUser.fullName,
      mobile: hasUser.mobile,
      email: hasUser.email,
      locked: hasUser.locked,
    }

    // اگر کاربر ما Provider باشد باید لیست ایدی هایی که اپراتور آن است را برگردانیم
    if (hasUser.catalogId === 3) {
      const providers: TypeApiProviders[] = await prisma.providers.findMany({
        where: { userId: hasUser.id },
      })
      user.providerIds = providers.map(item => item.id)
    }

    // ایجاد نشست
    const session = await encodeJwt({ userId: user.id, catalogId: user.catalogId })

    // ذخیره سازی نشست یا تمدید آن
    await upsertSession(user.id, session, epoch)

    // ایجاد پاسخ به درخواست
    const response = { ...user, permissions }

    return createSuccessResponseWithData(response, {
      'Set-Cookie': `bk-session=${session}; HttpOnly; Path=/; Max-Age=86400`,
    })
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
