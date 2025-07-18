'use client'
import { AiFillPlusCircle } from 'react-icons/ai'
import Link from 'next/link'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { bkToast } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import Popup from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import useHook from '@/hooks/controller/useHook'
import { useDeleteProvider, useGetProviders } from '@/hooks/admin/useProvider'

export default function TheProvidersUi() {
  const { permissions } = useHook()

  const { data: dataProviders, isLoading: isLoadingProviders } = useGetProviders()
  const { mutateAsync: mutateAsyncDeleteProvider, isPending: isPendingDeleteProvider } =
    useDeleteProvider()

  const handlerDeleteProvider = async (id: number, close: () => void) => {
    await mutateAsyncDeleteProvider({ id })
      .then(res => {
        bkToast('success', res.Message)
        close()
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  // hint: اگر نقش پروایدر امد باید لیست خودشو ببینه

  return (
    <>
      <HeaderPage title="ارائه دهندگان" description="در اینجا لیست ارائه دهندگان را مشاهده کنید.">
        {permissions.addProviders && (
          <Link href="/admin/providers/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>ارائه دهنده جدید</span>
          </Link>
        )}
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th>ارائه دهنده</th>
                <th>خدمت</th>
                <th>مدت استراحت بین هر نوبت</th>
                <th>بازه فعالیت</th>
                <th>بازه استراحت</th>
                <th>وضعیت</th>
                <th>تقویم کاری</th>
                <th className="w-[100px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProviders ? (
                <tr>
                  <td colSpan={8}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataProviders && dataProviders.length > 0 ? (
                dataProviders?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.user.fullName}</td>
                    <td>{item.service.name}</td>
                    <td>{item.slotTime} دقیقه</td>
                    <td>
                      {item.startDate &&
                        item.endDate !== null &&
                        item.startDate + ' تا ' + item.endDate}
                    </td>
                    <td>
                      {item.startTime &&
                        item.endTime !== null &&
                        item.startTime + ' تا ' + item.endTime}
                    </td>
                    <td>{item.status ? 'فعال' : 'غیرفعال'}</td>
                    <td>
                      {permissions.viewTimesheets && (
                        <Link
                          href={'/admin/providers/timesheets/' + item.id}
                          className="panel-badge-status bg-green-500"
                        >
                          تقویم کاری
                        </Link>
                      )}
                    </td>
                    <td>
                      <div className="flex-center-center gap-3">
                        {permissions.editProviders && (
                          <Link href={'/admin/providers/' + item.id}>
                            <FiEdit size="26px" />
                          </Link>
                        )}
                        {permissions.deleteProviders && (
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
                                <div className="panel-modal-title">حذف ارائه دهنده</div>
                                <div className="panel-modal-content">
                                  <p>
                                    آیا از حذف ارائه دهنده{' '}
                                    <strong className="px-1 text-red-500">
                                      {item.user.fullName}
                                    </strong>
                                    برای
                                    <strong className="px-1 text-red-500">
                                      {item.service.name}
                                    </strong>
                                    مطمن هستید؟ بدانید که تقویم کاری های متصل به سرویس
                                    <strong className="px-1 text-red-500">
                                      {item.service.name}
                                    </strong>
                                    نیز حذف می شوند.
                                  </p>
                                  <p className="mt-2">
                                    حتما باید همه رزروها با هر وضعیتی، که برای این ارائه دهنده ایجاد
                                    شده است را ابتدا حذف نمایید.
                                  </p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div
                                    className={
                                      'panel-modal-confirm-delete ' +
                                      (isPendingDeleteProvider
                                        ? 'disable-action'
                                        : 'cursor-pointer')
                                    }
                                    onClick={() => handlerDeleteProvider(item.id, close)}
                                  >
                                    {isPendingDeleteProvider ? (
                                      <TheSpinner />
                                    ) : (
                                      'مطمنم، ارائه دهنده را حذف کن'
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
                  <td colSpan={8}>ارائه دهنده برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
