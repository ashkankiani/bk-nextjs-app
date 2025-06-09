import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin5Line} from "react-icons/ri";
import {useEffect, useState} from "react";
import {bkToast} from "@/libs/utility";
import {hookDeleteHoliday, hookListHolidays} from "@/hooks/admin/hookHoliday";
import TheSpinner from "@/components/layout/TheSpinner";
import {AiFillPlusCircle} from "react-icons/ai";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useSelector} from "react-redux";

export default function Holidays() {
  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])

  const handlerListHolidays = async () => {
    setLoading(false)
    await hookListHolidays((response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteHoliday = async (id) => {
    setLoadingDelete(true)
    await hookDeleteHoliday(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerListHolidays()
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListHolidays()
  }, [])

  return (
    <>
      <HeadPage title="تعطیلات"/>
      <HeaderPage title="تعطیلات" description="روزهای تعطیل رسمی کشور و روزهای دلخواه را مشاهده کنید.">
        {
          permissions.addHolidays &&
          <Link href="/admin/holidays/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>روز تعطیل جدید</span>
          </Link>
        }
      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th width="50">ردیف</th>
              <th>تاریخ</th>
              <th>عنوان</th>
              <th width="100">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.date}</td>
                      <td>{item.title}</td>
                      <td>
                        <div className="flex-center-center gap-3">
                          {
                            permissions.editHolidays &&
                            <Link href={"/admin/holidays/" + item.id}><FiEdit size="26px"/></Link>
                          }
                          {
                            permissions.deleteHolidays &&
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
                                  <div className="panel-modal-title">حذف تعطیلی</div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف تاریخ<strong
                                      className="px-1 text-red-500">{item.date}</strong>مطمن هستید؟</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                         onClick={() => handlerDeleteHoliday(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، روز را حذف کن'
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
                    <td colSpan={4}>روز تعطیلی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={4}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
