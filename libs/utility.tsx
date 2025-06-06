import {toast, ToastOptions} from 'react-toastify'
import {getCookie} from 'cookies-next'
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {dateNowP, fullStringToDateObjectP} from "@/libs/convertor";
import {
  Headers,
  TypeBankName,
  TypeDiscountsType,
  TypeGender,
  TypePaymentType,
  TypeReservationsStatus,
  TypeToast
} from "@/types/typeConfig";
import {SESSION} from "@/libs/constant";
import React from "react";
import Qs from "qs";

export function bkToast(type: TypeToast, text: string) {
  const option : ToastOptions<unknown>  = {
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
// Add Authorization and Content To Api
/*<====================================>*/
export function AppHeader(): { headers: Headers } {
  return {
    headers: Qs.parse({ Authorization: String(getCookie(SESSION)) }) as Headers,
  }
}


export function onlyTypeNumber(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault()
  }
}


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
export function PNtoEN(str: number | string) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  if (typeof str === 'string') {
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i))
    }
  }
  return str
}


export function dayNameByIndex(num: number): string {
  const days: string[] = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  return days[num];
}


export function generateTrackingCodeWithDate() {
  const date = new DateObject({
    calendar: persian,
    locale: persian_fa
  })
  const {year, month, day, hour, minute, second} = date
  const modifyMonth = String(month.number).padStart(2, '0');
  return `${year}${modifyMonth}${day}${hour}${minute}${second}`;
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
    default:
      return 'تعریف نشده'
  }
}

