
import {checkMethodAllowed, createSuccessResponseWithData, handlerRequestError} from '@/app/api/_utils/handleRequest'
import Qs from 'qs'
import {NextResponse} from "next/server";

const allowedMethods = ['POST']

export async function GET(request: Request) {
  // بررسی مجاز بودن درخواست
  const methodCheckResponse = checkMethodAllowed(request, allowedMethods)
  if (methodCheckResponse) return methodCheckResponse

  // اعتبارسنجی توکن
  // const authResponse = await authenticateRequest(request);

  // if (!authResponse?.status) {
  //     return createErrorResponse(authResponse?.message);
  // }
  const body = await request.json()

  console.log(body)
  return createSuccessResponseWithData(body)

  try {

    // ?Authority=A0000000000000000000000000000wwOGYpd&Status=OK

    const callback = {
      status: query.status === "OK",
      authority: query.Authority
    }


    const redirectUrl = `/payment/?${Qs.stringify(callback)}`
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    return handlerRequestError(error)
  }
}


