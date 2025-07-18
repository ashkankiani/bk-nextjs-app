'use client'
import HeadPage from '@/components/layout/HeadPage'
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { AiFillPlusCircle } from 'react-icons/ai'
import { bkToast } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { numberWithCommas } from '@/libs/convertor'
import Popup from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import useHook from '@/hooks/controller/useHook'
import { useDeleteDiscount, useGetDiscounts } from '@/hooks/admin/useDiscount'

export default function TheDiscountsUi() {
  const { permissions } = useHook()

  const { data: dataDiscounts, isLoading: isLoadingDiscounts } = useGetDiscounts()
  const { mutateAsync: mutateAsyncDeleteDiscount, isPending: isPendingDeleteDiscount } =
    useDeleteDiscount()

  const handlerDeleteDiscount = async (id: number, close: () => void) => {
    await mutateAsyncDeleteDiscount({ id })
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
      <HeadPage title="کد تخفیف" />
      <HeaderPage title="کد تخفیف" description="کدهای تخفیف برای مشتریان خود ایجاد کنید.">
        {permissions.addDiscounts && (
          <Link href="/admin/discounts/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>کد تخفیف جدید</span>
          </Link>
        )}
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th>عنوان</th>
                <th>کد تخفیف</th>
                <th>تاریخ شروع</th>
                <th>تاریخ پایان</th>
                <th>نحوه تخفیف</th>
                <th>میزان تخفیف</th>
                <th className="w-[100px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingDiscounts ? (
                <tr>
                  <td colSpan={7}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataDiscounts && dataDiscounts.length > 0 ? (
                dataDiscounts?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.code}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>{item.type === 'CONSTANT' ? 'تخفیف ثابت' : 'درصد تخفیف'}</td>
                    <td>
                      {item.type === 'CONSTANT' ? numberWithCommas(item.amount) : item.amount}{' '}
                      {item.type === 'CONSTANT' ? 'تومان' : 'درصد'}
                    </td>
                    <td>
                      <div className="flex-center-center gap-3">
                        {permissions.editDiscounts && (
                          <Link href={'/admin/discounts/' + item.id}>
                            <FiEdit size="26px" />
                          </Link>
                        )}
                        {permissions.deleteDiscounts && (
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
                                <div className="panel-modal-title">حذف کد تخفیف</div>
                                <div className="panel-modal-content">
                                  <p>
                                    آیا از حذف کدتخفیف
                                    <strong className="px-1 text-red-500">{item.title}</strong>مطمن
                                    هستید؟ بدانید که دیگر نمیتوانید بفهمید که، کاربر از چه کد تخفیفی
                                    روی فاکتور استفاده کرده است.
                                  </p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div
                                    className={
                                      'panel-modal-confirm-delete ' +
                                      (isPendingDeleteDiscount
                                        ? 'disable-action'
                                        : 'cursor-pointer')
                                    }
                                    onClick={() => handlerDeleteDiscount(item.id, close)}
                                  >
                                    {isPendingDeleteDiscount ? (
                                      <TheSpinner />
                                    ) : (
                                      'مطمنم، کد تخفیف را حذف کن'
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
                  <td colSpan={7}>کد تخفیفی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
