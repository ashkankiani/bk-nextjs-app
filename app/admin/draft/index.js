import HeadPage from "@/components/layout/HeadPage";
import {bkToast} from "@/libs/utility";
import {useEffect, useState} from "react";
import TheSpinner from "@/components/layout/TheSpinner";
import {fullStringToDateObjectP} from "@/libs/convertor";

import HeaderPage from "@/components/back-end/section/HeaderPage";
import {hookDeleteAllDraft, hookListDraft} from "@/hooks/admin/hookDraft";
import {useSelector} from "react-redux";
import {RiDeleteBin5Line} from "react-icons/ri";

export default function Reservation() {

  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])


  const handlerListDraft = async () => {
    setLoading(false)
    await hookListDraft((response, message) => {
      if (response) {
        setData(message)
        setLoading(true)
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListDraft()
  }, [])


  const handlerDeleteAllDraft = async () => {
    setLoadingDelete(true)
    await hookDeleteAllDraft(async (response, message) => {
      if (response) {
        setLoadingDelete(false)
        await handlerListDraft()
        bkToast('success', message)
      } else {
        bkToast('error', message)
      }
    })
  }


  return (
    <>
      <HeadPage title="در حال رزرو"/>
      <HeaderPage title="در حال رزرو" description="در اینجا لیست نوبت هایی که در حال رزرو و پرداخت نهایی هستند را مشاهده کنید.">
        {
          permissions.deleteDraft &&
          <button className="delete" onClick={() => handlerDeleteAllDraft()}>
            <RiDeleteBin5Line size="24px" className="inline-flex align-middle ml-2"/>
            <span>{loadingDelete ? 'صبر کنید...' : 'حذف همه'}</span>
          </button>
        }
      </HeaderPage>

      <div className="panel-main">
        <p className="mb-4">رزروهای زیر برای سایر خریداران به مدت حداقل زمان قفلی که در تنظیمات ثبت نمودید قفل می مانند. اگر در زمان تعیین شده رزرو خود را نهایی نکنند خوکار حذف و برای رزرو در اختیار سایر کاربران قرار میگیرند.</p>
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th width={50}>ردیف</th>
              <th>تاریخ درخواست</th>
              <th>رزرو برای</th>
              <th>خریدار</th>
              <th>تاریخ رزرو</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data.map((item, index) =>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div dir="ltr">{fullStringToDateObjectP(item.createEpoch).format('YYYY/MM/DD HH:mm')}</div>
                      </td>
                      <td>
                        <div>{item.service.name}</div>
                        <div>{item.provider.user.fullName}</div>
                      </td>
                      <td>
                        <div>{item.user.fullName}</div>
                        <div>{item.user.mobile}</div>
                        <div>{item.user.codeMeli}</div>
                      </td>
                      {/*<td>*/}
                      {/*  <div>{item.order.user.fullName}</div>*/}
                      {/*  <div>{item.order.user.mobile}</div>*/}
                      {/*  <div>{item.order.user.codeMeli}</div>*/}
                      {/*</td>*/}
                      <td>
                        <div>{item.date}</div>
                        <div>{item.time.replace('-', ' تا ')}</div>
                        <div>{fullStringToDateObjectP(item.date).weekDay.name}</div>
                      </td>
                    </tr>
                  ) :
                  <tr>
                    <td colSpan={5}>در حال رزروی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={5}><TheSpinner/></td>
                </tr>
            }

            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
