import {AiFillPlusCircle} from "react-icons/ai";
import Link from "next/link";
import {RiDeleteBin5Line, RiFileExcel2Fill} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import {useEffect, useState} from "react";
import {bkToast, textGenderType} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import TheExport from "@/components/layout/TheExport";
import Popup from "reactjs-popup";
import {IoClose} from "react-icons/io5";
import {hookDeleteAllReservationUser} from "@/hooks/admin/hookReservation";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useGetUsers} from "@/hooks/admin/useUser";
import useHook from "@/hooks/controller/useHook";
import {useDeleteUser} from "@/hooks/admin/useUser";
import {TypeApiGetUsersRes} from "@/types/typeApiAdmin";


export default function TheUsersUi() {

    const {permissions} = useHook()

    const [loadingDeleteReserve, setLoadingDeleteReserve] = useState(false)
    const [dataExport, setDataExport] = useState<string[][]>([])


    const {data: dataUsers, isLoading: isLoadingUsers, isFetched: isFetchedUsers} = useGetUsers()
    const {mutateAsync: mutateAsyncDeleteUser, isPending: isPendingDeleteUser} = useDeleteUser()

    useEffect(() => {
        if (isFetchedUsers && dataUsers) {
            createObjExportForUsers(dataUsers)
        }
    }, [isFetchedUsers])


    const handlerDeleteUser = async (id: number, close: () => void) => {
        await mutateAsyncDeleteUser({id}).then((res) => {
            bkToast('success', res.Message)
            close()
        }).catch(errors => {
            bkToast('error', errors.Reason)
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


    const createObjExportForUsers = (OBJ: TypeApiGetUsersRes[]) => {
        const sameExport: string[][] = []
        OBJ.map(item => {
            sameExport.push([
                item.codeMeli,
                item.fullName,
                item.mobile,
                item.email ? item.email : "-",
                textGenderType(item.gender),
                item.catalog.title,
                item.locked ? 'فعال' : 'غیرفعال',
            ])
        })
        setDataExport(sameExport)
    }

    return (
        <>
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
                        loading={isLoadingUsers}
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
                            isLoadingUsers ?
                                <tr>
                                    <td colSpan={3}><TheSpinner/></td>
                                </tr>
                                :
                                dataUsers && dataUsers.length > 0 ?
                                    dataUsers.map((item, index) =>
                                        <tr key={index}>
                                            <td className={item.locked ? '' : 'bg-red-500 text-white'}>{index + 1}</td>
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
                                                            {(close: () => void) =>
                                                                <div className="panel-wrapper-modal max-w-[500px]">
                                                                    <IoClose
                                                                        size="32px"
                                                                        onClick={close}
                                                                        className="absolute left-4 top-4 cursor-pointer"
                                                                    />
                                                                    <div className="panel-modal-title">حذف کاربر</div>
                                                                    <div className="panel-modal-content">
                                                                        <p>آیا از حذف کاربر<strong
                                                                            className="px-1 text-red-500">{item.fullName}</strong>مطمن
                                                                            هستید؟</p>
                                                                        <p className="my-4">بدانید که با حذف کاربر، همه
                                                                            رزروها، فاکتورها و... این کاربر حذف
                                                                            می شوند.</p>
                                                                        <p>چنانچه در حال حذف ارائه دهنده هستید باید
                                                                            ابتدا ارائه های این ارائه دهنده را حذف
                                                                            کنید.</p>
                                                                    </div>
                                                                    <div className="panel-modal-footer flex-col">
                                                                        <p className="fa-regular-18px mt-2">حتما باید
                                                                            همه رزروها با هر وضعیتی، که برای این
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
                                                                            className={"panel-modal-confirm-delete " + (isPendingDeleteUser ? "disable-action" : "cursor-pointer")}
                                                                            onClick={() => handlerDeleteUser(item.id, close)}>
                                                                            {
                                                                                isPendingDeleteUser ?
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

                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
