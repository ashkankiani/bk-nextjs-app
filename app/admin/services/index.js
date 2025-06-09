import HeadPage from "@/components/layout/HeadPage";
import {AiFillPlusCircle} from "react-icons/ai";
import Link from "next/link";
import {RiDeleteBin5Line, RiUserLine} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import {useEffect, useState} from "react";
import {bkToast, textGenderType} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookDeleteService, hookListServices} from "@/hooks/admin/hookService";
import {minuteMaker, numberWithCommas} from "@/libs/convertor";
import {GrUserAdmin} from "react-icons/gr";
import {BsFilePerson} from "react-icons/bs";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useSelector} from "react-redux";

export default function Services() {
  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])

  const handlerListServices = async () => {
    setLoading(false)
    await hookListServices((response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteService = async (id) => {
    setLoadingDelete(true)
    await hookDeleteService(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerListServices()
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListServices()
  }, [])


  return (
    <>
      <HeadPage title="خدمات"/>
      <HeaderPage title="خدمات" description="در اینجا لیست خدمات خود را مشاهده کنید.">
        {
          permissions.deleteDraft &&
          <Link href="/admin/services/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>خدمت جدید</span>
          </Link>
        }
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
              <th width="100">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
                    <tr key={index}>
                      <td>
                        {item.name}
                      </td>
                      <td>{item.user.fullName}</td>
                      <td>{minuteMaker(item.periodTime)}</td>
                      <td>{numberWithCommas(item.price)} تومان</td>
                      <td>{item.capacity} نفر</td>
                      <td>
                        {(item.startDate && item.endDate !== null) && item.startDate + ' تا ' + item.endDate}
                      </td>
                      <td>
                        {item.codPayment && 'در محل'}
                        {item.codPayment && item.onlinePayment && ' - '}
                        {item.onlinePayment && 'آنلاین'}
                      </td>
                      <td>
                        {item.smsToAdminService &&
                          <GrUserAdmin className="inline-flex align-middle mx-1"
                                       size="22px"/>}
                        {item.smsToAdminProvider &&
                          <BsFilePerson className="inline-flex align-middle mx-1"
                                        size="22px"/>}
                        {item.smsToUserService &&
                          <RiUserLine className="inline-flex align-middle mx-1" size="22px"/>}
                      </td>
                      <td>
                        {item.emailToAdminService &&
                          <GrUserAdmin className="inline-flex align-middle mx-1"
                                       size="22px"/>}
                        {item.emailToAdminProvider &&
                          <BsFilePerson className="inline-flex align-middle mx-1"
                                        size="22px"/>}
                        {item.emailToUserService &&
                          <RiUserLine className="inline-flex align-middle mx-1" size="22px"/>}
                      </td>
                      <td>{item.gender === "NONE" ? "همه" : textGenderType(item.gender)}</td>
                      <td>
                        {
                          permissions.viewProviders &&
                          <Link href={"/admin/services/providers/" + item.id}
                                className="panel-badge-status bg-green-500">مشاهده</Link>
                        }
                      </td>
                      <td>
                        <div className="flex-center-center gap-3">

                          {
                            permissions.editServices &&
                            <Link href={"/admin/services/" + item.id}><FiEdit
                              size="26px"/></Link>
                          }
                          {
                            permissions.deleteServices &&
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
                                <div className="panel-wrapper-modal max-w-[480px]">
                                  <IoClose
                                    size="32px"
                                    onClick={close}
                                    className="absolute left-4 top-4 cursor-pointer"
                                  />
                                  <div className="panel-modal-title">دریافت تاییدیه</div>
                                  <div className="panel-modal-content">
                                    <p className="leading-9 text-justify">شما در حال حذف<strong
                                      className="px-1 text-red-500">{item.name}</strong>هستید. بدانید که ابتدا ارائه
                                      دهنده های متصل به سرویس را باید حذف کنید.</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteService(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، سرویس را حذف کن'
                                      }

                                    </div>
                                    <div className="panel-modal-close"
                                         onClick={close}>بیخیال شو
                                    </div>
                                  </div>
                                </div>
                              }
                            </Popup>
                          }
                        </div>
                      </td>
                    </tr>
                  ) :
                  <tr>
                    <td colSpan={12}>خدماتی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={12}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
