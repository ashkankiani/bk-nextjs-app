'use client'
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { bkToast } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { AiFillPlusCircle } from 'react-icons/ai'
import Popup from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import useHook from '@/hooks/controller/useHook'
import { useDeleteHoliday, useGetHolidays } from '@/hooks/admin/useHoliday'

export default function TheHolidaysUi() {
  const { permissions } = useHook()

  const { data: dataHolidays, isLoading: isLoadingHolidays } = useGetHolidays()

  const { mutateAsync: mutateAsyncDeleteHoliday, isPending: isPendingDeleteHoliday } =
    useDeleteHoliday()

  const handlerDeleteHoliday = async (id: number, close: () => void) => {
    await mutateAsyncDeleteHoliday({ id })
      .then(res => {
        bkToast('success', res.Message)
        close()
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  return (
    <>
      <HeaderPage
        title="تعطیلات"
        description="روزهای تعطیل رسمی کشور و روزهای دلخواه را مشاهده کنید."
      >
        {permissions.addHolidays && (
          <Link href="/admin/holidays/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>روز تعطیل جدید</span>
          </Link>
        )}
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th className="w-[50px]">ردیف</th>
                <th>تاریخ</th>
                <th>عنوان</th>
                <th className="w-[100px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingHolidays ? (
                <tr>
                  <td colSpan={4}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataHolidays && dataHolidays.length > 0 ? (
                dataHolidays?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.title}</td>
                    <td>
                      <div className="flex-center-center gap-3">
                        {permissions.editHolidays && (
                          <Link href={'/admin/holidays/' + item.id}>
                            <FiEdit size="26px" />
                          </Link>
                        )}
                        {permissions.deleteHolidays && (
                          <Popup
                            className="bg-modal"
                            contentStyle={{ width: '100%' }}
                            trigger={
                              <div>
                                <RiDeleteBin5Line
                                  className="cursor-pointer text-red-500"
                                  size="28px"
                                />
                              </div>
                            }
                            modal
                            nested
                          >
                            {(close: () => void) => (
                              <div className="panel-wrapper-modal max-w-[500px]">
                                <IoClose
                                  size="32px"
                                  onClick={close}
                                  className="absolute left-4 top-4 cursor-pointer"
                                />
                                <div className="panel-modal-title">حذف تعطیلی</div>
                                <div className="panel-modal-content">
                                  <p>
                                    آیا از حذف تاریخ
                                    <strong className="px-1 text-red-500">{item.date}</strong>مطمن
                                    هستید؟
                                  </p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div
                                    className={
                                      'panel-modal-confirm-delete ' +
                                      (isPendingDeleteHoliday ? 'disable-action' : 'cursor-pointer')
                                    }
                                    onClick={() => handlerDeleteHoliday(item.id, close)}
                                  >
                                    {isPendingDeleteHoliday ? (
                                      <TheSpinner />
                                    ) : (
                                      'مطمنم، روز را حذف کن'
                                    )}
                                  </div>
                                  <div className="panel-modal-close" onClick={close}>
                                    بیخیال شو
                                  </div>
                                </div>
                              </div>
                            )}
                          </Popup>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>روز تعطیلی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