export function textSettingsBankName(value: TypeBankName): string {
  switch (value) {
    case 'ZARINPAL':
      return 'زرین پال'
    case 'IDPAY':
      return 'آیدی پی'
    case 'AQAYEPARDAKHT':
      return 'آقای پرداخت'
    case 'ZIBAL':
      return 'زیبال'
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
// یک کد 6 رقمی تولید می کند.
/*<====================================>*/
export function generateCode():number {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mergeOverlappingTimes(hours) {
  for (let day in hours) {
    hours[day].sort((a, b) => a[0].localeCompare(b[0]));
    let merged = [hours[day][0]];
    for (let i = 1; i < hours[day].length; i++) {
      const lastMergedEnd: Date = new Date("1970/01/01 " + merged[merged.length - 1][1]);
      const currentStart: Date = new Date("1970/01/01 " + hours[day][i][0]);
      const currentEnd: Date = new Date("1970/01/01 " + hours[day][i][1]);
      if (currentStart <= lastMergedEnd) {
        lastMergedEnd.setTime(Math.max(lastMergedEnd.getTime(), currentEnd.getTime()));
        merged[merged.length - 1][1] = lastMergedEnd.toTimeString().split(" ")[0].substring(0, 5);
      } else {
        merged.push(hours[day][i]);
      }
    }
    hours[day] = merged;
  }
  return hours;
}

function convertToTime(timeStr) {
  let timeParts = timeStr.split(":");
  let date = new Date();
  date.setHours(timeParts[0]);
  date.setMinutes(timeParts[1]);
  date.setSeconds(0);
  return date;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function timeSlotGenerator(range, interval, gap, capacity) {
  let startTime = convertToTime(range[0]);
  let endTime = convertToTime(range[1]);

  let currentTime = startTime;
  let timePairs = [];
  while (currentTime < endTime) {
    let nextTime = addMinutes(currentTime, interval);
    if (nextTime > endTime) {
      break;
    }
    timePairs.push([formatTime(currentTime), formatTime(nextTime), false, "رزرو نشده", capacity]);
    currentTime = addMinutes(nextTime, gap);
  }
  return timePairs
}


function formatTime(date) {
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return hours + ":" + minutes;
}

function convertToMinutes(timeStr) {
  let timeParts = timeStr.split(":");
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
}


function replaceTime(times, slotTime, status, title, remainingCapacity) {
  if (slotTime.length === 0) {
    return times;
  }

  let slotTimeStart = convertToMinutes(slotTime[0]);
  let slotTimeEnd = convertToMinutes(slotTime[1]);

  for (let i = 0; i < times.length; i++) {
    if (times[i].length !== 0) {
      let timeStart = convertToMinutes(times[i][0]);
      let timeEnd = convertToMinutes(times[i][1]);

      if (timeStart < slotTimeEnd && timeEnd > slotTimeStart) {
        times[i] = [times[i][0], times[i][1], status, title, remainingCapacity];
      }
    }
  }
  return times;
}

export function slotGenerator(startDate, endDate, hours, dayHolidays, workHolidays, reserveList, slotTimeRest, interval, gap, minReservationTime, capacity) {
  // let interval = 50 // مدت زمان خدمت
  // let gap = 10 // مدت استراحت بین هر نوبت ارائه دهنده
  // slotTimeRest = [ "10:00", "11:00" ] // بازه ساعتی استراحت ثابت
  startDate = fullStringToDateObjectP(startDate);
  endDate = fullStringToDateObjectP(endDate);
  // let dayHolidays = ["1402-08-22", "1402-08-26"];
  // let hours = {
  //     1: [["14:00", "20:00"], ["18:00", "22:00"]], // Saturday
  //     2: [["08:00", "14:00"], ["14:00", "15:00"]], // Sunday
  //     3: [["09:00", "15:00"], ["17:00", "20:00"]], // Monday
  //     4: [["10:00", "16:00"]], // Tuesday
  //     5: [["11:00", "17:00"], ["09:00", "12:00"]], // Wednesday
  //     6: [["12:00", "18:00"]], // Thursday
  //     7: [["13:00", "19:00"]], // Friday
  // };
  //
  // let reserveList = {
  //     "1402-08-28": [["10:00", "11:00"], ["14:49", "16:00"]],
  //     "1402-08-29": [[ "17:00", "17:50" ],[ "18:00", "18:50" ],[ "19:00", "19:50" ]]
  // };
  let OBJ = []
  // let currentDay;
  hours = mergeOverlappingTimes(hours)

  let indexDayHoliday
  let listDayHoliday = []
  let textDayHoliday = []
  for (const [date, text] of dayHolidays) {
    listDayHoliday.push(date)
    textDayHoliday.push(text)
  }
  while (endDate >= startDate) {
    let startSlot;
    let endSlot;
    let slot
    let currentTimeSheet = []
    let dayIsHoliday = false
    let today = PNtoEN(dateNowP().format("YYYY/MM/DD")) // 1403/06/17
    let currentDay = PNtoEN(startDate.format()) // 1403/06/17
    let periodTimeHours = hours[parseInt(PNtoEN(startDate.format('d')))] // [ ["10:00","16:00"],["20:00","22:00"]]

    if (!workHolidays) {
      dayIsHoliday = listDayHoliday.includes(PNtoEN(startDate.format('YYYY-MM-DD')))
      indexDayHoliday = listDayHoliday.indexOf(PNtoEN(startDate.format('YYYY-MM-DD')))
    }


    if (periodTimeHours) {
      periodTimeHours.forEach(item => {
        startSlot = item[0]
        endSlot = item[1]
        slot = [startSlot, endSlot]
        currentTimeSheet.push(...timeSlotGenerator(slot, interval, gap, capacity))
      })
    }
// console.log(reserveList)
    for (let date in reserveList) {
      if (PNtoEN(startDate.format('YYYY-MM-DD')) === PNtoEN(date)) {
        let times = reserveList[date];

        let mergedTimes = [];

        times.forEach(time => {
          let found = mergedTimes.find(t => t[0] === time[0] && t[1] === time[1]);
          if (found) {
            found[3]++;
          } else {
            mergedTimes.push([...time, 1]);
          }
        });

        // console.log("times")
        // console.log(times)
        // console.log("mergedTimes")
        // console.log(mergedTimes)

        for (let i = 0; i < mergedTimes.length; i++) {
          if (capacity <= mergedTimes[i][3]) {
            replaceTime(currentTimeSheet, mergedTimes[i], true, mergedTimes[i][2] ? 'رزرو شده.' : "کاربر دیگر در حال رزرو...", capacity - mergedTimes[i][3])
          } else {
            replaceTime(currentTimeSheet, mergedTimes[i], false, 'رزرو نشده.', capacity - mergedTimes[i][3])
          }
        }
      }
    }

    replaceTime(currentTimeSheet, slotTimeRest, true, 'زمان استراحت')

    OBJ.push({
      date: currentDay,
      dayIsHoliday: dayIsHoliday,
      textHoliday: dayIsHoliday ? textDayHoliday[indexDayHoliday] : '',
      timeSheet: dayIsHoliday ? [] : currentDay === today ? removeTimeRangeAndBefore(currentTimeSheet, minReservationTime) : currentTimeSheet,
      is: currentDay === today
    })
    startDate.add(1, 'days')
  }
  console.log(OBJ)
  return OBJ
}


export function removeTimeRangeAndBefore(times, minReservationTime) {
  if (times.length === 0 || minReservationTime === 0) {
    return times;
  }
  let now
  let today = dateNowP()
  let checkTomorrow = dateNowP().add(minReservationTime, "minutes")
  if (today.day === checkTomorrow.day) {
    now = PNtoEN(dateNowP().add(minReservationTime, "minutes").format("HH:mm"))
  } else {
    now = "23:59"
  }

  // تبدیل زمان‌ها به فرمت عددی
  const nowNum = parseInt(now.replace(':', ''));
  let timesSample = times.map(timeRange => timeRange.map(time => parseInt(time.replace(':', ''))));

  // پیدا کردن اندیس اولین بازه قابل حذف
  let indexToRemove = timesSample.findIndex(timeRange => timeRange[0] >= nowNum);

  // اگر بازه‌ای پیدا نشد، هیچ تغییری ایجاد نمی‌کنیم
  if (indexToRemove === -1) {
    return [[times[0][0], times[times.length - 1][1], true, "نوبت فعالی برای امروز وجود ندارد."]];
  }
  // حذف بازه‌ها از ابتدای آرایه تا اندیس پیدا شده
  times.splice(0, indexToRemove);
  return times;
}

export function convertToHours(array) {
  let hours = {};
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    if (!hours[item.dayIndex]) {
      hours[item.dayIndex] = [];
    }
    hours[item.dayIndex].push([item.startTime, item.endTime]);
  }
  return hours;
}


export function isCurrentTimeInRange(startTime: number, endTime: number, currentTime: number) {
  if (currentTime >= startTime && currentTime <= endTime) {
    return true;
  } else {
    return false;
  }
}

export function groupTimesByDate(OBJ) {
  const result = [];
  for (const item of OBJ) {
    const date = PNtoEN(fullStringToDateObjectP(item.date).format('YYYY-MM-DD')) as string
    const time = item.time
    if (!result[date]) {
      result[date] = [];
    }
    const [startTime, endTime] = time.split("-");
    result[date].push([startTime, endTime, !!item.orderId]); // item.orderId = true = reserved and false is draft
  }
  return result;
}











/*<====================================>*/
// آیا زمان فعلی میان بازه زمانی شروع و پایان ما میباشد یا خیر؟
/*<====================================>*/
export function checkingTimeBetweenTimes(startDate: string, endDate: string, currentTime: number = dateNowP().valueOf()) {
  if (startDate === null && endDate === null) {
    return false
  } else {
    const nowStartDate = fullStringToDateObjectP(startDate).valueOf()
    const nowEndDate = fullStringToDateObjectP(endDate).valueOf() + 10  // 10 for increase offset
    return (!(currentTime > nowStartDate && currentTime < nowEndDate))
  }
}