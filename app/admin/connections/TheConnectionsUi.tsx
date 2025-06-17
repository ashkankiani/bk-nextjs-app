"use client"
import HeadPage from "@/components/layout/HeadPage";
import {AiOutlineSave, AiOutlineSetting} from "react-icons/ai";
import React, {useEffect} from "react";
import {bkToast, onlyTypeNumber} from "@/libs/utility";
import {useForm} from "react-hook-form";
import TheSpinner from "@/components/layout/TheSpinner";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import Link from "next/link";
import useHook from "@/hooks/controller/useHook";
import {useGetConnections, useUpdateConnection} from "@/hooks/admin/useConnection";
import {TypeApiConnection} from "@/types/typeApi";
import DocumentWebServiceSms from "@/app/admin/connections/components/DocumentWebServiceSms";
import ConnectionTest from "@/app/admin/connections/components/ConnectionTest";

export default function TheConnectionsUi() {

    const {permissions} = useHook()


    const items = [
        "bankName1",
        "merchantId1",
        "bankName2",
        "merchantId2",
        "smsName",
        "smsURL",
        "smsToken",
        "smsUserName",
        "smsPassword",
        "smsFrom",
        "smsCodePattern1",
        "smsCodePattern2",
        "smsCodePattern3",
        "smsCodePattern4",
        "smsCodePattern5",
        "smsCodePattern6",
        "smtpURL",
        "smtpUserName",
        "smtpPassword",
    ];

    const itemsInteger = [
        "id",
        "smtpPort",
    ];


    const {
        data: dataConnections,
        isLoading: isLoadingConnections,
        isFetched: isFetchedConnections
    } = useGetConnections()
    const {mutateAsync: mutateAsyncUpdateConnection, isPending: isPendingUpdateConnection} = useUpdateConnection()


    useEffect(() => {
        if (isFetchedConnections && dataConnections && dataConnections[0]) {

            items.forEach(item => {
                setValue(item, dataConnections[0][item])
            })
            itemsInteger.forEach(item => {
                setValue(item, parseInt(dataConnections[0][item]))
            })

            // setValue('id', dataPermission.id)
            // setValue('catalogId', dataPermission.catalogId)
        }
    }, [isFetchedConnections])


    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeApiConnection>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeApiConnection) => {

        itemsInteger.forEach(item => {
            data[item] = parseInt(data[item])
        })

        await mutateAsyncUpdateConnection(data).then((res) => {
            bkToast('success', res.Message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        })
    }


    return (
        <>
            <HeadPage title="ارتباطات"/>
            <HeaderPage title="ارتباطات" description="ارتباطات و پیگربندی وب سرویس خود را انجام دهید.">
                {
                    permissions.viewSettings &&
                    <Link href="/admin/connections" className="action">
                        <AiOutlineSetting size="24px" className="inline-flex align-middle ml-2"/>
                        <span>تنظیمات سایت</span>
                    </Link>
                }
            </HeaderPage>
            <div className="panel-main">
                {
                    isLoadingConnections ?
                        <TheSpinner/>
                        :
                        <>
                            <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex-center-start flex-wrap">

                                    <div className="panel-col-25">
                                        <label>درگاه بانکی یک</label>
                                        <select
                                            {...register('bankName1')}
                                            defaultValue="NONE"
                                            className="bk-input">
                                            <option value="NONE">غیرفعال</option>
                                            <option value="ZARINPAL">زرین پال</option>
                                            <option value="ZIBAL">زیبال</option>
                                            <option value="AQAYEPARDAKHT">آقای پرداخت</option>
                                            <option value="IDPAY" disabled={true}>آیدی پی (غیرفعال)</option>
                                        </select>
                                        <FormErrorMessage errors={errors} name="bankName1"/>
                                    </div>
                                    <div className="panel-col-75">
                                        <label>مرچندکد یک</label>
                                        <input
                                            {...register('merchantId1')}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="merchantId1"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>درگاه بانکی دوم</label>
                                        <select
                                            {...register('bankName2')}
                                            defaultValue="NONE"
                                            className="bk-input">
                                            <option value="NONE">غیرفعال</option>
                                            <option value="ZARINPAL">زرین پال</option>
                                            <option value="ZIBAL">زیبال</option>
                                            <option value="AQAYEPARDAKHT">آقای پرداخت</option>
                                            <option value="IDPAY" disabled={true}>آیدی پی (غیرفعال)</option>
                                        </select>
                                        <FormErrorMessage errors={errors} name="bankName2"/>
                                    </div>
                                    <div className="panel-col-75">
                                        <label>مرچندکد دوم</label>
                                        <input
                                            {...register('merchantId2')}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="merchantId2"/>
                                    </div>

                                    <div className="w-full p-4 my-4">
                                        <hr className="panel-section-separator"/>
                                    </div>

                                    <div className="panel-col-33">
                                        <label>نام سیستم پیامکی</label>
                                        <select
                                            {...register('smsName')}
                                            defaultValue="NONE"
                                            className="bk-input">
                                            <option value="NONE">غیرفعال</option>
                                            <option value="IPPANEL">آی پی پنل (IPPANEL)</option>
                                            <option value="MELIPAYAMAK">ملی پیامک (melipayamak.com)</option>
                                            <option value="KAVENEGAR">کاوه نگار (kavenegar.com)</option>
                                            <option value="FARAZSMS">فراز اس ام اس (farazsms.com)</option>
                                            <option value="SMSIR">ایده پردازان (sms.ir)</option>
                                        </select>
                                        <FormErrorMessage errors={errors} name="smsName"/>
                                    </div>
                                    <div className="panel-col-33">
                                        <label>آدرس API سیستم پیامکی</label>
                                        <input
                                            {...register('smsURL')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsURL"/>
                                    </div>
                                    <div className="panel-col-33">
                                        <label>توکن سیستم پیامکی</label>
                                        <input
                                            {...register('smsToken')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsToken"/>
                                    </div>
                                    <div className="panel-col-33">
                                        <label>نام کاربری سیستم پیامکی</label>
                                        <input
                                            {...register('smsUserName')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsUserName"/>
                                    </div>
                                    <div className="panel-col-33">
                                        <label>کلمه عبور سیستم پیامکی</label>
                                        <input
                                            {...register('smsPassword')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsPassword"/>
                                    </div>
                                    <div className="panel-col-33">
                                        <label>شماره خط سیستم پیامکی</label>
                                        <input
                                            {...register('smsFrom')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsFrom"/>
                                    </div>

                                    <div className="w-full p-4 my-4">
                                        <hr className="panel-section-separator"/>
                                    </div>

                                    <div className="panel-col-25">
                                        <label>کد پترن پیامک یکبار مصرف</label>
                                        <input
                                            {...register('smsCodePattern1')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern1"/>
                                    </div>

                                    <div className="panel-col-25">
                                        <label>کد پترن لغو رزرو<span
                                            className="fa-regular-14px">خالی باشد = پیامک لفو ارسال نمی شود</span></label>
                                        <input
                                            {...register('smsCodePattern2')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern2"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>کد پترن تایید رزرو</label>
                                        <input
                                            {...register('smsCodePattern3')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern3"/>
                                    </div>

                                    <div className="panel-col-25">
                                        <label>کد پترن تغییر وضعیت رزرو</label>
                                        <input
                                            {...register('smsCodePattern4')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern4"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>کد پترن یادآوری رزرو</label>
                                        <input
                                            {...register('smsCodePattern5')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern5"/>
                                    </div>

                                    <div className="panel-col-25">
                                        <label>کد پترن قدردانی پس از انجام رزرو</label>
                                        <input
                                            {...register('smsCodePattern6')}
                                            type="text" dir="ltr" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smsCodePattern6"/>
                                    </div>

                                    {/*<div className="panel-col-25">*/}
                                    {/*  <label>پترن 7</label>*/}
                                    {/*  <input*/}
                                    {/*    {...register('smsCodePattern7')}*/}
                                    {/*    type="text" dir="ltr" className="bk-input"/>*/}
                                    {/*  <FormErrorMessage errors={errors} name="smsCodePattern7"/>*/}
                                    {/*</div>*/}
                                    {/*<div className="panel-col-25">*/}
                                    {/*  <label>پترن 8</label>*/}
                                    {/*  <input*/}
                                    {/*    {...register('smsCodePattern8')}*/}
                                    {/*    type="text" dir="ltr" className="bk-input"/>*/}
                                    {/*  <FormErrorMessage errors={errors} name="smsCodePattern8"/>*/}
                                    {/*</div>*/}

                                    <div className="w-full p-4 my-4">
                                        <hr className="panel-section-separator"/>
                                    </div>

                                    <div className="panel-col-25">
                                        <label>نام میزبان SMTP</label>
                                        <input
                                            {...register('smtpURL')}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smtpURL"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>پورت</label>
                                        <input
                                            {...register('smtpPort', {
                                                min: {
                                                    value: 0,
                                                    message: " باید از 0 بیشتر باشد."
                                                },
                                                max: {
                                                    value: 1000,
                                                    message: " نباید از 1000 معادل نهایتا یک هفته بیشتر باشد."
                                                },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'یک عدد صحیح وارد کنید.',
                                                },
                                            })}
                                            onKeyPress={onlyTypeNumber}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smtpPort"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>نام کاربری</label>
                                        <input
                                            {...register('smtpUserName')}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smtpUserName"/>
                                    </div>
                                    <div className="panel-col-25">
                                        <label>کلمه عبور</label>
                                        <input
                                            {...register('smtpPassword')}
                                            type="text" className="bk-input"/>
                                        <FormErrorMessage errors={errors} name="smtpPassword"/>
                                    </div>
                                    {
                                        permissions.editConnections &&
                                        <div className="panel-col-100">
                                            <button
                                                className={
                                                    'panel-form-submit ' +
                                                    (isPendingUpdateConnection ? 'disable-action' : '')
                                                }
                                                type="submit">
                                                {isPendingUpdateConnection ? (
                                                    <TheSpinner/>
                                                ) : (
                                                    <span><AiOutlineSave size="24px"
                                                                         className="inline-flex align-middle ml-2"/>ثبت ارتباطات</span>
                                                )}
                                            </button>
                                        </div>
                                    }
                                </div>
                            </form>
                            <ConnectionTest/>
                            <DocumentWebServiceSms/>
                        </>

                }
            </div>
        </>
    )
}