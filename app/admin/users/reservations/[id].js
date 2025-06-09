import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {bkToast, PNtoEN, textPaymentType, textReservationsStatus} from "@/libs/utility";
import {useEffect, useState} from "react";
import TheSpinner from "@/components/layout/TheSpinner";
import {FiEdit} from "react-icons/fi";
import {fullStringToDateObjectP, numberWithCommas} from "@/libs/convertor";
import {RiDeleteBin5Line} from "react-icons/ri";
import {hookDeleteReservation, hookGetReservationWhere} from "@/hooks/admin/hookReservation";
import Popup from "reactjs-popup";
import {AiOutlineDollarCircle} from "react-icons/ai";
import DisplayOrderPaymentInformation from "@/components/back-end/reservation/DisplayOrderPaymentInformation";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";
import {IoClose} from "react-icons/io5";

export default function UserReservations({id}) {
  const {permissions} = useHook()

  const [loading, setLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])

  const handlerListUserReservationsWhere = async () => {
    setLoading(false)
    let params = {
      type: "condition",
      condition:
        {
          where: {
            userId: parseInt(id),
          },
          include: {
            order: {
              include: {
                payment: {},
                user: {},
                provider: {
                  include: {
                    service: {},
                    user: {}
                  }
                },
              }
            },
          }
        }
    }
    await hookGetReservationWhere(params, (response, message) => {
      setData(message)
      if (response) {
        setLoading(true)
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {
    handlerListUserReservationsWhere()
  }, [])

  const handlerDeleteReservation = async (id) => {
    setLoadingDelete(false)
    await hookDeleteReservation(id, (response, message) => {
      setLoadingDelete(true)
      if (response) {
        bkToast('success', message)
        handlerListUserReservationsWhere()
      } else {
        bkToast('error', message)
      }
    })
  }
  return (
    <>
      <HeadPage title="لیست رزروهای کاربر"/>
      <HeaderPage title="لیست رزروهای کاربر" description="رزروهای کاربر خود را مدیریت کنید.">
        <Link href="/admin/users" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست کاربران</span>
        </Link>
      </HeaderPage>

      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th width={50}>ردیف</th>
              <th>کد پیگیری</th>
              <th>خریدار</th>
              <th>رزرو برای</th>
              <th>تاریخ رزرو</th>
              <th>پرداخت</th>
              <th>وضعیت</th>
              <th width={100}>عملیات</th>
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
                        <div>{item.order.trackingCode}</div>
                        <div
                          dir="ltr">{PNtoEN(fullStringToDateObjectP(item.createdAt, 'YYYY-MM-DDTHH:MM:SS.SSSZ').format('YYYY/MM/DD - HH:MM'))}</div>
                      </td>
                      <td>
                        <div>{item.order.user.fullName}</div>
                        <div>{item.order.user.mobile}</div>
                        <div>{item.order.user.codeMeli}</div>
                      </td>
                      <td>
                        <div>{item.order.provider.service.name}</div>
                        <div>{item.order.provider.user.fullName}</div>
                      </td>
                      <td>
                        <div>{item.date}</div>
                        <div>{item.time.replace('-', ' تا ')}</div>
                        <div>{fullStringToDateObjectP(item.date).weekDay.name}</div>
                      </td>
                      <td>
                        <div>{item.order.discountPrice ? numberWithCommas(item.order.price - item.order.discountPrice) : numberWithCommas(item.order.price)} تومان</div>
                        {/*<div>{numberWithCommas(item.order.totalPrice)} تومان</div>*/}
                        <div>{textPaymentType(item.order.payment.paymentType)}</div>
                      </td>
                      <td>{textReservationsStatus(item.status)}</td>
                      <td>
                        <div className="flex-center-center gap-3">
                          <Popup
                            className="bg-modal"
                            contentStyle={{width: '100%'}}
                            trigger={
                              <div>
                                <AiOutlineDollarCircle size="26px"
                                                       className="cursor-pointer"/>
                              </div>
                            }
                            modal
                            nested
                          >
                            {close => <DisplayOrderPaymentInformation item={item}
                                                                      close={close}/>}
                          </Popup>
                          {
                            permissions.editReservation &&
                            <Link href={"/admin/reservation/" + item.id}><FiEdit
                              size="26px"/></Link>
                          }

                          {
                            permissions.deleteReservation &&
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
                                  <div className="panel-modal-title">حذف رزرو
                                    ({item.order.trackingCode})
                                  </div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف رزرو مطمن هستید؟</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteReservation(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، رزرو را حذف کن'
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
                    <td colSpan={8}>رزروی برای نمایش وجود ندارد.</td>
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