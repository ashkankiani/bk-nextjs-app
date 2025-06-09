"use client"
import Link from "next/link";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin5Line} from "react-icons/ri";
import {bkToast} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import {AiFillPlusCircle} from "react-icons/ai";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";
import {useDeleteFaq, useGetFaqs} from "@/hooks/admin/useFaq";

export default function TheFaqsUi() {

    const {permissions} = useHook()

    const {data: dataFaqs, isLoading: isLoadingFaqs} = useGetFaqs()

    const {mutateAsync: mutateAsyncDeleteFaq, isPending: isPendingDeleteFaq} = useDeleteFaq()

    const handlerDeleteFaq = async (id: number , close:()=>void) => {
        await mutateAsyncDeleteFaq({id}).then((res) => {
            bkToast('success', res.Message)
            close()
        }).catch(errors => {
            bkToast('error', errors.Reason)
        })
    }

    return (
        <>
            <HeaderPage title="سوالات متداول" description="سوالات متداول برای مشتریان خود ایجاد کنید.">
                {
                    permissions.addFaqs &&
                    <Link href="/admin/faqs/add" className="action">
                        <AiFillPlusCircle size="24px" className="inline-flex align-middle ml-2"/>
                        <span>سوال متداول جدید</span>
                    </Link>
                }
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
                        {
                            isLoadingFaqs ?
                                <tr>
                                    <td colSpan={3}><TheSpinner/></td>
                                </tr>

                                :
                                dataFaqs && dataFaqs.length > 0 ?
                                    dataFaqs?.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>
                                                <div className="flex-center-center gap-3">
                                                    {
                                                        permissions.editFaqs &&
                                                        <Link href={"/admin/faqs/" + item.id}><FiEdit
                                                            size="26px"/></Link>
                                                    }
                                                    {
                                                        permissions.deleteFaqs &&
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
                                                            {(close: () => void) =>
                                                                <div className="panel-wrapper-modal max-w-[500px]">
                                                                    <IoClose
                                                                        size="32px"
                                                                        onClick={close}
                                                                        className="absolute left-4 top-4 cursor-pointer"
                                                                    />
                                                                    <div className="panel-modal-title">حذف سوال متداول
                                                                    </div>
                                                                    <div className="panel-modal-content">
                                                                        <p>آیا از حذف سوال متداول<strong
                                                                            className="px-1 text-red-500">{item.title}</strong>مطمن
                                                                            هستید؟</p>
                                                                    </div>
                                                                    <div className="panel-modal-footer">
                                                                        <div
                                                                            className={"panel-modal-confirm-delete " + (isPendingDeleteFaq ? "disable-action" : "cursor-pointer")}
                                                                            aria-disabled={true}
                                                                            onClick={() => handlerDeleteFaq(item.id , close)}>
                                                                            {
                                                                                isPendingDeleteFaq ?
                                                                                    <TheSpinner/>
                                                                                    :
                                                                                    'مطمنم، سوال متداول را حذف کن'
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
                                        <td colSpan={3}>سوال متداولی برای نمایش وجود ندارد.</td>
                                    </tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
