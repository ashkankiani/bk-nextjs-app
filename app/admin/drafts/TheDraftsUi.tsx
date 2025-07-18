'use client'
import { bkToast } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { fullStringToDateObjectP } from '@/libs/convertor'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { RiDeleteBin5Line } from 'react-icons/ri'
import useHook from '@/hooks/controller/useHook'
import { useDeleteDrafts, useGetDrafts } from '@/hooks/admin/useDraft'

export default function TheDraftsUi() {
  const { permissions } = useHook()

  const { data: dataDrafts, isLoading: isLoadingDrafts } = useGetDrafts()

  const { mutateAsync: mutateAsyncDeleteDrafts, isPending: isPendingDeleteDrafts } =
    useDeleteDrafts()

  const handlerDeleteDrafts = async () => {
    await mutateAsyncDeleteDrafts()
      .then(res => {
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  return (
    <>
      <HeaderPage
        title="در حال رزرو"
        description="در اینجا لیست نوبت هایی که در حال رزرو و پرداخت نهایی هستند را مشاهده کنید."
      >
        {permissions.deleteDraft && (
          <button className="delete" onClick={() => handlerDeleteDrafts()}>
            <RiDeleteBin5Line size="24px" className="ml-2 inline-flex align-middle" />
            <span>{isPendingDeleteDrafts ? 'صبر کنید...' : 'حذف همه'}</span>
          </button>
        )}
      </HeaderPage>

      <div className="panel-main">
        <p className="mb-4">
          رزروهای زیر برای سایر خریداران به مدت حداقل زمان قفلی که در تنظیمات ثبت نمودید قفل می
          مانند. اگر در زمان تعیین شده رزرو خود را نهایی نکنند خوکار حذف و برای رزرو در اختیار سایر
          کاربران قرار میگیرند.
        </p>
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th className="w-[50px]">ردیف</th>
                <th>تاریخ درخواست</th>
                <th>رزرو برای</th>
                <th>خریدار</th>
                <th>تاریخ رزرو</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingDrafts ? (
                <tr>
                  <td colSpan={5}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataDrafts && dataDrafts.length > 0 ? (
                dataDrafts.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div dir="ltr">
                        {fullStringToDateObjectP(item.createEpoch).format('YYYY/MM/DD HH:mm')}
                      </div>
                    </td>
                    <td>
                      <div>{item.service.name}</div>
                      {/* hint: بررسی بشه با خط زیر */}
                      <div>{item.user.fullName}</div>
                      {/*<div>{item.provider.user.fullName}</div>*/}
                    </td>
                    <td>
                      <div>{item.user.fullName}</div>
                      <div>{item.user.mobile}</div>
                      <div>{item.user.codeMeli}</div>
                    </td>
                    <td>
                      <div>{item.date}</div>
                      <div>{item.time.replace('-', ' تا ')}</div>
                      <div>{fullStringToDateObjectP(item.date).weekDay.name}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>در حال رزروی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
