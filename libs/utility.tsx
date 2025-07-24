import { toast, ToastOptions } from 'react-toastify'
import { getCookie } from 'cookies-next'
import { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { dateNowP, fullStringToDateObjectP } from '@/libs/convertor'
import {
  TypeBankName,
  TypeDiscountsType,
  TypeGender,
  TypeHeaders,
  TypePaymentType,
  TypeReservationsStatus,
  TypeToast,
} from '@/types/typeConfig'
import { SESSION } from '@/libs/constant'
import React from 'react'
import Qs from 'qs'
import { TypeApiHoliday, TypeApiReservation, TypeApiTimeSheet } from '@/types/typeApiEntity'

/*<====================================>*/
// ایجاد توست های سریع
/*<====================================>*/
export function bkToast(type: TypeToast, text: string) {
  const option: ToastOptions<unknown> = {
    theme: localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
    position: 'bottom-left',
  }
  switch (type) {
    case (type = 'success'):
      toast.success(text, option)
      break
    case (type = 'error'):
      toast.error(text, option)
      break
    case (type = 'info'):
      toast.info(text, option)
      break
    case (type = 'warning'):
      toast.warn(text, option)
      break
    default:
      toast(text, option)
      break
  }
}

/*<====================================>*/
// افزودن هدر به درخواست ها
/*<====================================>*/
export function AppHeader(): { headers: Headers } {
  return {
    headers: Qs.parse({ Authorization: String(getCookie(SESSION)) }) as TypeHeaders,
  }
}

/*<====================================>*/
// تنها باید عدد وارد نماید
/*<====================================>*/
export function onlyTypeNumber(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault()
  }
}

/*<====================================>*/
// بررسی قدرت پسورد و شرایط مورد نیاز یک پسورد
/*<====================================>*/
export function passwordStrength(val: string) {
  const atLeastOneUppercase = /[A-Z]/g // capital letters from A to Z
  const atLeastOneLowercase = /[a-z]/g // small letters from a to z
  const atLeastOneNumeric = /[0-9]/g // numbers from 0 to 9
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g // any of the special characters within the square brackets
  const fiveCharsOrMore = /.{5,}/g // eight characters or more
  return {
    uppercase: val.match(atLeastOneUppercase),
    lowercase: val.match(atLeastOneLowercase),
    number: val.match(atLeastOneNumeric),
    specialChar: val.match(atLeastOneSpecialChar),
    fiveCharsOrGreater: val.match(fiveCharsOrMore),
  }
}

/*
export function minuteMaker(minute) {

    minute = minute < 1439 ? minute : 1439 // نباید بیشتر از یک روز باشد.
    var time = [
        Math.floor(minute / 60), // ساعت
        minute % 60 // دقیقه
    ];

    for (var i = 0; i < time.length; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i];
        }
    }
    return time.join(':');

}
*/

/*<====================================>*/
// Convert Persian number to English number
/*<====================================>*/
export function PNtoEN(str: number | string): string {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  if (typeof str === 'string') {
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i))
    }
  }
  return str.toString()
}

export function dayNameByIndex(num: number): string {
  const days: string[] = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
  return days[num]
}

/*<====================================>*/
// ایجاد کد رهگیری رزرو بر مبنای زمان
/*<====================================>*/
export function generateTrackingCodeWithDate(): string {
  const date = new DateObject({
    calendar: persian,
    locale: persian_fa,
  })
  const { year, month, day, hour, minute, second } = date
  const modifyMonth = String(month.number).padStart(2, '0')
  return `${year}${modifyMonth}${day}${hour}${minute}${second}`
}

