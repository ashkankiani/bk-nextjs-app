import Link from 'next/link'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { AiOutlineSave } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { bkToast, onlyTypeNumber, passwordStrength } from '@/libs/utility'
import TheSpinner from '@/components/layout/TheSpinner'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import HeaderPage from '@/components/back-end/section/HeaderPage'
import { useGetCatalogs } from '@/hooks/admin/useCatalog'
import { TypeApiAddUserReq } from '@/types/typeApiAdmin'
import { useAddUser } from '@/hooks/admin/useUser'

export default function TheAddUserUi() {
  const router = useRouter()

  const { data: dataCatalogs, isLoading: isLoadingCatalogs } = useGetCatalogs()
  const { mutateAsync: mutateAsyncAddUser, isPending: isPendingAddUser } = useAddUser()

  const [passwordShown, setPasswordShown] = useState(false)

  const itemsBoolean = ['status']

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeApiAddUserReq>({
    criteriaMode: 'all',
    defaultValues: {
      password: '', // Evil because of watch
    },
  })

  const onSubmit = async (data: TypeApiAddUserReq) => {
    itemsBoolean.forEach(item => {
      data[item] = data[item] === 'true'
    })

    await mutateAsyncAddUser(data)
      .then(res => {
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
      .finally(() => {
        router.push('/admin/users')
      })
  }

  const [meter, setMeter] = useState(false)
  const checkPasswordStrength = passwordStrength(watch('password'))
  const passwordStrengthLength = Object.values(checkPasswordStrength).filter(value => value).length

  return (
    <>
      <HeaderPage title="افزودن کاربر جدید" description="کاربر جدید اضافه نمایید.">
        <Link href="/admin/users" className="back">
          <MdOutlineKeyboardBackspace size="24px" className="ml-2 inline-flex align-middle" />
          <span>لیست کاربران</span>
        </Link>
      </HeaderPage>
      <div className="panel-main">
        <form className="panel-boxed" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-center-start flex-wrap">
            <div className="panel-col-33">
              <label>
                سطح دسترسی<span>*</span>
              </label>
              <select
                {...register('catalogId', {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'سطح دسترسی ضروری است',
                  },
                })}
                defaultValue=""
                className="bk-input"
              >
                {isLoadingCatalogs ? (
                  <option value="" disabled>
                    در حال بارگزاری...
                  </option>
                ) : dataCatalogs && dataCatalogs.length > 0 ? (
                  <>
                    <option value="" disabled>
                      انتخاب کنید
                    </option>
                    {dataCatalogs?.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>ابتدا سطوح دسترسی را ثبث کنید.</option>
                )}
              </select>
              <FormErrorMessage errors={errors} name="catalogId" />
            </div>
            <div className="panel-col-33">
              <label>
                کدملی<span>*</span>
              </label>
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
                onKeyPress={onlyTypeNumber}
                type="text"
                className="bk-input"
              />
              <FormErrorMessage errors={errors} name="codeMeli" />
            </div>
            <div className="panel-col-33">
              <label>جنسیت</label>
              <select {...register('gender')} defaultValue="NONE" className="bk-input">
                <option value="NONE">نمیدانم</option>
                <option value="MAN">مرد</option>
                <option value="WOMAN">زن</option>
              </select>
              <FormErrorMessage errors={errors} name="gender" />
            </div>
            <div className="panel-col-33">
              <label>
                نام و نام خانوادگی<span>*</span>
              </label>
              <input
                {...register('fullName', {
                  required: {
                    value: true,
                    message: 'نام و نام خانوادگی ضروری است.',
                  },
                  minLength: {
                    value: 4,
                    message: 'نام و نام خانوادگی باید بیش از 4 کاراکتر باشد.',
                  },
                  maxLength: {
                    value: 25,
                    message: 'نام و نام خانوادگی نباید بیش از 25 کاراکتر باشد.',
                  },
                })}
                type="text"
                className="bk-input"
              />
              <FormErrorMessage errors={errors} name="fullName" />
            </div>
            <div className="panel-col-33">
              <label>
                موبایل<span>*</span>
              </label>
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
                onKeyPress={onlyTypeNumber}
                type="text"
                dir="ltr"
                className="bk-input"
              />
              <FormErrorMessage errors={errors} name="mobile" />
            </div>
            <div className="panel-col-33">
              <label>ایمیل</label>
              <input
                {...register('email', {
                  // required: {
                  //     value: true,
                  //     message: 'ایمیل ضروری است',
                  // },
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: 'ایمیل شما استاندارد نیست.',
                  },
                  minLength: {
                    value: 5,
                    message: 'ایمیل باید بیش از 5 کاراکتر باشد.',
                  },
                  maxLength: {
                    value: 35,
                    message: 'ایمیل نباید بیشتر از 35 کاراکتر باشد.',
                  },
                })}
                type="email"
                dir="ltr"
                className="bk-input lowercase"
              />
              <FormErrorMessage errors={errors} name="email" />
            </div>
            <div className="panel-col-33">
              <label>
                کلمه عبور<span>*</span>
              </label>

              <div className="relative">
                <input
                  onFocus={() => setMeter(true)}
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'کلمه عبور مورد نیاز است.',
                    },
                    validate: () => {
                      if (passwordStrengthLength !== 5) {
                        return 'کلمه عبور قوی نیست.'
                      }
                    },
                    minLength: {
                      value: 5,
                      message: 'کلمه عبور باید بیش از 5 کاراکتر باشد.',
                    },
                    maxLength: {
                      value: 25,
                      message: 'کلمه عبور نباید بیش از 25 کاراکتر باشد.',
                    },
                  })}
                  type={passwordShown ? 'text' : 'password'}
                  className="bk-input"
                  placeholder="کلمه عبور"
                />

                <span className="absolute left-4 top-4 cursor-pointer leading-6 text-neutral-400">
                  {passwordShown ? (
                    <FiEye
                      onClick={() => setPasswordShown(!passwordShown)}
                      className="cursor-pointer leading-normal text-neutral-400"
                      size="18px"
                    />
                  ) : (
                    <FiEyeOff
                      onClick={() => setPasswordShown(!passwordShown)}
                      className="cursor-pointer leading-normal text-neutral-400"
                      size="18px"
                    />
                  )}
                </span>
                <style jsx>
                  {`
                    .password-strength-meter::before {
                      content: '';
                      background-color: ${['red', 'orange', '#03a2cc', '#03a2cc', '#0ce052'][
                        passwordStrengthLength - 1
                      ] || ''};
                      height: 100%;
                      width: ${(passwordStrengthLength / 5) * 100}%;
                      display: block;
                      border-radius: 3px;
                      transition: width 0.2s;
                    }
                  `}
                </style>
                {meter && <div className="password-strength-meter"></div>}
              </div>
              <FormErrorMessage errors={errors} name="password" />
            </div>
            <div className="panel-col-33">
              <label>وضعیت</label>
              <select
                {...register('status', {
                  required: {
                    value: true,
                    message: 'پوسته ظاهری سایت ضروری است',
                  },
                })}
                defaultValue="true"
                className="bk-input"
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
              <FormErrorMessage errors={errors} name="status" />
            </div>
            <div className="panel-col-100">
              <button
                className={'panel-form-submit ' + (isPendingAddUser ? 'disable-action' : '')}
                type="submit"
              >
                {isPendingAddUser ? (
                  <TheSpinner />
                ) : (
                  <span>
                    <AiOutlineSave size="24px" className="ml-2 inline-flex align-middle" />
                    ثبت کاربر
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
