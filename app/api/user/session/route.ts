import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { isAuthenticated } from '@/libs/authentication'
import {
  checkMethodAllowed,
  createSuccessResponseWithData,
  handlerRequestError,
} from '../../_utils/handleRequest'
import { SESSION } from '@/libs/constant'

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
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION)

    if (!token || !token.value) {
      return NextResponse.json({ message: 'User not Authorized' }, { status: 401 })
    }

    const authStatus = await isAuthenticated(token.value)

    // حذف کوکی با تنظیم تاریخ انقضا در گذشته
    const response = NextResponse.json(
      authStatus.status ? { message: 'deleted successfully' } : { message: 'Token not Authorized' },
      { status: authStatus.status ? 200 : 401 }
    )

    response.cookies.set(SESSION, '', {
      path: '/',
      expires: new Date(0),
    })

    if (authStatus.status) {
      await prisma.sessions.delete({
        where: {
          userId: authStatus.userId,
        },
      })
    }
    return createSuccessResponseWithData(response)
  } catch (error) {
    return handlerRequestError(error)
  }
}
