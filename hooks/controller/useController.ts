import {dateNowP, stringToDateObjectP} from "@/libs/convertor";
import {checkingTimeBetweenTimes} from "@/libs/controller";
import {useState} from "react";
import useHook from "@/hooks/controller/useHook";
import {DateObject} from "react-multi-date-picker";
// import {PNtoEN} from "@/libs/utility";

export default function useController() {
  const {setting} = useHook()

  const [conditionReservation, setConditionReservation] = useState(null);
  // const [countReserveToday, setCountReserveToday] = useState(null);
  // const [countReserveMonthly, setCountReserveMonthly] = useState(null);


  const calculatorReservationUser = (OBJ, cart) => {
    const month: DateObject = dateNowP()
    const nextMonth: DateObject = dateNowP().add(1, "month")
    // let today = dateNowP()


    const dates = cart.map(item => stringToDateObjectP(item.date).month.number)
    // let cartToday = cart.filter(item => item.date === PNtoEN(today.format("YYYY/MM/DD")));
    const cartMonth = dates.filter(item => item === month.month.number);
    const cartNextMonth = dates.filter(item => item === (month.month.number + 1));


    // const countCartReservedInToday = cartToday.length;
    const countCartReservedInMonth = cartMonth.length;
    const countCartReservedInNextMonth = cartNextMonth.length;

    // let epochFirstToday = today.setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf()
    // let epochLastToday = today.setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()

    const epochFirstMonth = month.toFirstOfMonth().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf()
    const epochLastMonth = month.toLastOfMonth().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()

    const epochFirstNextMonth = nextMonth.toFirstOfMonth().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf()
    const epochLastNextMonth = nextMonth.toLastOfMonth().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()

    let countOldReservedToday = 0;
    let countOldReservedMonth = 0;
    let countOldReservedNextMonth = 0;

    const todayReserve = new Date();
          todayReserve.setHours(0, 0, 0, 0);
    //
    //   let count = OBJ.filter(obj => {
    //     let createdAt = new Date(obj.createdAt);
    //     createdAt.setHours(0, 0, 0, 0);
    //     return (obj.status === "COMPLETED" || obj.status === "REVIEW") && createdAt.getTime() === today.getTime();
    //   }).length;




    for (let i = 0; i < OBJ.length; i++) {
      const item = OBJ[i];
      // if (item.dateTimeStartEpoch >= epochFirstToday && item.dateTimeEndEpoch <= epochLastToday) {
        // countOldReservedToday++;
      // }
      if (item.dateTimeStartEpoch >= epochFirstMonth && item.dateTimeEndEpoch <= epochLastMonth) {
        countOldReservedMonth++;
      }
      if (item.dateTimeStartEpoch >= epochFirstNextMonth && item.dateTimeEndEpoch <= epochLastNextMonth) {
        countOldReservedNextMonth++;
      }
      const createdAt = new Date(item.createdAt)
      createdAt.setHours(0, 0, 0, 0)
      if(createdAt.getTime() === todayReserve.getTime()){
        countOldReservedToday++;
      }

    }

    //   setCountReserveMonthly({
    //     allowReserved: setting.maxReservationMonthly,
    //     oldReserveCount: count,
    //     currentReserveCount: countDates,
    //   })


    setConditionReservation({
      countOldReservedToday,
      countOldReservedMonth,
      countOldReservedNextMonth,
      // countCartReservedInToday,
      countCartReservedInMonth,
      countCartReservedInNextMonth,
      // totalReservedToday: countOldReservedToday + countCartReservedInToday,
      totalReservedMonth: countOldReservedMonth + countCartReservedInMonth,
      totalReservedNextMonth: countOldReservedNextMonth + countCartReservedInNextMonth,
      // offsetReserveToday: setting.maxReservationDaily - countOldReservedToday,
      offsetReserveMonth: setting.maxReservationMonthly - countOldReservedMonth,
      offsetReserveNextMonth: setting.maxReservationMonthly - countOldReservedNextMonth,
    })



  }

  const setStartEndDate = (value, setValue) => {
    setValue('startDate', null)
    setValue('endDate', null)
    const minReservationDate = dateNowP().add(setting.minReservationDate, 'day')
    const maxReservationDate = dateNowP().add(setting.maxReservationDate, 'day')
    const startDate = dateNowP()
    const endDate = dateNowP()
    const isSetStart = checkingTimeBetweenTimes(dateNowP().add(setting.minReservationDate, 'day'), dateNowP().add(setting.maxReservationDate, 'day'))
    let isSetEnd
    let future

    switch (value) {
      case "today" :
        if (!isSetStart) {
          setValue('startDate', startDate)
          setValue('endDate', endDate)
        }
        break
      case "tomorrow" :
        future = endDate.add(1, "days")
        isSetEnd = checkingTimeBetweenTimes(minReservationDate, maxReservationDate, future)
        if (!isSetStart) {
          setValue('startDate', startDate.add(1, "days"))
          setValue('endDate', future)
        }
        break
      case "7day" :
        future = endDate.add(7, "days")
        isSetEnd = checkingTimeBetweenTimes(minReservationDate, maxReservationDate, future)
        if (!isSetStart) {
          setValue('startDate', startDate)
        }
        if (!isSetEnd) {
          setValue('endDate', future)
        }
        break
      case "30day" :
        future = endDate.add(30, "days")
        isSetEnd = checkingTimeBetweenTimes(minReservationDate, maxReservationDate, future)
        if (!isSetStart) {
          setValue('startDate', startDate)
        }
        if (!isSetEnd) {
          setValue('endDate', future)
        }
        break
      case "nextMonth" :
        future = endDate.add(1, "month").toLastOfMonth()
        isSetEnd = checkingTimeBetweenTimes(minReservationDate, maxReservationDate, future)
        if (!isSetStart) {
          setValue('startDate', startDate.add(1, "month").toFirstOfMonth())
        }
        if (!isSetEnd) {
          setValue('endDate', future)
        }
        break
    }
  }


  // const calculatorCountReserveToday = (OBJ , cart) => {
  //   let today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //
  //   let count = OBJ.filter(obj => {
  //     let createdAt = new Date(obj.createdAt);
  //     createdAt.setHours(0, 0, 0, 0);
  //     return (obj.status === "COMPLETED" || obj.status === "REVIEW") && createdAt.getTime() === today.getTime();
  //   }).length;
  //   setCountReserveToday(count)
  // }

  // const calculatorCountReserveMonthly = (OBJ , Cart) => {
  //
  //   let month = dateNowP()
  //
  //   let dates = Cart.map(item => stringToDateObjectP(item.date).month.number)
  //
  //   const filteredNumbers = dates.filter(number => number === month.month.number);
  //
  //   const countDates = filteredNumbers.length;
  //
  //   let epochFirstMonth = month.toFirstOfMonth().setHour(0).setMinute(0).setSecond(0).setMillisecond(0).valueOf()
  //   let epochLastMonth = month.toLastOfMonth().setHour(23).setMinute(59).setSecond(59).setMillisecond(999).valueOf()
  //
  //   let count = 0;
  //
  //   for (let i = 0; i < OBJ.length; i++) {
  //     const item = OBJ[i];
  //     if (item.dateTimeStartEpoch >= epochFirstMonth && item.dateTimeEndEpoch <= epochLastMonth) {
  //       count++;
  //     }
  //   }
  //
  //   setCountReserveMonthly({
  //     allowReserved: setting.maxReservationMonthly,
  //     oldReserveCount: count,
  //     currentReserveCount: countDates,
  //   })
  //
  //
  // }


  return ({setStartEndDate, calculatorReservationUser, conditionReservation})
}