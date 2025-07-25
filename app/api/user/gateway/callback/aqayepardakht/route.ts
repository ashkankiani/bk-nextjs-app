import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  createTemplateSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import Qs from 'qs'
import { NextResponse } from 'next/server'
import { TYPE_ONLINE_PAYMENT_STATUS } from '@/libs/constant'

const allowedMethods = ['POST']

export async function POST(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }

  // دریافت اطلاعات داخل درخواست
  const formData = await request.formData()

  // تبدیل به آبجکت ساده
  const body = Object.fromEntries(formData.entries())

  if (process.env.NODE_ENV === 'development') {
    body.cardnumber = 'development'
  }

  // استخراج پارامترهای مورد نیاز
  const { transid, cardnumber, tracking_number, invoice_id, status } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    transid,
    cardnumber,
    tracking_number,
    invoice_id,
    status,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // ?transid=123&cardnumber=12323&tracking_number=213123&invoice_id=12321&bank=OK&status=1

    const Type = 'OnlinePayment'
    const Status =
      status === '1' ? TYPE_ONLINE_PAYMENT_STATUS.PAID : TYPE_ONLINE_PAYMENT_STATUS.UN_PAID
    const Authority = transid

    // آماده کردن URL برای هدایت به داشبورد
    const redirectUrl = new URL(
      `/payment?${Qs.stringify({
        Type,
        Status,
        Authority,
      })}`,
      process.env.NEXT_PUBLIC_FULL_PATH
    )

    return new Response(
      `
  <html>
    <head>
      <meta http-equiv="refresh" content="0; url=${redirectUrl.toString()}" />
      <script>window.location.href = "${redirectUrl.toString()}";</script>
    </head>
    <body>
      در حال انتقال...
    </body>
  </html>
  `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )

    // return createSuccessResponseWithData()
    // return NextResponse.redirect(redirectUrl, { status: 302 })
  } catch (error) {
    return handlerRequestError(error)
  }
}
