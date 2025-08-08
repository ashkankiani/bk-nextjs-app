'use client'
import { useEffect, useRef, useState } from 'react'
import { PNtoEN, textPaymentType, textReservationsStatus } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { fullStringToDateObjectP, numberWithCommas } from '@/libs/convertor'
import ChartAreaSpline from '@/components/layout/ChartAreaSpline'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useGetOrders } from '@/hooks/admin/useOrder'
import { TypeApiGetOrdersRes } from '@/types/typeApiAdmin'

type TypeResultTheFinancialsUi = {
  dates: string[]
  onlinePaymentCounts: number[]
  reservationCounts: number[]
  statusCanceled: number[]
  statusCompleted: number[]
  statusDone: number[]
  statusPending: number[]
  statusRejected: number[]
  statusReview: number[]
  totalIncomes: number[]
  unknownPaymentCounts: number[]
}
export default function TheFinancialsUi() {
  const chart = useRef(null)

  const [data, setData] = useState<TypeResultTheFinancialsUi>({
    dates: [],
    onlinePaymentCounts: [],
    reservationCounts: [],
    statusCanceled: [],
    statusCompleted: [],
    statusDone: [],
    statusPending: [],
    statusRejected: [],
    statusReview: [],
    totalIncomes: [],
    unknownPaymentCounts: [],
  })
  // const [category, setCategory] = useState<[]>([])

  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    isFetched: isFetchedOrders,
  } = useGetOrders()

  useEffect(() => {
    if (isFetchedOrders && dataOrders) {
      calculateEarnings(dataOrders)
    }
  }, [isFetchedOrders])

  const calculateEarnings = (data: TypeApiGetOrdersRes[]) => {
    const byDateMap = new Map<string, any>()
    const allDates = new Set<string>()

    const statusKeys = ['COMPLETED', 'REVIEW', 'DONE', 'CANCELED', 'REJECTED', 'PENDING']

    const statusMap = new Map(statusKeys.map(key => [key, new Map<string, number>()]))

    data.forEach(order => {
      const date = PNtoEN(
        fullStringToDateObjectP(String(order.createdAt), 'YYYY-MM-DDTHH:MM:SS.SSSZ').format(
          'YYYY/MM/DD'
        )
      )
      allDates.add(date)
      const isOnline = order.method !== 'COD'

      if (!byDateMap.has(date)) {
        byDateMap.set(date, {
          reservationCount: 0,
          totalIncome: 0,
          onlinePaymentCount: 0,
          unknownPaymentCount: 0,
        })
      }

      const daily = byDateMap.get(date)
      daily.reservationCount += order.Reservations?.length || 0
      daily.totalIncome += order.price || 0
      if (isOnline) daily.onlinePaymentCount += 1
      else daily.unknownPaymentCount += 1

      const statusKey = order.status
      if (statusMap.has(statusKey)) {
        const map = statusMap.get(statusKey)!
        map.set(date, (map.get(date) || 0) + 1)
      }
    })

    const sortedDates = Array.from(allDates).sort()

    const result: TypeResultTheFinancialsUi = {
      dates: sortedDates,
      reservationCounts: sortedDates.map(d => byDateMap.get(d)?.reservationCount || 0),
      totalIncomes: sortedDates.map(d => byDateMap.get(d)?.totalIncome || 0),
      onlinePaymentCounts: sortedDates.map(d => byDateMap.get(d)?.onlinePaymentCount || 0),
      unknownPaymentCounts: sortedDates.map(d => byDateMap.get(d)?.unknownPaymentCount || 0),
    }

    for (const statusKey of statusKeys) {
      const camelKey = 'status' + statusKey[0] + statusKey.slice(1).toLowerCase()
      const map = statusMap.get(statusKey)!
      result[camelKey] = sortedDates.map(date => map.get(date) || 0)
    }
    setData(result)
  }

  return (
    <>
      <HeaderPage title="سفارش ها" description="سفارش های ایجاد شده را مشاهده فرمائید." />
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th className="w-[50px]">ردیف</th>
                <th>کد پیگیری</th>
                <th>خریدار</th>
                <th>نوبت برای</th>
                <th>پرداخت</th>
                <th>وضعیت</th>
                {/*<th className="w-[100px]">عملیات</th>*/}
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={6}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataOrders && dataOrders.length > 0 ? (
                dataOrders?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.trackingCode}</td>
                    <td>
                      <div>{item.Reservations[0].user.fullName}</div>
                      <div>{item.Reservations[0].user.mobile}</div>
                      <div>{item.Reservations[0].user.codeMeli}</div>
                    </td>
                    <td>
                      <div>{item.Reservations[0].service.name}</div>
                      <div>{item.Reservations[0].user.fullName}</div>
                    </td>
                    <td>
                      <div>
                        {item.discountPrice
                          ? numberWithCommas(item.price - item.discountPrice)
                          : numberWithCommas(item.price)}
                        تومان
                      </div>
                      <div>{textPaymentType(item.payment?.paymentType)}</div>
                      {item.discount && <div>{item.discount.code}</div>}
                    </td>
                    <td>{textReservationsStatus(item.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>سفارشی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <div className="bk-chart">
            <h2 className="fa-bold-26px mb-6 text-primary-700">نمودار سفارشات</h2>
            <ChartAreaSpline
              loading={isLoadingOrders}
              data={dataOrders}
              category={data.dates}
              reference={chart}
              series={[
                {
                  name: 'Count',
                  data: data.reservationCounts,
                  color: '#0ca8ce',
                  yAxis: 0,
                  marker: {
                    enabled: true,
                    lineWidth: 2,
                    lineColor: '#0ca8ce',
                    radius: 4,
                    fillColor: '#FFFFFF',
                  },
                },
                // {
                //   name: 'Earning',
                //   data: data.totalIncomes,
                //   color: '#4caf50',
                // },
                // {
                //   name: 'Online',
                //   data: data.onlinePaymentCounts,
                //   color: '#ff9800',
                // },
                // {
                //   name: 'Cod',
                //   data: data.unknownPaymentCounts,
                //   color: '#9e9e9e',
                // },
                // {
                //   name: 'Completed',
                //   data: data.statusCompleted,
                //   color: '#2e7d32',
                // },
                // {
                //   name: 'Review',
                //   data: data.statusReview,
                //   color: '#1976d2',
                // },
                // {
                //   name: 'Done',
                //   data: data.statusDone,
                //   color: '#512da8',
                // },
                // {
                //   name: 'Canceled',
                //   data: data.statusCanceled,
                //   color: '#d32f2f',
                // },
                // {
                //   name: 'Rejected',
                //   data: data.statusRejected,
                //   color: '#c2185b',
                // },
                // {
                //   name: 'Pending',
                //   data: data.statusPending,
                //   color: '#fbc02d',
                // },
              ]}
              tooltip={{
                formatter: function () {
                  const index = this.points?.[0]?.point.index ?? 0

                  return `
          <b>${data.dates[index]}</b><br/>
          Count: ${data.reservationCounts[index]}<br/>
          Earning: ${data.totalIncomes[index]}<br/>
          Online: ${data.onlinePaymentCounts[index]}<br/>
          COD: ${data.unknownPaymentCounts[index]}<br/>
          Completed: ${data.statusCompleted[index]}<br/>
          Review: ${data.statusReview[index]}<br/>
          Done: ${data.statusDone[index]}<br/>
          Canceled: ${data.statusCanceled[index]}<br/>
          Rejected: ${data.statusRejected[index]}<br/>
          Pending: ${data.statusPending[index]}
        `
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
