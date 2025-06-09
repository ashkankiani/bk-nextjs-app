import {IoClose} from "react-icons/io5";
import {useForm} from "react-hook-form";
import {bkToast} from "@/libs/utility";
import {hookLogin, hookRegister} from "@/hooks/user/hookAuth";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import TheSpinner from "@/components/layout/TheSpinner";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setIsLogin, setPermissions, setUser} from "@/store/slice/user";
// import {setCookie} from "cookies-next";

export default function ModalFastRegister({checkDraft, close}) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const password = Math.floor(1000000 + Math.random() * 9000000)

  const {
    register,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    criteriaMode: 'all',
  })

  const onSubmit = async (data) => {
    data["type"] = "REGISTER";
    if (data.fullName.length === 0) {
      data.fullName = "مهمان"
    }
    data.password = password.toString()
    await handlerRegister(data)
  }

  const handlerRegister = async data => {
    setLoading(true)
    await hookRegister(data, async (response, message) => {
      if (response) {
        await handlerLogin()
      } else {
        bkToast('error', message)
      }
    })
  }

  const handlerLogin = async () => {
    let params = {
      type: "LOGIN",
      codeMeli: getValues('codeMeli'),
      password: password.toString(),
    }
    await hookLogin(params, async (response, message) => {
      setLoading(false)
      if (response) {
        if (message.status) {
          dispatch(setIsLogin(true))
          dispatch(setPermissions(message.permissions))
          delete message.permissions
          dispatch(setUser(message))
          // setCookie('bk-session', message.session,{ maxAge: 60 * 60 * 24 , httpOnly: process.env.NODE_ENV === "production" })
          bkToast('success', message.fullName + ' با موفقیت وارد شدید.')
          close()
          await checkDraft(message)
        } else {
          bkToast('error', message.fullName + ' حساب کاربری شما توسط مدیر غیرفعال شده است.')
        }
      } else {
        bkToast('error', message)
      }
    })
  }


  return (
    <div className="panel-wrapper-modal max-w-[480px]">
      <IoClose
        size="32px"
        onClick={close}
        className="absolute left-4 top-4 cursor-pointer"
      />
      <div className="panel-modal-title">ثبت نوبت مهمان</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="panel-modal-content">
          <p className="mb-4">برای پیگیری رزرو و رهگیری پرداخت نیاز به تکمیل اطلاعات زیر است.</p>
          <div className="columns-1 mb-4">
            <input
              {...register('codeMeli', {
                required: {
                  value: true,
                  message: 'کد ملی ضروری است',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'لطفا عدد وارد کنید',
                },
                minLength: {
                  value: 10,
                  message: 'کد ملی باید 10 کاراکتر باشد.',
                },
                maxLength: {
                  value: 10,
                  message: 'کد ملی باید 10 کاراکتر باشد.',
                },
              })}
              type="text" className="bk-input" placeholder="کد ملی"/>
            <FormErrorMessage errors={errors} name="codeMeli"/>
          </div>
          <div className="columns-1 mb-4">
            <input
              {...register('mobile', {
                required: {
                  value: true,
                  message: 'شماره موبایل ضروری است.',
                },
                pattern: {
                  value: /^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/,
                  message: 'شماره موبایل معتبر نمی باشد.',
                },
                minLength: {
                  value: 11,
                  message: 'شماره موبایل باید 11 کاراکتر باشد.',
                },
                maxLength: {
                  value: 16,
                  message: 'شماره موبایل باید نهایتا 16 کاراکتر باشد.',
                },
              })}
              type="text" dir="ltr" className="bk-input" placeholder="شماره موبایل"/>
            <FormErrorMessage errors={errors} name="mobile"/>

          </div>
          <div className="columns-1">
            <input
              {...register('fullName', {
                required: {
                  value: false,
                  message: 'نام و نام خانوادگی ضروری است.',
                },
                minLength: {
                  value: 5,
                  message: 'نام و نام خانوادگی باید بیش از 5 کاراکتر باشد.',
                },
                maxLength: {
                  value: 25,
                  message: 'نام و نام خانوادگی نباید بیش از 25 کاراکتر باشد.',
                },
              })}
              type="text" className="bk-input" placeholder="نام و نام خانوادگی (اختیاری)"/>
            <FormErrorMessage errors={errors} name="fullName"/>
          </div>
        </div>
        <div className="panel-modal-footer">
          <button
            className={"panel-modal-confirm flex-center-center gap-2 " + (loading ? 'disable-action' : '')}>
            {
              loading ?
                <TheSpinner/>
                :
                'تکمیل سفارش'
            }
          </button>
          <div className="panel-modal-close" onClick={close}>بستن</div>
        </div>
      </form>

    </div>
  )
}