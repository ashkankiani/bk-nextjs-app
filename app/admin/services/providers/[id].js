import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {RiDeleteBin5Line} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import {useEffect, useState} from "react";
import {bkToast} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {hookDeleteProvider, hookGetProviderByKeyId} from "@/hooks/admin/hookProvider";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useSelector} from "react-redux";

export default function ProvidersForService({id}) {

  const permissions = useSelector(state => state.user.permissions)


  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])


  const handlerGetProviderByServiceId = async () => {
    setLoading(false)
    let params = {
      serviceId: parseInt(id)
    }
    // let params = {
    //     type: "condition",
    //     how: "findMany",
    //     condition: {
    //         where: {
    //             serviceId: parseInt(id)
    //         },
    //         include: {
    //             service: {
    //                 select: {
    //                     name: true
    //                 }
    //             },
    //             user: {
    //                 select: {
    //                     fullName: true
    //                 }
    //             },
    //         },
    //     }
    // }
    await hookGetProviderByKeyId(params, (response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }


  const handlerDeleteProvider = async (id) => {
    setLoadingDelete(true)
    await hookDeleteProvider(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerGetProviderByServiceId()
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {
    handlerGetProviderByServiceId()
  }, [])


  return (
    <>
      <HeadPage title="خدمات"/>
      <HeaderPage title="لیست ارائه دهندگان" description="در اینجا لیست ارائه دهندگان به خدمت خود را مشاهده کنید.">
        <Link href="/admin/services" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست خدمات</span>
        </Link>
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
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
                    <tr key={index}>
                      <td>{item.user.fullName}</td>
                      <td>{item.service.name}</td>
                      <td>{item.slotTime} دقیقه</td>
                      <td>
                        {(item.startDate && item.endDate !== null) && item.startDate + ' تا ' + item.endDate}
                      </td>
                      <td>
                        {(item.startTime && item.endTime !== null) && item.startTime + ' تا ' + item.endTime}
                      </td>
                      <td>{item.status ? 'فعال' : 'غیرفعال'}</td>
                      <td>
                        {
                          permissions.viewTimesheets &&
                          <Link href={"/admin/providers/timesheets/" + item.id}
                                className="panel-badge-status bg-green-500">تقویم کاری</Link>
                        }
                      </td>
                      <td>
                        <div className="flex-center-center gap-3">
                          {
                            permissions.editProviders &&
                            <Link href={"/admin/providers/" + item.id}><FiEdit size="26px"/></Link>
                          }
                          {
                            permissions.deleteProviders &&
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
                                  <div className="panel-modal-title">حذف ارائه دهنده</div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف ارائه دهنده <strong
                                      className="px-1 text-red-500">{item.user.fullName}</strong>برای<strong
                                      className="px-1 text-red-500">{item.service.name}</strong>مطمن هستید؟ بدانید که
                                      تقویم کاری های متصل به سرویس<strong
                                        className="px-1 text-red-500">{item.service.name}</strong>نیز حذف می شوند.</p>
                                    <p className="mt-2">حتما باید همه رزروها با هر وضعیتی، که برای این ارائه
                                      دهنده
                                      ایجاد شده است را ابتدا حذف نمایید.</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteProvider(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، ارائه دهنده را حذف کن'
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
                    <td colSpan={8}>ارائه دهنده برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={8}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}


export const getServerSideProps = ({query}) => {
  const id = query.id
  return {props: {id}}
}