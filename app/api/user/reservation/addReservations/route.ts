import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import {  fullStringToDateObjectP } from '@/libs/convertor'
import prisma from '@/prisma/client'
import {TypeApiAddReservationsReq} from "@/types/typeApiUser";

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
  const body: TypeApiAddReservationsReq = await request.json()

  if (!Array.isArray(body)) {
    return createErrorResponseWithMessage('داده دریافتی باید آرایه‌ای از آبجکت‌ها باشد.')
  }

  // بررسی وجود داده های ورودی مورد نیاز
  const allPreReserve: TypeApiAddReservationsReq[] = []
  const results = await Promise.all(
    body.map(async (item, index) => {
      const { orderId, serviceId, providerId, userId, date, time }  = item

      const errorMessage = checkRequiredFields({
        orderId,
        serviceId,
        providerId,
        userId,
        date,
        time,
      })

      if (errorMessage) {
        return {
          index,
          success: false,
          message: `خطا در آیتم ${index + 1} (serviceId=${serviceId ?? 'نامشخص'}): ${errorMessage}`,
        }
      }

      try {
        // محاسبه زمان شروع و پایان
        const [startHour, startMinute] = time[0].split(':').map(Number)
        const [endHour, endMinute] = time[1].split(':').map(Number)

        const dateTimeStartEpoch = fullStringToDateObjectP(
          `${date} ${startHour}:${startMinute}`,
          'YYYY/MM/DD HH:mm'
        ).valueOf()
        const dateTimeEndEpoch = fullStringToDateObjectP(
          `${date} ${endHour}:${endMinute}`,
          'YYYY/MM/DD HH:mm'
        ).valueOf()

        const params : TypeApiAddReservationsReq = {
          orderId,
          serviceId,
          providerId,
          userId,
          dateTimeStartEpoch,
          dateTimeEndEpoch,
          date,
          time: time.join('-'), // "15:00-16:00"
        }

        // افزودن به لیست
        allPreReserve.push(params)

        return {
          index,
          success: true,
          message: `آیتم ${index + 1} با موفقیت پردازش شد.`,
        }
      } catch (e) {
        return {
          index,
          success: false,
          message: `خطای داخلی هنگام پردازش آیتم ${index + 1}: ${(e as Error).message}`,
        }
      }
    })
  )

  const successes = results.filter(r => r.success)
  const errors = results.filter(r => !r.success)

  try {
    // اگر کاربر draft قبلی دارد حذف شود تا آزاد شود.
    // await prisma.drafts.deleteMany({
    //   where: {
    //     userId: body[0].userId,
    //   },
    // })

    // رزروهایی که تاریخشون رد شده رو حذف میکنه ابتدا


    try {
      // ایجاد در حال رزرو برای زمان مورد نیاز
      await prisma.reservations.createMany({
        data: allPreReserve,
        // data: Object.values(allPreReserve),
      })
    } catch (error) {
      if (error.meta?.target === 'PRIMARY') {
        return createErrorResponseWithMessage(
          'یک یا چندتا از نوبت های شما در حال رزرو توسط کاربر دیگری هستند.'
        )
      } else {
        return handlerRequestError(error)
      }
    }

    return createSuccessResponseWithData({
      // success: errors.length === 0,
      results,
      status: errors.length === 0,
      successes: successes.length,
      errors: errors.length,
      message:
        errors.length === 0
          ?  'در حال رزرو ثبت شد.'
          : `پردازش کامل شد. موفق: ${successes.length}، ناموفق: ${errors.length}`
    })
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
