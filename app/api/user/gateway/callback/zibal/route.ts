import { checkMethodAllowed, handlerRequestError } from '@/app/api/_utils/handleRequest'
import Qs from 'qs'
import { NextResponse } from 'next/server'
import { TYPE_ONLINE_PAYMENT_STATUS } from '@/libs/constant'

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

  const { searchParams } = new URL(request.url)
  const query: Record<string, string> = {}

  try {
    // ?trackId=9900&success=1&status=2&orderId=1
    searchParams.forEach((value, key) => {
      query[key] = value
    })

    const Type = 'OnlinePayment'
    const Status =
      query.success === '1' ? TYPE_ONLINE_PAYMENT_STATUS.PAID : TYPE_ONLINE_PAYMENT_STATUS.UN_PAID
    const Authority = query.trackId

    // آماده کردن URL برای هدایت به داشبورد
    const redirectUrl = new URL(
      `/payment?${Qs.stringify({
        Type,
        Status,
        Authority,
      })}`,
      process.env.NEXT_PUBLIC_FULL_PATH
    )
    return NextResponse.redirect(redirectUrl, { status: 302 })
  } catch (error) {
    return handlerRequestError(error)
  }
}
