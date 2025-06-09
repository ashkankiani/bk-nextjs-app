import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {RiDeleteBin5Line} from "react-icons/ri";
import {useEffect, useState} from "react";
import {bkToast} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {AiFillPlusCircle} from "react-icons/ai";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {hookDeleteCatalog, hookListCatalogs} from "@/hooks/admin/hookCatalogs";
import {MdOutlineLocalPolice} from "react-icons/md";
import {useSelector} from "react-redux";

export default function Catalogs() {
  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])


  const handlerListCatalogs = async () => {
    setLoading(false)
    await hookListCatalogs((response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteCatalogs = async (id) => {
    setLoadingDelete(true)
    await hookDeleteCatalog(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerListCatalogs()
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListCatalogs()
  }, [])


  return (
    <>
      <HeadPage title="سطوح دسترسی"/>
      <HeaderPage title="سطوح دسترسی" description="سطوح دسترسی برای همه کاربران ایجاد کنید.">
        {
          permissions.addCatalogs &&
          <Link href="/admin/catalogs/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>سطح دسترسی جدید</span>
          </Link>
        }

      </HeaderPage>
      <div className="panel-main">
        <div className="bk-table">
          <table>
            <thead>
            <tr>
              <th width="50">ردیف</th>
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
                      <td>{item.title}</td>
                      <td>
                        <div className="flex-center-center gap-3">
                          {
                            !(item.id === 1 || item.id === 2) && permissions.editCatalogs &&
                            <Link href={"/admin/catalogs/" + item.id}><MdOutlineLocalPolice size="26px"/></Link>
                          }
                          {
                            !(item.id === 1 || item.id === 2 || item.id === 3) && permissions.deleteCatalogs &&
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
                                  <div className="panel-modal-title">حذف سطح دسترسی</div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف سطح دسترسی<strong
                                      className="px-1 text-red-500">{item.title}</strong>مطمن
                                      هستید؟</p>
                                  </div>

                                  <div className="panel-modal-footer">
                                    <div className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                         onClick={() => handlerDeleteCatalogs(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، سطح دسترسی را حذف کن'
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
                    <td colSpan={2}>سطح دسترسی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={2}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
