'use client'

import Link from 'next/link'
import imageLogo from '@/public/images/logo.png'
import FormErrorMessage from '@/components/back-end/section/FormErrorMessage'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import TheSpinner from '@/components/layout/TheSpinner'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { bkToast, generateCode, passwordStrength } from '@/libs/utility'
import useHook from '@/hooks/controller/useHook'
import { useResetPassword, useSendCodeOtp } from '@/hooks/user/useAuth'
import { TypeApiResetPasswordReq, TypeApiResetPasswordRes } from '@/types/typeApiUser'

export default function TheResetPasswordUi() {
  const { router, setting } = useHook()

  const { mutateAsync: mutateAsyncResetPassword, isPending: isPendingResetPassword } =
    useResetPassword()
  const { mutateAsync: mutateAsyncSendCodeOtp, isPending: isPendingSendCodeOtp } = useSendCodeOtp()

  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [passwordRepeatShown, setPasswordRepeatShown] = useState<boolean>(false)

  const [text, setText] = useState<string>('ارسال کد')
  const [code, setCode] = useState<number | null>(null)

  const [showTime, setShowTime] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(180)

  type TypeFormTheRegisterUi = {
    mobile: string
    password: string
    passwordRepeat: string
    otp: string
  }

  const {
    register,
    getValues,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TypeFormTheRegisterUi>({
    criteriaMode: 'all',
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = async (data: TypeFormTheRegisterUi) => {
    if (code === Number(data.otp)) {
      const transformedData: TypeApiResetPasswordReq = {
        mobile: data.mobile,
        password: data.password,
      }
      await mutateAsyncResetPassword(transformedData)
        .then(res => {
          handlerResetPassword(res)
        })
        .catch(errors => {
          bkToast('error', errors.Reason)
        })
    } else {
      bkToast('error', 'کد تایید موبایل صحیح نمی باشد.')
    }
  }

  const handlerResetPassword = (data: TypeApiResetPasswordRes) => {
    bkToast('success', data.Message)
    router.push('/account/sign-in')
  }

  const [meter, setMeter] = useState(false)
  const checkPasswordStrength = passwordStrength(watch('password'))
  const passwordStrengthLength = Object.values(checkPasswordStrength).filter(value => value).length

  const handlerSendCodeOTP = async () => {
    const code: number = generateCode()
    setCode(code)
    const params = {
      mobile: getValues('mobile'),
      code: code,
    }

    await mutateAsyncSendCodeOtp(params)
      .then(res => {
        setTimer(180)
        setText('ارسال شد.')
        setShowTime(true)
        bkToast('success', res.Message)
      })
      .catch(errors => {
        bkToast('error', errors.Reason)
      })
  }

  useEffect(() => {
    if (timer === 0) {
      setShowTime(false)
      setText('ارسال کد')
      return // از اجرای تایمر جلوگیری کن
    }

    const counter = setInterval(() => {
      setTimer(prev => prev - 1)
    }, 1000)

    return () => clearInterval(counter)
  }, [timer])

  return (
    <div className="bk-box md:w-5/12 lg:w-3/12">
      <Link href="/" className="mb-6 block">
        <img src={imageLogo.src} className="mx-auto dark:brightness-200" alt="logo" />
      </Link>
      <div className="bk-box-wrapper">
        <h1 className="bk-box-wrapper-title">بازیابی کلمه عبور</h1>
        <p className="bk-box-wrapper-description">کلمه عبور خود را بازگردانی کنید.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 columns-1">
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
                  value: 11,
                  message: 'شماره موبایل باید نهایتا 11 کاراکتر باشد.',
                },
              })}
              minLength={11}
              maxLength={11}
              type="text"
              dir="ltr"
              className="bk-input"
              placeholder="شماره موبایل"
            />
            <FormErrorMessage errors={errors} name="mobile" />
          </div>
          <div className="relative mb-4 columns-1">
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
            <FormErrorMessage errors={errors} name="password" />
          </div>
          <div className="relative mb-4 columns-1">
            <input
              {...register('passwordRepeat', {
                required: {
                  value: true,
                  message: 'تکرار کلمه عبور جدید مورد نیاز است.',
                },
                validate: val => {
                  if (watch('password') !== val) {
                    return 'کلمه عبور شما مطابقت ندارند.'
                  }
                },
                minLength: {
                  value: 5,
                  message: 'تکرار کلمه عبور جدید باید بیش از 5 کاراکتر باشد.',
                },
                maxLength: {
                  value: 25,
                  message: 'تکرار کلمه عبور جدید نباید بیش از 25 کاراکتر باشد.',
                },
              })}
              type={passwordRepeatShown ? 'text' : 'password'}
              className="bk-input"
              placeholder="تکرار کلمه عبور"
            />
            <span className="absolute left-4 top-4 cursor-pointer leading-6 text-neutral-400">
              {passwordRepeatShown ? (
                <FiEye
                  onClick={() => setPasswordRepeatShown(!passwordRepeatShown)}
                  className="cursor-pointer leading-normal text-neutral-400"
                  size="18px"
                />
              ) : (
                <FiEyeOff
                  onClick={() => setPasswordRepeatShown(!passwordRepeatShown)}
                  className="cursor-pointer leading-normal text-neutral-400"
                  size="18px"
                />
              )}
            </span>
            <FormErrorMessage errors={errors} name="passwordRepeat" />
          </div>

          <div className="relative mb-4 columns-1">
            <input
              {...register('otp', {
                required: {
                  value: setting.registerOTP,
                  message: 'کد تایید موبایل ضروری است.',
                },
                minLength: {
                  value: 6,
                  message: 'کد تایید موبایل باید بیش از 5 کاراکتر باشد.',
                },
                maxLength: {
                  value: 6,
                  message: 'کد تایید موبایل نباید بیش از 6 کاراکتر باشد.',
                },
              })}
              type="text"
              className="bk-input"
              placeholder="کد تایید موبایل"
            />

            <div
              onClick={async () => {
                const validateForm = await trigger(['mobile'])
                if (validateForm && !isPendingSendCodeOtp && !showTime) {
                  handlerSendCodeOTP()
                }
              }}
              className={
                'fa-sbold-18px absolute left-2 top-2 rounded-md bg-green-800 px-2 py-1 text-white ' +
                (isPendingSendCodeOtp || showTime ? 'disable-action' : 'cursor-pointer')
              }
            >
              {isPendingSendCodeOtp ? <TheSpinner /> : showTime ? timer + ' ثانیه' : text}
            </div>
            <FormErrorMessage errors={errors} name="otp" />
          </div>
          <div className="mb-4 columns-1">
            <button
              className={
                'bk-button fa-sbold-18px mx-auto w-full bg-primary-500 dark:bg-primary-900 sm:w-48 ' +
                (isPendingResetPassword ? 'disable-action' : '')
              }
            >
              {isPendingResetPassword ? <TheSpinner /> : 'ثبت کلمه عبور جدید'}
            </button>
          </div>
        </form>
        <div className="flex-center-center mt-6 divide-x divide-x-reverse divide-black dark:divide-darkNavy3">
          <Link href="/account/sign-in" className="px-2">
            ورود به سیستم
          </Link>
          <Link href="/account/sign-up" className="px-2">
            ثبت نام
          </Link>
          <Link href="/" className="px-2">
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