/*<====================================>*/
// یک کد 6 رقمی تولید می کند.
/*<====================================>*/
export function generateCode(): number {
  const min = 100000
  const max = 999999
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function textPaymentType(value: TypePaymentType): string {
  switch (value) {
    case 'OnlinePayment':
      return 'پرداخت آنلاین'
    case 'CashPayment':
      return 'پرداخت نقدی'
    case 'CartByCart':
      return 'کارت به کارت'
    case 'CardReader':
      return 'دستگاه کارت خوان'
    case 'Free':
      return 'رایگان'
    case 'UnknownPayment':
      return 'پرداخت در محل'
    default:
      return 'تعریف نشده'
  }
}

export function textReservationsStatus(value: TypeReservationsStatus): string {
  switch (value) {
    case 'REVIEW':
      return 'در صف بررسی'
    case 'COMPLETED':
      return 'تکمیل شده'
    case 'DONE':
      return 'انجام شده'
    case 'CANCELED':
      return 'لغو شده'
    case 'REJECTED':
      return 'رد شده'
    case 'PENDING':
      return 'در حال رزرو'
    default:
      return 'تعریف نشده'
  }
}

export function textBankName(value: TypeBankName | 'COD'): string {
  switch (value) {
    case 'ZARINPAL':
      return 'زرین پال'
    case 'IDPAY':
      return 'آیدی پی'
    case 'AQAYEPARDAKHT':
      return 'آقای پرداخت'
    case 'ZIBAL':
      return 'زیبال'
    case 'COD':
      return 'پرداخت در محل'
    default:
      return 'تعریف نشده'
  }
}

export function textDiscountsType(value: TypeDiscountsType): string {
  switch (value) {
    case 'CONSTANT':
      return 'مبلغ ثابت'
    case 'PERCENT':
      return 'درصدی'
    default:
      return 'تعریف نشده'
  }
}

/*<====================================>*/
// ترجمه نوع جنسیت
/*<====================================>*/
export function textGenderType(value: TypeGender): string {
  switch (value) {
    case 'NONE':
      return 'نامشخص'
    case 'WOMAN':
      return 'زن'
    case 'MAN':
      return 'مرد'
    default:
      return 'تعریف نشده'
  }
}

/*<====================================>*/
// ایجاد اسلات های بازه های زمانی و وضعیت آنها برای نمایش تقویم کاری
/*<====================================>*/
type TypeSlotGenerator = {
  startDate: string
  endDate: string
  hours: TypeGroupTimesByDay
  dayHolidays: TypeGroupHolidaysByDate
  workInHolidays: boolean
  reserveList: TypeGroupReservationsTimesByDate
  slotTimeRest: string[]
  periodTime: number
  slotTime: number
  minReservationTime: number
  capacity: number
}

export function slotGenerator({
  startDate,
  endDate,
  hours,
  dayHolidays,
  workInHolidays,
  reserveList,
  slotTimeRest,
  periodTime,
  slotTime,
  minReservationTime,
  capacity,
}: TypeSlotGenerator) {
  // startDate = "YYYY/MM/DD" // تاریخ شروع  سرویس
  // endDate = "YYYY/MM/DD" // تاریخ پایان  سرویس
  // hours =  {
  //          1: [["14:00", "20:00"], ["18:00", "22:00"]], // Saturday
  //          2: [["08:00", "14:00"], ["14:00", "15:00"]], // Sunday
  //          3: [["09:00", "15:00"], ["17:00", "20:00"]], // Monday
  //          4: [["10:00", "16:00"]], // Tuesday
  //          5: [["11:00", "17:00"], ["09:00", "12:00"]], // Wednesday
  //          6: [["12:00", "18:00"]], // Thursday
  //          7: [["13:00", "19:00"]], // Friday
  //      }
  // گروه‌بندی بازه‌های زمانی بر اساس شماره روز هفته
  // dayHolidays = [["1403/01/02" , "رحلت امام"] , ...] // آبجکت لیست تعطیلات
  // workHolidays = true/false // آیا ارائه دهنده ر.ز تعطیل کار میکند یا خیر
  // reserveList =  {
  //          "1402-08-28": [["10:00", "11:00"], ["14:49", "16:00"]],
  //          "1402-08-29": [[ "17:00", "17:50" ],[ "18:00", "18:50" ],[ "19:00", "19:50" ]]
  //      }
  // لیست رزروهای انجام شده + رزروهای در حال رزرو کرده
  // slotTimeRest = [ "10:00", "11:00" ] || [] // بازه ساعتی استراحت ثابت
  // periodTime = 60 // مدت زمان خدمت
  // slotTime = 10 // مدت استراحت بین هر نوبت
  // minReservationTime = 50 // حداقل دقیقه قبل شروع رزرو که می تواند رزرو داشته باشیم
  // capacity = 10 // ظرفیت نفرات در رزرو

  const startDateDateObject = fullStringToDateObjectP(startDate)
  const endDateDateObject = fullStringToDateObjectP(endDate)

  const result: {
    date: string
    dayIsHoliday: boolean
    title: string
    timeSheet: TypeTimeSlotGenerator
    is: boolean
  }[] = []

  // بازه های زمانی تایم کاری را هماهنگ و مرتب میکنیم.
  hours = mergeOverlappingTimes(hours)

  // ایجاد ابجکت تاریخ و عنوان تعطیلی ها
  let titleDayHoliday = ''
  const listDateHoliday: string[] = []
  const listTitleHoliday: string[] = []

  for (const [date, text] of dayHolidays) {
    listDateHoliday.push(date)
    listTitleHoliday.push(text)
  }

  // حلقه بررسی روزهای بین بازه زمانی
  while (endDateDateObject >= startDateDateObject) {
    // روز مورد بررسی به صورت دیفالت، تعطیل نمی باشد.
    let dayIsHoliday = false

    // تاریخ امروز
    // 1403/06/17
    const today: string = PNtoEN(dateNowP().format('YYYY/MM/DD'))

    // 1403/06/17
    // تبدیل دیت ابجکت تاریخ جاری حلقه به تاریخ
    const currentDay: string = PNtoEN(startDateDateObject.format('YYYY/MM/DD'))

    // [ ["10:00","16:00"],["20:00","22:00"]]
    // بدست اوردن ساعت های کاری در ان روز توسط ایندکس روز هفته
    const periodTimeHours = hours[parseInt(PNtoEN(startDateDateObject.format('d')))]

    // بررسی آیا ارئه دهنده روز های تعطیل کار می کند یا نه.
    if (!workInHolidays) {
      // بررسی که روز جاری ایا در روزهای تعطیل ما می باشد یا خیر
      dayIsHoliday = listDateHoliday.includes(PNtoEN(startDateDateObject.format('"YYYY/MM/DD"')))
      // بدست اوردن عنوان روز تعطیل
      titleDayHoliday =
        listTitleHoliday[
          listDateHoliday.indexOf(PNtoEN(startDateDateObject.format('"YYYY/MM/DD"')))
        ]
    }

    // ساخت اسلات بازه شروع و پایان زمان های رزرو
    let startSlot
    let endSlot
    let slot

    // تقویم کاری کامل روز جاری
    const currentTimeSheet: TypeTimeSlotGenerator = []

    // ایجاد اسلات بازه های زمانی
    // ["10:00" , "11:00", false, "no-reserved", 1 ][]

    if (periodTimeHours) {
      periodTimeHours.forEach(item => {
        startSlot = item[0] // "10:00"
        endSlot = item[1] // "16:00"
        slot = [startSlot, endSlot] // ["10:00","16:00"]
        currentTimeSheet.push(...timeSlotGenerator(slot, periodTime, slotTime, capacity))
      })
    }

    // مقایسه بین اسلات بازه های زمانی بدست آمده با رزروهای قبل تر رزرو شده + در حال رزرو
    for (const date in reserveList) {
      if (PNtoEN(startDateDateObject.format('YYYY/MM/DD')) === PNtoEN(date)) {
        // بازه زمانی در آن تاریخ
        // [startTime: string, endTime: string, reserved: boolean]
        const times = reserveList[date]

        // ادغام رزروها و درج ظرفیت ها و وضعیت رزرو
        const mergedTimes: TypeTimeRecord[] = []

        times.forEach(time => {
          const found = mergedTimes.find(t => t[0] === time[0] && t[1] === time[1])
          if (found) {
            found[3]++
          } else {
            mergedTimes.push([...time, 1])
          }
        })

        for (let i = 0; i < mergedTimes.length; i++) {
          if (capacity <= mergedTimes[i][3]) {
            replaceTime(
              currentTimeSheet,
              mergedTimes[i],
              true,
              mergedTimes[i][2] ? 'رزرو شده.' : 'کاربر دیگر در حال رزرو...',
              capacity - mergedTimes[i][3]
            )
          } else {
            replaceTime(
              currentTimeSheet,
              mergedTimes[i],
              false,
              'رزرو نشده.',
              capacity - mergedTimes[i][3]
            )
          }
        }
      }
    }

    // اعمال روز استراحت ثابت روی تقویم کاری
    const createSlotTimeRest: TypeTimeRecord = [slotTimeRest[0], slotTimeRest[1], true, 0]
    replaceTime(currentTimeSheet, createSlotTimeRest, true, 'زمان استراحت', 0)

    result.push({
      date: currentDay,
      dayIsHoliday: dayIsHoliday,
      title: titleDayHoliday,
      timeSheet: dayIsHoliday
        ? []
        : currentDay === today
          ? removeTimeRangeAndBefore(currentTimeSheet, minReservationTime)
          : currentTimeSheet,
      is: currentDay === today,
    })
    startDateDateObject.add(1, 'days')
  }
  return result
}

/*<====================================>*/
// بازه های زمانی تایم کاری را هماهنگ و مرتب میکند.
/*<====================================>*/
function mergeOverlappingTimes(hours: TypeGroupTimesByDay): TypeGroupTimesByDay {
  for (const day in hours) {
    hours[day].sort((a, b) => a[0].localeCompare(b[0]))
    const merged = [hours[day][0]]
    for (let i = 1; i < hours[day].length; i++) {
      const lastMergedEnd: Date = new Date('1970/01/01 ' + merged[merged.length - 1][1])
      const currentStart: Date = new Date('1970/01/01 ' + hours[day][i][0])
      const currentEnd: Date = new Date('1970/01/01 ' + hours[day][i][1])
      if (currentStart <= lastMergedEnd) {
        lastMergedEnd.setTime(Math.max(lastMergedEnd.getTime(), currentEnd.getTime()))
        merged[merged.length - 1][1] = lastMergedEnd.toTimeString().split(' ')[0].substring(0, 5)
      } else {
        merged.push(hours[day][i])
      }
    }
    hours[day] = merged
  }
  return hours
}

/*<====================================>*/
// تبدیل "10:00" به یک زمان Date
/*<====================================>*/
function convertToTime(timeStr: string) {
  const timeParts: string[] = timeStr.split(':')
  const date = new Date()
  date.setHours(Number(timeParts[0]))
  date.setMinutes(Number(timeParts[1]))
  date.setSeconds(0)
  return date
}

/*<====================================>*/
// ایجاد زمان جدید در دقایق آینده
/*<====================================>*/
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

/*<====================================>*/
// ایجاد رکرودی از اسلات های زمانی
/*<====================================>*/
// slot = ["10:00","16:00"]
// periodTime = 60
// slotTime = 10
// capacity = 3
export type TypeTimeSlotGenerator = (string | number | boolean)[][]

function timeSlotGenerator(
  slot: string[],
  periodTime: number,
  slotTime: number,
  capacity: number
): TypeTimeSlotGenerator {
  // تبدیل استرینگ زمانی به Date
  const startTime: Date = convertToTime(slot[0])
  const endTime: Date = convertToTime(slot[1])

  let currentTime: Date = startTime
  const timePairs = []
  while (currentTime < endTime) {
    const nextTime = addMinutes(currentTime, periodTime)
    if (nextTime > endTime) {
      break
    }
    // [currentTime : string , nextTime: string, reserved: boolean, text: string, capacity: number ][]
    timePairs.push([formatTime(currentTime), formatTime(nextTime), false, 'رزرو نشده', capacity])
    currentTime = addMinutes(nextTime, slotTime)
  }
  return timePairs
}

/*<====================================>*/
// ایجاد فرمت زمانی مورد نیاز
// "10:00:
/*<====================================>*/
function formatTime(date: Date): string {
  const hours: string = date.getHours().toString().padStart(2, '0')
  const minutes: string = date.getMinutes().toString().padStart(2, '0')
  return hours + ':' + minutes
}

/*<====================================>*/
// تبدیل "10:00" به دقیقه
/*<====================================>*/
function convertToMinutes(time: string): number {
  const timeParts = time.split(':')
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1])
}

