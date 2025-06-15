"use client"
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {bkToast} from "@/libs/utility";
import {useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {useParams} from "next/navigation";
import useHook from "@/hooks/controller/useHook";
import {useShowFaq, useUpdateFaq} from "@/hooks/admin/useFaq";
import {TypeApiUpdateFaqReq} from "@/types/typeApi";
import {useEffect} from "react";

export default function TheIdFaqUi() {

    const params = useParams()
    const id = Number(params.id)

    const {permissions, router} = useHook()

    const {data: dataFaq, isLoading: isLoadingFaq, isFetched: isFetchedFaq} = useShowFaq(id)
    const {mutateAsync: mutateAsyncUpdateFaq, isPending: isPendingUpdateFaq} = useUpdateFaq()

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeApiUpdateFaqReq>({
        criteriaMode: 'all',
    })


    const onSubmit = async (data: TypeApiUpdateFaqReq) => {

        await mutateAsyncUpdateFaq(data).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        }).finally(() => {
            router.push('/admin/faqs')
        })

    }

    useEffect(() => {
        if (isFetchedFaq && dataFaq) {
            setValue('id', dataFaq.id)
            setValue('title', dataFaq.title)
            setValue('content', dataFaq.content)
        }
    }, [isFetchedFaq])

    return (
        <>
            <HeaderPage title="ویرایش سوال متداول" description="سوالات متداول خود را ویرایش کنید.">
                <Link href="/admin/faqs" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست سوال متداول</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">
                {
                    isLoadingFaq ?
                        <TheSpinner/>
                        :
                        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex-center-start flex-wrap">
                                <div className="panel-col-100">
                                    <label>عنوان سوال<span>*</span></label>
                                    <input
                                        {...register('title', {
                                            required: {
                                                value: true,
                                                message: 'عنوان ضروری است',
                                            },
                                        })}
                                        type="text" className="bk-input"/>
                                    <FormErrorMessage errors={errors} name="title"/>
                                </div>
                                <div className="panel-col-100">
                                    <label>توضیحات سوال<span>*</span></label>
                                    <textarea
                                        {...register('content', {
                                            required: {
                                                value: true,
                                                message: 'توضیحات ضروری است',
                                            },
                                        })}
                                        rows={5} className="bk-input text-right"/>
                                    <FormErrorMessage errors={errors} name="content"/>
                                </div>
                                {
                                    permissions.editFaqs &&
                                    <div className="panel-col-100">
                                        <button
                                            className={
                                                'panel-form-submit ' +
                                                (isPendingUpdateFaq ? 'disable-action' : '')
                                            }
                                            type="submit">
                                            {isPendingUpdateFaq ? (
                                                <TheSpinner/>
                                            ) : (
                                                <span><AiOutlineSave size="24px"
                                                                     className="inline-flex align-middle ml-2"/>ویرایش سوال</span>
                                            )}
                                        </button>
                                    </div>
                                }
                            </div>
                        </form>
                }
            </div>
        </>
    )
}