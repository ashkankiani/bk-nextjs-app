import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"


/*<====================================>*/
// اعداد را سه رقم سه رقم جدا می کند.
/*<====================================>*/
// Add Comma Separator To Number
export function numberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


// زمان همین الان را به صورت تاریخ شمسی استرینگ برمیگرداند
export function dateNowP() {
    return new DateObject({calendar: persian, locale: persian_fa})
}

// زمان همین الان را به صورت تاریخ میلادی استرینگ برمیگرداند
export function dateNowG() {
    return new DateObject({calendar: gregorian, locale: gregorian_en})
}

// زمان دلخواه را به صورت تاریخ شمسی استرینگ برمیگرداند
export function dateSetP(year: number, month: number, day: number) {
    return new DateObject({calendar: persian, locale: persian_fa})
        .set({year: year, month: month, day: day})
}

// زمان دلخواه را به صورت تاریخ میلادی استرینگ برمیگرداند
export function dateSetG(year: number, month: number, day: number) {
    return new DateObject({calendar: gregorian, locale: gregorian_en})
        .set({year: year, month: month, day: day})
}

// تاریخ شمسی استرینگ را به دیت آبجکت بر میگرداند
export function stringToDateObjectP(year: number, month: number, day: number) {
    return new DateObject({
        date: `${year}/${month}/${day}`,
        format: "YYYY/MM/DD",
        calendar: persian,
        locale: persian_fa
    })
}

// تاریخ شمسی استرینگ را به دیت آبجکت بر میگرداند با یک ورودی

export function fullStringToDateObjectP(date: string, format: string = "YYYY/MM/DD") {
    return new DateObject({
        date: date,
        format: format,
        calendar: persian,
        locale: persian_fa
    })
}

// تاریخ میلادی استرینگ را به دیت آبجکت بر میگرداند
export function stringToDateObjectG(year: number, month: number, day: number) {
    return new DateObject({
        date: `${year}/${month}/${day}`,
        format: "YYYY/MM/DD",
        calendar: gregorian,
        locale: gregorian_en
    })
}


// دیت آبجکت شمسی را به دیت آبجکت میلادی تبدیل می کند.
export function datePConvertDateG(dateObject: DateObject) {
    return dateObject.convert(gregorian, gregorian_en)
}

// دیت آبجکت میلادی را به دیت آبجکت شمسی تبدیل می کند.
export function dateGConvertDateP(dateObject: DateObject) {
    return dateObject.convert(persian, persian_fa)
}


export function minuteMaker(totalMinute: number, type: 'string' | 'withDay') {
    const mins = totalMinute % 60;
    const hour = Math.floor(totalMinute / 60);
    const days = Math.floor(hour / 24);
    const hours = hour % 24

    const minsWithZero = totalMinute % 60 < 10 ? "0" + totalMinute % 60 : totalMinute % 60;
    const hoursWithZero = hour % 24 < 10 ? "0" + hour % 24 : hour % 24;

    if (type === 'withDay') {
        return days + ':' + hoursWithZero + ':' + minsWithZero;
    } else if (type === 'string') {
        if (days === 0) {
            return hours + ' ساعت و ' + mins + ' دقیقه';
        } else {
            return days + ' روز و ' + hours + ' ساعت و ' + mins + ' دقیقه';
        }
    } else {
        return hoursWithZero + ':' + minsWithZero;
    }
}