/*<====================================>*/
// بررسی و جایگزینی بازه های زمانی و وضعیت و ظرفیت آنها
/*<====================================>*/
export type TypeTimeRecord = [
  startTime: string,
  endTime: string,
  reserved: boolean,
  capacity: number,
]

function replaceTime(
  currentTimeSheet: TypeTimeSlotGenerator,
  mergedTimes: TypeTimeRecord,
  status: boolean,
  title: string,
  remainingCapacity: number
) {
  // if (mergedTimes.length === 0) {
  if (!mergedTimes || mergedTimes[0] === undefined) {
    return currentTimeSheet
  }

  const slotTimeStart = convertToMinutes(mergedTimes[0])
  const slotTimeEnd = convertToMinutes(mergedTimes[1])

  for (let i = 0; i < currentTimeSheet.length; i++) {
    if (currentTimeSheet[i].length !== 0) {
      const timeStart = convertToMinutes(currentTimeSheet[i][0] as string) // currentTime : string
      const timeEnd = convertToMinutes(currentTimeSheet[i][1] as string) // nextTime: string

      if (timeStart < slotTimeEnd && timeEnd > slotTimeStart) {
        currentTimeSheet[i] = [
          currentTimeSheet[i][0],
          currentTimeSheet[i][1],
          status,
          title,
          remainingCapacity,
        ]
      }
    }
  }
  return currentTimeSheet
}

