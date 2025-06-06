"use client"

import Link from "next/link";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {bkToast, generateCode, passwordStrength} from "@/libs/utility";
import {FiEye, FiEyeOff} from "react-icons/fi";
import {hookRegister} from "@/hooks/user/hookAuth";
import imageLogo from "@/public/images/logo.png";
import FormErrorMessage from "@/components/back-end/layout/section/FormErrorMessage";
import {hookSendSms} from "@/hooks/user/hookSms";
import TheSpinner from "@/components/layout/TheSpinner";
import useHook from "@/hooks/controller/useHook";
import {TypeGender} from "@/types/typeConfig";

type TypeTheRegisterUiForm = {
  id: number
  gender: TypeGender
  fullName:  string
  codeMeli: string
  mobile: string
  email: string
  password?: string
  passwordRepeat?: string
  type?: string
  otp?: number
}
export default function TheSignUpUi() {
  const {router, setting} = useHook()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingOTP, setLoadingOTP] = useState<boolean>(false)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [passwordRepeatShown, setPasswordRepeatShown] = useState<boolean>(false)

  const [text, setText] = useState<string>("ارسال کد")
  const [code, setCode] = useState<number | null>(null)

  const [showTime, setShowTime] = useState(false);
  const [timer, setTimer] = useState(180);

  const {
    register,
    getValues,
    trigger,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<TypeTheRegisterUiForm>({
    criteriaMode: 'all',
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async (data: TypeTheRegisterUiForm) => {
    data["type"] = "REGISTER";
    delete data.passwordRepeat
    if (setting.loginOTP) {
      if (code === Number(data.otp)) {
        delete data.otp
        handlerRegister(data)
      } else {
        bkToast('error', 'کد تایید موبایل صحیح نمی باشد.')
      }
    } else {
      delete data.otp
      handlerRegister(data)
    }

  }

  const handlerRegister = async data => {
    setLoading(true)
    await hookRegister(data, (response, message) => {
      setLoading(false)
      if (response) {
        bkToast('success', message)
        router.push('/account/sign-in')
      } else {
        bkToast('error', message)
      }
    })
  }

  const [meter, setMeter] = useState(false)
  const checkPasswordStrength = passwordStrength(watch('password'))
  const passwordStrengthLength = Object.values(checkPasswordStrength).filter(
    value => value,
  ).length

  const handlerSendCodeOTP = async () => {
    setLoadingOTP(true)
    let code:number = generateCode()
    setCode(code)

    let params = {
      // type: "OTP",
      mobile: getValues('mobile'),
      code: code
    }
    await hookSendSms(params, (response, message) => {
      setLoadingOTP(false)
      if (response) {
        if (message.status) {
          setTimer(180)
          setText('ارسال شد.')
          setShowTime(true)
        }
        bkToast('success', message.message)
      } else {
        bkToast('error', message.message)
      }
    })
  }

  useEffect(() => {
    if (timer === 0) {
      setShowTime(false)
      setText('ارسال کد')
    }
    const counter = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(counter);
  }, [timer]);


  return (
      <div className="bk-box md:w-5/12 lg:w-3/12">
        <Link href="/" className="block mb-6">
          <img src={imageLogo.src} className="dark:brightness-200 mx-auto" alt="logo"/>
        </Link>
        <div className="bk-box-wrapper">
          <h1 className="bk-box-wrapper-title">ثبت نام</h1>
          <p className="bk-box-wrapper-description">به آسانی ثبت نام کنید.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('fullName', {
                  required: {
                    value: true,
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
                type="text" className="bk-input" placeholder="نام و نام خانوادگی"/>
              <FormErrorMessage errors={errors} name="fullName"/>
            </div>
            {
              setting.emailStatus !== "DELETE" &&
              <div className="columns-1 mb-4">
                <input
                  {...register('email', {
                    required: {
                      value: setting.emailStatus === "MANDATORY" ? true : setting.emailStatus === "OPTIONAL" ? false : false,
                      message: 'ایمیل ضروری است',
                    },
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
                  type="text" dir="ltr" className="bk-input lowercase"
                  placeholder={setting.emailStatus === "OPTIONAL" ? 'ایمیل (اختیاری)' : "ایمیل"}/>
                <FormErrorMessage errors={errors} name="email"/>
              </div>
            }
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
            {
              setting.registerOTP &&
              <div className="columns-1 mb-4 relative">
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
                  type="text" className="bk-input" placeholder="کد تایید موبایل"/>


                <div
                  onClick={async () => {
                    const validateForm = await trigger(['mobile'])
                    if (validateForm && !loadingOTP && !showTime) {
                      handlerSendCodeOTP()
                    }
                  }}
                  className={"bg-green-800 text-white absolute left-2 top-2 px-2 py-1 rounded-md fa-sbold-18px " + ((loadingOTP || showTime) ? "disable-action" : "cursor-pointer")}>
                  {
                    loadingOTP ?
                      <TheSpinner/>
                      :
                      showTime ?
                        timer + ' ثانیه' :
                        text
                  }
                </div>
                <FormErrorMessage errors={errors} name="otp"/>

              </div>
            }
            <div className="columns-1 mb-4 relative">
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
                className="bk-input" placeholder="کلمه عبور"/>

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
                        background-color: ${[
                            'red',
                            'orange',
                            '#03a2cc',
                            '#03a2cc',
                            '#0ce052',
                        ][passwordStrengthLength - 1] || ''};
                        height: 100%;
                        width: ${(passwordStrengthLength / 5) * 100}%;
                        display: block;
                        border-radius: 3px;
                        transition: width 0.2s;
                    }
                `}
              </style>
              {meter && <div className="password-strength-meter"></div>}
              <FormErrorMessage errors={errors} name="password"/>
            </div>
            <div className="columns-1 mb-4 relative">
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
                    message:
                      'تکرار کلمه عبور جدید باید بیش از 5 کاراکتر باشد.',
                  },
                  maxLength: {
                    value: 25,
                    message:
                      'تکرار کلمه عبور جدید نباید بیش از 25 کاراکتر باشد.',
                  },
                })}
                type={passwordRepeatShown ? 'text' : 'password'}
                className="bk-input" placeholder="تکرار کلمه عبور"/>
              <span className="absolute left-4 top-4 cursor-pointer leading-6 text-neutral-400">
                    {passwordRepeatShown ? (
                      <FiEye
                        onClick={() =>
                          setPasswordRepeatShown(!passwordRepeatShown)
                        }
                        className="cursor-pointer leading-normal text-neutral-400"
                        size="18px"
                      />
                    ) : (
                      <FiEyeOff
                        onClick={() =>
                          setPasswordRepeatShown(!passwordRepeatShown)
                        }
                        className="cursor-pointer leading-normal text-neutral-400"
                        size="18px"
                      />
                    )}
                  </span>
              <FormErrorMessage errors={errors} name="passwordRepeat"/>
            </div>
            <div className="columns-1 mb-4">
              <button
                className={"bk-button bg-primary-500 dark:bg-primary-900 w-full sm:w-48 mx-auto fa-sbold-18px " + (loading ? 'disable-action' : '')}>
                {
                  loading ?
                    <TheSpinner/>
                    :
                    'ثبت نام'
                }
              </button>
            </div>
          </form>
          <div className="flex-center-center divide-x divide-x-reverse divide-black dark:divide-darkNavy3 mt-6">
            <Link href="/account/sign-in" className="px-2">ورود به سیستم</Link>
            <Link href="/" className="px-2">صفحه اصلی</Link>
          </div>
        </div>
      </div>
  )
}

