"use client"
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {bkToast} from "@/libs/utility";
import {useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {AiOutlineSave} from "react-icons/ai";
import {useParams} from "next/navigation";
import useHook from "@/hooks/controller/useHook";
import {useShowPermission} from "@/hooks/admin/usePermission";
import {useUpdatePermission} from "@/hooks/admin/usePermission";
import {TypeApiUpdatePermissionReq} from "@/types/typeApi";
import {useEffect} from "react";

export default function TheIdCatalogUi() {

    const params = useParams()
    const id = Number(params.id)

    const {router} = useHook()

    const {data: dataPermission, isLoading: isLoadingPermission, isFetched: isFetchedPermission } = useShowPermission(id)
    const {mutateAsync: mutateAsyncUpdatePermission, isPending: isPendingUpdatePermission} = useUpdatePermission()


    const {
        register,
        handleSubmit,
        setValue,
        // formState: {errors},
    } = useForm<TypeApiUpdatePermissionReq>({
        criteriaMode: 'all',
    })


    const onSubmit = async (data: TypeApiUpdatePermissionReq) => {

        await mutateAsyncUpdatePermission(data).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        }).finally(() => {
            router.push('/admin/catalogs')
        })
    }


    useEffect(() => {
        if (isFetchedPermission && dataPermission) {
            setValue('id', dataPermission.id)
            setValue('catalogId', dataPermission.catalogId)
        }
    }, [isFetchedPermission])


    return (
        <>
            <HeaderPage title="ویرایش مجوزها" description="مجوزهای سطح دسترسی خود را ویرایش کنید.">
                <Link href="/admin/catalogs" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست سطوح</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                {
                    isLoadingPermission ?
                        <TheSpinner/>
                        :
                        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex-center-start gap-4 flex-wrap mb-4" dir="ltr">
                                {
                                    dataPermission && Object.entries(dataPermission).map(([key, value], index) => {
                                        if (key !== 'id' && key !== 'catalogId') {
                                            return (
                                                <div key={key + index}
                                                     className="rounded-md  p-2 fa-regular-18px bg-white border border-neutral-400 dark:border-darkNavy3 dark:bg-darkNavy2 dark:text-white">
                                                    <label className="flex items-center gap-2 cursor-pointer ">
                                                        <input
                                                            {...register(key, {})}
                                                            type="checkbox"
                                                            className="bk-checkbox"
                                                            defaultChecked={!!value}
                                                        />
                                                        <span className="truncate" title={key}>
                                                          {key}
                                                        </span>
                                                    </label>
                                                </div>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </div>

                            <div className="panel-col-100">
                                <button
                                    className={
                                        'panel-form-submit ' +
                                        (isPendingUpdatePermission ? 'disable-action' : '')
                                    }
                                    type="submit">
                                    {isPendingUpdatePermission ? (
                                        <TheSpinner/>
                                    ) : (
                                        <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ویرایش مجوزها</span>
                                    )}
                                </button>
                            </div>
                        </form>

                }
            </div>
        </>
    )
}

