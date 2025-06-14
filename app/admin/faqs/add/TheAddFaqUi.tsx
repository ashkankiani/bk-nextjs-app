"use client"
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useForm} from 'react-hook-form'
import {bkToast} from "@/libs/utility";
import TheSpinner from "@/components/layout/TheSpinner";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import useHook from "@/hooks/controller/useHook";
import {useAddFaq} from "@/hooks/admin/useFaq";
import {TypeApiAddFaqReq} from "@/types/typeApi";

export default function TheAddFaqUi() {

    const {router} = useHook()

    const {mutateAsync: mutateAsyncAddFaq, isPending: isPendingAddFaq} = useAddFaq()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeApiAddFaqReq>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeApiAddFaqReq) => {
        await mutateAsyncAddFaq(data).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        }).finally(() => {
            router.push('/admin/faqs')
        })
    }


    return (
        <>
            <HeaderPage title="افزودن سوال متداول جدید"
                        description="سوالات متداول علاوه بر روشنگری، بار پشتیبانی شما را کاهش میدهد.">
                <Link href="/admin/faqs" className="back">
                    <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
                    <span>لیست سوال متداول</span>
                </Link>
            </HeaderPage>
            <div className="panel-main">

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
                        <div className="panel-col-100">
                            <button
                                className={
                                    'panel-form-submit ' +
                                    (isPendingAddFaq ? 'disable-action' : '')
                                }
                                type="submit">
                                {isPendingAddFaq ? (
                                    <TheSpinner/>
                                ) : (
                                    <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت سوال جدید</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}
