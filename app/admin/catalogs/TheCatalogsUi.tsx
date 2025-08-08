'use client'
import Link from 'next/link'
import { RiDeleteBin5Line } from 'react-icons/ri'
import {bkToast, textRuleType} from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { AiFillPlusCircle } from 'react-icons/ai'
import Popup from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { MdOutlineLocalPolice } from 'react-icons/md'
import useHook from '@/hooks/controller/useHook'
import { useDeleteCatalog, useGetCatalogs } from '@/hooks/admin/useCatalog'

export default function TheCatalogsUi() {
  const { permissions } = useHook()

  const { data: dataCatalogs, isLoading: isLoadingCatalogs } = useGetCatalogs()
  const { mutateAsync: mutateAsyncDeleteCatalog, isPending: isPendingDeleteCatalog } =
    useDeleteCatalog()

  const handlerDeleteCatalogs = async (id: number, close: () => void) => {
    await mutateAsyncDeleteCatalog({ id })
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
      <HeaderPage title="سطوح دسترسی" description="سطوح دسترسی برای همه کاربران ایجاد کنید.">
        {permissions.addCatalogs && (
          <Link href="/admin/catalogs/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>سطح دسترسی جدید</span>
          </Link>
        )}
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th className="w-[50px]">ردیف</th>
                <th>عنوان</th>
                <th className="w-[100px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCatalogs ? (
                <tr>
                  <td colSpan={3}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataCatalogs && dataCatalogs.length > 0 ? (
                dataCatalogs?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{textRuleType(item.title)}</td>
                    <td>
                      <div className="flex-center-center gap-3">
                        {!(item.id === 1 || item.id === 2) && permissions.editCatalogs && (
                          <Link href={'/admin/catalogs/' + item.id}>
                            <MdOutlineLocalPolice size="26px" />
                          </Link>
                        )}
                        {!(item.id === 1 || item.id === 2 || item.id === 3) &&
                          permissions.deleteCatalogs && (
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
                                  <div className="panel-modal-title">حذف سطح دسترسی</div>
                                  <div className="panel-modal-content">
                                    <p>
                                      آیا از حذف سطح دسترسی
                                      <strong className="px-1 text-red-500">{item.title}</strong>
                                      مطمن هستید؟
                                    </p>
                                  </div>

                                  <div className="panel-modal-footer">
                                    <div
                                      className={
                                        'panel-modal-confirm-delete ' +
                                        (isPendingDeleteCatalog
                                          ? 'disable-action'
                                          : 'cursor-pointer')
                                      }
                                      onClick={() => handlerDeleteCatalogs(item.id, close)}
                                    >
                                      {isPendingDeleteCatalog ? (
                                        <TheSpinner />
                                      ) : (
                                        'مطمنم، سطح دسترسی را حذف کن'
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
                  <td colSpan={2}>سطح دسترسی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
