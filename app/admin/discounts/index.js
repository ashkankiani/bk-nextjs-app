import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin5Line} from "react-icons/ri";
import {AiFillPlusCircle} from "react-icons/ai";
import {useEffect, useState} from "react";
import {bkToast} from "@/libs/utility";
import {hookDeleteDiscount, hookListDiscounts} from "@/hooks/admin/hookDiscount";
import TheSpinner from "@/components/layout/TheSpinner";
import {numberWithCommas} from "@/libs/convertor";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useSelector} from "react-redux";

export default function Discounts() {

  const permissions = useSelector(state => state.user.permissions)

  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [data, setData] = useState([])

  const handlerListDiscounts = async () => {
    setLoading(false)
    await hookListDiscounts((response, message) => {
      setLoading(true)
      if (response) {
        setData(message)
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerDeleteDiscount = async (id) => {
    setLoadingDelete(true)
    await hookDeleteDiscount(id, (response, message) => {
      setLoadingDelete(false)
      if (response) {
        bkToast('success', message)
        handlerListDiscounts()
      } else {
        bkToast('error', message)
      }
    })
  }

  useEffect(() => {
    handlerListDiscounts()
  }, [])

  return (
    <>
      <HeadPage title="کد تخفیف"/>
      <HeaderPage title="کد تخفیف" description="کدهای تخفیف برای مشتریان خود ایجاد کنید.">
        {
          permissions.addDiscounts &&
          <Link href="/admin/discounts/add" className="action">
            <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
            <span>کد تخفیف جدید</span>
          </Link>
        }
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
              <th width="100">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {
              loading ?
                data.length > 0 ?
                  data?.map((item, index) =>
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.code}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>{item.type === 'CONSTANT' ? 'تخفیف ثابت' : 'درصد تخفیف'}</td>
                      <td>{item.type === 'CONSTANT' ? numberWithCommas(item.amount) : item.amount} {item.type === 'CONSTANT' ? 'تومان' : 'درصد'}</td>
                      <td>
                        <div className="flex-center-center gap-3">
                          {
                            permissions.editDiscounts &&
                            <Link href={"/admin/discounts/" + item.id}><FiEdit size="26px"/></Link>
                          }
                          {
                            permissions.deleteDiscounts &&
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
                                  <div className="panel-modal-title">حذف کد تخفیف</div>
                                  <div className="panel-modal-content">
                                    <p>آیا از حذف کدتخفیف<strong
                                      className="px-1 text-red-500">{item.title}</strong>مطمن هستید؟ بدانید که دیگر
                                      نمیتوانید بفهمید که، کاربر از چه کد تخفیفی روی فاکتور استفاده کرده است.</p>
                                  </div>
                                  <div className="panel-modal-footer">
                                    <div className={"panel-modal-confirm-delete " + (loadingDelete ? "disable-action" : "cursor-pointer")}
                                         onClick={() => handlerDeleteDiscount(item.id)}>
                                      {
                                        loadingDelete ?
                                          <TheSpinner/>
                                          :
                                          'مطمنم، کد تخفیف را حذف کن'
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
                    <td colSpan={7}>کد تخفیفی برای نمایش وجود ندارد.</td>
                  </tr>
                :
                <tr>
                  <td colSpan={7}><TheSpinner/></td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
