import {
  checkMethodAllowed,
  checkRequiredFields,
  createErrorResponseWithMessage,
  createSuccessResponseWithData,
  createSuccessResponseWithMessage,
  handlerRequestError,
} from '@/app/api/_utils/handleRequest'
import { fullStringToDateObjectP } from '@/libs/convertor'
import prisma from '@/prisma/client'
import {
  groupTimesByDay,
  groupReservationsTimesByDate,
  PNtoEN,
  slotGenerator,
  groupHolidaysByDate,
} from '@/libs/utility'
import { TypeApiService } from '@/types/typeApiEntity'

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
  const { serviceId, providerId, date } = body

  // بررسی وجود داده های ورودی مورد نیاز
  const errorMessage = checkRequiredFields({
    serviceId,
    providerId,
    date,
  })

  if (errorMessage) {
    return createErrorResponseWithMessage(errorMessage)
  }

  try {
    // دریافت سرویس
    const service = await prisma.services.findUnique({
      where: {
        id: serviceId,
      },
    })

    if (!service) {
      return createErrorResponseWithMessage('دسترسی به سرویس مویثر نشد.')
    }

    // دریافت ارائه دهنده
    const provider = await prisma.providers.findUnique({
      where: {
        id: providerId,
      },
    })

    if (!provider) {
      return createErrorResponseWithMessage('دسترسی به ارائه دهنده مویثر نشد.')
    }

    // دریافت داده های مورد نیاز اولیه
    const [
      responseReservations,
      responseDraft,
      responseHolidays,
      responseSetting,
      responseTimeSheet,
    ] = await Promise.all([
      prisma.reservations.findMany({
        where: {
          serviceId: service.id,
          providerId: provider.id,
          date: date,
          status: {
            in: ['REVIEW', 'COMPLETED', 'DONE'],
          },
        },
      }),
      prisma.drafts.findMany({
        where: {
          serviceId: service.id,
          providerId: provider.id,
          date: date,
        },
      }),
      prisma.holidays.findMany(),
      prisma.settings.findFirst(),
      prisma.timeSheets.findMany({
        where: {
          serviceId: service.id,
          providerId: provider.id,
        },
      }),
    ])

    if (
      !responseReservations ||
      !responseDraft ||
      !responseHolidays ||
      !responseSetting ||
      !responseTimeSheet
    ) {
      return createSuccessResponseWithMessage('دریافت اطلاعات با خطا روبرو شده است.')
    }

    // ساخت آبجکت لیست تعطیلات
    const dayHolidays = groupHolidaysByDate(responseHolidays)
    const hours = groupTimesByDay(responseTimeSheet)
    const merge = responseReservations.concat(responseDraft)
    const reserveList = groupReservationsTimesByDate(merge)

    const objStartDate = PNtoEN(fullStringToDateObjectP(date, 'YYYY-MM-DD').format())
    const objEndDate = PNtoEN(fullStringToDateObjectP(date, 'YYYY-MM-DD').format())

    const dataTimeSheet = slotGenerator(
      objStartDate,
      objEndDate,
      hours,
      dayHolidays,
      provider.workHolidays,
      reserveList,
      provider.startTime && body.provider.endTime
        ? [body.provider.startTime, body.provider.endTime]
        : [],
      service.periodTime,
      provider.slotTime,
      responseSetting.minReservationTime,
      service.capacity
    )

    return createSuccessResponseWithData(dataTimeSheet)
  } catch (error: unknown) {
    return handlerRequestError(error)
  }
}
