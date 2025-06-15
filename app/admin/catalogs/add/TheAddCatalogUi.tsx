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
import {useAddCatalog} from "@/hooks/admin/useCatalog";
import {TypeApiAddCatalogReq} from "@/types/typeApi";

export default function TheAddCatalogUi() {

  const {router} = useHook()

  const {mutateAsync: mutateAsyncAddCatalog, isPending: isPendingAddCatalog} = useAddCatalog()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<TypeApiAddCatalogReq>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: TypeApiAddCatalogReq) => {

    await mutateAsyncAddCatalog(data).then((res) => {
      bkToast('success', res.Message)
    }).catch(errors => {
      bkToast('error', errors.Reason)
    }).finally(() => {
      router.push('/admin/catalogs')
    })
  }


  return (
    <>
      <HeaderPage title="افزودن سطح دسترسی جدید" description="یک سطح دسترسی جدید ایجاد کنید.">
        <Link href="/admin/catalogs" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="inline-flex align-middle ml-2"/>
          <span>لیست سطوح</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">

        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-100">
              <label>عنوان سطح دسترسی<span>*</span></label>
              <input
                {...register('title', {
                  required: {
                    value: true,
                    message: 'عنوان سطوح دسترسی ضروری است',
                  },
                  minLength: {
                    value: 3,
                    message: 'نام سطح دسترسی باید حداقل 3 کاراکتر باشد.',
                  },
                  maxLength: {
                    value: 20,
                    message: 'نام سطح دسترسی نباید بیشتر از 20 کاراکتر باشد.',
                  },
                })}
                type="text" className="bk-input"/>
              <FormErrorMessage errors={errors} name="title"/>
            </div>
            <div className="panel-col-100">
              <button
                className={
                  'panel-form-submit ' +
                  (isPendingAddCatalog ? 'disable-action' : '')
                }
                type="submit">
                {isPendingAddCatalog ? (
                  <TheSpinner/>
                ) : (
                  <span><AiOutlineSave size="24px" className="inline-flex align-middle ml-2"/>ثبت سطح جدید</span>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  )
}
