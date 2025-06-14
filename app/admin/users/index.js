import HeadPage from "@/components/layout/HeadPage";
import {AiFillPlusCircle} from "react-icons/ai";
import Link from "next/link";
import {RiDeleteBin5Line, RiFileExcel2Fill} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import {useEffect, useState} from "react";
import {bkToast, textGenderType} from "@/libs/utility";
import {hookDeleteUser, hookListUsers} from "@/hooks/admin/hookUser";
import TheSpinner from "@/components/layout/TheSpinner";
import TheExport from "@/components/layout/TheExport";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import {hookDeleteAllReservationUser} from "@/hooks/admin/hookReservation";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useSelector} from "react-redux";


export default function Users() {

  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingDeleteReserve, setLoadingDeleteReserve] = useState(false)
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])


  const handlerListUsers = async () => {
    setLoading(false)
    await hookListUsers(async (response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
        await createObjExportForUsers(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteUser = async (id) => {
    setLoadingDelete(true)
    await hookDeleteUser(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerListUsers()
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteAllReservationUser = async (id) => {
    setLoadingDeleteReserve(true)
    await hookDeleteAllReservationUser(id, (response, message) => {
      setLoadingDeleteReserve(false)
      if (response) {
        bkToast('success', message)
        handlerListUsers()
      } else {
        bkToast('error', message)
      }
    })
  }


  useEffect(() => {
    handlerListUsers()
  }, [])


  const createObjExportForUsers = async OBJ => {
    let sameExport = []
    OBJ.map(item => {
      sameExport.push([
        item.codeMeli,
        item.fullName,
        item.mobile,
        item.email,
        textGenderType(item.gender),
        item.catalog.title,
        item.status ? 'فعال' : 'غیرفعال',
      ])
    })
    setDataExport(sameExport)
  }

  return (
    <>
      <HeadPage title="کاربران"/>
      <HeaderPage title="کاربران" description="در اینجا لیست کاربران را مشاهده کنید.">

          {
            permissions.importUsers &&
            <Link href="/admin/users/add-excel" className="action">
              <RiFileExcel2Fill size="24px" className="inline-flex align-middle ml-2"/>
              <span>درون ریزی کاربر</span>
            </Link>
          }
          {
            permissions.exportUsers &&
            <TheExport
              title="برون بری کاربر"
              loading={loading}
              dataExport={dataExport}
              keys="کدملی,نام و نام خانوادگی,موبایل,ایمیل,جنسیت,دسترسی,وضعیت"
              heading={[
                [
                  'کدملی',
                  'نام و نام خانوادگی',
                  'موبایل',
                  'ایمیل',
                  'جنسیت',
                  'دسترسی',
                  'وضعیت',
                ],
              ]}
            />
          }
          {
            permissions.addUsers &&
            <Link href="/admin/users/add" className="action">
              <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
              <span>کاربر جدید</span>
            </Link>
          }

      </HeaderPage>

      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th className="w-[50px]">ردیف</th>
              <th>کدملی</th>
              <th>نام و نام خانوادگی</th>
              <th>موبایل</th>
              <th>ایمیل</th>
              <th>جنسیت</th>
              <th>نقش</th>
              <th>رزروها</th>
              <th className="w-[100px]">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
                    <tr key={index}>
                      <td className={item.status ? '' : 'bg-red-500 text-white'}>{index + 1}</td>
                      <td>{item.codeMeli}</td>
                      <td>{item.fullName}</td>
                      <td dir="ltr">{item.mobile}</td>
                      <td dir="ltr">{item.email}</td>
                      <td>{textGenderType(item.gender)}</td>
                      <td>{item.catalog.title}</td>
                      <td>
                        {
                          permissions.viewReservation &&
                          <Link href={"/admin/users/reservations/" + item.id}
                                className="panel-badge-status bg-green-500">مشاهده</Link>
                        }
                      </td>
                      <td>
                        <div className="flex-center-center gap-3">
                          {
                            permissions.editUsers &&
                            <Link href={"/admin/users/" + item.codeMeli}><FiEdit
                              size="26px"/></Link>
                          }
                          {
                            permissions.deleteUsers && (item.id !== 1) &&
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
                                  <div className="panel-modal-title">حذف کاربر</div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف کاربر<strong className="px-1 text-red-500">{item.fullName}</strong>مطمن
                                      هستید؟</p>
                                    <p className="my-4">بدانید که با حذف کاربر، همه رزروها، فاکتورها و... این کاربر حذف
                                      می شوند.</p>
                                    <p>چنانچه در حال حذف ارائه دهنده هستید باید ابتدا ارائه های این ارائه دهنده را حذف
                                      کنید.</p>
                                  </div>
                                  <div className="panel-modal-footer flex-col">
                                    <p className="fa-regular-18px mt-2">حتما باید همه رزروها با هر وضعیتی، که برای این
                                      کاربر ایجاد شده است را ابتدا حذف نمایید.</p>
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDeleteReserve ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteAllReservationUser(item.id)}>
                                      {
                                        loadingDeleteReserve ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، همه رزروهای این کاربر را حذف کن'
                                      }
                                    </div>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div
                                      className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                      onClick={() => handlerDeleteUser(item.codeMeli)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، خود کاربر را حذف کن'
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
                    <td colSpan={3}>کاربری برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={3}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
