'use client'
import { useEffect, useRef, useState } from 'react'
import { PNtoEN, textPaymentType, textReservationsStatus } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { dateGConvertDateP, numberWithCommas } from '@/libs/convertor'
import ChartAreaSpline from '@/components/layout/ChartAreaSpline'
import { DateObject } from 'react-multi-date-picker'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useGetOrders } from '@/hooks/admin/useOrder'
import { TypeApiGetOrdersRes } from '@/types/typeApiAdmin'

export default function TheFinancialsUi() {
  const chart = useRef()

  const [series, setSeries] = useState<[]>([])
  const [category, setCategory] = useState<[]>([])

  const { data: dataOrders, isLoading: isLoadingOrders } = useGetOrders()

  useEffect(() => {
    if (isLoadingOrders && dataOrders) {
      calculateEarnings(dataOrders)
    }
  }, [])

  const calculateEarnings = (data: TypeApiGetOrdersRes[]) => {
    let ObjTime = []
    let ObjEarn = []
    // eslint-disable-next-line no-undef
    let earningsMap = new Map()

    // Calculate total earnings for each day
    data.forEach(item => {
      let date = new Date(item.createdAt).toISOString().split('T')[0]
      if (!earningsMap.has(date)) {
        earningsMap.set(date, 0)
      }
      earningsMap.set(date, earningsMap.get(date) + item.price)
    })

    // Fill the arrays
    let currentDate = new Date(data[0].createdAt)
    let endDate = new Date(data[data.length - 1].createdAt)
    while (currentDate <= endDate) {
      let dateString = currentDate.toISOString().split('T')[0]

      ObjTime.push(PNtoEN(dateGConvertDateP(new DateObject(currentDate)).format()))
      ObjEarn.push(earningsMap.get(dateString) || 0)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setCategory(ObjTime)

    setSeries([
      {
        name: 'درآمد',
        data: ObjEarn,
        color: '#0ca8ce',
        yAxis: 0,
        marker: {
          enabled: true,
          lineWidth: 5,
          lineColor: '#0ca8ce',
          radius: 5,
          fillColor: '#FFFFFF',
        },
      },
    ])
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
                      <div>{item.user.fullName}</div>
                      <div>{item.user.mobile}</div>
                      <div>{item.user.codeMeli}</div>
                    </td>
                    <td>
                      <div>{item.service.name}</div>
                      <div>{item.user.fullName}</div>
                    </td>
                    <td>
                      <div>
                        {item.discountPrice
                          ? numberWithCommas(item.price - item.discountPrice)
                          : numberWithCommas(item.price)}{' '}
                        تومان
                      </div>
                      <div>{textPaymentType(item.payment.paymentType)}</div>
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
            <h2 className="fa-bold-26px mb-6 text-primary-700">نمودار فروش محقق شده</h2>
            <ChartAreaSpline
              loading={isLoadingOrders}
              data={dataOrders}
              series={series}
              category={category}
              reference={chart}
            />
          </div>
        </div>
      </div>
    </>
  )
}
