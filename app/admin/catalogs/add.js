import HeadPage from "@/components/layout/HeadPage";
import Link from "next/link";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import {AiOutlineSave} from "react-icons/ai";
import {useForm} from 'react-hook-form'
import {bkToast} from "@/libs/utility";
import {useState} from "react";
import TheSpinner from "@/components/layout/TheSpinner";
import {useRouter} from "next/router";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import HeaderPage from "@/components/back-end/section/HeaderPage";
import {hookAddCatalog} from "@/hooks/admin/hookCatalogs";

export default function AddCatalog() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)


  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    criteriaMode: 'all',
  })

  const onSubmit = data => {
    addCatalog(data)
  }

  const addCatalog = async data => {
    setLoading(true)
    await hookAddCatalog(data, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', message)
        router.push('/admin/catalogs')
      } else {
        bkToast('error', message)
      }
    })
  }

  return (
    <>
      <HeadPage title="افزودن سطح دسترسی جدید"/>
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
                  (loading ? 'disable-action' : '')
                }
                type="submit">
                {loading ? (
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
