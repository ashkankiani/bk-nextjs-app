'use client'
import HeadPage from '@/components/layout/HeadPage'
import { AiFillPlusCircle } from 'react-icons/ai'
import Link from 'next/link'
import { RiDeleteBin5Line, RiUserLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { bkToast, textGenderType } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { minuteIntegerToTime, numberWithCommas } from '@/libs/convertor'
import { GrUserAdmin } from 'react-icons/gr'
import { BsFilePerson } from 'react-icons/bs'
import Popup from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import useHook from '@/hooks/controller/useHook'
import { useDeleteService, useGetServices } from '@/hooks/admin/useService'

export default function TheServicesUi() {
  const { permissions } = useHook()

  const { data: dataServices, isLoading: isLoadingServices } = useGetServices()
  const { mutateAsync: mutateAsyncDeleteService, isPending: isPendingDeleteService } =
    useDeleteService()

  const handlerDeleteService = async (id: number, close: () => void) => {
    await mutateAsyncDeleteService({ id })
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
      <HeadPage title="خدمات" />
      <HeaderPage title="خدمات" description="در اینجا لیست خدمات خود را مشاهده کنید.">
        {permissions.deleteDraft && (
          <Link href="/admin/services/add" className="action">
            <AiFillPlusCircle size="24px" className="ml-2 inline-flex align-middle" />
            <span>خدمت جدید</span>
          </Link>
        )}
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
              <tr>
                <th>نام</th>
                <th>مدیر سرویس</th>
                <th>مدت زمان</th>
                <th>قیمت</th>
                <th>ظرفیت</th>
                <th>بازه فعالیت</th>
                <th>نوع پرداخت</th>
                <th>پیامک</th>
                <th>ایمیل</th>
                <th>جنسیت</th>
                <th>ارائه دهنده متصل</th>
                <th className="w-[100px]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingServices ? (
                <tr>
                  <td colSpan={12}>
                    <TheSpinner />
                  </td>
                </tr>
              ) : dataServices && dataServices.length > 0 ? (
                dataServices?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.user.fullName}</td>
                    <td>{minuteIntegerToTime(item.periodTime)}</td>
                    <td>{numberWithCommas(item.price)} تومان</td>
                    <td>{item.capacity} نفر</td>
                    <td>
                      {item.startDate &&
                        item.endDate !== null &&
                        item.startDate + ' تا ' + item.endDate}
                    </td>
                    <td>
                      {item.codPayment && 'در محل'}
                      {item.codPayment && item.onlinePayment && ' - '}
                      {item.onlinePayment && 'آنلاین'}
                    </td>
                    <td>
                      {item.smsToAdminService && (
                        <GrUserAdmin className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                      {item.smsToAdminProvider && (
                        <BsFilePerson className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                      {item.smsToUserService && (
                        <RiUserLine className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                    </td>
                    <td>
                      {item.emailToAdminService && (
                        <GrUserAdmin className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                      {item.emailToAdminProvider && (
                        <BsFilePerson className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                      {item.emailToUserService && (
                        <RiUserLine className="mx-1 inline-flex align-middle" size="22px" />
                      )}
                    </td>
                    <td>{item.gender === 'NONE' ? 'همه' : textGenderType(item.gender)}</td>
                    <td>
                      {permissions.viewProviders && (
                        <Link
                          href={'/admin/services/providers/' + item.id}
                          className="panel-badge-status bg-green-500"
                        >
                          مشاهده
                        </Link>
                      )}
                    </td>
                    <td>
                      <div className="flex-center-center gap-3">
                        {permissions.editServices && (
                          <Link href={'/admin/services/' + item.id}>
                            <FiEdit size="26px" />
                          </Link>
                        )}
                        {permissions.deleteServices && (
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
                              <div className="panel-wrapper-modal max-w-[480px]">
                                <IoClose
                                  size="32px"
                                  onClick={close}
                                  className="absolute left-4 top-4 cursor-pointer"
                                />
                                <div className="panel-modal-title">دریافت تاییدیه</div>
                                <div className="panel-modal-content">
                                  <p className="text-justify leading-9">
                                    شما در حال حذف
                                    <strong className="px-1 text-red-500">{item.name}</strong>هستید.
                                    بدانید که ابتدا ارائه دهنده های متصل به سرویس را باید حذف کنید.
                                  </p>
                                </div>
                                <div className="panel-modal-footer">
                                  <div
                                    className={
                                      'panel-modal-confirm-delete ' +
                                      (isPendingDeleteService ? 'disable-action' : 'cursor-pointer')
                                    }
                                    onClick={() => handlerDeleteService(item.id, close)}
                                  >
                                    {isPendingDeleteService ? (
                                      <TheSpinner />
                                    ) : (
                                      'مطمنم، سرویس را حذف کن'
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
                  <td colSpan={12}>خدماتی برای نمایش وجود ندارد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
