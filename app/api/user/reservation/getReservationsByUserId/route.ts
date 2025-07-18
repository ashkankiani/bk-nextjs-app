import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl,
  createErrorResponseWithMessage,
} from '@/app/api/_utils/handleRequest'
import { dateNowP } from '@/libs/convertor'

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

  // دریافت Id درخواست
  const userId = getQueryStringByUrl(request.url, 'userId')

  // بررسی وجود ID
  if (!userId) {
    return createErrorResponseWithMessage('آیدی ضروری است.')
  }

  try {
    const month = dateNowP()
    const epochFirstMonth = month
      .toFirstOfMonth()
      .setHour(0)
      .setMinute(0)
      .setSecond(0)
      .setMillisecond(0)
      .valueOf()
    const epochLastMonth = month
      .add(1, 'month')
      .toLastOfMonth()
      .setHour(23)
      .setMinute(59)
      .setSecond(59)
      .setMillisecond(999)
      .valueOf()

    // جستجو بین رزرو ها
    // eslint-disable-next-line no-undef
    // BigInt.prototype.toJSON = function () {
    //     const int = Number.parseInt(this.toString());
    //     return int ?? this.toString();
    // };
    //

    // دریافت رزروهای کاربر
    const reservations = await prisma.reservations.findMany({
      where: {
        AND: [
          { userId: parseInt(userId) },
          {
            status: {
              in: ['REVIEW', 'COMPLETED', 'DONE'],
            },
          },
          {
            dateTimeStartEpoch: {
              gte: epochFirstMonth,
            },
          },
          {
            dateTimeEndEpoch: {
              lte: epochLastMonth,
            },
          },
        ],
      },
    })

    return createSuccessResponseWithData(reservations)
  } catch (error) {
    return handlerRequestError(error)
  }
}