/*<====================================>*/
// بازه های زمانی را بررسی و بازه ای که فاصله لازم برای رزرو
// تا minReservationTime را نداشته باشد رو حذف میکند.
/*<====================================>*/
export function removeTimeRangeAndBefore(
  times: TypeTimeSlotGenerator,
  minReservationTime: number
): TypeTimeSlotGenerator {
  if (times.length === 0 || minReservationTime === 0) {
    return times
  }

  let now
  const today: DateObject = dateNowP()
  const checkTomorrow = dateNowP().add(minReservationTime, 'minutes')

  if (today.day === checkTomorrow.day) {
    now = PNtoEN(dateNowP().add(minReservationTime, 'minutes').format('HH:mm'))
  } else {
    now = '23:59'
  }

  // تبدیل زمان‌ها به فرمت عددی
  const nowNum = parseInt(now.replace(':', ''))
  const timesSample = times.map(timeRange => timeRange.map(time => parseInt(time.replace(':', ''))))

  // پیدا کردن اندیس اولین بازه قابل حذف
  const indexToRemove = timesSample.findIndex(timeRange => timeRange[0] >= nowNum)

  // اگر بازه‌ای پیدا نشد، هیچ تغییری ایجاد نمی‌کنیم
  if (indexToRemove === -1) {
    return [[times[0][0], times[times.length - 1][1], true, 'نوبت فعالی برای امروز وجود ندارد.']]
  }
  // حذف بازه‌ها از ابتدای آرایه تا اندیس پیدا شده
  times.splice(0, indexToRemove)
  return times
}

