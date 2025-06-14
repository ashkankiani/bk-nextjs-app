import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {bkToast, PNtoEN, textPaymentType, textReservationsStatus} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {AiFillPlusCircle} from "react-icons/ai";
import {hookListOrders} from "@/hooks/admin/hookOrder";
import {
  dateGConvertDateP,
  numberWithCommas,
} from "@/libs/convertor";
import ChartAreaSpline from "@/components/layout/ChartAreaSpline";
import {DateObject} from "react-multi-date-picker";
import HeaderPage from "@/components/back-end/section/HeaderPage";

export default function Financial() {

  const chart = useRef()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [series, setSeries] = useState([])
  const [category, setCategory] = useState([])

  const handlerListOrder = async () => {
    setLoading(false)
    await hookListOrders((response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
        calculateEarnings(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListOrder()
  }, [])

  function calculateEarnings(data) {

    let ObjTime = [];
    let ObjEarn = [];
    // eslint-disable-next-line no-undef
    let earningsMap = new Map();

    // Calculate total earnings for each day
    data.forEach(item => {
      let date = new Date(item.createdAt).toISOString().split('T')[0];
      if (!earningsMap.has(date)) {
        earningsMap.set(date, 0);
      }
      earningsMap.set(date, earningsMap.get(date) + item.price);
    });

    // Fill the arrays
    let currentDate = new Date(data[0].createdAt);
    let endDate = new Date(data[data.length - 1].createdAt);
    while (currentDate <= endDate) {
      let dateString = currentDate.toISOString().split('T')[0];

      ObjTime.push(PNtoEN(dateGConvertDateP(new DateObject(currentDate)).format()));
      ObjEarn.push(earningsMap.get(dateString) || 0);
      currentDate.setDate(currentDate.getDate() + 1);
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
      <HeadPage title="سفارش ها"/>
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
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
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
                        <div>{item.discountPrice ? numberWithCommas(item.price - item.discountPrice) : numberWithCommas(item.price)} تومان</div>
                        <div>{textPaymentType(item.payment.paymentType)}</div>
                        {
                          item.discount &&
                          <div>{item.discount.code}</div>
                        }
                      </td>
                      <td>{textReservationsStatus(item.status)}</td>
                      {/*
                      <td>
                        <div className="flex-center-center gap-3">
                          <Link href={"/admin/faqs/" + item.id}><FiEdit size="26px"/></Link>
                          <Popup
                            className="bg-modal"
                            contentStyle={{width: '100%'}}
                            trigger={
                              <div>
                                <RiDeleteBin5Line
                                  className="text-red-500 cursor-pointer"
                                  size="28px"/>
                              </div>
                            }
                            modal
                            nested
                          >
                            {close =>
                              <div className="panel-wrapper-modal max-w-[500px]">
                                <IoClose
                                  size="32px"
                                  onClick={close}
                                  className="absolute left-4 top-4 cursor-pointer"
                                />
                                <div className="panel-modal-title">حذف سوال متداول</div>
                                <div className="panel-modal-content">
                                  <p>آیا از حذف سوال متداول<strong
                                    className="px-1 text-red-500">{item.title}</strong>مطمن هستید؟</p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div className="panel-modal-confirm-delete"
                                       onClick={() => handlerDeleteFaq(item.id)}>
                                    {
                                      loadingDelete ?
                                        'مطمنم، سوال متداول را حذف کن'
                                        :
                                        <TheSpinner/>
                                    }
                                  </div>
                                  <div className="panel-modal-close"
                                       onClick={close}>بیخیال شو
                                  </div>
                                </div>

                              </div>
                            }
                          </Popup>
                        </div>
                      </td>
                      */}
                    </tr>
                  ) :
                  <tr>
                    <td colSpan={6}>سفارشی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={6}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <div className="bk-chart">
            <h2 className="fa-bold-26px mb-6 text-primary-700">نمودار فروش محقق شده</h2>
            <ChartAreaSpline
              loading={loading}
              data={data}
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
