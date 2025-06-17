"use client"
import Link from "next/link";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {bkToast, passwordStrength} from "@/libs/utility";
import {FiEye, FiEyeOff} from "react-icons/fi";
import imageLogo from "@/public/images/logo.png";
import {setUser} from "@/store/slice/user";
import FormErrorMessage from "@/components/back-end/section/FormErrorMessage";
import TheSpinner from "@/components/layout/TheSpinner";
import useHook from "@/hooks/controller/useHook";
import {TypeGender} from "@/types/typeConfig";
import {TypeApiUpdateUserReq, TypeApiUser} from "@/types/typeApiAdmin";
import {useUpdateUser} from "@/hooks/user/useAuth";

export default function TheProfileUi() {
    const {dispatch, user, setting} = useHook()

    const {mutateAsync: mutateAsyncUpdateUser, isPending: isPendingUpdateUser} = useUpdateUser()

    const [passwordShown, setPasswordShown] = useState<boolean>(false)
    const [passwordRepeatShown, setPasswordRepeatShown] = useState<boolean>(false)

    const hasEmail = setting.emailStatus === "MANDATORY" // ? true : setting.emailStatus === "OPTIONAL" ? false : false


    type TypeFormTheProfileUi = {
        gender: TypeGender
        fullName: string
        codeMeli: string
        mobile: string
        email: string | null
        password: string
        passwordRepeat: string
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<TypeFormTheProfileUi>({
        criteriaMode: 'all',
        defaultValues: {
            gender: user.gender,
            fullName: user.fullName,
            codeMeli: user.codeMeli,
            mobile: user.mobile,
            email: user.email,
            password: '',
        },
    })

    const onSubmit = async (data: TypeFormTheProfileUi) => {
        const transformedData: TypeApiUpdateUserReq = {
            mobile: data.mobile,
            gender: data.gender,
            fullName: data.fullName,
            codeMeli: data.codeMeli,
            ...(data.email && {email: data.email}),
            ...(watch('password').length !== 0 && {password: data.password})
        }
        await mutateAsyncUpdateUser(transformedData).then((res) => {
            handlerUpdateUser(res)
        }).catch(errors => {
            bkToast('error', errors.Reason)
        })

    }

    const handlerUpdateUser = async (data: TypeApiUser) => {
        console.log(data)
        dispatch(setUser(data))
        bkToast('success', 'بروزرسانی با موفقیت انجام شد.')
    }

    const [meter, setMeter] = useState(false)
    const checkPasswordStrength = passwordStrength(watch('password'))
    const passwordStrengthLength = Object.values(checkPasswordStrength).filter(
        value => value,
    ).length


    return (
        <div className="bk-box md:w-5/12 lg:w-3/12">
            <Link href="/" className="block mb-6">
                <img src={imageLogo.src} className="dark:brightness-200 mx-auto" alt="logo"/>
            </Link>
            <div className="bk-box-wrapper">
                <h1 className="bk-box-wrapper-title">پروفایل</h1>
                <p className="bk-box-wrapper-description">اطلاعات خود را ویرایش کنید.</p>
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
                            disabled={true} type="text" className="bk-input disable" placeholder="کد ملی"/>
                    </div>
                    <div className="columns-1 mb-4">
                        <select
                            {...register('gender', {
                                required: {
                                    value: true,
                                    message: 'جنسیت ضروری است.',
                                },
                            })}
                            defaultValue=""
                            className="bk-input">
                            <option value="" disabled hidden={user.gender !== "NONE"}>جنسیت</option>
                            <option value="NONE" disabled hidden={user.gender !== "NONE"}>تعیین نشده</option>
                            <option value="MAN">مرد</option>
                            <option value="WOMAN">زن</option>
                        </select>
                        <FormErrorMessage errors={errors} name="gender"/>
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
                                    value: 11,
                                    message: 'شماره موبایل باید 11 کاراکتر باشد.',
                                },
                            })}
                            type="text" className="bk-input" placeholder="شماره موبایل"/>
                        <FormErrorMessage errors={errors} name="mobile"/>

                    </div>
                    <div className="columns-1 mb-4">
                        <input
                            {...register('email', {
                                required: {
                                    value: hasEmail,
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
                            type="text" className="bk-input" placeholder="ایمیل"/>
                        <FormErrorMessage errors={errors} name="email"/>

                    </div>
                    <div className="columns-1 mb-4 relative">
                        <input
                            onFocus={() => setMeter(true)}
                            {...register('password', {
                                required: {
                                    value: false,
                                    message: 'کلمه عبور مورد نیاز است.',
                                },
                                validate: () => {
                                    if (passwordStrengthLength !== 5 && watch('password').length !== 0) {
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
                            className="bk-input" placeholder="کلمه عبور (اختیاری)"/>

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
                                    value: false,
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
                            className="bk-input" placeholder="تکرار کلمه عبور (اختیاری)"/>
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
                            className={"bk-button bg-primary-500 dark:bg-primary-900 w-full sm:w-48 mx-auto fa-sbold-18px " + (isPendingUpdateUser ? 'disable-action' : '')}>
                            {
                                isPendingUpdateUser ? (
                                    <TheSpinner/>
                                ) : (
                                    'ویرایش پروفایل'
                                )
                            }
                        </button>
                    </div>
                </form>
                <div
                    className="flex-center-center divide-x divide-x-reverse divide-black dark:divide-darkNavy3 mt-6">
                    <Link href="/account/reservation" className="px-2">لیست رزروها</Link>
                    <Link href="/" className="px-2">صفحه اصلی</Link>
                </div>
            </div>
        </div>
    )
}