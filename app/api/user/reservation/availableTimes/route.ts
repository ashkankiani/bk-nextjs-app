import prisma from '@/prisma/client'
import {
  createSuccessResponseWithData,
  handlerRequestError,
  checkMethodAllowed,
  getQueryStringByUrl,
  createErrorResponseWithMessage,
  getQueryArrayFlexible,
} from '@/app/api/_utils/handleRequest'
import { dateNowP, fullStringToDateObjectP } from '@/libs/convertor'
import {
  groupHolidaysByDate,
  groupReservationsTimesByDate,
  groupTimesByDay,
  slotGenerator,
} from '@/libs/utility'
import { ReservationsStatus } from '@prisma/client'

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
  const serviceId = getQueryStringByUrl(request.url, 'serviceId')
  const providerId = getQueryStringByUrl(request.url, 'providerId')
  const startDate = getQueryStringByUrl(request.url, 'startDate')
  const endDate = getQueryStringByUrl(request.url, 'endDate')
  const statusArray = getQueryArrayFlexible(request.url, 'status') as ReservationsStatus[]

  // بررسی وجود داده های ورودی مورد نیاز
  if (!serviceId || !providerId || !startDate || !endDate || !statusArray) {
    return createErrorResponseWithMessage('داده اصلی ضروری است.')
  }

  // کنترل داده ورودی ارسالی از کش
  if (serviceId === '0' || providerId === '0') {
    return createErrorResponseWithMessage('داده اصلی اشتباه است.')
  }

  try {
    // دریافت تنظیمات
    const settings = await prisma.settings.findMany()

    if (!settings || !settings[0]) {
      return createErrorResponseWithMessage('دسترسی به تنظیمات مویثر نشد.')
    }

    // دریافت سرویس
    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(serviceId),
      },
    })

    if (!service) {
      return createErrorResponseWithMessage('دسترسی به سرویس مویثر نشد.')
    }

    // دریافت ارائه دهنده
    const provider = await prisma.providers.findUnique({
      where: {
        id: parseInt(providerId),
      },
    })

    if (!provider) {
      return createErrorResponseWithMessage('دسترسی به ارائه دهنده مویثر نشد.')
    }

    // دریافت رزروهای اخذ شده در بازه زمانی
    const reservations = await prisma.reservations.findMany({
      where: {
        serviceId: service.id,
        providerId: provider.id,
        dateTimeStartEpoch: {
          gte: fullStringToDateObjectP(startDate)
            .setHour(0)
            .setMinute(0)
            .setSecond(0)
            .setMillisecond(0)
            .valueOf(),
        },
        dateTimeEndEpoch: {
          lte: fullStringToDateObjectP(endDate)
            .setHour(0)
            .setMinute(0)
            .setSecond(0)
            .setMillisecond(0)
            .valueOf(),
        },
        status: {
          in: statusArray,
        },
      },
    })

    // ساخت گروهی آبجکت رزوها بر اساس تاریخ
    const reserveList = groupReservationsTimesByDate(reservations)

    // دریافت لیست تعطیلات
    const holidays = await prisma.holidays.findMany()

    // ساخت آبجکت لیست تعطیلات
    const dayHolidays = groupHolidaysByDate(holidays)

    // دریافت برنامه زمانی ارائه دهنده برای سرویس مدنظر
    const timeSheets = await prisma.timeSheets.findMany({
      where: {
        serviceId: parseInt(serviceId),
        providerId: parseInt(providerId),
      },
    })

    if (timeSheets.length === 0) {
      return createErrorResponseWithMessage('برنامه زمانی ثبت نشده است.')
    }

    // گروه‌بندی بازه‌های زمانی بر اساس شماره روز هفته
    const hours = groupTimesByDay(timeSheets)

    const calender = slotGenerator({
      startDate: startDate,
      endDate: endDate,
      hours: hours,
      dayHolidays: dayHolidays,
      workInHolidays: provider.workHolidays,
      reserveList: reserveList,
      slotTimeRest:
        provider.startTime && provider.endTime ? [provider.startTime, provider.endTime] : [],
      periodTime: service.periodTime,
      slotTime: provider.slotTime,
      minReservationTime: settings[0].minReservationTime,
      capacity: service.capacity,
    })
    return createSuccessResponseWithData(calender)
  } catch (error) {
    return handlerRequestError(error)
  }
}
