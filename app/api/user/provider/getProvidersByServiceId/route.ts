import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
} from '@/app/api/_utils/handleRequest'
import { TypeApiGetProvidersForServiceRes } from '@/types/typeApiAdmin'

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
    // Parse query parameters and convert values to numbers
    const url = new URL(request.url)
    const query: Record<string, unknown> = {}
    url.searchParams.forEach((value, key) => {
      query[key] = Number(value)
    })

    const providers: TypeApiGetProvidersForServiceRes[] = await prisma.providers.findMany({
      where: query,
      include: {
        service: {
          select: {
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            mobile: true,
            email: true,
          },
        },
      },
    })
    return createSuccessResponseWithData(providers)
  } catch (error) {
    return handlerRequestError(error)
  }
}