/*<====================================>*/
// گروه‌بندی بازه‌های زمانی بر اساس شماره روز هفته (dayIndex)
// خروجی: شی‌ای که کلیدهای آن شماره روز هفته و مقدار آن آرایه‌ای از بازه‌های زمانی [startTime, endTime] است
/*<====================================>*/
export type TypeGroupTimesByDay = Record<number, [string, string][]>

export function groupTimesByDay(timeSheetArray: TypeApiTimeSheet[]): TypeGroupTimesByDay {
  const result: TypeGroupTimesByDay = {}

  for (const item of timeSheetArray) {
    const { dayIndex, startTime, endTime } = item

    if (!result[dayIndex]) {
      result[dayIndex] = []
    }

    result[dayIndex].push([startTime, endTime])
  }

  return result
}

/*<====================================>*/
// زمان‌های رزرو رو بر اساس تاریخ دسته‌بندی می‌کنه.
// مقدار هر تاریخ، شامل آرایه‌ای از بازه‌های زمانی به همراه وضعیت رزرو (true یا false) هست.
/*<====================================>*/
export type TypeGroupReservationsTimesByDate = Record<
  string,
  [startTime: string, endTime: string, reserved: boolean][]
>

export function groupReservationsTimesByDate(
  OBJ: TypeApiReservation[]
): TypeGroupReservationsTimesByDate {
  const result: TypeGroupReservationsTimesByDate = {}

  for (const item of OBJ) {
    const date = PNtoEN(fullStringToDateObjectP(item.date).format('YYYY-MM-DD')) as string
    const time = item.time

    if (!result[date]) {
      result[date] = []
    }

    const [startTime, endTime] = time.split('-')
    result[date].push([startTime, endTime, !!item.orderId]) // true: reserved, false: draft
  }

  return result
}

/*<====================================>*/
// تعطیلات رو بر اساس ساختار آرایه گروه بندی مینماید
/*<====================================>*/

export type TypeGroupHolidaysByDate = [string, string][]

export function groupHolidaysByDate(OBJ: TypeApiHoliday[]): TypeGroupHolidaysByDate {
  const result: TypeGroupHolidaysByDate = []

  for (const item of OBJ) {
    const date = item.date.replaceAll('/', '-')
    const title = item.title

    result.push([date, title])
  }

  return result
}

/*<====================================>*/
// آیا زمان فعلی میان بازه زمانی شروع و پایان ما میباشد یا خیر؟
/*<====================================>*/
export function checkingTimeBetweenTimes(
  startDate: string,
  endDate: string,
  currentTime: number = dateNowP().valueOf()
) {
  if (startDate === null && endDate === null) {
    return false
  } else {
    const nowStartDate = fullStringToDateObjectP(startDate).valueOf()
    const nowEndDate = fullStringToDateObjectP(endDate).valueOf() + 10 // 10 for increase offset
    return !(currentTime > nowStartDate && currentTime < nowEndDate)
  }
}

export function isCurrentTimeInRange(startTime: number, endTime: number, currentTime: number) {
  if (currentTime >= startTime && currentTime <= endTime) {
    return true
  } else {
    return false
  }
}
