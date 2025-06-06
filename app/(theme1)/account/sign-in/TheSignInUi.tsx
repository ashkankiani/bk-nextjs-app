"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {bkToast, generateCode, onlyTypeNumber} from "@/libs/utility";
import {FiEye, FiEyeOff} from "react-icons/fi";
import FormErrorMessage from "@/components/back-end/layout/section/FormErrorMessage";
import TheSpinner from "@/components/layout/TheSpinner";
import useHook from "@/hooks/controller/useHook";
import {useLogin, useLoginOtp, useSendCodeOtp} from "@/hooks/user/useAuth";
import {setPermissions, setUser} from "@/store/slice/user";
import {TypeApiLoginRes} from "@/types/typeApi";

type TypeTheSignInUiForm = {
    mobile: string
    captcha: string
    password: string
    passwordRepeat: string
    codeMeli: string
    // type: string
    otp: number
}
export default function TheSignInUi() {

    const {dispatch, router, setting} = useHook()
    const {mutateAsync: mutateAsyncLogin, isPending: isPendingLogin} = useLogin()
    const {mutateAsync: mutateAsyncLoginOtp, isPending: isPendingLoginOtp} = useLoginOtp()
    const {mutateAsync: mutateAsyncSendCodeOtp, isPending: isPendingSendCodeOtp} = useSendCodeOtp()

    const [passwordShown, setPasswordShown] = useState<boolean>(false)
    const [captcha, setCaptcha] = useState<number>(generateCode())

    const [text, setText] = useState<string>("ارسال کد")
    const [code, setCode] = useState<number | null>(null)

    const [showTime, setShowTime] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(180);

    type TypeFormOutByLoginOtpTheSignInUi = {
        mobile: string
    }
    type TypeFormOutByLoginTheSignInUi = {
        password: string
        codeMeli: string
    }

    const {
        register,
        getValues,
        trigger,
        handleSubmit,
        formState: {errors},
    } = useForm<TypeTheSignInUiForm>({
        criteriaMode: 'all',
    })

    const onSubmit = async (data: TypeTheSignInUiForm) => {
        setCaptcha(generateCode())
        if (parseInt(data.captcha) === captcha) return bkToast('error', 'کد کپچا صحیح نمی باشد.')

        if (setting.loginOTP) {

            if (code === Number(data.otp)) {
                const transformedData: TypeFormOutByLoginOtpTheSignInUi = {
                    mobile: data.mobile,
                }
                await mutateAsyncLoginOtp(transformedData).then((res) => {
                    handlerLogin(res)
                })

            } else {
                bkToast('error', 'کد یکبار مصرف صحیح نمی باشد.')
            }

        } else {

            const transformedData: TypeFormOutByLoginTheSignInUi = {
                codeMeli: data.codeMeli,
                password: data.password,
            }

            await mutateAsyncLogin(transformedData).then((res) => {
                handlerLogin(res)
            })
        }

    }


    const handlerLogin = (data: TypeApiLoginRes) => {
        if (data.lock) {
            bkToast('error', data.fullName + ' حساب کاربری شما توسط مدیر غیرفعال شده است.')
        } else {
            const {permissions, ...dataWithoutPermissions} = data;
            dispatch(setPermissions(permissions))
            dispatch(setUser(dataWithoutPermissions))

            bkToast('success', data.fullName + ' با موفقیت وارد شدید.')
            router.push('/')
        }
    }


    const handlerSendCodeOTP = async () => {
        const code: number = generateCode()
        setCode(code)
        const params = {
            mobile: getValues('mobile'),
            code: code
        }

        await mutateAsyncSendCodeOtp(params).then((res) => {
            setTimer(180)
            setText('ارسال شد.')
            setShowTime(true)
            bkToast('success', res.message)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        })

    }

    useEffect(() => {
        if (timer === 0) {
            setShowTime(false);
            setText('ارسال کد');
            return; // از اجرای تایمر جلوگیری کن
        }

        const counter = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(counter);
    }, [timer]);

    return (
        <div className="bk-box md:w-5/12 lg:w-3/12">
            <div className="bk-box-wrapper">
                <h1 className="bk-box-wrapper-title">ورود به سیستم</h1>
                <p className="bk-box-wrapper-description">وارد حساب کاربری خودتان شوید.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {
                        setting.loginOTP ?
                            <>
                                <div className="columns-1 mb-4">
                                    <input
                                        {...register('mobile', {
                                            required: {
                                                value: setting.loginOTP,
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
                                <div className="columns-1 mb-4 relative">
                                    <input
                                        {...register('otp', {
                                            required: {
                                                value: setting.loginOTP,
                                                message: 'کد یکبار مصرف موبایل ضروری است.',
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
                                        type="text" className="bk-input" placeholder="کد یکبار مصرف"/>
                                    <div
                                        onClick={async () => {
                                            const validateForm = await trigger(['mobile'])
                                            if (validateForm && !isPendingSendCodeOtp && !showTime) {
                                                handlerSendCodeOTP()
                                            }
                                        }}
                                        className={"bg-green-800 text-white absolute left-2 top-2 px-2 py-1 rounded-md fa-sbold-18px " + ((isPendingLoginOtp || showTime) ? "disable-action" : "cursor-pointer")}>
                                        {
                                            isPendingLoginOtp ?
                                                <TheSpinner/>
                                                :
                                                showTime ?
                                                    timer + ' ثانیه' :
                                                    text
                                        }
                                    </div>


                                    {/*                    {
                      code === null ?
                        <div
                          onClick={async () => {
                            const validateForm = await trigger(['mobile'])
                            if (validateForm) {
                              handlerSendCodeOTP()
                            }
                          }}
                          className="bg-green-800 text-white absolute left-2 top-2 px-2 py-1 rounded-md cursor-pointer fa-sbold-18px">
                          {
                            loadingOTP ?
                              <TheSpinner/>
                              :
                              'ارسال کد'
                          }
                        </div>
                        :
                        <div
                          className="bg-green-600 text-white absolute left-2 top-2 px-2 py-1 rounded-md disable-action fa-sbold-18px">
                          ارسال شد
                        </div>
                    }*/}
                                    <FormErrorMessage errors={errors} name="otp"/>
                                </div>
                            </>
                            :
                            <>
                                <div className="columns-1 mb-4">
                                    <input
                                        {...register('codeMeli', {
                                            required: {
                                                value: !setting.loginOTP,
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
                                <div className="columns-1 mb-4 relative">
                                    <input
                                        {...register('password', {
                                            required: {
                                                value: !setting.loginOTP,
                                                message: 'کلمه عبور مورد نیاز است.',
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
                                    <FormErrorMessage errors={errors} name="password"/>
                                </div>
                            </>

                    }
                    <div className="columns-1 mb-4 relative">
                        <input
                            {...register('captcha', {
                                required: {
                                    value: true,
                                    message: 'کپچا مورد نیاز است.',
                                },
                                minLength: {
                                    value: 6,
                                    message: 'کپچا باید 6 کاراکتر باشد.',
                                },
                                maxLength: {
                                    value: 6,
                                    message: 'کپچا نباید بیش از 6 کاراکتر باشد.',
                                },
                            })}
                            onKeyPress={onlyTypeNumber}
                            className="bk-input" placeholder="عدد روبرو"/>
                        <div
                            onClick={() => setCaptcha(generateCode())}
                            className="text-neutral-400 absolute left-4 top-3 select-none cursor-pointer en-sbold-20px"
                        >{captcha}</div>
                        <FormErrorMessage errors={errors} name="captcha"/>
                    </div>
                    <div className="columns-1 mb-4">
                        <button
                            className={"bk-button bg-primary-500 dark:bg-primary-900 w-full sm:w-48 mx-auto fa-sbold-18px " + (isPendingLogin || isPendingLoginOtp ? 'disable-action' : '')}>
                            {
                                isPendingLogin || isPendingLoginOtp ? (
                                    <TheSpinner/>
                                ) : (
                                    'ورود به سیستم'
                                )
                            }
                        </button>
                    </div>
                </form>
                <div
                    className="flex-center-center divide-x divide-x-reverse divide-black dark:divide-darkNavy3 mt-6">
                    <Link href="/account/reset-password" className="px-2">فراموشی کلمه عبور</Link>
                    <Link href="/account/sign-up" className="px-2">ثبت نام</Link>
                    <Link href="/" className="px-2">صفحه اصلی</Link>
                </div>
            </div>
        </div>
    )
}